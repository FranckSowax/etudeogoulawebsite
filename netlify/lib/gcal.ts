// Minimal Google Calendar client using a Service Account.
// The Google Calendar must be shared with the service account email
// so it can write events.
//
// Required env vars:
//   - GCAL_CALENDAR_ID         (e.g. cabinet@notaire.com or *@group.calendar.google.com)
//   - GCAL_SERVICE_ACCOUNT_KEY (the JSON key, raw or base64-encoded)
//   - GCAL_TIMEZONE            (defaults to Africa/Libreville)

import { SignJWT, importPKCS8 } from 'jose'

type ServiceAccount = {
  client_email: string
  private_key: string
  token_uri: string
}

/** True if both Calendar ID and Service Account key are non-empty. */
export function isGcalConfigured(): boolean {
  return Boolean(
    process.env.GCAL_CALENDAR_ID?.trim() &&
      process.env.GCAL_SERVICE_ACCOUNT_KEY?.trim(),
  )
}

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name]?.trim() || fallback
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

function loadServiceAccount(): ServiceAccount {
  const raw = getEnv('GCAL_SERVICE_ACCOUNT_KEY')
  // Accept either raw JSON or base64-encoded JSON
  const decoded = raw.trim().startsWith('{')
    ? raw
    : Buffer.from(raw, 'base64').toString('utf-8')
  return JSON.parse(decoded) as ServiceAccount
}

async function getAccessToken(): Promise<string> {
  const sa = loadServiceAccount()
  const now = Math.floor(Date.now() / 1000)

  const privateKey = await importPKCS8(sa.private_key, 'RS256')
  const jwt = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/calendar',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(sa.client_email)
    .setAudience(sa.token_uri)
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60)
    .sign(privateKey)

  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status} ${await res.text()}`)
  }
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
  const tz = getEnv('GCAL_TIMEZONE', 'Africa/Libreville')

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
  const json = (await res.json()) as { id: string; hangoutLink?: string }
  return { id: json.id, hangoutLink: json.hangoutLink }
}

export async function deleteEvent(eventId: string): Promise<void> {
  const token = await getAccessToken()
  const calendarId = encodeURIComponent(getEnv('GCAL_CALENDAR_ID'))
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
  )
  // 410 Gone is fine — already deleted
  if (!res.ok && res.status !== 410 && res.status !== 404) {
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
