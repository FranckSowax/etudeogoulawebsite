import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Eyebrow from '@/components/ui/Eyebrow'
import { POLE_ICONS, type PoleSlug } from '@/components/ui/PoleIcons'
import { useT } from '@/lib/i18n'

const SLUGS: PoleSlug[] = ['immobilier', 'succession', 'famille', 'societe', 'acte', 'patrimoine']

export default function Services() {
  const t = useT()
  const reduce = useReducedMotion()
  return (
    <section id="services" aria-label={t.services.eyebrow} className="bg-navy text-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <Eyebrow align="center" tone="paper" className="mb-5 justify-center">{t.services.eyebrow}</Eyebrow>
          <h2 className="font-serif font-medium text-white [font-size:clamp(1.875rem,3.6vw,3rem)] leading-[1.08] tracking-[-0.01em] mb-6">
            {t.services.title}
          </h2>
          <p className="text-white/65 leading-relaxed">{t.services.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-gold/30">
          {SLUGS.map((slug, i) => {
            const pole = t.services.poles[slug]
            const Icon = POLE_ICONS[slug]
            return (
              <motion.div
                key={slug}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06, ease: 'easeOut' }}
                className="border-r border-b border-gold/30"
              >
                <Link
                  to={`/expertises/${slug}`}
                  className="group block p-7 sm:p-8 h-full hover:bg-gold/[0.06] transition-colors relative"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-gold/70 font-serif text-xs tracking-[0.22em]">
                      0{i + 1}
                    </span>
                    <Icon className="text-gold transition-transform group-hover:scale-110" size={40} />
                  </div>
                  <h3 className="font-serif font-medium text-white text-xl sm:text-2xl leading-tight mb-4">
                    {pole.title}
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed mb-6">{pole.desc}</p>
                  <span className="inline-flex items-center gap-2 text-gold text-[11px] tracking-[0.22em] uppercase font-medium">
                    {t.services.learnMore}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
