import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

/** Returns a singleton Supabase admin client (uses the service role key). */
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var')
  }
  cached = createClient(url, key, { auth: { persistSession: false } })
  return cached
}

export type AppointmentRow = {
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
  status: string
  gcal_event_id: string | null
  gcal_meet_link: string | null
  reminder_24h_sent_at: string | null
  reminder_2h_sent_at: string | null
}
