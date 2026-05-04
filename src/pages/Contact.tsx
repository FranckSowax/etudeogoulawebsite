import Seo from '@/components/Seo'
import ContactSection from '@/sections/ContactSection'

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact — Notaire à Libreville, Gabon | Étude Ogoula Nkondawiri"
        description="Contactez l'Étude Notariale Ogoula Nkondawiri à Libreville : téléphone, email, adresse, horaires. Formulaire de contact direct."
        canonical="/contact"
      />

      <section className="bg-navy py-12 sm:py-14 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-sm font-medium tracking-wider uppercase">Contact</span>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            Contactez l'étude
          </h1>
        </div>
      </section>

      <ContactSection />

      <section className="bg-white pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-navy mb-6 text-center">
            Notre étude à Libreville
          </h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-elegant">
            <iframe
              title="Plan d'accès à l'Étude Notariale Ogoula Nkondawiri"
              src="https://www.google.com/maps?q=Boulevard+de+la+Nation,+Libreville,+Gabon&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  )
}
