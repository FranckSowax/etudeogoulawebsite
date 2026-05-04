import { motion, useReducedMotion } from 'framer-motion'
import Eyebrow from '@/components/ui/Eyebrow'
import SectionTitle from '@/components/ui/SectionTitle'
import PullQuote from '@/components/ui/PullQuote'

export default function NotaireMessage() {
  const reduce = useReducedMotion()
  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.5, delay, ease: 'easeOut' as const },
        }

  return (
    <section aria-label="Le mot du Notaire" className="bg-cream py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Portrait */}
          <motion.div className="lg:col-span-2" {...fade(0)}>
            <div className="relative">
              <img
                src="/notary-portrait.jpg"
                alt="Maître Suzanne Ogoula Nkondawiri, notaire titulaire"
                className="w-full max-w-sm grayscale aspect-[4/5] object-cover rounded-sm shadow-elegant"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-gold/40 -z-10" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div className="lg:col-span-3" {...fade(0.1)}>
            <Eyebrow className="mb-5">Le Notaire</Eyebrow>
            <SectionTitle className="mb-2">
              Maître Suzanne Ogoula Nkondawiri.
            </SectionTitle>
            <p className="font-serif italic text-muted-foreground [font-size:clamp(1.125rem,1.6vw,1.375rem)] mb-8">
              Notaire titulaire de l&rsquo;Étude depuis 2012.
            </p>

            <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed space-y-5">
              <p>
                Maître Suzanne Ogoula Nkondawiri exerce le notariat à Libreville depuis 2012,
                après avoir prêté serment devant la Cour d&rsquo;Appel de Libreville. Diplômée
                en droit privé et notarial, elle a fondé l&rsquo;Étude qui porte aujourd&rsquo;hui
                son nom avec la conviction qu&rsquo;un acte authentique est, avant tout, le résultat
                d&rsquo;un dialogue patient et d&rsquo;une analyse rigoureuse.
              </p>
              <p>
                Membre de la Chambre des Notaires du Gabon, elle accompagne particuliers et entreprises
                dans leurs opérations les plus structurantes : transactions immobilières, transmission
                patrimoniale, constitution et restructuration de sociétés, contrats matrimoniaux. Sa pratique
                s&rsquo;inscrit dans le cadre du droit gabonais et des Actes uniformes OHADA, avec une
                attention constante portée à l&rsquo;évolution de la jurisprudence et à la mise en conformité
                des opérations transfrontalières.
              </p>
            </div>

            <PullQuote cite="S. Ogoula Nkondawiri" className="mt-10">
              «&nbsp;Le notaire n&rsquo;écrit pas l&rsquo;histoire de ses clients : il en garantit la trace.&nbsp;»
            </PullQuote>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
