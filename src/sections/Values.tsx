import { motion, useReducedMotion } from 'framer-motion'
import { useT } from '@/lib/i18n'

export default function Values() {
  const t = useT()
  const reduce = useReducedMotion()
  return (
    <section aria-label="Nos valeurs" className="bg-navy text-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-10 sm:gap-0">
          {t.values.items.map((v, i) => (
            <motion.div
              key={v.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className={
                'text-center px-6 py-2 ' +
                (i < t.values.items.length - 1 ? 'sm:border-r sm:border-gold/40' : '')
              }
            >
              <h3 className="font-serif font-medium text-white [font-size:clamp(1.5rem,3vw,2.25rem)] leading-tight mb-3">
                {v.title}
              </h3>
              <p className="text-white/60 text-sm italic leading-relaxed max-w-xs mx-auto">
                {v.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
