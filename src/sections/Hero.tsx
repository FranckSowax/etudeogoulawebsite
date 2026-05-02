import { Link } from 'react-router-dom'
import { Calendar, ChevronRight, Shield, Award, Gavel } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img
          src="/hero-notary.jpg"
          alt="Cabinet notarial pour achat immobilier au Gabon - Notaire Ogoula Nkondawiri à Libreville"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-12 h-[2px] bg-gold" />
            <span className="text-gold-light text-sm font-medium tracking-wider uppercase">
              République Gabonaise
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Notaire au Gabon<br />
            <span className="text-gold">Suzanne Ogoula</span><br />
            Nkondawiri
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed">
            Votre notaire pour l'achat immobilier au Gabon. Sécurité juridique,
            conseil personnalisé et accompagnement dans toutes vos démarches
            notariales à Libreville.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/rendez-vous">
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-navy font-semibold px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Prendre Rendez-vous
              </Button>
            </Link>
            <Link to="/expertises">
              <Button size="lg" className="bg-white text-navy hover:bg-gray-100 px-8 font-semibold">
                <ChevronRight className="w-5 h-5 mr-2" />
                Nos Domaines d'Expertise
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <span className="text-sm">Sécurité Juridique</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              <span className="text-sm">Expertise Reconnue</span>
            </div>
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-gold" />
              <span className="text-sm">Authenticité Garantie</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
