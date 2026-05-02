import { useEffect, useState } from 'react'
import { Ban, Clock, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useStaff } from '@/hooks/useStaff'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type DayRow = {
  day_of_week: number
  is_open: boolean
  open_time: string   // "HH:MM" or "HH:MM:SS"
  close_time: string
}

type Unavailability = {
  id: string
  date: string
  all_day: boolean
  time_start: string | null
  time_end: string | null
  reason: string | null
  created_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES = ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

/** "HH:MM:SS" → "HH:MM" */
const trimSeconds = (t: string) => t.slice(0, 5)

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminIndispos() {
  return (
    <div className="space-y-10">
      <h1 className="font-serif text-2xl font-bold text-navy">Horaires & Indisponibilités</h1>
      <OfficeHoursSection />
      <ClosuresSection />
    </div>
  )
}

// ─── Section 1 : Horaires d'ouverture ─────────────────────────────────────────

function OfficeHoursSection() {
  const [rows, setRows] = useState<DayRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from('office_hours')
      .select('day_of_week, is_open, open_time, close_time')
      .order('day_of_week')
      .then(({ data }) => {
        if (data) setRows(data as DayRow[])
        setLoading(false)
      })
  }, [])

  const update = (dow: number, patch: Partial<DayRow>) => {
    setRows((prev) => prev.map((r) => (r.day_of_week === dow ? { ...r, ...patch } : r)))
  }

  const handleSave = async () => {
    setSaving(true)
    const results = await Promise.all(
      rows.map((r) =>
        supabase
          .from('office_hours')
          .update({
            is_open:    r.is_open,
            open_time:  trimSeconds(r.open_time),
            close_time: trimSeconds(r.close_time),
          })
          .eq('day_of_week', r.day_of_week),
      ),
    )
    setSaving(false)
    if (results.some((r) => r.error)) {
      toast.error('Certaines lignes n\'ont pas pu être sauvegardées.')
    } else {
      toast.success('Horaires mis à jour.')
    }
  }

  return (
    <section className="bg-white rounded-lg border border-border overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-cream">
        <Clock className="w-5 h-5 text-gold" />
        <h2 className="font-serif text-lg font-semibold text-navy">Horaires d'ouverture</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-gold" />
        </div>
      ) : (
        <>
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <div
                key={row.day_of_week}
                className={cn(
                  'flex flex-wrap items-center gap-4 px-5 py-3',
                  !row.is_open && 'bg-gray-50/60',
                )}
              >
                {/* Toggle + day name */}
                <button
                  type="button"
                  onClick={() => update(row.day_of_week, { is_open: !row.is_open })}
                  className={cn(
                    'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                    row.is_open ? 'bg-gold' : 'bg-gray-200',
                  )}
                  role="switch"
                  aria-checked={row.is_open}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                      row.is_open ? 'translate-x-4' : 'translate-x-0',
                    )}
                  />
                </button>

                <span
                  className={cn(
                    'w-24 text-sm font-medium',
                    row.is_open ? 'text-navy' : 'text-muted-foreground',
                  )}
                >
                  {DAY_NAMES[row.day_of_week]}
                </span>

                {row.is_open ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={trimSeconds(row.open_time)}
                      onChange={(e) => update(row.day_of_week, { open_time: e.target.value })}
                      className="w-28 h-8 text-sm"
                    />
                    <span className="text-muted-foreground text-sm">→</span>
                    <Input
                      type="time"
                      value={trimSeconds(row.close_time)}
                      onChange={(e) => update(row.day_of_week, { close_time: e.target.value })}
                      className="w-28 h-8 text-sm"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Fermé</span>
                )}
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-border flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="bg-navy hover:bg-navy-light text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1.5" />
              )}
              Sauvegarder les horaires
            </Button>
          </div>
        </>
      )}
    </section>
  )
}

// ─── Section 2 : Fermetures exceptionnelles ───────────────────────────────────

