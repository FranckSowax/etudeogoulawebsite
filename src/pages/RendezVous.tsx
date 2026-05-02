import Seo from '@/components/Seo'
import AppointmentForm from '@/sections/AppointmentForm'

export default function RendezVous() {
  return (
    <>
      <Seo
        title="Prendre Rendez-vous — Notaire à Libreville, Gabon | Cabinet Ogoula Nkondawiri"
        description="Prenez rendez-vous en ligne avec Maître Suzanne Ogoula Nkondawiri à Libreville. Consultation au cabinet, en visio ou par téléphone."
        canonical="/rendez-vous"
      />

      <section className="bg-navy py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-sm font-medium tracking-wider uppercase">Rendez-vous</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-serif font-bold text-white">
            Prendre rendez-vous
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Réservez une consultation au cabinet, en visio ou par téléphone.
          </p>
        </div>
      </section>

      <AppointmentForm />
    </>
  )
}
