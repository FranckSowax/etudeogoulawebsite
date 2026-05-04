import { motion, useReducedMotion } from 'framer-motion'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import Eyebrow from '@/components/ui/Eyebrow'
import SectionTitle from '@/components/ui/SectionTitle'

export default function ContactSection() {
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
    <section id="contact" aria-label="Contact" className="bg-paper py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Eyebrow align="center" className="mb-5 justify-center">Contact</Eyebrow>
          <SectionTitle align="center" className="mx-auto">
            Au cœur du quartier d&rsquo;affaires de Libreville.
          </SectionTitle>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Map placeholder — Google Maps embed */}
          <motion.div {...fade(0)} className="aspect-[4/3] bg-ink/5 border border-bronze/20 overflow-hidden">
            <iframe
              title="Plan d'accès — Étude Notariale Ogoula Nkondawiri"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3978.0!2d9.4673!3d0.4162!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLibreville%2C+Gabon!5e0!3m2!1sfr!2sga!4v0"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(40%) contrast(0.95)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          <motion.div {...fade(0.1)}>
            <dl className="divide-y divide-bronze/20">
              <Row icon={<MapPin />} label="Adresse">
                Boulevard de la Nation, Immeuble Hollando, 6ᵉ étage<br />
                BP 8350 — Libreville, République Gabonaise
              </Row>
              <Row icon={<Phone />} label="Téléphone">
                <a href="tel:+24177373500" className="hover:text-bronze transition-colors">011 77 37 35</a>
                {' · '}
                <a href="tel:+24166151220" className="hover:text-bronze transition-colors">066 15 12 20</a>
              </Row>
              <Row icon={<Mail />} label="Courriel">
                <a href="mailto:contact@notaire-nkondawiri.ga" className="hover:text-bronze transition-colors">
                  contact@notaire-nkondawiri.ga
                </a>
              </Row>
              <Row icon={<Clock />} label="Horaires">
                Lundi au vendredi · 7h30 – 15h30
              </Row>
            </dl>

            <p className="mt-8 text-graphite/55 text-xs italic leading-relaxed border-t border-bronze/20 pt-6">
              L&rsquo;Étude est tenue au secret professionnel et à la protection de vos données
              personnelles conformément aux dispositions de la CNPDCP.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-5">
      <span className="flex-shrink-0 w-9 h-9 rounded-full border border-bronze/40 text-bronze flex items-center justify-center mt-1 [&>svg]:w-4 [&>svg]:h-4">
        {icon}
      </span>
      <div>
        <dt className="text-[11px] tracking-[0.2em] uppercase text-bronze font-medium mb-1">{label}</dt>
        <dd className="text-graphite leading-relaxed">{children}</dd>
      </div>
    </div>
  )
}
