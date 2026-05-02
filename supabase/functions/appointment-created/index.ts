// Triggered after an appointment is inserted.
// Creates a Google Calendar event (with Meet link if visio) and sends a
// WhatsApp confirmation via Whapi.
//
// Two ways to invoke:
//  1. Direct HTTP call from the client right after insert (passing the row id)
//  2. Database trigger / pg_net.http_post on row insert
//
// Auth: requires SUPABASE_SERVICE_ROLE_KEY to update the row with the gcal id.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { buildISODate, createEvent } from '../_shared/gcal.ts'
import { buildConfirmationMessage, sendWhatsappText } from '../_shared/whapi.ts'

const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://www.notaire-ogoula-gabon.com'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const { record } = (await req.json()) as { record: AppointmentRow }
    if (!record?.id) throw new Error('Missing appointment id')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { startISO, endISO } = buildISODate(record.date, record.time, record.duration_minutes ?? 30)

    const event = await createEvent({
      summary: `RDV — ${record.name} (${record.motif ?? record.service ?? ''})`,
      description: [
        `Téléphone : ${record.phone}`,
        record.email ? `Email : ${record.email}` : null,
        record.message ? `Note : ${record.message}` : null,
        `Type : ${record.type}`,
      ]
        .filter(Boolean)
        .join('\n'),
      startISO,
      endISO,
      attendeeEmail: record.email ?? undefined,
      withMeet: record.type === 'visio',
    })

    const cancelUrl = `${SITE_URL}/rendez-vous/annuler/${record.cancellation_token}`
    const whapi = await sendWhatsappText(
      record.phone,
      buildConfirmationMessage({
        name: record.name,
        motif: record.motif ?? '',
        date: record.date,
        time: record.time,
        type: record.type,
        meetLink: event.hangoutLink,
        cancelUrl,
      }),
    )

    await supabase
      .from('appointments')
      .update({
        status: 'confirmed',
        gcal_event_id: event.id,
        gcal_meet_link: event.hangoutLink ?? null,
        whapi_confirm_message_id: whapi.id ?? null,
      })
      .eq('id', record.id)

    return new Response(
      JSON.stringify({ ok: true, gcalId: event.id, whatsappSent: whapi.sent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

type AppointmentRow = {
  id: string
  name: string
  phone: string
  email: string | null
  message: string | null
  motif: string | null
  service: string | null
  type: 'cabinet' | 'visio' | 'telephone'
  date: string
  time: string
  duration_minutes: number | null
  cancellation_token: string
}
