import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Loader2, Plus, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AppointmentDetailModal, { type AppointmentDetail } from './AppointmentDetailModal'
import NewAppointmentModal from './NewAppointmentModal'

type Appointment = {
  id: string
  name: string
  phone: string
  email: string | null
  date: string
  time: string
  motif: string
  type: 'cabinet' | 'visio' | 'telephone'
  status: string
  duration_minutes: number
  message: string | null
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending:   { label: 'En attente',  class: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmé',    class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulé',      class: 'bg-red-100 text-red-700' },
  completed: { label: 'Terminé',     class: 'bg-gray-100 text-gray-700' },
  no_show:   { label: 'Absent',      class: 'bg-orange-100 text-orange-700' },
}

const TYPE_LABELS: Record<string, string> = {
  cabinet:   '🏛 Étude',
  visio:     '🎥 Visio',
  telephone: '📞 Téléphone',
}

function getWeekBounds(base: Date) {
  const d = new Date(base)
  const dow = d.getDay() === 0 ? 6 : d.getDay() - 1
  const monday = new Date(d)
  monday.setDate(d.getDate() - dow)
  monday.setHours(0, 0, 0, 0)
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  return { monday, friday }
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function weekDays(monday: Date): Date[] {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export default function AdminAgenda() {
  const [baseDate, setBaseDate] = useState(() => new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<AppointmentDetail | null>(null)
  const [showNew, setShowNew] = useState(false)

  const { monday, friday } = getWeekBounds(baseDate)
  const days = weekDays(monday)
  const todayIso = isoDate(new Date())
  const mondayIso = isoDate(monday)
  const fridayIso = isoDate(friday)

  const fetchAppointments = () => {
    setLoading(true)
    supabase
      .from('appointments')
      .select('id, name, phone, email, date, time, motif, type, status, duration_minutes, message')
      .gte('date', mondayIso)
      .lte('date', fridayIso)
      .order('time', { ascending: true })
      .then(({ data }) => {
        setAppointments((data as Appointment[]) ?? [])
        setLoading(false)
      })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchAppointments, [mondayIso])

  const stats = useMemo(() => {
    const visible = appointments.filter((a) => a.status !== 'cancelled')
    const total = visible.length
    const byStatus: Record<string, number> = {}
    for (const a of visible) byStatus[a.status] = (byStatus[a.status] ?? 0) + 1
    const cancelled = appointments.filter((a) => a.status === 'cancelled').length
    const byMotif: Record<string, number> = {}
    for (const a of visible) byMotif[a.motif] = (byMotif[a.motif] ?? 0) + 1
    const topMotifs = Object.entries(byMotif).sort((a, b) => b[1] - a[1]).slice(0, 3)
    const totalSlotMinutes = visible.reduce((sum, a) => sum + (a.duration_minutes ?? 30), 0)
    const fillRate = Math.min(100, Math.round((totalSlotMinutes / (5 * 8 * 60)) * 100))
    return { total, byStatus, cancelled, topMotifs, fillRate }
  }, [appointments])

  const prevWeek = () => {
    const d = new Date(baseDate)
    d.setDate(d.getDate() - 7)
    setBaseDate(d)
  }
  const nextWeek = () => {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + 7)
    setBaseDate(d)
  }
  const goToday = () => setBaseDate(new Date())

  const weekLabel =
    monday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) +
    ' – ' +
    friday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="font-serif text-2xl font-bold text-navy">Agenda</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-navy hover:bg-navy-light text-white" onClick={() => setShowNew(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Nouveau RDV
          </Button>
          <Button variant="outline" size="sm" onClick={prevWeek}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={goToday} className="text-xs">Aujourd'hui</Button>
          <Button variant="outline" size="sm" onClick={nextWeek}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{weekLabel}</p>

      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="RDV cette semaine"
            value={stats.total}
            sub={stats.cancelled > 0 ? `${stats.cancelled} annulé${stats.cancelled > 1 ? 's' : ''}` : undefined}
            accent="navy"
          />
          <StatCard
            label="Confirmés / En attente"
            value={`${stats.byStatus.confirmed ?? 0} / ${stats.byStatus.pending ?? 0}`}
            sub={stats.byStatus.no_show ? `${stats.byStatus.no_show} absent${stats.byStatus.no_show > 1 ? 's' : ''}` : undefined}
            accent="green"
          />
          <StatCard
            label="Taux de remplissage"
            value={`${stats.fillRate}%`}
            sub="basé sur 40 h/sem"
            accent="gold"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <div className="bg-white rounded-lg border border-border p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              Top motifs
            </p>
            {stats.topMotifs.length === 0 ? (
              <p className="text-xs text-muted-foreground">—</p>
            ) : (
              <ul className="space-y-1">
                {stats.topMotifs.map(([motif, count]) => (
                  <li key={motif} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-navy">{motif}</span>
                    <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-cream text-navy font-semibold">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {days.map((day) => {
            const iso = isoDate(day)
            const isToday = iso === todayIso
            const dayAppts = appointments.filter((a) => a.date === iso && a.status !== 'cancelled')

            return (
              <div key={iso} className="bg-white rounded-lg border border-border overflow-hidden">
                <div
                  className={cn(
                    'px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b',
                    isToday ? 'bg-navy text-white' : 'bg-cream text-navy',
                  )}
                >
                  {day.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  {dayAppts.length > 0 && (
                    <span
                      className={cn(
                        'ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                        isToday ? 'bg-gold text-navy' : 'bg-navy text-white',
                      )}
                    >
                      {dayAppts.length}
                    </span>
                  )}
                </div>
                <div className="p-2 space-y-2 min-h-[80px]">
                  {dayAppts.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">—</p>
                  ) : (
                    dayAppts.map((a) => {
                      const s = STATUS_LABELS[a.status] ?? { label: a.status, class: 'bg-gray-100 text-gray-700' }
                      return (
                        <button
                          key={a.id}
                          onClick={() => setSelected(a)}
                          className="w-full text-left rounded bg-gray-50 border border-border hover:border-gold hover:bg-cream/40 transition-colors p-2 text-xs"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-semibold text-navy">{a.time}</span>
                            <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-medium', s.class)}>
                              {s.label}
                            </span>
                          </div>
                          <p className="font-medium text-navy truncate">{a.name}</p>
                          <p className="text-muted-foreground truncate">{a.motif}</p>
                          <p className="text-muted-foreground">{TYPE_LABELS[a.type]}</p>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && appointments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Aucun rendez-vous cette semaine.</p>
        </div>
      )}

      <AppointmentDetailModal appt={selected} onClose={() => setSelected(null)} />
      <NewAppointmentModal open={showNew} onClose={() => setShowNew(false)} onCreated={fetchAppointments} />
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string
  value: string | number
  sub?: string
  accent: 'navy' | 'gold' | 'green'
  icon?: React.ReactNode
}) {
  const accentClass = {
    navy:  'text-navy',
    gold:  'text-gold',
    green: 'text-green-700',
  }[accent]

  return (
    <div className="bg-white rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </p>
        {icon && <span className="text-gold">{icon}</span>}
      </div>
      <p className={cn('text-2xl font-bold font-serif', accentClass)}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}
