// Minimal Google Calendar client using a Service Account.
// The Google Calendar must be shared with the service account email
// so it can write events.
//
// Required env vars:
//   - GCAL_CALENDAR_ID         (e.g. cabinet@notaire.com or *@group.calendar.google.com)
//   - GCAL_SERVICE_ACCOUNT_KEY (the JSON key, base64-encoded)
//   - GCAL_TIMEZONE            (e.g. Africa/Libreville)

import { create as createJwt, getNumericDate } from 'https://deno.land/x/djwt@v3.0.2/mod.ts'

type ServiceAccount = {
  client_email: string
  private_key: string
  token_uri: string
}

function getEnv(name: string): string {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

async function loadServiceAccount(): Promise<ServiceAccount> {
  const raw = getEnv('GCAL_SERVICE_ACCOUNT_KEY')
  // Accept either a raw JSON or a base64-encoded JSON
  const decoded = raw.trim().startsWith('{') ? raw : new TextDecoder().decode(
    Uint8Array.from(atob(raw), (c) => c.charCodeAt(0)),
  )
  return JSON.parse(decoded) as ServiceAccount
}

async function getAccessToken(): Promise<string> {
  const sa = await loadServiceAccount()
  const now = getNumericDate(0)
  const exp = getNumericDate(60 * 60)

  const pemHeader = '-----BEGIN PRIVATE KEY-----'
  const pemFooter = '-----END PRIVATE KEY-----'
  const pemContents = sa.private_key.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '')
  const binary = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0))
  const key = await crypto.subtle.importKey(
    'pkcs8',
    binary,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const jwt = await createJwt(
    { alg: 'RS256', typ: 'JWT' },
    {
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/calendar',
      aud: sa.token_uri,
      iat: now,
      exp,
    },
    key,
  )

  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status} ${await res.text()}`)
  const json = (await res.json()) as { access_token: string }
  return json.access_token
}

export type GcalEvent = {
  id: string
  hangoutLink?: string
}

export async function createEvent(args: {
  summary: string
  description: string
  startISO: string
  endISO: string
  attendeeEmail?: string
  withMeet?: boolean
}): Promise<GcalEvent> {
  const token = await getAccessToken()
  const calendarId = encodeURIComponent(getEnv('GCAL_CALENDAR_ID'))
  const tz = Deno.env.get('GCAL_TIMEZONE') ?? 'Africa/Libreville'

  const body: Record<string, unknown> = {
    summary: args.summary,
    description: args.description,
    start: { dateTime: args.startISO, timeZone: tz },
    end: { dateTime: args.endISO, timeZone: tz },
    attendees: args.attendeeEmail ? [{ email: args.attendeeEmail }] : [],
  }

  if (args.withMeet) {
    body.conferenceData = {
      createRequest: {
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    }
  }

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=none`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )

  if (!res.ok) throw new Error(`GCal create failed: ${res.status} ${await res.text()}`)
  const json = await res.json()
  return { id: json.id, hangoutLink: json.hangoutLink }
}

export async function deleteEvent(eventId: string): Promise<void> {
  const token = await getAccessToken()
  const calendarId = encodeURIComponent(getEnv('GCAL_CALENDAR_ID'))
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
  )
  if (!res.ok && res.status !== 410) {
    throw new Error(`GCal delete failed: ${res.status} ${await res.text()}`)
  }
}

/** Build a UTC ISO datetime from a date (yyyy-mm-dd) and a time (HH:mm), assuming Africa/Libreville (UTC+1). */
export function buildISODate(date: string, time: string, durationMinutes: number) {
  // Africa/Libreville is UTC+1 year-round (no DST).
  const start = new Date(`${date}T${time}:00+01:00`)
  const end = new Date(start.getTime() + durationMinutes * 60_000)
  return { startISO: start.toISOString(), endISO: end.toISOString() }
}
