// Scheduled function — runs every 15 minutes via Netlify Scheduled Functions.
// Sends WhatsApp reminders for upcoming pending/confirmed appointments:
//   - 24h before (J-1)
//   - 2h before (H-2)
// Marks the corresponding column to avoid duplicate sends.

import type { Config } from '@netlify/functions'
import {
  buildReminderInteractive,
  buildReminderMessage,
  isWhapiConfigured,
  sendWhatsappInteractive,
  sendWhatsappText,
} from '../lib/whapi'
import { getSupabaseAdmin, type AppointmentRow } from '../lib/supabase'

async function sendReminder(
  phone: string,
  args: Parameters<typeof buildReminderInteractive>[0],
) {
  const r = await sendWhatsappInteractive(phone, buildReminderInteractive(args))
  if (r.sent) return r
  // Fallback to plain text if interactive buttons fail (Whapi marks them
  // as unstable). The text version still includes the cancel URL inline.
  return sendWhatsappText(phone, buildReminderMessage(args))
}

const SITE_URL = process.env.SITE_URL ?? 'https://etudeogoulankondawiri.netlify.app'

export default async () => {
  // No WhatsApp = no point running. Return cleanly.
  if (!isWhapiConfigured()) {
    return new Response(
      JSON.stringify({ ok: true, skipped: true, reason: 'WHAPI_TOKEN not configured' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const supabase = getSupabaseAdmin()

  const now = new Date()
  const inAHourMin = new Date(now.getTime() + 60 * 60_000)
  const inAHourMax = new Date(now.getTime() + 3 * 60 * 60_000)
  const in24hMin = new Date(now.getTime() + 23 * 60 * 60_000)
  const in24hMax = new Date(now.getTime() + 25 * 60 * 60_000)

  const isoDay = (d: Date) => d.toISOString().slice(0, 10)

  const { data: rows, error } = await supabase
    .from('appointments')
    .select('*')
    .in('status', ['pending', 'confirmed'])
    .gte('date', isoDay(now))
    .lte('date', isoDay(in24hMax))

  if (error) {
    console.error('reminder query failed', error)
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 })
  }

  let sent24 = 0
  let sent2 = 0

  for (const raw of (rows ?? []) as AppointmentRow[]) {
    const apptStart = new Date(`${raw.date}T${raw.time}:00+01:00`)
    const cancelUrl = `${SITE_URL}/rendez-vous/annuler/${raw.cancellation_token}`

    if (
      !raw.reminder_24h_sent_at &&
      apptStart >= in24hMin &&
      apptStart <= in24hMax
    ) {
      const r = await sendReminder(raw.phone, {
        name: raw.name,
        date: raw.date,
        time: raw.time,
        type: raw.type,
        hoursBefore: 24,
        cancelUrl,
      })
      if (r.sent) {
        await supabase
          .from('appointments')
          .update({ reminder_24h_sent_at: new Date().toISOString() })
          .eq('id', raw.id)
        sent24++
      }
    }

    if (
      !raw.reminder_2h_sent_at &&
      apptStart >= inAHourMin &&
      apptStart <= inAHourMax
    ) {
      const r = await sendReminder(raw.phone, {
        name: raw.name,
        date: raw.date,
        time: raw.time,
        type: raw.type,
        hoursBefore: 2,
        cancelUrl,
      })
      if (r.sent) {
        await supabase
          .from('appointments')
          .update({ reminder_2h_sent_at: new Date().toISOString() })
          .eq('id', raw.id)
        sent2++
      }
    }
  }

  return new Response(
    JSON.stringify({ ok: true, scanned: rows?.length ?? 0, sent24, sent2 }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}

export const config: Config = {
  schedule: '*/15 * * * *',
}
