import { useEffect } from 'react'
import { Calendar, Clock, MapPin, Mail, MessageCircle, Phone, X, FileText, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type AppointmentDetail = {
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
  message?: string | null
  created_at?: string
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending:   { label: 'En attente',  class: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmé',    class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulé',      class: 'bg-red-100 text-red-700' },
  completed: { label: 'Terminé',     class: 'bg-gray-100 text-gray-700' },
  no_show:   { label: 'Absent',      class: 'bg-orange-100 text-orange-700' },
}

const TYPE_LABELS: Record<string, string> = {
  cabinet:   "À l'étude",
  visio:     'Visio',
  telephone: 'Téléphone',
}

function formatLongDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

/** Strip non-digits and add 241 prefix for 8-digit Gabonese numbers. */
function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^\d]/g, '')
  if (digits.length === 8) digits = '241' + digits
  return digits
}

type Props = {
  appt: AppointmentDetail | null
  onClose: () => void
}

export default function AppointmentDetailModal({ appt, onClose }: Props) {
  // ESC closes the modal; lock body scroll while open.
  useEffect(() => {
    if (!appt) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [appt, onClose])

  if (!appt) return null

  const phoneDigits = normalizePhone(appt.phone)
  const status = STATUS_LABELS[appt.status] ?? { label: appt.status, class: 'bg-gray-100 text-gray-700' }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-elegant max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-serif text-xl font-bold text-navy">{appt.name}</h2>
            <span className={cn('inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium', status.class)}>
              {status.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-navy transition-colors p-1 -mr-1"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick contact actions */}
        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-border bg-cream/40">
          <a
            href={`tel:${phoneDigits}`}
            className="flex flex-col items-center gap-1 px-2 py-2 rounded bg-white hover:bg-navy hover:text-white border border-border transition-colors text-xs font-medium text-navy"
          >
            <Phone className="w-4 h-4" />
            Appeler
          </a>
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 px-2 py-2 rounded bg-white hover:bg-green-600 hover:text-white border border-border transition-colors text-xs font-medium text-navy"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          {appt.email ? (
            <a
              href={`mailto:${appt.email}`}
              className="flex flex-col items-center gap-1 px-2 py-2 rounded bg-white hover:bg-navy hover:text-white border border-border transition-colors text-xs font-medium text-navy"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          ) : (
            <span className="flex flex-col items-center gap-1 px-2 py-2 rounded bg-gray-100 border border-border text-xs font-medium text-muted-foreground/60">
              <Mail className="w-4 h-4" />
              —
            </span>
          )}
        </div>

        {/* Details */}
        <dl className="divide-y divide-border text-sm">
          <Row icon={<Calendar className="w-4 h-4" />} label="Date">
            <span className="capitalize">{formatLongDate(appt.date)}</span>
          </Row>
          <Row icon={<Clock className="w-4 h-4" />} label="Heure">
            {appt.time} ({appt.duration_minutes} min)
          </Row>
          <Row icon={<MapPin className="w-4 h-4" />} label="Modalité">
            {TYPE_LABELS[appt.type]}
          </Row>
          <Row icon={<FileText className="w-4 h-4" />} label="Motif">
            {appt.motif}
          </Row>
          <Row icon={<User className="w-4 h-4" />} label="Téléphone">
            <a href={`tel:${phoneDigits}`} className="text-gold hover:underline">{appt.phone}</a>
          </Row>
          {appt.email && (
            <Row icon={<Mail className="w-4 h-4" />} label="Email">
              <a href={`mailto:${appt.email}`} className="text-gold hover:underline break-all">{appt.email}</a>
            </Row>
          )}
          {appt.message && (
            <Row icon={<MessageCircle className="w-4 h-4" />} label="Note">
              <span className="whitespace-pre-wrap">{appt.message}</span>
            </Row>
          )}
        </dl>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>Fermer</Button>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-5 py-3">
      <span className="text-gold mt-0.5 flex-shrink-0">{icon}</span>
      <dt className="w-24 text-muted-foreground flex-shrink-0">{label}</dt>
      <dd className="flex-1 text-navy font-medium min-w-0">{children}</dd>
    </div>
  )
}
