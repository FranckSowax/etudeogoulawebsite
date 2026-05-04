import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Eyebrow from '@/components/ui/Eyebrow'
import SectionTitle from '@/components/ui/SectionTitle'

const STEPS = [
  ['Choisir le motif', 'La durée de l’entretien s’ajuste au sujet à traiter (30 à 60 minutes).'],
  ['Sélectionner la modalité', 'Présentiel, visioconférence Google Meet ou appel téléphonique.'],
  ['Réserver le créneau', 'Disponibilités en temps réel sur les quinze prochains jours ouvrés.'],
  ['Confirmer le rendez-vous', 'Confirmation WhatsApp instantanée et lien d’annulation sécurisé.'],
]

export default function AppointmentCta() {
  const reduce = useReducedMotion()
  return (
    <section id="rendez-vous" aria-label="Prendre rendez-vous" className="bg-cream py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <Eyebrow align="center" className="mb-5 justify-center">Rendez-vous</Eyebrow>
          <SectionTitle align="center" className="mx-auto mb-6">
            Réserver un entretien en quatre étapes.
          </SectionTitle>
          <p className="text-muted-foreground/80 leading-relaxed">
            À l&rsquo;Étude, en visioconférence ou par téléphone — confirmation WhatsApp et rappels
            automatiques J-1 et H-2.
          </p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 mb-14">
          {STEPS.map(([title, desc], i) => (
            <motion.li
              key={title}
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
              <h3 className="font-serif text-navy text-xl mb-2 leading-tight">{title}</h3>
              <p className="text-muted-foreground/75 text-sm leading-relaxed">{desc}</p>
            </motion.li>
          ))}
        </ol>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-navy hover:bg-graphite text-white font-medium tracking-wider uppercase text-xs px-8 h-12 rounded-none"
          >
            <Link to="/rendez-vous">
              <Calendar className="w-4 h-4 mr-2" />
              Prendre rendez-vous
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
