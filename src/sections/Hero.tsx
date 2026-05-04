import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, ChevronRight, Shield, Award, Gavel } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  const reduce = useReducedMotion()
  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: 'easeOut' as const },
        }

  return (
    <section
      id="accueil"
      className="relative min-h-[85svh] md:min-h-screen flex items-center"
    >
      <div className="absolute inset-0">
        <img
          src="/hero-notary.jpg"
          alt="Étude notariale pour achat immobilier au Gabon - Notaire Ogoula Nkondawiri à Libreville"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32 w-full">
        <div className="max-w-2xl">
          <motion.div className="flex items-center gap-2 mb-5 sm:mb-6" {...fade(0)}>
            <div className="w-10 sm:w-12 h-[2px] bg-gold" />
            <span className="text-gold-light text-xs sm:text-sm font-medium tracking-wider uppercase">
              République Gabonaise
            </span>
          </motion.div>

          <motion.h1
            className="text-fluid-h1 font-serif font-bold text-white mb-5 sm:mb-6"
            {...fade(0.08)}
          >
            Notaire au Gabon<br />
            <span className="text-gold">Suzanne Ogoula</span><br />
            Nkondawiri
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg lg:text-xl text-gray-200 mb-7 sm:mb-8 leading-relaxed max-w-xl"
            {...fade(0.16)}
          >
            Votre notaire pour l'achat immobilier au Gabon. Sécurité juridique,
            conseil personnalisé et accompagnement dans toutes vos démarches
            notariales à Libreville.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4" {...fade(0.24)}>
            <Button
              asChild
              size="lg"
              className="bg-gold hover:bg-gold-dark text-navy font-semibold px-6 sm:px-8 h-12"
            >
              <Link to="/rendez-vous">
                <Calendar className="w-5 h-5 mr-2" />
                Prendre Rendez-vous
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-navy hover:bg-gray-100 px-6 sm:px-8 font-semibold h-12"
            >
              <Link to="/expertises">
                <ChevronRight className="w-5 h-5 mr-2" />
                Nos Domaines d'Expertise
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-10 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-6 text-white/80"
            {...fade(0.32)}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <span className="text-xs sm:text-sm">Sécurité Juridique</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              <span className="text-xs sm:text-sm">Expertise Reconnue</span>
            </div>
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-gold" />
              <span className="text-xs sm:text-sm">Authenticité Garantie</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
