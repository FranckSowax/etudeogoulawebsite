import { useEffect, useState } from 'react'
import { Loader2, Plus, RefreshCw } from 'lucide-react'
import AppointmentDetailModal, { type AppointmentDetail } from './AppointmentDetailModal'
import NewAppointmentModal from './NewAppointmentModal'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  created_at: string
}

const STATUSES = ['pending', 'confirmed', 'completed', 'no_show', 'cancelled']

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending:   { label: 'En attente',  class: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmé',    class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulé',      class: 'bg-red-100 text-red-700' },
  completed: { label: 'Terminé',     class: 'bg-gray-100 text-gray-700' },
  no_show:   { label: 'Absent',      class: 'bg-orange-100 text-orange-700' },
}

const TYPE_LABELS: Record<string, string> = {
  cabinet:   'Étude',
  visio:     'Visio',
  telephone: 'Tél.',
}

export default function AdminListe() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<AppointmentDetail | null>(null)
  const [showNew, setShowNew] = useState(false)

  const fetch = () => {
    setLoading(true)
    let q = supabase
      .from('appointments')
      .select('id, name, phone, email, date, time, motif, type, status, duration_minutes, message, created_at')
      .order('date', { ascending: false })
      .order('time', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    q.then(({ data, error }) => {
      if (error) toast.error('Erreur de chargement.')
      else setAppointments((data as Appointment[]) ?? [])
      setLoading(false)
    })
  }

  useEffect(fetch, [filter])

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id)
    setUpdatingId(null)
    if (error) {
      toast.error('Impossible de mettre à jour le statut.')
    } else {
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus } : a))
      toast.success('Statut mis à jour.')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl font-bold text-navy">Liste des rendez-vous</h1>
        <Button size="sm" className="bg-navy hover:bg-navy-light text-white" onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Nouveau RDV
        </Button>
        <Button variant="outline" size="sm" onClick={fetch}>
          <RefreshCw className="w-4 h-4 mr-1.5" /> Actualiser
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <FilterChip label="Tous" value="all" active={filter === 'all'} onClick={() => setFilter('all')} />
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={STATUS_LABELS[s].label}
            value={s}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Aucun rendez-vous trouvé.</p>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream border-b border-border text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-3">Date / Heure</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Motif</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((a) => {
                  const s = STATUS_LABELS[a.status] ?? { label: a.status, class: 'bg-gray-100 text-gray-700' }
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(a)}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-navy">{formatDate(a.date)}</p>
                        <p className="text-muted-foreground">{a.time} ({a.duration_minutes} min)</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy">{a.name}</p>
                        <p className="text-muted-foreground text-xs">{a.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">{a.motif}</td>
                      <td className="px-4 py-3 text-muted-foreground">{TYPE_LABELS[a.type]}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', s.class)}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {updatingId === a.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gold" />
                        ) : (
                          <StatusSelect
                            value={a.status}
                            onChange={(v) => updateStatus(a.id, v)} stopPropagation
                          />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden divide-y divide-border">
            {appointments.map((a) => {
              const s = STATUS_LABELS[a.status] ?? { label: a.status, class: 'bg-gray-100 text-gray-700' }
              return (
                <div key={a.id} className="p-4 space-y-2 cursor-pointer hover:bg-gray-50" onClick={() => setSelected(a)}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-navy">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.phone}</p>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0', s.class)}>
                      {s.label}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(a.date)} · {a.time} · {TYPE_LABELS[a.type]}
                  </div>
                  <p className="text-sm text-navy">{a.motif}</p>
                  {updatingId === a.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  ) : (
                    <StatusSelect value={a.status} onChange={(v) => updateStatus(a.id, v)} stopPropagation />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
      <NewAppointmentModal open={showNew} onClose={() => setShowNew(false)} onCreated={fetch} />
      <AppointmentDetailModal appt={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; value: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
        active
          ? 'bg-navy text-white border-navy'
          : 'bg-white text-muted-foreground border-border hover:border-navy hover:text-navy',
      )}
    >
      {label}
    </button>
  )
}

function StatusSelect({ value, onChange, stopPropagation }: { value: string; onChange: (v: string) => void; stopPropagation?: boolean }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)} onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      className="text-xs border border-border rounded px-2 py-1 text-navy bg-white cursor-pointer"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
      ))}
    </select>
  )
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}
