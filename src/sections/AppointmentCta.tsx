import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Eyebrow from '@/components/ui/Eyebrow'
import SectionTitle from '@/components/ui/SectionTitle'
import { useT } from '@/lib/i18n'

export default function AppointmentCta() {
  const t = useT()
  const reduce = useReducedMotion()
  return (
    <section id="rendez-vous" aria-label={t.appointment.eyebrow} className="bg-cream py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <Eyebrow align="center" className="mb-5 justify-center">{t.appointment.eyebrow}</Eyebrow>
          <SectionTitle align="center" className="mx-auto mb-6">{t.appointment.title}</SectionTitle>
          <p className="text-muted-foreground/80 leading-relaxed">{t.appointment.subtitle}</p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 mb-14">
          {t.appointment.steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              className={
                'relative pl-0 ' +
                (i < 3 ? 'lg:border-r lg:border-gold/25 lg:pr-10' : '')
              }
            >
              <span className="block font-serif text-gold [font-size:clamp(2.5rem,4vw,3.5rem)] leading-none mb-4">
                0{i + 1}
              </span>
              <h3 className="font-serif text-navy text-xl mb-2 leading-tight">{step.title}</h3>
              <p className="text-muted-foreground/75 text-sm leading-relaxed">{step.desc}</p>
            </motion.li>
          ))}
        </ol>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-navy hover:bg-navy-light text-white font-medium tracking-wider uppercase text-xs px-8 h-12 rounded-none"
          >
            <Link to="/rendez-vous">
              <Calendar className="w-4 h-4 mr-2" />
              {t.appointment.cta}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
