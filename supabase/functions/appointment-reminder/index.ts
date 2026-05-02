// Scheduled by Supabase Cron (or any external cron) — runs every 15 min.
// For each upcoming pending/confirmed appointment, sends a WhatsApp reminder
// 24h and 2h before the appointment, marking the column to avoid duplicates.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { buildReminderMessage, sendWhatsappText } from '../_shared/whapi.ts'

const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://www.notaire-ogoula-gabon.com'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const now = new Date()
  const inAHourMin = new Date(now.getTime() + 60 * 60_000)
  const inAHourMax = new Date(now.getTime() + 3 * 60 * 60_000)
  const in24hMin = new Date(now.getTime() + 23 * 60 * 60_000)
  const in24hMax = new Date(now.getTime() + 25 * 60 * 60_000)

  const isoDay = (d: Date) => d.toISOString().slice(0, 10)

  const { data: rows, error } = await supabase
    .from('appointments')
    .select(
      'id, name, phone, date, time, type, duration_minutes, cancellation_token, reminder_24h_sent_at, reminder_2h_sent_at, status',
    )
    .in('status', ['pending', 'confirmed'])
    .gte('date', isoDay(now))
    .lte('date', isoDay(in24hMax))

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let sent24 = 0
  let sent2 = 0

  for (const row of rows ?? []) {
    const apptStart = new Date(`${row.date}T${row.time}:00+01:00`)
    const cancelUrl = `${SITE_URL}/rendez-vous/annuler/${row.cancellation_token}`

    if (
      !row.reminder_24h_sent_at &&
      apptStart >= in24hMin &&
      apptStart <= in24hMax
    ) {
      const r = await sendWhatsappText(
        row.phone,
        buildReminderMessage({
          name: row.name,
          date: row.date,
          time: row.time,
          type: row.type,
          hoursBefore: 24,
          cancelUrl,
        }),
      )
      if (r.sent) {
        await supabase
          .from('appointments')
          .update({ reminder_24h_sent_at: new Date().toISOString() })
          .eq('id', row.id)
        sent24++
      }
    }

    if (
      !row.reminder_2h_sent_at &&
      apptStart >= inAHourMin &&
      apptStart <= inAHourMax
    ) {
      const r = await sendWhatsappText(
        row.phone,
        buildReminderMessage({
          name: row.name,
          date: row.date,
          time: row.time,
          type: row.type,
          hoursBefore: 2,
          cancelUrl,
        }),
      )
      if (r.sent) {
        await supabase
          .from('appointments')
          .update({ reminder_2h_sent_at: new Date().toISOString() })
          .eq('id', row.id)
        sent2++
      }
    }
  }

  return new Response(
    JSON.stringify({ ok: true, scanned: rows?.length ?? 0, sent24, sent2 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})
