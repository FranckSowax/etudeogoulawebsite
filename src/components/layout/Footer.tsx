import { Link } from 'react-router-dom'
import MonogramSON from '@/components/ui/MonogramSON'
import { expertises } from '@/lib/services'

const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/etude', label: 'L’Étude' },
  { to: '/expertises', label: 'Pôles de compétences' },
  { to: '/honoraires', label: 'Honoraires' },
  { to: '/blog', label: 'Actualités' },
  { to: '/contact', label: 'Contact' },
]

const LEGAL = [
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/confidentialite', label: 'Politique de confidentialité' },
  { to: '/honoraires', label: 'Honoraires' },
  { to: '/contact', label: 'Plan d’accès' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-paper pt-16 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Monogram */}
          <div>
            <Link to="/" className="inline-block mb-5 text-bronze">
              <MonogramSON size={88} />
            </Link>
            <p className="text-paper/55 text-sm leading-relaxed max-w-xs">
              Étude Notariale<br />
              Suzanne Ogoula Nkondawiri<br />
              Libreville · République Gabonaise
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-bronze font-medium mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-paper/65 hover:text-paper text-sm transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pôles */}
          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-bronze font-medium mb-5">
              Pôles de compétences
            </h4>
            <ul className="space-y-3">
              {expertises.map((e) => (
                <li key={e.slug}>
                  <Link
                    to={`/expertises/${e.slug}`}
                    className="text-paper/65 hover:text-paper text-sm transition-colors"
                  >
                    {e.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-bronze font-medium mb-5">
              Mentions
            </h4>
            <ul className="space-y-3">
              {LEGAL.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-paper/65 hover:text-paper text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-bronze/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-paper/50">
          <p>
            © {new Date().getFullYear()} Étude Notariale Suzanne Ogoula Nkondawiri · Tous droits réservés
          </p>
          <p className="italic">
            Membre de la Chambre des Notaires du Gabon
          </p>
        </div>
      </div>
    </footer>
  )
}
