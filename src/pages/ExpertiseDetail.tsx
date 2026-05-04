import { Link, useParams, Navigate } from 'react-router-dom'
import { Calendar, CheckCircle2, ChevronRight, Phone } from 'lucide-react'
import Seo from '@/components/Seo'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { expertises } from '@/lib/services'

export default function ExpertiseDetail() {
  const { slug } = useParams<{ slug: string }>()
  const service = expertises.find((e) => e.slug === slug)

  if (!service) return <Navigate to="/expertises" replace />

  const others = expertises.filter((e) => e.slug !== service.slug).slice(0, 3)

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Notary',
      name: 'Étude Notariale Suzanne Ogoula Nkondawiri',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Boulevard de la Nation, Immeuble Hollando, 6ème étage',
        addressLocality: 'Libreville',
        addressCountry: 'GA',
      },
      telephone: '+241-011-77-37-35',
    },
    areaServed: { '@type': 'Country', name: 'Gabon' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.title,
      itemListElement: service.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item },
      })),
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.notaire-ogoula-gabon.com/' },
      { '@type': 'ListItem', position: 2, name: 'Expertises', item: 'https://www.notaire-ogoula-gabon.com/expertises' },
      { '@type': 'ListItem', position: 3, name: service.shortTitle, item: `https://www.notaire-ogoula-gabon.com/expertises/${service.slug}` },
    ],
  }

  return (
    <>
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        canonical={`/expertises/${service.slug}`}
        jsonLd={[serviceJsonLd, faqJsonLd, breadcrumbJsonLd]}
      />

      {/* Hero */}
      <section className="bg-navy py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gold-light mb-6" aria-label="Fil d'Ariane">
            <Link to="/" className="hover:text-gold">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/expertises" className="hover:text-gold">Expertises</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{service.shortTitle}</span>
          </nav>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-gold/20 rounded-lg flex items-center justify-center text-gold flex-shrink-0">
              {service.icon}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
                {service.title}
              </h1>
              <p className="mt-4 text-lg text-gray-300 max-w-3xl">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro + figures */}
      <section className="py-10 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {service.intro.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-lg">
                  {p}
                </p>
              ))}
            </div>
            {service.figures && (
              <aside className="space-y-4">
                {service.figures.map((f) => (
                  <div key={f.label} className="bg-cream rounded-lg p-5 border-l-4 border-gold">
                    <div className="font-serif text-3xl font-bold text-navy">{f.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{f.label}</div>
                  </div>
                ))}
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* Long-form sections */}
      <section className="py-10 sm:py-14 lg:py-16 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {service.sections.map((sec) => (
              <article key={sec.heading}>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy mb-4">
                  {sec.heading}
                </h2>
                <div className="space-y-3">
                  {sec.paragraphs.map((p, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
                  ))}
                </div>
              </article>
            ))}

            <article>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy mb-6">
                Nos prestations
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {service.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-navy text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy mb-6">
                Comment ça se passe ?
              </h2>
              <ol className="space-y-4">
                {[
                  ['Prise de rendez-vous', "Choisissez un créneau en ligne, en visio ou à l'étude à Libreville."],
                  ['Étude de votre dossier', 'Nous analysons votre situation et listons les pièces nécessaires.'],
                  ["Rédaction de l'acte", 'Nos clercs préparent l\'acte avec rigueur, en lien étroit avec vous.'],
                  ['Signature & enregistrement', "Signature à l'étude, puis enregistrement et conservation dans nos archives."],
                ].map(([title, desc], idx) => (
                  <li key={title} className="flex gap-4 bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gold text-navy font-bold flex items-center justify-center text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-navy">{title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-navy text-white rounded-lg p-6 shadow-elegant">
              <h3 className="font-serif text-xl font-semibold mb-2">
                Besoin d'un conseil ?
              </h3>
              <p className="text-sm text-gray-300 mb-6">
                Réservez une consultation avec Maître Ogoula Nkondawiri.
              </p>
              <Button asChild className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold mb-3">
                <Link to="/rendez-vous">
                  <Calendar className="w-4 h-4 mr-2" />
                  Prendre rendez-vous
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent border-white/30 text-white hover:bg-white hover:text-navy">
                <a href="tel:+24101177373535">
                  <Phone className="w-4 h-4 mr-2" />
                  011 77 37 35
                </a>
              </Button>
              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-gray-400">
                Lun – Ven : 7h30 – 15h30<br />
                Boulevard de la Nation, Libreville
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-gold text-sm font-medium tracking-wider uppercase">FAQ</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-serif font-bold text-navy">
              Questions fréquentes — {service.shortTitle}
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {service.faqs.map((f, i) => (
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

      {/* Other expertises */}
      <section className="py-10 sm:py-14 lg:py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-navy mb-8 text-center">
            Nos autres domaines d'expertise
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/expertises/${o.slug}`}
                className="bg-white rounded-lg p-6 hover:shadow-elegant transition-all group"
              >
                <div className="w-12 h-12 gradient-navy rounded-lg flex items-center justify-center mb-4 text-gold">
                  {o.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-navy mb-2">{o.shortTitle}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{o.description}</p>
                <div className="flex items-center text-gold text-sm font-medium">
                  Découvrir
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
