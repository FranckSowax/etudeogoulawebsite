import { motion, useReducedMotion } from 'framer-motion'
import Eyebrow from '@/components/ui/Eyebrow'
import SectionTitle from '@/components/ui/SectionTitle'
import PullQuote from '@/components/ui/PullQuote'
import { useT } from '@/lib/i18n'

export default function NotaireMessage() {
  const t = useT()
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
    <section aria-label={t.notaire.eyebrow} className="bg-cream py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          <motion.div className="lg:col-span-2" {...fade(0)}>
            <div className="relative">
              <img
                src="/notary-portrait.jpg"
                alt={t.notaire.portraitAlt}
                className="w-full max-w-sm grayscale aspect-[4/5] object-cover rounded-sm shadow-elegant"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-gold/40 -z-10" />
            </div>
          </motion.div>

          <motion.div className="lg:col-span-3" {...fade(0.1)}>
            <Eyebrow className="mb-5">{t.notaire.eyebrow}</Eyebrow>
            <SectionTitle className="mb-2">{t.notaire.title}</SectionTitle>
            <p className="font-serif italic text-muted-foreground [font-size:clamp(1.125rem,1.6vw,1.375rem)] mb-8">
              {t.notaire.subtitle}
            </p>

            <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed space-y-5">
              <p>{t.notaire.p1}</p>
              <p>{t.notaire.p2}</p>
            </div>

            <PullQuote cite={t.notaire.cite} className="mt-10">
              {t.notaire.quote}
            </PullQuote>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
