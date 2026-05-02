import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { expertises } from '@/lib/services'

export default function Services() {
  return (
    <section id="services" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-[2px] bg-gold" />
            <span className="text-gold text-sm font-medium tracking-wider uppercase">
              Nos Domaines d'Expertise
            </span>
            <div className="w-8 h-[2px] bg-gold" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mb-4">
            Services Notariaux au Gabon : Achat, Vente et Conseil Juridique
          </h2>

          <p className="text-muted-foreground">
            Notre cabinet notarial à Libreville offre une gamme complète de services :
            achat immobilier, vente, succession, droit des affaires et actes authentiques au Gabon.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertises.map((service) => (
            <Link
              key={service.slug}
              to={`/expertises/${service.slug}`}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
            >
              <Card className="h-full cursor-pointer hover:shadow-elegant transition-all duration-300 border-0 bg-white">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 gradient-navy rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-gold">{service.icon}</div>
                  </div>
                  <CardTitle className="font-serif text-xl text-navy">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
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
  )
}
