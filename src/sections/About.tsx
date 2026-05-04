import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronRight, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/Reveal'

export default function About() {
  return (
    <section id="a-propos" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          <Reveal className="relative">
            <div className="relative z-10">
              <img
                src="/notary-portrait.jpg"
                alt="Maître Suzanne Ogoula Nkondawiri - Notaire à Libreville, Gabon"
                className="w-full max-w-md mx-auto rounded-lg shadow-elegant"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold/10 rounded-lg -z-0" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-gold/30 rounded-lg -z-0" />

            <div className="absolute bottom-8 -right-4 bg-white p-4 rounded-lg shadow-elegant">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-navy rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-serif font-bold text-navy">Notaire</p>
                  <p className="text-sm text-muted-foreground">Depuis 2012</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-gold" />
              <span className="text-gold text-sm font-medium tracking-wider uppercase">
                À Propos de Nous
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-navy mb-5 sm:mb-6">
              Votre Notaire de Confiance pour l'Achat Immobilier au Gabon
            </h2>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              L'Étude Notariale Suzanne Ogoula Nkondawiri est une étude de notariat
              établie à Libreville, capitale de la République Gabonaise. Spécialisé dans
              l'achat et la vente immobilière au Gabon, notre étude accompagne
              particuliers et entreprises dans toutes leurs transactions notariales.
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Que vous souhaitiez acheter un bien immobilier au Gabon, constituer une
              société, régler une succession ou préparer un contrat de mariage, notre
              notaire vous garantit la sécurité juridique de chaque acte.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                ['Professionnalisme', 'Rigueur et excellence'],
                ['Confidentialité', 'Discrétion absolue'],
                ['Réactivité', 'Réponse rapide'],
                ['Accessibilité', 'À votre écoute'],
              ].map(([title, sub]) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-navy">{title}</p>
                    <p className="text-sm text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild className="bg-navy hover:bg-navy-light text-white">
              <Link to="/contact">
                Nous Contacter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
