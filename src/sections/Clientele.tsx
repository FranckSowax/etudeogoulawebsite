import { motion, useReducedMotion } from 'framer-motion'
import Eyebrow from '@/components/ui/Eyebrow'
import SectionTitle from '@/components/ui/SectionTitle'

const ITEMS = [
  'Investisseurs institutionnels',
  'Promoteurs et opérateurs immobiliers',
  'Dirigeants et family offices',
  'Particuliers exigeants et expatriés',
  'Groupes et entreprises de l’espace OHADA',
  'Institutions publiques et collectivités',
]

export default function Clientele() {
  const reduce = useReducedMotion()
  return (
    <section aria-label="Notre clientèle" className="bg-paper py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <Eyebrow align="center" className="mb-4">Clientèle</Eyebrow>
          <SectionTitle align="center" className="mx-auto">
            Une clientèle exigeante, locale et internationale.
          </SectionTitle>
        </div>

        <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-3 max-w-3xl mx-auto">
          {ITEMS.map((item, i) => (
            <motion.li
              key={item}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
              className="flex items-center gap-3 py-3 border-b border-bronze/20 text-graphite"
            >
              <span aria-hidden className="block w-1.5 h-1.5 bg-bronze rotate-45 flex-shrink-0" />
              <span className="font-serif text-lg">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
