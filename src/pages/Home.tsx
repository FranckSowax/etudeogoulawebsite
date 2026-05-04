import Seo from '@/components/Seo'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Services from '@/sections/Services'
import AppointmentCta from '@/sections/AppointmentCta'
import ContactSection from '@/sections/ContactSection'

export default function Home() {
  return (
    <>
      <Seo
        title="Notaire au Gabon | Achat Immobilier & Droit Notarial à Libreville - Étude Ogoula Nkondawiri"
        description="Étude notariale à Libreville, Gabon. Maître Suzanne Ogoula Nkondawiri, notaire spécialisée en achat immobilier, vente, succession, droit des affaires et actes authentiques. Prenez rendez-vous."
        canonical="/"
      />
      <Hero />
      <About />
      <Services />
      <AppointmentCta />
      <ContactSection />
    </>
  )
}
