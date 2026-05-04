import Seo from '@/components/Seo'
import BookingWizard from '@/components/booking/BookingWizard'

export default function RendezVous() {
  return (
    <>
      <Seo
        title="Prendre Rendez-vous — Notaire à Libreville, Gabon | Étude Ogoula Nkondawiri"
        description="Prenez rendez-vous en ligne avec Maître Suzanne Ogoula Nkondawiri à Libreville. Consultation à l'étude, en visio ou par téléphone. Confirmation WhatsApp."
        canonical="/rendez-vous"
      />

      <section className="bg-navy py-12 sm:py-14 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-sm font-medium tracking-wider uppercase">Rendez-vous</span>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            Prendre rendez-vous en ligne
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Choisissez votre motif, votre modalité et votre créneau en quelques secondes.
            Confirmation et rappels par WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 lg:py-16 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingWizard />
        </div>
      </section>
    </>
  )
}
