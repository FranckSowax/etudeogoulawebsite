// Triggered by the booking wizard right after the appointment row is
// inserted. Fetches the row server-side (service role) to avoid relying
// on client-supplied data, then creates a Google Calendar event and
// sends the WhatsApp confirmation via Whapi. Marks the row as 'confirmed'.

import type { Config, Context } from '@netlify/functions'
import { buildConfirmationMessage, isWhapiConfigured, sendWhatsappText } from '../lib/whapi'
import { buildISODate, createEvent, isGcalConfigured } from '../lib/gcal'
import { getSupabaseAdmin, type AppointmentRow } from '../lib/supabase'

const SITE_URL = process.env.SITE_URL ?? 'https://etudeogoulankondawiri.netlify.app'

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return cors(new Response(null))
  if (req.method !== 'POST') return cors(json({ ok: false, error: 'Method not allowed' }, 405))

  let payload: { token?: string; id?: string }
  try {
    payload = await req.json()
  } catch {
    return cors(json({ ok: false, error: 'Invalid JSON body' }, 400))
  }
  if (!payload.token && !payload.id) {
    return cors(json({ ok: false, error: 'Missing token or id' }, 400))
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq(payload.id ? 'id' : 'cancellation_token', payload.id ?? payload.token!)
    .maybeSingle()

  if (error || !data) {
    return cors(json({ ok: false, error: 'Appointment not found' }, 404))
  }
  const appt = data as AppointmentRow

  // Idempotency: skip if already processed
  if (appt.gcal_event_id) {
    return cors(json({ ok: true, alreadyProcessed: true }))
  }

  // Each integration is optional and isolated: a failure in one (or
  // missing config) doesn't cancel the others or fail the whole call.
  let gcalEventId: string | null = null
  let gcalMeetLink: string | null = null
  let gcalSkipped = false
  let gcalError: string | null = null

  if (isGcalConfigured()) {
    try {
      const { startISO, endISO } = buildISODate(
        appt.date,
        appt.time,
        appt.duration_minutes ?? 30,
      )
      const event = await createEvent({
        summary: `RDV — ${appt.name} (${appt.motif ?? appt.service ?? ''})`,
        description: [
          `Téléphone : ${appt.phone}`,
          appt.email ? `Email : ${appt.email}` : null,
          appt.message ? `Note : ${appt.message}` : null,
          `Modalité : ${appt.type}`,
        ]
          .filter(Boolean)
          .join('\n'),
        startISO,
        endISO,
        attendeeEmail: appt.email ?? undefined,
        withMeet: appt.type === 'visio',
      })
      gcalEventId = event.id
      gcalMeetLink = event.hangoutLink ?? null
    } catch (err) {
      gcalError = (err as Error).message
      console.error('GCal create failed (continuing)', err)
    }
  } else {
    gcalSkipped = true
    console.warn('GCal not configured (GCAL_CALENDAR_ID / GCAL_SERVICE_ACCOUNT_KEY) — skipping')
  }

  let whapi: { sent: boolean; id?: string; error?: string } = { sent: false }
  if (isWhapiConfigured()) {
    try {
      const cancelUrl = `${SITE_URL}/rendez-vous/annuler/${appt.cancellation_token}`
      whapi = await sendWhatsappText(
        appt.phone,
        buildConfirmationMessage({
          name: appt.name,
          motif: appt.motif ?? '',
          date: appt.date,
          time: appt.time,
          type: appt.type,
          meetLink: gcalMeetLink ?? undefined,
          cancelUrl,
        }),
      )
    } catch (err) {
      whapi = { sent: false, error: (err as Error).message }
      console.error('WhatsApp send failed (continuing)', err)
    }
  } else {
    whapi = { sent: false, error: 'WHAPI_TOKEN not configured' }
  }

  // Promote to 'confirmed' if at least one integration succeeded;
  // otherwise leave 'pending' so the cabinet can confirm manually.
  const anySucceeded = Boolean(gcalEventId) || whapi.sent
  await supabase
    .from('appointments')
    .update({
      status: anySucceeded ? 'confirmed' : 'pending',
      gcal_event_id: gcalEventId,
      gcal_meet_link: gcalMeetLink,
      whapi_confirm_message_id: whapi.id ?? null,
    })
    .eq('id', appt.id)

  return cors(
    json({
      ok: true,
      gcal: gcalSkipped
        ? { skipped: true, reason: 'not configured' }
        : gcalError
        ? { sent: false, error: gcalError }
        : { sent: true, eventId: gcalEventId },
      whatsapp: whapi.sent
        ? { sent: true, messageId: whapi.id }
        : { sent: false, error: whapi.error },
    }),
  )
}

export const config: Config = {
  path: '/api/appointments/created',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function cors(res: Response): Response {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return res
}
