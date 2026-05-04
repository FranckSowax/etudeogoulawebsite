import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Eyebrow from '@/components/ui/Eyebrow'


const POLES = [
  {
    slug: 'immobilier',
    title: 'Droit immobilier & transactions',
    desc: 'Sécuriser l’acquisition, la vente et la mise en valeur de votre patrimoine immobilier au Gabon — actes de vente, baux notariés, hypothèques et conservation foncière.',
  },
  {
    slug: 'succession',
    title: 'Successions & libéralités',
    desc: 'Organiser la transmission du patrimoine familial avec rigueur, discrétion et bienveillance — règlements de succession, testaments, donations entre vifs.',
  },
  {
    slug: 'famille',
    title: 'Droit de la famille',
    desc: 'Accompagner chaque étape de la vie familiale par des actes solennels et sur-mesure — contrats de mariage, divorces, adoptions, reconnaissances.',
  },
  {
    slug: 'societe',
    title: 'Droit des sociétés & OHADA',
    desc: 'Conseiller dirigeants et investisseurs dans la structuration et la vie de leurs entreprises — constitutions, cessions de parts, baux commerciaux, fusions-acquisitions.',
  },
  {
    slug: 'acte',
    title: 'Authentification & dépôt d’actes',
    desc: 'Conférer à vos écrits la force probante et exécutoire de l’acte authentique — procurations, reconnaissances de dette, dépôts d’écrits, actes de notoriété.',
  },
  {
    slug: 'patrimoine',
    title: 'Conseil patrimonial & ingénierie fiscale',
    desc: 'Élaborer une stratégie patrimoniale pérenne pour les particuliers et les chefs d’entreprise — audit de patrimoine, démembrement, optimisation fiscale conforme.',
  },
]

export default function Services() {
  const reduce = useReducedMotion()
  return (
    <section id="services" aria-label="Pôles de compétences" className="bg-navy text-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <Eyebrow align="center" tone="paper" className="mb-5 justify-center">Expertise</Eyebrow>
          <h2 className="font-serif font-medium text-white [font-size:clamp(1.875rem,3.6vw,3rem)] leading-[1.08] tracking-[-0.01em] mb-6">
            Six pôles de compétences au service de votre sécurité juridique.
          </h2>
          <p className="text-white/65 leading-relaxed">
            De la transaction immobilière à l&rsquo;ingénierie patrimoniale, l&rsquo;Étude intervient
            sur l&rsquo;ensemble des actes notariés relevant du droit gabonais et de l&rsquo;espace OHADA.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-gold/30">
          {POLES.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06, ease: 'easeOut' }}
              className="border-r border-b border-gold/30"
            >
              <Link
                to={`/expertises/${p.slug}`}
                className="group block p-7 sm:p-8 h-full hover:bg-gold/[0.06] transition-colors relative"
              >
                <span className="text-gold font-serif text-sm tracking-[0.2em]">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-serif font-medium text-white text-xl sm:text-2xl leading-tight mb-4">
                  {p.title}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed mb-6">
                  {p.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-gold text-[11px] tracking-[0.22em] uppercase font-medium">
                  En savoir plus
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
