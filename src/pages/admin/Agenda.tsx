import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Appointment = {
  id: string
  name: string
  phone: string
  date: string
  time: string
  motif: string
  type: 'cabinet' | 'visio' | 'telephone'
  status: string
  duration_minutes: number
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending:   { label: 'En attente',  class: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmé',    class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulé',      class: 'bg-red-100 text-red-700' },
  completed: { label: 'Terminé',     class: 'bg-gray-100 text-gray-700' },
  no_show:   { label: 'Absent',      class: 'bg-orange-100 text-orange-700' },
}

const TYPE_LABELS: Record<string, string> = {
  cabinet:   '🏛 Cabinet',
  visio:     '🎥 Visio',
  telephone: '📞 Téléphone',
}

function getWeekBounds(base: Date) {
  const d = new Date(base)
  const dow = d.getDay() === 0 ? 6 : d.getDay() - 1 // Mon=0
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

  const { monday, friday } = getWeekBounds(baseDate)
  const days = weekDays(monday)
  const todayIso = isoDate(new Date())

  useEffect(() => {
    setLoading(true)
    supabase
      .from('appointments')
      .select('id, name, phone, date, time, motif, type, status, duration_minutes')
      .gte('date', isoDate(monday))
      .lte('date', isoDate(friday))
      .in('status', ['pending', 'confirmed', 'completed', 'no_show'])
      .order('time', { ascending: true })
      .then(({ data }) => {
        setAppointments((data as Appointment[]) ?? [])
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isoDate(monday)])

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

  const weekLabel = monday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    + ' – '
    + friday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl font-bold text-navy">Agenda</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevWeek}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={goToday} className="text-xs">Aujourd'hui</Button>
          <Button variant="outline" size="sm" onClick={nextWeek}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{weekLabel}</p>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {days.map((day) => {
            const iso = isoDate(day)
            const isToday = iso === todayIso
            const dayAppts = appointments.filter((a) => a.date === iso)

            return (
              <div key={iso} className="bg-white rounded-lg border border-border overflow-hidden">
                <div className={cn(
                  'px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b',
                  isToday ? 'bg-navy text-white' : 'bg-cream text-navy',
                )}>
                  {day.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  {dayAppts.length > 0 && (
                    <span className={cn(
                      'ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                      isToday ? 'bg-gold text-navy' : 'bg-navy text-white',
                    )}>
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
                        <div key={a.id} className="rounded bg-gray-50 border border-border p-2 text-xs">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-semibold text-navy">{a.time}</span>
                            <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-medium', s.class)}>
                              {s.label}
                            </span>
                          </div>
                          <p className="font-medium text-navy truncate">{a.name}</p>
                          <p className="text-muted-foreground truncate">{a.motif}</p>
                          <p className="text-muted-foreground">{TYPE_LABELS[a.type]}</p>
                        </div>
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
    </div>
  )
}
