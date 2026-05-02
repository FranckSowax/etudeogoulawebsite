import { Link, useParams, Navigate } from 'react-router-dom'
import { Calendar, CheckCircle2, ChevronRight } from 'lucide-react'
import Seo from '@/components/Seo'
import { Button } from '@/components/ui/button'
import { expertises } from '@/lib/services'

export default function ExpertiseDetail() {
  const { slug } = useParams<{ slug: string }>()
  const service = expertises.find((e) => e.slug === slug)

  if (!service) return <Navigate to="/expertises" replace />

  const others = expertises.filter((e) => e.slug !== service.slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Notary',
      name: 'Cabinet Notarial Suzanne Ogoula Nkondawiri',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Boulevard de la Nation, Immeuble Hollando, 6ème étage',
        addressLocality: 'Libreville',
        addressCountry: 'GA',
      },
    },
    areaServed: { '@type': 'Country', name: 'Gabon' },
  }

  return (
    <>
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        canonical={`/expertises/${service.slug}`}
        jsonLd={jsonLd}
      />

      <section className="bg-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gold-light mb-6" aria-label="Fil d'Ariane">
            <Link to="/" className="hover:text-gold">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/expertises" className="hover:text-gold">Expertises</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{service.shortTitle}</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gold/20 rounded-lg flex items-center justify-center text-gold">
              {service.icon}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
              {service.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {service.description}
            </p>

            <h2 className="text-2xl font-serif font-bold text-navy mb-6">Nos prestations</h2>
            <ul className="space-y-3 mb-12">
              {service.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <span className="text-navy">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-serif font-bold text-navy mb-4">Comment ça se passe ?</h2>
            <ol className="space-y-4">
              {[
                ['Prise de rendez-vous', 'Choisissez un créneau en ligne, en visio ou au cabinet à Libreville.'],
                ['Étude de votre dossier', 'Nous analysons votre situation et listons les pièces nécessaires.'],
                ['Rédaction de l\'acte', 'Nos clercs préparent l\'acte avec rigueur, en lien étroit avec vous.'],
                ['Signature & enregistrement', 'Signature au cabinet, puis enregistrement et conservation dans nos archives.'],
              ].map(([title, desc], idx) => (
                <li key={title} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold text-navy font-bold flex items-center justify-center text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-navy">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="bg-cream p-6 rounded-lg h-fit sticky top-24">
            <h3 className="font-serif text-xl font-semibold text-navy mb-3">
              Besoin d'un conseil ?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Réservez une consultation avec Maître Ogoula Nkondawiri.
            </p>
            <Link to="/rendez-vous" className="block">
              <Button className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold">
                <Calendar className="w-4 h-4 mr-2" />
                Prendre rendez-vous
              </Button>
            </Link>
            <Link to="/contact" className="block mt-3">
              <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy hover:text-white">
                Nous contacter
              </Button>
            </Link>
          </aside>
        </div>
      </section>

      <section className="py-20 bg-cream">
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
