import { Link } from 'react-router-dom'
import { Award } from 'lucide-react'
import { expertises } from '@/lib/services'

export default function Footer() {
  return (
    <footer className="bg-navy-dark pt-12 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Étude Notariale S.O. Nkondawiri" className="h-12 w-auto" />
              <div>
                <p className="font-serif font-semibold text-white">Étude Notariale</p>
                <p className="text-xs text-gold">S.O. Nkondawiri</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">
              Expertise notariale au service de vos projets. Sécurité juridique,
              conseil personnalisé et accompagnement dans toutes vos démarches.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Award className="w-4 h-4 text-gold" />
              <span>République Gabonaise</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Domaines d'expertise</h4>
            <ul className="space-y-2">
              {expertises.map((e) => (
                <li key={e.slug}>
                  <Link
                    to={`/expertises/${e.slug}`}
                    className="text-gray-400 hover:text-gold text-sm transition-colors"
                  >
                    {e.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>011 77 37 35</li>
              <li>066 15 12 20</li>
              <li>BP 8350 Libreville</li>
              <li>Immeuble Hollando, 6ème étage</li>
              <li className="pt-2">
                <Link to="/rendez-vous" className="text-gold hover:text-gold-light">
                  Prendre rendez-vous →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Étude Notariale Suzanne Ogoula Nkondawiri. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-sm">
            Notaire achat immobilier Gabon — Libreville, République Gabonaise
          </p>
        </div>
      </div>
    </footer>
  )
}
