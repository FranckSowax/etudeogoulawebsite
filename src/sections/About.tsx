import { motion, useReducedMotion } from 'framer-motion'
import Eyebrow from '@/components/ui/Eyebrow'
import SectionTitle from '@/components/ui/SectionTitle'

export default function About() {
  const reduce = useReducedMotion()
  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.55, delay, ease: 'easeOut' as const },
        }

  return (
    <section id="a-propos" aria-label="L'Étude" className="bg-cream py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div className="lg:col-span-5" {...fade(0)}>
            <div className="relative">
              <img
                src="/services-legal.jpg"
                alt="Acte authentique, sceau et plume — Étude Ogoula Nkondawiri"
                className="w-full aspect-[4/5] object-cover rounded-sm shadow-elegant"
                loading="lazy"
              />
              <div className="absolute -bottom-5 -right-5 w-40 h-40 border border-gold/40 -z-10" />
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-gold/10 -z-10" />
            </div>
          </motion.div>

          <motion.div className="lg:col-span-7" {...fade(0.1)}>
            <Eyebrow className="mb-5">L&rsquo;Office</Eyebrow>
            <SectionTitle className="mb-8">
              Une référence notariale au cœur de Libreville.
            </SectionTitle>

            <div className="text-muted-foreground leading-relaxed space-y-5">
              <p>
                Établie sur le Boulevard de la Nation, dans l&rsquo;Immeuble Hollando, l&rsquo;Étude
                Ogoula Nkondawiri figure parmi les études notariales de référence en République
                Gabonaise. Depuis 2012, elle se distingue par sa capacité à intervenir avec célérité
                sur les dossiers les plus sensibles, dans le strict respect de la déontologie notariale
                et de la culture juridique de chacun de ses clients.
              </p>
              <p>
                Particuliers, dirigeants, entreprises, investisseurs institutionnels et acteurs
                publics actifs sur l&rsquo;espace OHADA y trouvent un interlocuteur unique, capable
                d&rsquo;allier la précision du droit gabonais à la pratique des montages internationaux.
              </p>
              <p>
                L&rsquo;Étude conjugue une connaissance approfondie du tissu économique local et une
                ouverture résolue sur les places africaines et européennes — au service d&rsquo;un
                seul objectif : conférer à chaque acte la sécurité juridique qu&rsquo;il mérite.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
