import { Lock } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import Eyebrow from '@/components/ui/Eyebrow'
import { useT } from '@/lib/i18n'

export default function DataRoom() {
  const t = useT()
  const reduce = useReducedMotion()
  return (
    <section aria-label={t.dataroom.eyebrow} className="bg-navy text-white py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Eyebrow align="center" tone="paper" className="mb-5 justify-center">
            {t.dataroom.eyebrow}
          </Eyebrow>
          <h2 className="font-serif text-white [font-size:clamp(1.75rem,3.2vw,2.5rem)] leading-tight mb-5">
            {t.dataroom.title}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
            {t.dataroom.body}
          </p>

          <div className="inline-flex items-center gap-3 px-5 py-3 border border-gold/40 text-gold hover:text-white hover:border-white/60 transition-colors text-sm tracking-[0.2em] uppercase font-medium cursor-not-allowed opacity-70">
            <Lock className="w-4 h-4" />
            {t.dataroom.soon}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
