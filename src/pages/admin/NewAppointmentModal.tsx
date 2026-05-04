import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { motifs, appointmentTypes } from '@/lib/booking'
import { supabase } from '@/lib/supabase'

type Props = {
  open: boolean
  onClose: () => void
  /** Called after a successful create so the parent can refresh its list. */
  onCreated: () => void
  /** Optional: pre-fill date/time when opened from a calendar slot. */
  defaultDate?: string
  defaultTime?: string
}

export default function NewAppointmentModal({ open, onClose, onCreated, defaultDate, defaultTime }: Props) {
  const [motifSlug, setMotifSlug] = useState(motifs[0].slug)
  const [type, setType] = useState<'cabinet' | 'visio' | 'telephone'>('cabinet')
  const [date, setDate] = useState(defaultDate ?? '')
  const [time, setTime] = useState(defaultTime ?? '09:00')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sendWhatsapp, setSendWhatsapp] = useState(true)
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const motif = motifs.find((m) => m.slug === motifSlug) ?? motifs[0]

  const reset = () => {
    setMotifSlug(motifs[0].slug)
    setType('cabinet')
    setDate(defaultDate ?? '')
    setTime(defaultTime ?? '09:00')
    setName('')
    setPhone('')
    setEmail('')
    setMessage('')
    setSendWhatsapp(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !date || !time) return
    setSaving(true)

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
      status: 'confirmed',
      cancellation_token: token,
    })

    setSaving(false)
    if (error) {
      toast.error("Création échouée : " + error.message)
      return
    }

    if (sendWhatsapp) {
      // Fire-and-forget: trigger Netlify Function so the client gets a
      // confirmation message and the GCal event is created.
      fetch('/api/appointments/created', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }).catch((err) => console.error('webhook failed', err))
    }

    toast.success('Rendez-vous créé.')
    reset()
    onCreated()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-elegant max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
          <h2 className="font-serif text-xl font-bold text-navy">Nouveau rendez-vous</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-navy p-1 -mr-1" aria-label="Fermer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-name">Nom complet *</Label>
              <Input id="new-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-phone">Téléphone *</Label>
              <Input
                id="new-phone"
                type="tel"
                placeholder="077 12 34 56"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-email">Email (optionnel)</Label>
            <Input id="new-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-motif">Motif</Label>
            <select
              id="new-motif"
              value={motifSlug}
              onChange={(e) => setMotifSlug(e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-white px-3 text-sm"
            >
              {motifs.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.label} ({m.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Modalité</Label>
            <div className="flex gap-2">
              {appointmentTypes.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setType(t.slug)}
                  className={`flex-1 px-3 py-2 rounded border text-xs font-medium transition-colors ${
                    type === t.slug
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-muted-foreground border-border hover:border-navy'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-date">Date *</Label>
              <Input id="new-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-time">Heure *</Label>
              <Input id="new-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-message">Note interne (optionnel)</Label>
            <Textarea
              id="new-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={sendWhatsapp}
              onChange={(e) => setSendWhatsapp(e.target.checked)}
              className="rounded border-border"
            />
            Envoyer la confirmation WhatsApp au client
          </label>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy-light text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Créer le rendez-vous
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
