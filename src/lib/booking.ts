import { Home, Scale, Users, Building2, FileText, Landmark, MessageSquare } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AppointmentType = 'cabinet' | 'visio' | 'telephone'

export type Motif = {
  slug: string
  label: string
  description: string
  icon: LucideIcon
  durationMinutes: number
}

export const motifs: Motif[] = [
  {
    slug: 'immobilier',
    label: 'Achat / vente immobilier',
    description: "Conseil et préparation de votre transaction immobilière au Gabon.",
    icon: Home,
    durationMinutes: 45,
  },
  {
    slug: 'succession',
    label: 'Succession / donation',
    description: "Règlement de succession, testament, donation entre vifs.",
    icon: Scale,
    durationMinutes: 60,
  },
  {
    slug: 'famille',
    label: 'Droit de la famille',
    description: "Contrat de mariage, divorce, adoption, filiation.",
    icon: Users,
    durationMinutes: 45,
  },
  {
    slug: 'societe',
    label: 'Création / cession de société',
    description: "Constitution de société, cession de parts ou de fonds, baux commerciaux.",
    icon: Building2,
    durationMinutes: 60,
  },
  {
    slug: 'acte',
    label: "Authentification / signature d'acte",
    description: "Procuration, reconnaissance de dette, dépôt d'écrit, signature au cabinet.",
    icon: FileText,
    durationMinutes: 30,
  },
  {
    slug: 'patrimoine',
    label: 'Conseil patrimonial',
    description: "Audit patrimonial, transmission, optimisation fiscale.",
    icon: Landmark,
    durationMinutes: 60,
  },
  {
    slug: 'autre',
    label: 'Autre demande',
    description: "Une question qui ne rentre pas dans les autres motifs.",
    icon: MessageSquare,
    durationMinutes: 30,
  },
]

export type AppointmentTypeOption = {
  slug: AppointmentType
  label: string
  description: string
  hint: string
}

export const appointmentTypes: AppointmentTypeOption[] = [
  {
    slug: 'cabinet',
    label: 'Au cabinet',
    description: "Boulevard de la Nation, Immeuble Hollando, 6ème étage à Libreville.",
    hint: 'Recommandé pour la signature et les dossiers complexes',
  },
  {
    slug: 'visio',
    label: 'En visio',
    description: "Lien Google Meet envoyé par WhatsApp à la confirmation.",
    hint: 'Idéal si vous résidez à l\'étranger ou en province',
  },
  {
    slug: 'telephone',
    label: 'Par téléphone',
    description: "Le cabinet vous appelle au numéro indiqué à l'heure du créneau.",
    hint: 'Pratique pour une première consultation rapide',
  },
]

export const motifBySlug = (slug: string) => motifs.find((m) => m.slug === slug)
export const typeBySlug = (slug: AppointmentType) =>
  appointmentTypes.find((t) => t.slug === slug)

// ---------- Slot generation ---------------------------------------------------

const OFFICE_OPEN_MINUTES = 7 * 60 + 30   // 07:30
const OFFICE_CLOSE_MINUTES = 15 * 60 + 30 // 15:30
const SLOT_STEP_MINUTES = 30

export type Slot = { time: string; minutes: number }
export type BusySlot = { date: string; time: string; duration_minutes: number }

const minutesToTime = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

const timeToMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/**
 * Returns all candidate start times for a given date and motif duration.
 * Filters out slots that would overlap an existing busy slot or that
 * would exceed office hours.
 */
export function computeAvailableSlots(
  busy: BusySlot[],
  isoDate: string,
  durationMinutes: number,
): Slot[] {
  const dayBusy = busy
    .filter((b) => b.date === isoDate)
    .map((b) => {
      const start = timeToMinutes(b.time)
      return { start, end: start + b.duration_minutes }
    })

  const slots: Slot[] = []
  for (
    let t = OFFICE_OPEN_MINUTES;
    t + durationMinutes <= OFFICE_CLOSE_MINUTES;
    t += SLOT_STEP_MINUTES
  ) {
    const end = t + durationMinutes
    const overlaps = dayBusy.some((b) => t < b.end && end > b.start)
    if (!overlaps) {
      slots.push({ time: minutesToTime(t), minutes: t })
    }
  }
  return slots
}

/**
 * For a list of next N working days, returns which days have at least one
 * available slot (so the calendar can grey out unavailable ones).
 */
export function computeOpenDays(
  busy: BusySlot[],
  days: string[],
  durationMinutes: number,
): Record<string, boolean> {
  const out: Record<string, boolean> = {}
  for (const d of days) {
    out[d] = computeAvailableSlots(busy, d, durationMinutes).length > 0
  }
  return out
}

// Returns the next `count` working days (Mon-Fri), starting today, as ISO yyyy-mm-dd
export function nextWorkingDays(count: number, from: Date = new Date()): string[] {
  const out: string[] = []
  const cursor = new Date(from)
  cursor.setHours(0, 0, 0, 0)

  // Skip today if it's already past office hours
  const now = new Date()
  if (
    cursor.toDateString() === now.toDateString() &&
    now.getHours() * 60 + now.getMinutes() >= OFFICE_CLOSE_MINUTES - 30
  ) {
    cursor.setDate(cursor.getDate() + 1)
  }

  while (out.length < count) {
    const dow = cursor.getDay()
    if (dow !== 0 && dow !== 6) {
      out.push(cursor.toISOString().slice(0, 10))
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
}

export function formatLongDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
