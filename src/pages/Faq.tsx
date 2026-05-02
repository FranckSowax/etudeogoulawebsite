import Seo from '@/components/Seo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'Quels sont les frais de notaire au Gabon pour un achat immobilier ?',
    a: 'Les frais de notaire pour un achat immobilier au Gabon comprennent les émoluments du notaire (réglementés et proportionnels au prix), les droits d\'enregistrement perçus pour l\'État, et les frais de conservation foncière. Notre simulateur en ligne (à venir) vous donnera une estimation précise.',
  },
  {
    q: 'Quels documents apporter pour un rendez-vous notarial ?',
    a: 'Selon votre démarche : pièce d\'identité, acte de naissance, titre de propriété, plan cadastral, livret de famille, statuts de société, etc. Nous vous adresserons une liste personnalisée après votre prise de rendez-vous.',
  },
  {
    q: 'Combien de temps prend une succession au Gabon ?',
    a: 'Une succession simple peut être réglée en quelques mois ; un dossier complexe (immobilier, héritiers à l\'étranger, contestation) peut prendre 12 à 24 mois. Nous vous tenons informé à chaque étape.',
  },
  {
    q: 'Puis-je signer mes actes à distance ?',
    a: 'Certains actes peuvent être signés par procuration authentique. Nous proposons également des consultations en visioconférence pour la préparation de votre dossier. La signature électronique sera prochainement disponible pour certains actes.',
  },
  {
    q: 'Comment prendre rendez-vous avec le cabinet ?',
    a: 'Vous pouvez réserver directement en ligne via notre formulaire, ou nous appeler aux numéros indiqués. Vous recevrez une confirmation par WhatsApp et un rappel J-1.',
  },
  {
    q: 'Le notaire est-il tenu au secret professionnel ?',
    a: 'Oui, le notaire est officier public et tenu au secret professionnel le plus strict. Toute information confiée à l\'étude reste confidentielle.',
  },
]

export default function Faq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <Seo
        title="FAQ Notaire Gabon — Questions Fréquentes | Cabinet Ogoula Nkondawiri"
        description="Réponses aux questions les plus posées sur le notariat au Gabon : frais, délais, succession, documents, prise de rendez-vous. Cabinet Ogoula Nkondawiri à Libreville."
        canonical="/faq"
        jsonLd={jsonLd}
      />

      <section className="bg-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-sm font-medium tracking-wider uppercase">FAQ</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-serif font-bold text-white">
            Questions fréquentes
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="font-serif text-left text-navy text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  )
}
