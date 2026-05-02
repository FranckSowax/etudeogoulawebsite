// Removes a Google Calendar event after an appointment was cancelled.
// Triggered by a database trigger on UPDATE where status='cancelled', or
// manually after the client has called the cancel_appointment_by_token RPC.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { deleteEvent } from '../_shared/gcal.ts'
import { sendWhatsappText } from '../_shared/whapi.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const { record } = (await req.json()) as {
      record: {
        id: string
        name: string
        phone: string
        date: string
        time: string
        gcal_event_id: string | null
        status: string
      }
    }
    if (record.status !== 'cancelled') {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    if (record.gcal_event_id) {
      try {
        await deleteEvent(record.gcal_event_id)
      } catch (err) {
        console.error('GCal delete failed', err)
      }
    }

    await sendWhatsappText(
      record.phone,
      `Bonjour ${record.name}, votre rendez-vous du ${record.date} à ${record.time} a bien été annulé. Vous pouvez réserver un nouveau créneau sur notre site. Cabinet Ogoula Nkondawiri.`,
    )

    await supabase
      .from('appointments')
      .update({ gcal_event_id: null })
      .eq('id', record.id)

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
