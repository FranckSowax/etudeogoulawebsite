import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Eyebrow from '@/components/ui/Eyebrow'

export default function Hero() {
  const reduce = useReducedMotion()
  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: 'easeOut' as const },
        }

  return (
    <section
      id="accueil"
      className="relative min-h-[90svh] md:min-h-screen flex items-center bg-ink text-paper overflow-hidden"
    >
      {/* Background image with desaturation + ink overlay */}
      <div className="absolute inset-0">
        <img
          src="/hero-notary.jpg"
          alt="Étude notariale Ogoula Nkondawiri à Libreville, Gabon"
          className="w-full h-full object-cover opacity-40 grayscale-[40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36 w-full">
        <div className="max-w-3xl">
          <motion.div {...fade(0)}>
            <Eyebrow tone="paper" className="mb-8">
              Étude Notariale — Libreville, République Gabonaise
            </Eyebrow>
          </motion.div>

          <motion.h1
            {...fade(0.1)}
            className="font-serif font-medium text-paper [font-size:clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] mb-7"
          >
            Notaire à Libreville. Conseil patrimonial,{' '}
            <span className="text-bronze">droit immobilier</span> et{' '}
            <span className="text-bronze">droit OHADA</span>.
          </motion.h1>

          <motion.p
            {...fade(0.2)}
            className="text-paper/75 [font-size:clamp(1rem,1.4vw,1.125rem)] leading-relaxed max-w-2xl mb-10"
          >
            L&rsquo;Étude Ogoula Nkondawiri accompagne particuliers, entreprises et institutions au
            Gabon depuis 2012. Sécurité juridique, discrétion et excellence pour vos opérations
            les plus structurantes.
          </motion.p>

          <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="bg-bronze hover:bg-bronze/90 text-paper font-medium tracking-wider uppercase text-xs px-7 h-12 rounded-none"
            >
              <Link to="/rendez-vous">
                <Calendar className="w-4 h-4 mr-2" />
                Prendre rendez-vous
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border border-paper/40 bg-transparent text-paper hover:bg-paper hover:text-ink font-medium tracking-wider uppercase text-xs px-7 h-12 rounded-none"
            >
              <Link to="/etude">Découvrir l&rsquo;Étude</Link>
            </Button>
          </motion.div>

          <motion.div
            {...fade(0.4)}
            className="mt-14 sm:mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 text-paper/55"
          >
            <Item icon={<MapPin className="w-3.5 h-3.5" />}>Bd de la Nation, Imm. Hollando</Item>
            <Item icon={<Phone className="w-3.5 h-3.5" />}>011 77 37 35</Item>
            <Item>OHADA · Depuis 2012</Item>
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-bronze/30" />
    </section>
  )
}

function Item({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-medium">
      {icon && <span className="text-bronze">{icon}</span>}
      {children}
    </span>
  )
}
