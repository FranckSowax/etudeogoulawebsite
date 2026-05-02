import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Phone, MessageCircle, Video, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AppointmentCta() {
  return (
    <section id="rendez-vous" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-gold" />
              <span className="text-gold text-sm font-medium tracking-wider uppercase">
                Rendez-vous en ligne
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mb-6">
              Réservez votre consultation en 4 étapes
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Choisissez votre motif, votre modalité (cabinet, visio ou téléphone) et votre
              créneau. Vous recevrez une confirmation WhatsApp puis un rappel automatique J-1
              et 2h avant votre rendez-vous.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <FormatCard icon={<Building className="w-5 h-5" />} label="Au cabinet" />
              <FormatCard icon={<Video className="w-5 h-5" />} label="En visio" />
              <FormatCard icon={<Phone className="w-5 h-5" />} label="Par téléphone" />
            </div>

            <div className="space-y-4 mb-8">
              <InfoRow icon={<Clock className="w-5 h-5" />}>
                Lundi au vendredi, 7h30 – 15h30
              </InfoRow>
              <InfoRow icon={<MapPin className="w-5 h-5" />}>
                Bd de la Nation, Imm. Hollando, 6e étage, Libreville
              </InfoRow>
              <InfoRow icon={<MessageCircle className="w-5 h-5" />}>
                Confirmation et rappels par WhatsApp
              </InfoRow>
            </div>

            <Link to="/rendez-vous">
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-navy font-semibold h-12 px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Réserver mon rendez-vous
              </Button>
            </Link>
          </div>

          <div className="bg-cream rounded-lg p-8 lg:p-10 shadow-elegant">
            <ol className="space-y-6">
              {[
                ['Choisissez votre motif', "La durée du créneau s'ajuste automatiquement (de 30 à 60 min)."],
                ['Sélectionnez la modalité', 'Cabinet, visio Google Meet, ou téléphone.'],
                ['Réservez votre créneau', 'Disponibilités en temps réel sur les 15 prochains jours ouvrés.'],
                ['Confirmez en 1 clic', 'Confirmation WhatsApp + lien d\'annulation.'],
              ].map(([title, desc], idx) => (
                <li key={title} className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-navy text-gold font-bold flex items-center justify-center text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-navy">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

function FormatCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="bg-cream rounded-lg p-3 text-center">
      <div className="w-10 h-10 mx-auto bg-gold/10 rounded-lg flex items-center justify-center text-gold mb-2">
        {icon}
      </div>
      <span className="text-xs font-medium text-navy">{label}</span>
    </div>
  )
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center text-gold flex-shrink-0">
        {icon}
      </span>
      {children}
    </div>
  )
}
