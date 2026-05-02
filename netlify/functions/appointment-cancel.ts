// Invoked by the cancellation page right after the user confirms
// cancellation. The DB has already been updated by the
// cancel_appointment_by_token RPC. This function:
//   - removes the Google Calendar event if any
//   - sends a WhatsApp acknowledgement to the client.

import type { Config, Context } from '@netlify/functions'
import { sendWhatsappText } from '../lib/whapi'
import { deleteEvent } from '../lib/gcal'
import { getSupabaseAdmin, type AppointmentRow } from '../lib/supabase'

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return cors(new Response(null))
  if (req.method !== 'POST') return cors(json({ ok: false, error: 'Method not allowed' }, 405))

  let payload: { token?: string }
  try {
    payload = await req.json()
  } catch {
    return cors(json({ ok: false, error: 'Invalid JSON body' }, 400))
  }
  if (!payload.token) return cors(json({ ok: false, error: 'Missing token' }, 400))

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('cancellation_token', payload.token)
    .maybeSingle()

  if (error || !data) return cors(json({ ok: false, error: 'Appointment not found' }, 404))
  const appt = data as AppointmentRow

  if (appt.status !== 'cancelled') {
    return cors(json({ ok: false, error: 'Appointment is not cancelled' }, 400))
  }

  try {
    if (appt.gcal_event_id) {
      try {
        await deleteEvent(appt.gcal_event_id)
      } catch (err) {
        console.error('GCal delete failed', err)
      }
    }

    await sendWhatsappText(
      appt.phone,
      `Bonjour ${appt.name}, votre rendez-vous du ${appt.date} à ${appt.time} a bien été annulé. Vous pouvez réserver un nouveau créneau sur notre site. Cabinet Ogoula Nkondawiri.`,
    )

    await supabase
      .from('appointments')
      .update({ gcal_event_id: null })
      .eq('id', appt.id)

    return cors(json({ ok: true }))
  } catch (err) {
    console.error('appointment-cancel failed', err)
    return cors(json({ ok: false, error: (err as Error).message }, 500))
  }
}

export const config: Config = {
  path: '/api/appointments/cancel',
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
