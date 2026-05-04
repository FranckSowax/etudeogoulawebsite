import { motion, useReducedMotion } from 'framer-motion'
import Eyebrow from '@/components/ui/Eyebrow'
import SectionTitle from '@/components/ui/SectionTitle'
import { useT } from '@/lib/i18n'

export default function About() {
  const t = useT()
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
    <section id="a-propos" aria-label={t.about.eyebrow} className="bg-cream py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div className="lg:col-span-5" {...fade(0)}>
            <div className="relative">
              <img
                src="/services-legal.jpg"
                alt={t.about.imageAlt}
                className="w-full aspect-[4/5] object-cover rounded-sm shadow-elegant"
                loading="lazy"
              />
              <div className="absolute -bottom-5 -right-5 w-40 h-40 border border-gold/40 -z-10" />
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-gold/10 -z-10" />
            </div>
          </motion.div>

          <motion.div className="lg:col-span-7" {...fade(0.1)}>
            <Eyebrow className="mb-5">{t.about.eyebrow}</Eyebrow>
            <SectionTitle className="mb-8">{t.about.title}</SectionTitle>

            <div className="text-muted-foreground leading-relaxed space-y-5">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
