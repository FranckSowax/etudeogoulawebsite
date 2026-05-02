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

const SLOT_STEP_MINUTES = 30

export type Slot = { time: string; minutes: number }
export type BusySlot = { date: string; time: string; duration_minutes: number }

/** One row from the office_hours table, parsed into minute offsets. */
export type DaySchedule = {
  dayOfWeek: number   // 1=Mon … 7=Sun (ISO weekday)
  isOpen: boolean
  openMinutes: number  // e.g. 450 for 07:30
  closeMinutes: number // e.g. 930 for 15:30
}

/** Mon–Fri 07:30–15:30, used as fallback while office_hours loads. */
export const DEFAULT_SCHEDULE: DaySchedule[] = [
  { dayOfWeek: 1, isOpen: true,  openMinutes: 450, closeMinutes: 930 },
  { dayOfWeek: 2, isOpen: true,  openMinutes: 450, closeMinutes: 930 },
  { dayOfWeek: 3, isOpen: true,  openMinutes: 450, closeMinutes: 930 },
  { dayOfWeek: 4, isOpen: true,  openMinutes: 450, closeMinutes: 930 },
  { dayOfWeek: 5, isOpen: true,  openMinutes: 450, closeMinutes: 930 },
  { dayOfWeek: 6, isOpen: false, openMinutes: 450, closeMinutes: 930 },
  { dayOfWeek: 7, isOpen: false, openMinutes: 450, closeMinutes: 930 },
]

const minutesToTime = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

const timeToMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** JS getDay() → ISO weekday (1=Mon…7=Sun) */
const jsToIso = (d: number) => (d === 0 ? 7 : d)

function dayScheduleFor(isoDate: string, schedule: DaySchedule[]): DaySchedule | undefined {
  const dow = jsToIso(new Date(isoDate + 'T00:00:00').getDay())
  return schedule.find((s) => s.dayOfWeek === dow)
}

export function computeAvailableSlots(
  busy: BusySlot[],
  isoDate: string,
  durationMinutes: number,
  schedule: DaySchedule[] = DEFAULT_SCHEDULE,
): Slot[] {
  const ds = dayScheduleFor(isoDate, schedule)
  if (!ds?.isOpen) return []

  const dayBusy = busy
    .filter((b) => b.date === isoDate)
    .map((b) => {
      const start = timeToMinutes(b.time)
      return { start, end: start + b.duration_minutes }
    })

  const slots: Slot[] = []
  for (
    let t = ds.openMinutes;
    t + durationMinutes <= ds.closeMinutes;
    t += SLOT_STEP_MINUTES
  ) {
    const end = t + durationMinutes
    if (!dayBusy.some((b) => t < b.end && end > b.start)) {
      slots.push({ time: minutesToTime(t), minutes: t })
    }
  }
  return slots
}

export function computeOpenDays(
  busy: BusySlot[],
  days: string[],
  durationMinutes: number,
  schedule: DaySchedule[] = DEFAULT_SCHEDULE,
): Record<string, boolean> {
  const out: Record<string, boolean> = {}
  for (const d of days) {
    out[d] = computeAvailableSlots(busy, d, durationMinutes, schedule).length > 0
  }
  return out
}

/** Returns the next `count` open working days as ISO yyyy-mm-dd strings. */
export function nextWorkingDays(
  count: number,
  from: Date = new Date(),
  schedule: DaySchedule[] = DEFAULT_SCHEDULE,
): string[] {
  const out: string[] = []
  const cursor = new Date(from)
  cursor.setHours(0, 0, 0, 0)

  // Skip today if past the last viable slot
  const now = new Date()
  if (cursor.toDateString() === now.toDateString()) {
    const todayDs = dayScheduleFor(cursor.toISOString().slice(0, 10), schedule)
    if (todayDs && now.getHours() * 60 + now.getMinutes() >= todayDs.closeMinutes - 30) {
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  let guard = 0
  while (out.length < count && guard < count + 90) {
    guard++
    const ds = dayScheduleFor(cursor.toISOString().slice(0, 10), schedule)
    if (ds?.isOpen) out.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
}

/** Human-readable opening hours label for a schedule, e.g. "lun.–ven. 07h30–15h30". */
export function scheduleLabel(schedule: DaySchedule[]): string {
  const open = schedule.filter((s) => s.isOpen)
  if (open.length === 0) return 'Fermé'
  const min = Math.min(...open.map((s) => s.openMinutes))
  const max = Math.max(...open.map((s) => s.closeMinutes))
  const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}h${String(m % 60).padStart(2, '0')}`
  const days = open.map((s) =>
    ['', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][s.dayOfWeek],
  )
  return `${days[0]}–${days[days.length - 1]} ${fmt(min)}–${fmt(max)}`
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
