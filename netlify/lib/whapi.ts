// Lightweight Whapi.cloud client for sending WhatsApp messages.
// Docs: https://whapi.readme.io/

const WHAPI_BASE = 'https://gate.whapi.cloud'

export type WhapiResult = { id?: string; sent: boolean; error?: string }

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
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
  const token = getEnv('WHAPI_TOKEN')
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

export function buildConfirmationMessage(args: {
  name: string
  motif: string
  date: string
  time: string
  type: 'cabinet' | 'visio' | 'telephone'
  meetLink?: string
  cancelUrl: string
}) {
  const lines = [
    `Bonjour ${args.name},`,
    '',
    `Votre rendez-vous au Cabinet Notarial Suzanne Ogoula Nkondawiri est enregistré :`,
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
    lines.push("☎️ Le cabinet vous appellera au numéro indiqué.")
  }
  lines.push('')
  lines.push(`Pour annuler ou reporter : ${args.cancelUrl}`)
  lines.push('')
  lines.push('À bientôt — Cabinet Ogoula Nkondawiri')
  return lines.join('\n')
}

export function buildReminderMessage(args: {
  name: string
  date: string
  time: string
  type: 'cabinet' | 'visio' | 'telephone'
  hoursBefore: 24 | 2
  cancelUrl: string
}) {
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
