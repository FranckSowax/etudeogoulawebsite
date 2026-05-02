import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Calendar, Clock, MapPin, MessageCircle, X } from 'lucide-react'
import Seo from '@/components/Seo'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { formatLongDate, typeBySlug, type AppointmentType } from '@/lib/booking'

type AppointmentRow = {
  id: string
  name: string
  date: string
  time: string
  type: AppointmentType
  motif: string
  duration_minutes: number
  status: string
}

export default function Confirmation() {
  const { token } = useParams<{ token: string }>()
  const [appt, setAppt] = useState<AppointmentRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Lien invalide.')
      setLoading(false)
      return
    }
    supabase
      .rpc('get_appointment_by_token', { token })
      .then(({ data, error }) => {
        if (error) {
          setError("Impossible de charger le rendez-vous.")
        } else if (!data || (data as AppointmentRow[]).length === 0) {
          setError('Rendez-vous introuvable.')
        } else {
          setAppt((data as AppointmentRow[])[0])
        }
        setLoading(false)
      })
  }, [token])

  return (
    <>
      <Seo
        title="Confirmation de rendez-vous — Cabinet Ogoula Nkondawiri"
        description="Récapitulatif de votre rendez-vous au Cabinet Notarial Ogoula Nkondawiri à Libreville."
      />

      <section className="bg-navy py-12 sm:py-14 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex w-16 h-16 rounded-full bg-gold/20 items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white">
            Rendez-vous enregistré
          </h1>
          <p className="mt-4 text-gray-300">
            Vous allez recevoir un message WhatsApp de confirmation au numéro indiqué.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <p className="text-center text-muted-foreground">Chargement…</p>}

          {error && (
            <div className="text-center">
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button asChild className="bg-gold hover:bg-gold-dark text-navy font-semibold">
                <Link to="/rendez-vous">Reprendre une réservation</Link>
              </Button>
            </div>
          )}

          {appt && (
            <>
              {appt.status === 'cancelled' && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 text-sm text-destructive">
                  Ce rendez-vous a été annulé.
                </div>
              )}

              <div className="bg-cream rounded-lg p-6 mb-6">
                <h2 className="font-serif text-xl font-semibold text-navy mb-4">
                  Récapitulatif
                </h2>
                <dl className="space-y-3 text-sm">
                  <Row icon={<Calendar className="w-4 h-4" />} label="Date" value={<span className="capitalize">{formatLongDate(appt.date)}</span>} />
                  <Row icon={<Clock className="w-4 h-4" />} label="Heure" value={`${appt.time} (${appt.duration_minutes} min)`} />
                  <Row
                    icon={<MapPin className="w-4 h-4" />}
                    label="Modalité"
                    value={typeBySlug(appt.type)?.label ?? appt.type}
                  />
                  <Row label="Motif" value={appt.motif} />
                  <Row label="Au nom de" value={appt.name} />
                </dl>
              </div>

              <div className="bg-white border border-border rounded-lg p-6 mb-6">
                <h3 className="font-serif text-lg font-semibold text-navy mb-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-gold" />
                  Prochaines étapes
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Confirmation WhatsApp dans les minutes qui suivent.</li>
                  <li>• Rappel automatique 24h et 2h avant le rendez-vous.</li>
                  {appt.type === 'visio' && (
                    <li>• Le lien de visio Google Meet sera envoyé avec la confirmation.</li>
                  )}
                  {appt.type === 'cabinet' && (
                    <li>• Adresse : Boulevard de la Nation, Immeuble Hollando, 6ème étage, Libreville.</li>
                  )}
                  {appt.type === 'telephone' && (
                    <li>• Le cabinet vous appelle au numéro communiqué à l'heure du rendez-vous.</li>
                  )}
                </ul>
              </div>

              {appt.status !== 'cancelled' && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white">
                    <Link to={`/rendez-vous/annuler/${token}`}>
                      <X className="w-4 h-4 mr-2" /> Annuler ce rendez-vous
                    </Link>
                  </Button>
                  <Button asChild className="flex-1 bg-navy hover:bg-navy-light text-white">
                    <Link to="/">Retour à l'accueil</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      {icon && <span className="text-gold mt-0.5 flex-shrink-0">{icon}</span>}
      <div className="flex-1 flex justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
        <dt className="text-muted-foreground">{label}</dt>
        <dd className="font-medium text-navy text-right">{value}</dd>
      </div>
    </div>
  )
}
