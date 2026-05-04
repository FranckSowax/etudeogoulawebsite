import Seo from '@/components/Seo'
import Hero from '@/sections/Hero'
import Values from '@/sections/Values'
import About from '@/sections/About'
import NotaireMessage from '@/sections/NotaireMessage'
import Services from '@/sections/Services'
import Clientele from '@/sections/Clientele'
import AppointmentCta from '@/sections/AppointmentCta'
import DataRoom from '@/sections/DataRoom'
import ContactSection from '@/sections/ContactSection'

export default function Home() {
  return (
    <>
      <Seo
        title="Notaire à Libreville | Étude Notariale Suzanne Ogoula Nkondawiri — Droit OHADA & Patrimoine"
        description="Étude notariale de référence à Libreville depuis 2012. Droit immobilier, successions, sociétés OHADA, conseil patrimonial. Maître Suzanne Ogoula Nkondawiri."
        canonical="/"
      />
      <Hero />
      <Values />
      <About />
      <NotaireMessage />
      <Services />
      <Clientele />
      <AppointmentCta />
      <DataRoom />
      <ContactSection />
    </>
  )
}
