// Lightweight Whapi.cloud client for sending WhatsApp messages.
// Docs: https://whapi.readme.io/

const WHAPI_BASE = 'https://gate.whapi.cloud'

export type WhapiResult = { id?: string; sent: boolean; error?: string }

export type InteractiveButton =
  | { type: 'url'; title: string; id: string; url: string }
  | { type: 'quick_reply'; title: string; id: string }
  | { type: 'call'; title: string; id: string; phone_number: string }
  | { type: 'copy'; title: string; id: string; copy_code: string }

export type InteractivePayload = {
  header?: { text: string }
  body: { text: string }
  footer?: { text: string }
  action: { buttons: InteractiveButton[] }
  type: 'button'
}

export function isWhapiConfigured(): boolean {
  return Boolean(process.env.WHAPI_TOKEN?.trim())
}

/** Normalize a phone number into the digits-only format Whapi expects. */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^\d]/g, '')
  // Default to Gabon country code if local 8-digit number provided
  if (digits.length === 8) digits = '241' + digits
  return digits
}

export async function sendWhatsappText(
  toRaw: string,
  body: string,
): Promise<WhapiResult> {
  const token = process.env.WHAPI_TOKEN?.trim()
  if (!token) {
    return { sent: false, error: 'WHAPI_TOKEN not configured' }
  }
  const to = normalizePhone(toRaw)

  const res = await fetch(`${WHAPI_BASE}/messages/text`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, body }),
  })

  if (!res.ok) {
    const text = await res.text()
    return { sent: false, error: `Whapi ${res.status}: ${text}` }
  }
  const json = (await res.json()) as { message?: { id?: string } }
  return { sent: true, id: json.message?.id }
}

export async function sendWhatsappInteractive(
  toRaw: string,
  payload: InteractivePayload,
): Promise<WhapiResult> {
  const token = process.env.WHAPI_TOKEN?.trim()
  if (!token) {
    return { sent: false, error: 'WHAPI_TOKEN not configured' }
  }
  const to = normalizePhone(toRaw)

  const res = await fetch(`${WHAPI_BASE}/messages/interactive`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...payload, to }),
  })

  if (!res.ok) {
    const text = await res.text()
    return { sent: false, error: `Whapi ${res.status}: ${text}` }
  }
  const json = (await res.json()) as { message?: { id?: string } }
  return { sent: true, id: json.message?.id }
}

type ConfirmationArgs = {
  name: string
  motif: string
  date: string
  time: string
  type: 'cabinet' | 'visio' | 'telephone'
  meetLink?: string
  cancelUrl: string
}

type ReminderArgs = {
  name: string
  date: string
  time: string
  type: 'cabinet' | 'visio' | 'telephone'
  hoursBefore: 24 | 2
  cancelUrl: string
}

/** Interactive payload with a single "Annuler le RDV" URL button. */
export function buildConfirmationInteractive(args: ConfirmationArgs): InteractivePayload {
  const lines = [
    `Bonjour ${args.name},`,
    '',
    `Votre rendez-vous à l'Étude Notariale Suzanne Ogoula Nkondawiri est enregistré :`,
    '',
    `📅 ${formatDate(args.date)}`,
    `🕒 ${args.time}`,
    `📌 ${args.motif}`,
  ]
  if (args.type === 'cabinet') {
    lines.push('📍 Bd de la Nation, Imm. Hollando, 6e étage, Libreville')
  } else if (args.type === 'visio') {
    lines.push(args.meetLink ? `🎥 Visio : ${args.meetLink}` : '🎥 Visio (lien à suivre)')
  } else {
    lines.push("☎️ L'étude vous appellera au numéro indiqué.")
  }

  return {
    body: { text: lines.join('\n') },
    footer: { text: 'Étude Ogoula Nkondawiri' },
    action: {
      buttons: [
        { type: 'url', title: 'Annuler le RDV', id: 'cancel', url: args.cancelUrl },
      ],
    },
    type: 'button',
  }
}

/** Interactive payload for reminders with a single "Annuler le RDV" URL button. */
export function buildReminderInteractive(args: ReminderArgs): InteractivePayload {
  const when = args.hoursBefore === 24 ? 'demain' : 'dans 2 heures'
  const lines = [
    `Rappel : votre rendez-vous est ${when} à ${args.time} (${formatDate(args.date)}).`,
  ]
  if (args.type === 'cabinet') {
    lines.push('📍 Bd de la Nation, Imm. Hollando, 6e étage, Libreville.')
  }
  return {
    header: { text: `Bonjour ${args.name}` },
    body: { text: lines.join('\n') },
    footer: { text: 'Étude Ogoula Nkondawiri' },
    action: {
      buttons: [
        { type: 'url', title: 'Annuler le RDV', id: 'cancel', url: args.cancelUrl },
      ],
    },
    type: 'button',
  }
}

