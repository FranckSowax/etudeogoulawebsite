import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Video,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  appointmentTypes,
  computeAvailableSlots,
  computeOpenDays,
  formatLongDate,
  formatShortDate,
  motifBySlug,
  motifs,
  nextWorkingDays,
  scheduleLabel,
  typeBySlug,
  type AppointmentType,
} from '@/lib/booking'
import { useAvailability } from '@/hooks/useAvailability'
import { useOfficeHours } from '@/hooks/useOfficeHours'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type Step = 'motif' | 'type' | 'datetime' | 'details'

const typeIcons: Record<AppointmentType, typeof Phone> = {
  cabinet: Building,
  visio: Video,
  telephone: Phone,
}

const stepOrder: Step[] = ['motif', 'type', 'datetime', 'details']

export default function BookingWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('motif')
  const [motifSlug, setMotifSlug] = useState<string | null>(null)
  const [type, setType] = useState<AppointmentType | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const motif = motifSlug ? motifBySlug(motifSlug) : undefined
  const typeOption = type ? typeBySlug(type) : undefined
  const stepIndex = stepOrder.indexOf(step)
  const canGoBack = stepIndex > 0

  const goNext = (next: Step) => setStep(next)
  const goBack = () => {
    if (canGoBack) setStep(stepOrder[stepIndex - 1])
  }

  const handleSubmit = async () => {
    if (!motif || !type || !date || !time) return
    setSubmitting(true)

    // Generate the cancellation token client-side. Avoids the .select()
    // round-trip after insert, which would require a SELECT RLS policy
    // (RETURNING is treated as SELECT by Postgres). With anon's
    // INSERT-only policy in place, generating the UUID locally lets us
    // navigate straight to the confirmation page using the same token.
    const token = crypto.randomUUID()

    const { error } = await supabase.from('appointments').insert({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      message: message.trim() || null,
      motif: motif.label,
      service: motif.slug,
      type,
      date,
      time,
      duration_minutes: motif.durationMinutes,
      status: 'pending',
      cancellation_token: token,
    })

    setSubmitting(false)

    if (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.")
      return
    }

    // Fire-and-forget: trigger Netlify Function to create the GCal event
    // and send the WhatsApp confirmation. Failures here are logged but
    // don't block the user — the row is already in DB.
    fetch('/api/appointments/created', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch((err) => console.error('appointment-created webhook failed', err))

    navigate(`/rendez-vous/confirmation/${token}`)
  }

  const reduce = useReducedMotion()
  const stepAnim = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.22, ease: 'easeOut' as const },
      }

  return (
    <div className="max-w-4xl mx-auto">
      <Stepper currentIndex={stepIndex} />

      <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-elegant border border-border overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={step} {...stepAnim}>
            {step === 'motif' && (
              <MotifStep
                selected={motifSlug}
                onSelect={(slug) => {
                  setMotifSlug(slug)
                  goNext('type')
                }}
              />
            )}

            {step === 'type' && (
              <TypeStep
                selected={type}
                onSelect={(t) => {
                  setType(t)
                  goNext('datetime')
                }}
              />
            )}

            {step === 'datetime' && motif && (
              <DateTimeStep
                durationMinutes={motif.durationMinutes}
                selectedDate={date}
                selectedTime={time}
                onSelectDate={(d) => {
                  setDate(d)
                  setTime(null)
                }}
                onSelectTime={(t) => {
                  setTime(t)
                  goNext('details')
                }}
              />
            )}

            {step === 'details' && motif && typeOption && date && time && (
              <DetailsStep
                motif={motif.label}
                duration={motif.durationMinutes}
                typeLabel={typeOption.label}
                date={date}
                time={time}
                name={name}
                phone={phone}
                email={email}
                message={message}
                submitting={submitting}
                onChange={(field, value) => {
                  if (field === 'name') setName(value)
                  if (field === 'phone') setPhone(value)
                  if (field === 'email') setEmail(value)
                  if (field === 'message') setMessage(value)
                }}
                onSubmit={handleSubmit}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {canGoBack && step !== 'details' && (
          <div className="px-6 pb-6">
            <Button variant="ghost" onClick={goBack} className="text-navy">
              <ArrowLeft className="w-4 h-4 mr-2" /> Étape précédente
            </Button>
          </div>
        )}
      </div>

      {step !== 'motif' && (motif || type || date) && (
        <Recap motifLabel={motif?.label} typeLabel={typeOption?.label} date={date} time={time} />
      )}
    </div>
  )
}

// ------------------------------ Stepper ---------------------------------------

function Stepper({ currentIndex }: { currentIndex: number }) {
  const steps = [
    { short: 'Motif', long: 'Motif' },
    { short: 'Mode', long: 'Modalité' },
    { short: 'Date', long: 'Date & heure' },
    { short: 'Infos', long: 'Coordonnées' },
  ]
  return (
    <ol className="flex items-center justify-between gap-1 sm:gap-4">
      {steps.map((s, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        return (
          <li key={s.long} className="flex-1 flex items-center gap-1.5 sm:gap-3 min-w-0">
            <div
              className={cn(
                'flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-colors',
                done && 'bg-gold border-gold text-navy',
                active && 'bg-navy border-navy text-white',
                !done && !active && 'bg-white border-border text-muted-foreground',
              )}
              aria-current={active ? 'step' : undefined}
            >
              {done ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={cn(
                'text-[11px] sm:text-sm font-medium truncate',
                active ? 'text-navy' : done ? 'text-navy/70' : 'text-muted-foreground',
              )}
            >
              <span className="sm:hidden">{s.short}</span>
              <span className="hidden sm:inline">{s.long}</span>
            </span>
            {i < steps.length - 1 && (
              <div className={cn('flex-1 h-[2px] rounded min-w-[8px]', done ? 'bg-gold' : 'bg-border')} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

// ------------------------------ Step 1: Motif ---------------------------------

function MotifStep({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (slug: string) => void
}) {
  return (
    <div className="p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">Quel est le motif de votre rendez-vous ?</h2>
      <p className="text-muted-foreground text-sm mb-6">
        La durée du créneau s'ajuste automatiquement selon le motif choisi.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {motifs.map((m) => {
          const Icon = m.icon
          const active = selected === m.slug
          return (
            <button
              key={m.slug}
              type="button"
              onClick={() => onSelect(m.slug)}
              className={cn(
                'group flex items-start gap-4 p-4 rounded-lg border text-left transition-all hover:shadow-elegant focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                active ? 'border-gold bg-gold/5' : 'border-border bg-white hover:border-navy',
              )}
            >
              <div className="w-11 h-11 gradient-navy rounded-lg flex items-center justify-center flex-shrink-0 text-gold">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-serif font-semibold text-navy">{m.label}</h3>
                  <span className="flex-shrink-0 text-xs text-gold font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {m.durationMinutes} min
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold flex-shrink-0 mt-1" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ------------------------------ Step 2: Type ----------------------------------

function TypeStep({
  selected,
  onSelect,
}: {
  selected: AppointmentType | null
  onSelect: (t: AppointmentType) => void
}) {
  return (
    <div className="p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">Comment souhaitez-vous être reçu ?</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Choisissez le format qui vous convient le mieux.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {appointmentTypes.map((t) => {
          const Icon = typeIcons[t.slug]
          const active = selected === t.slug
          return (
            <button
              key={t.slug}
              type="button"
              onClick={() => onSelect(t.slug)}
              className={cn(
                'flex flex-col items-start p-5 rounded-lg border text-left transition-all hover:shadow-elegant focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                active ? 'border-gold bg-gold/5' : 'border-border bg-white hover:border-navy',
              )}
            >
              <div className="w-12 h-12 gradient-navy rounded-lg flex items-center justify-center mb-4 text-gold">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-navy">{t.label}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-3">{t.description}</p>
              <span className="text-xs text-gold mt-auto italic">{t.hint}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ------------------------------ Step 3: Date & time ---------------------------

function DateTimeStep({
  durationMinutes,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: {
  durationMinutes: number
  selectedDate: string | null
  selectedTime: string | null
  onSelectDate: (d: string) => void
  onSelectTime: (t: string) => void
}) {
  const { schedule, loading: scheduleLoading } = useOfficeHours()
  const days = useMemo(() => nextWorkingDays(15, new Date(), schedule), [schedule])
  const start = days[0] ?? new Date().toISOString().slice(0, 10)
  const end = days[days.length - 1] ?? start
  const { busy, loading: slotsLoading } = useAvailability(start, end)
  const loading = scheduleLoading || slotsLoading

  const openDays = useMemo(
    () => computeOpenDays(busy, days, durationMinutes, schedule),
    [busy, days, durationMinutes, schedule],
  )

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return []
    return computeAvailableSlots(busy, selectedDate, durationMinutes, schedule)
  }, [busy, selectedDate, durationMinutes, schedule])

  return (
    <div className="p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">Choisissez votre créneau</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Créneau de {durationMinutes} minutes.{' '}
        {!scheduleLoading && <>L'étude est ouverte : {scheduleLabel(schedule)}.</>}
      </p>

      <div className="space-y-6">
        <div>
          <Label className="mb-3 block">Date</Label>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Chargement des disponibilités…
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {days.map((d) => {
                const open = openDays[d]
                const active = selectedDate === d
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={!open}
                    onClick={() => onSelectDate(d)}
                    className={cn(
                      'p-3 rounded-lg border text-center transition-all',
                      active
                        ? 'bg-navy border-navy text-white shadow-elegant'
                        : open
                        ? 'bg-white border-border text-navy hover:border-gold hover:bg-gold/5'
                        : 'bg-muted/40 border-border text-muted-foreground cursor-not-allowed line-through',
                    )}
                  >
                    <div className="text-xs uppercase tracking-wide">{formatShortDate(d)}</div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {selectedDate && (
          <div>
            <Label className="mb-3 block">
              Heure — <span className="text-muted-foreground capitalize">{formatLongDate(selectedDate)}</span>
            </Label>
            {slotsForDate.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun créneau disponible ce jour. Choisissez une autre date.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {slotsForDate.map((s) => {
                  const active = selectedTime === s.time
                  return (
                    <button
                      key={s.time}
                      type="button"
                      onClick={() => onSelectTime(s.time)}
                      className={cn(
                        'py-3 rounded-lg border font-medium transition-all',
                        active
                          ? 'bg-gold border-gold text-navy'
                          : 'bg-white border-border text-navy hover:border-gold hover:bg-gold/5',
                      )}
                    >
                      {s.time}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ------------------------------ Step 4: Details -------------------------------

function DetailsStep({
  motif,
  duration,
  typeLabel,
  date,
  time,
  name,
  phone,
  email,
  message,
  submitting,
  onChange,
  onSubmit,
}: {
  motif: string
  duration: number
  typeLabel: string
  date: string
  time: string
  name: string
  phone: string
  email: string
  message: string
  submitting: boolean
  onChange: (field: 'name' | 'phone' | 'email' | 'message', value: string) => void
  onSubmit: () => void
}) {
  const isValid = name.trim().length > 1 && phone.trim().length >= 6

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (isValid) onSubmit()
      }}
      className="p-6 sm:p-8"
    >
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">Vos coordonnées</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Nous utiliserons votre numéro WhatsApp pour confirmer le rendez-vous et envoyer un rappel.
      </p>

      <div className="bg-cream rounded-lg p-4 mb-6 text-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-navy">
          <SummaryItem icon={<Calendar className="w-4 h-4" />} label={formatLongDate(date)} />
          <SummaryItem icon={<Clock className="w-4 h-4" />} label={`${time} (${duration} min)`} />
          <SummaryItem icon={<MapPin className="w-4 h-4" />} label={typeLabel} />
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Motif : {motif}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Votre nom"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone / WhatsApp *</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+241 ..."
            required
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <Label htmlFor="email">Email (optionnel)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="vous@exemple.com"
        />
      </div>

      <div className="space-y-2 mb-6">
        <Label htmlFor="message">Précisions (optionnel)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => onChange('message', e.target.value)}
          placeholder="Décrivez brièvement votre demande, mentionnez les pièces déjà disponibles…"
          className="min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        disabled={!isValid || submitting}
        className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold h-12"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi en cours…
          </>
        ) : (
          <>
            Confirmer le rendez-vous <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        En confirmant, vous recevrez un message WhatsApp de confirmation et un rappel J-1.
      </p>
    </form>
  )
}

function SummaryItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-gold">{icon}</span>
      <span className="capitalize">{label}</span>
    </span>
  )
}

// ------------------------------ Recap (sticky bottom) -------------------------

function Recap({
  motifLabel,
  typeLabel,
  date,
  time,
}: {
  motifLabel?: string
  typeLabel?: string
  date: string | null
  time: string | null
}) {
  return (
    <div className="mt-6 bg-navy text-white rounded-lg p-4 text-sm flex flex-wrap items-center gap-x-6 gap-y-2">
      {motifLabel && <span><span className="text-gold">Motif :</span> {motifLabel}</span>}
      {typeLabel && <span><span className="text-gold">Modalité :</span> {typeLabel}</span>}
      {date && <span className="capitalize"><span className="text-gold">Date :</span> {formatLongDate(date)}</span>}
      {time && <span><span className="text-gold">Heure :</span> {time}</span>}
    </div>
  )
}
