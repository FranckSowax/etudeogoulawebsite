import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Seo from '@/components/Seo'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function Annulation() {
  const { token } = useParams<{ token: string }>()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleCancel = async () => {
    if (!token) return
    setSubmitting(true)
    const { data, error } = await supabase.rpc('cancel_appointment_by_token', { token })
    setSubmitting(false)

    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      toast.error("Impossible d'annuler ce rendez-vous (lien expiré ou déjà annulé).")
      return
    }

    // Fire-and-forget: tell the Netlify Function to drop the GCal event
    // and send the WhatsApp ack. Failures don't block the user.
    fetch('/api/appointments/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch((err) => console.error('appointment-cancel webhook failed', err))

    setDone(true)
    toast.success('Rendez-vous annulé.')
  }

  return (
    <>
      <Seo
        title="Annulation de rendez-vous — Étude Ogoula Nkondawiri"
        description="Annulez votre rendez-vous en un clic auprès du Étude Notariale Ogoula Nkondawiri."
      />

      <section className="bg-navy py-12 sm:py-14 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white">
            Annulation du rendez-vous
          </h1>
        </div>
      </section>

      <section className="py-10 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {done ? (
            <>
              <div className="inline-flex w-16 h-16 rounded-full bg-gold/20 items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-gold" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-3">
                Rendez-vous annulé
              </h2>
              <p className="text-muted-foreground mb-8">
                Le créneau a été libéré. Vous pouvez à tout moment réserver un nouveau rendez-vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="bg-gold hover:bg-gold-dark text-navy font-semibold">
                  <Link to="/rendez-vous">Reprendre rendez-vous</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Retour à l'accueil</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex w-16 h-16 rounded-full bg-destructive/10 items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-3">
                Confirmer l'annulation ?
              </h2>
              <p className="text-muted-foreground mb-8">
                Cette action libère votre créneau. Vous pourrez en réserver un autre à tout moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleCancel}
                  disabled={submitting}
                  className="bg-destructive hover:bg-destructive/90 text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Annulation en cours…
                    </>
                  ) : (
                    'Oui, annuler'
                  )}
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Conserver le rendez-vous
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
