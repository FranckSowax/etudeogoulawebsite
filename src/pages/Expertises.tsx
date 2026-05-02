import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Seo from '@/components/Seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { expertises } from '@/lib/services'

export default function Expertises() {
  return (
    <>
      <Seo
        title="Domaines d'Expertise — Notaire au Gabon | Cabinet Ogoula Nkondawiri"
        description="Tous les domaines d'expertise de l'Étude Notariale Ogoula Nkondawiri à Libreville : immobilier, successions, famille, sociétés, authentification, conseil patrimonial."
        canonical="/expertises"
      />

      <section className="bg-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-sm font-medium tracking-wider uppercase">Expertises</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-serif font-bold text-white">
            Nos domaines d'expertise notariale
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Une expertise complète au service des particuliers et entreprises au Gabon.
          </p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertises.map((service) => (
              <Link
                key={service.slug}
                to={`/expertises/${service.slug}`}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
              >
                <Card className="h-full hover:shadow-elegant transition-all duration-300 border-0 bg-white">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 gradient-navy rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <div className="text-gold">{service.icon}</div>
                    </div>
                    <CardTitle className="font-serif text-xl text-navy">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                    <div className="flex items-center text-gold text-sm font-medium">
                      En savoir plus
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
