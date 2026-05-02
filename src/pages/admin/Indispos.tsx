import { useEffect, useState } from 'react'
import { Ban, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useStaff } from '@/hooks/useStaff'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Unavailability = {
  id: string
  date: string
  reason: string | null
  created_at: string
}

export default function AdminIndispos() {
  const { staff } = useStaff()
  const [indispos, setIndispos] = useState<Unavailability[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetch = () => {
    setLoading(true)
    supabase
      .from('unavailabilities')
      .select('id, date, reason, created_at')
      .order('date', { ascending: true })
      .then(({ data }) => {
        setIndispos((data as Unavailability[]) ?? [])
        setLoading(false)
      })
  }

  useEffect(fetch, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDate) return
    setSaving(true)
    const { error } = await supabase.from('unavailabilities').insert({
      date: newDate,
      reason: newReason.trim() || null,
      created_by: staff?.id ?? null,
    })
    setSaving(false)
    if (error) {
      toast.error(error.code === '23505' ? 'Cette date est déjà bloquée.' : 'Erreur lors de l\'enregistrement.')
      return
    }
    toast.success('Date bloquée.')
    setNewDate('')
    setNewReason('')
    setAdding(false)
    fetch()
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error } = await supabase.from('unavailabilities').delete().eq('id', id)
    setDeletingId(null)
    if (error) {
      toast.error('Impossible de supprimer.')
    } else {
      toast.success('Date débloquée.')
      setIndispos((prev) => prev.filter((i) => i.id !== id))
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl font-bold text-navy">Indisponibilités</h1>
        {!adding && (
          <Button
            size="sm"
            className="bg-navy hover:bg-navy-light text-white"
            onClick={() => setAdding(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Bloquer une date
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Les dates bloquées n'apparaîtront pas dans le calendrier de prise de rendez-vous.
      </p>

      {/* Add form */}
      {adding && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-border rounded-lg p-4 mb-6 space-y-4"
        >
          <h2 className="font-medium text-navy">Bloquer une nouvelle date</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-date">Date</Label>
              <Input
                id="new-date"
                type="date"
                min={today}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-reason">Motif (optionnel)</Label>
              <Input
                id="new-reason"
                type="text"
                placeholder="Journée formation, Férié…"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={saving} className="bg-navy hover:bg-navy-light text-white">
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              Enregistrer
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => { setAdding(false); setNewDate(''); setNewReason('') }}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </div>
      ) : indispos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Ban className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Aucune date bloquée.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border divide-y divide-border">
          {indispos.map((i) => {
            const isPast = i.date < today
            return (
              <div key={i.id} className={`flex items-center justify-between gap-4 px-4 py-3 ${isPast ? 'opacity-50' : ''}`}>
                <div className="min-w-0">
                  <p className="font-medium text-navy">
                    {new Date(i.date + 'T00:00:00').toLocaleDateString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  {i.reason && (
                    <p className="text-sm text-muted-foreground">{i.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(i.id)}
                  disabled={deletingId === i.id}
                  title="Débloquer"
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  {deletingId === i.id ? (
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
    </div>
  )
}