function ClosuresSection() {
  const { staff } = useStaff()
  const [items, setItems] = useState<Unavailability[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form state
  const [allDay, setAllDay] = useState(true)
  const [date, setDate] = useState('')
  const [timeStart, setTimeStart] = useState('08:00')
  const [timeEnd, setTimeEnd] = useState('10:00')
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchItems = () => {
    setLoading(true)
    supabase
      .from('unavailabilities')
      .select('id, date, all_day, time_start, time_end, reason, created_at')
      .order('date', { ascending: true })
      .then(({ data }) => {
        setItems((data as Unavailability[]) ?? [])
        setLoading(false)
      })
  }

  useEffect(fetchItems, [])

  const resetForm = () => {
    setAllDay(true)
    setDate('')
    setTimeStart('08:00')
    setTimeEnd('10:00')
    setReason('')
    setShowForm(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) return
    if (!allDay && timeStart >= timeEnd) {
      toast.error('L\'heure de fin doit être après l\'heure de début.')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('unavailabilities').insert({
      date,
      all_day:    allDay,
      time_start: allDay ? null : timeStart,
      time_end:   allDay ? null : timeEnd,
      reason:     reason.trim() || null,
      created_by: staff?.id ?? null,
    })
    setSaving(false)
    if (error) {
      toast.error('Erreur lors de l\'enregistrement.')
      return
    }
    toast.success('Fermeture enregistrée.')
    resetForm()
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error } = await supabase.from('unavailabilities').delete().eq('id', id)
    setDeletingId(null)
    if (error) {
      toast.error('Impossible de supprimer.')
    } else {
      toast.success('Fermeture supprimée.')
      setItems((prev) => prev.filter((i) => i.id !== id))
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <section className="bg-white rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border bg-cream">
        <div className="flex items-center gap-3">
          <Ban className="w-5 h-5 text-gold" />
          <h2 className="font-serif text-lg font-semibold text-navy">Fermetures exceptionnelles</h2>
        </div>
        {!showForm && (
          <Button
            size="sm"
            className="bg-navy hover:bg-navy-light text-white"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Ajouter
          </Button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="px-5 py-5 border-b border-border space-y-4 bg-gray-50/50">
          <h3 className="font-medium text-navy text-sm">Nouvelle fermeture</h3>

          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAllDay(true)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                allDay ? 'bg-navy text-white border-navy' : 'bg-white text-muted-foreground border-border hover:border-navy',
              )}
            >
              Journée entière
            </button>
            <button
              type="button"
              onClick={() => setAllDay(false)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                !allDay ? 'bg-navy text-white border-navy' : 'bg-white text-muted-foreground border-border hover:border-navy',
              )}
            >
              Plage horaire
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="closure-date">Date</Label>
              <Input
                id="closure-date"
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {!allDay && (
              <div className="space-y-1.5">
                <Label>Plage horaire bloquée</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <span className="text-muted-foreground text-sm">→</span>
                  <Input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="flex-1"
                    required
                  />
                </div>
              </div>
            )}

            <div className={cn('space-y-1.5', !allDay && 'sm:col-span-2')}>
              <Label htmlFor="closure-reason">Motif (optionnel)</Label>
              <Input
                id="closure-reason"
                type="text"
                placeholder="Formation, Férié, Réunion…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={saving} className="bg-navy hover:bg-navy-light text-white">
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              Enregistrer
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={resetForm}>
              Annuler
            </Button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-gold" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Ban className="w-8 h-8 mx-auto mb-2 opacity-25" />
          <p className="text-sm">Aucune fermeture exceptionnelle.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {items.map((item) => {
            const isPast = item.date < today
            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-center justify-between gap-4 px-5 py-3',
                  isPast && 'opacity-40',
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-navy text-sm capitalize">
                      {formatDate(item.date)}
                    </p>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-[11px] font-medium',
                      item.all_day
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700',
                    )}>
                      {item.all_day
                        ? 'Journée entière'
                        : `${trimSeconds(item.time_start ?? '')} → ${trimSeconds(item.time_end ?? '')}`}
                    </span>
                  </div>
                  {item.reason && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  title="Supprimer"
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  {deletingId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