export function buildConfirmationMessage(args: ConfirmationArgs) {
  const lines = [
    `Bonjour ${args.name},`,
    '',
    `Votre rendez-vous à l'Étude Notariale Suzanne Ogoula Nkondawiri est enregistré :`,
    '',
    `📅 Date : ${formatDate(args.date)}`,
    `🕒 Heure : ${args.time}`,
    `📌 Motif : ${args.motif}`,
  ]
  if (args.type === 'cabinet') {
    lines.push("📍 Lieu : Bd de la Nation, Imm. Hollando, 6e étage, Libreville")
  } else if (args.type === 'visio') {
    lines.push(args.meetLink ? `🎥 Visio : ${args.meetLink}` : '🎥 Visio (lien à suivre)')
  } else {
    lines.push("☎️ L'étude vous appellera au numéro indiqué.")
  }
  lines.push('')
  lines.push(`Pour annuler ou reporter : ${args.cancelUrl}`)
  lines.push('')
  lines.push('À bientôt — Étude Ogoula Nkondawiri')
  return lines.join('\n')
}

export function buildReminderMessage(args: ReminderArgs) {
  const when = args.hoursBefore === 24 ? 'demain' : 'dans 2 heures'
  const lines = [
    `Bonjour ${args.name}, rappel : votre rendez-vous est ${when} à ${args.time} (${formatDate(args.date)}).`,
  ]
  if (args.type === 'cabinet') {
    lines.push('📍 Bd de la Nation, Imm. Hollando, 6e étage, Libreville.')
  }
  lines.push(`Annuler ou reporter : ${args.cancelUrl}`)
  return lines.join('\n')
}

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Staff notifications ──────────────────────────────────────────────────────

type StaffNotificationArgs = {
  name: string
  phone: string
  motif: string
  date: string
  time: string
  type: 'cabinet' | 'visio' | 'telephone'
  email?: string | null
  message?: string | null
  adminUrl?: string
}

const STAFF_TYPE_LABELS: Record<'cabinet' | 'visio' | 'telephone', string> = {
  cabinet:   '🏛 À l\'étude',
  visio:     '🎥 Visio',
  telephone: '📞 Téléphone',
}

/** Plain-text notification sent to staff phones whenever a new RDV is booked. */
export function buildStaffNotification(args: StaffNotificationArgs): string {
  const lines = [
    '🆕 NOUVEAU RDV',
    '',
    `👤 ${args.name}`,
    `📱 ${args.phone}`,
  ]
  if (args.email) lines.push(`✉️ ${args.email}`)
  lines.push('')
  lines.push(`📅 ${formatDate(args.date)} à ${args.time}`)
  lines.push(`📌 ${args.motif}`)
  lines.push(STAFF_TYPE_LABELS[args.type])
  if (args.message) {
    lines.push('')
    lines.push(`📝 Note : ${args.message}`)
  }
  if (args.adminUrl) {
    lines.push('')
    lines.push(`🔗 ${args.adminUrl}`)
  }
  return lines.join('\n')
}

export function buildStaffCancellation(args: {
  name: string
  date: string
  time: string
  motif: string
}): string {
  return [
    '❌ RDV ANNULÉ',
    '',
    `👤 ${args.name}`,
    `📅 ${formatDate(args.date)} à ${args.time}`,
    `📌 ${args.motif}`,
  ].join('\n')
}

/** Comma-separated list of staff phones (international format, e.g. 24177373500). */
export function getStaffPhones(): string[] {
  const raw = process.env.STAFF_PHONES?.trim()
  if (!raw) return []
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}

/** Best-effort: send the same plain-text message to every configured staff phone. */
export async function notifyStaff(message: string): Promise<{ sent: number; failed: number }> {
  const phones = getStaffPhones()
  if (phones.length === 0 || !isWhapiConfigured()) return { sent: 0, failed: 0 }
  let sent = 0
  let failed = 0
  await Promise.all(
    phones.map(async (phone) => {
      try {
        const r = await sendWhatsappText(phone, message)
        if (r.sent) sent++
        else failed++
      } catch (err) {
        console.error(`Staff WhatsApp failed for ${phone}`, err)
        failed++
      }
    }),
  )
  return { sent, failed }
}
