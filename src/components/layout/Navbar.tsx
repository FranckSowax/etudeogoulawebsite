import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { expertises } from '@/lib/services'
import { cn } from '@/lib/utils'

const mainLinks = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/etude', label: "L'Étude" },
  { to: '/honoraires', label: 'Honoraires' },
  { to: '/blog', label: 'Actualités' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expertisesOpen, setExpertisesOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setExpertisesOpen(false)
  }, [location.pathname])

  const solid = !transparent || scrolled
  const linkBase =
    'text-sm font-medium transition-colors hover:text-gold focus:outline-none focus-visible:text-gold'
  const linkColor = solid ? 'text-navy' : 'text-white'
  const activeColor = 'text-gold'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
        solid ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-transparent',
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Cabinet Notarial S.O. Nkondawiri" className="h-14 w-auto" />
            <div className="hidden sm:block">
              <p className={cn('font-serif font-semibold text-lg leading-tight', solid ? 'text-navy' : 'text-white')}>
                Cabinet Notarial
              </p>
              <p className={cn('text-xs', solid ? 'text-gold' : 'text-gold-light')}>
                S.O. Nkondawiri
              </p>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-7">
            <NavLink to="/" end className={({ isActive }) => cn(linkBase, isActive ? activeColor : linkColor)}>
              Accueil
            </NavLink>
            <NavLink to="/etude" className={({ isActive }) => cn(linkBase, isActive ? activeColor : linkColor)}>
              L'Étude
            </NavLink>

            {/* Expertises dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setExpertisesOpen(true)}
              onMouseLeave={() => setExpertisesOpen(false)}
            >
              <NavLink
                to="/expertises"
                className={({ isActive }) =>
                  cn(linkBase, 'flex items-center gap-1', isActive ? activeColor : linkColor)
                }
              >
                Expertises
                <ChevronDown className="w-4 h-4" />
              </NavLink>
              {expertisesOpen && (
                <div className="absolute top-full left-0 pt-2 w-72">
                  <div className="bg-white rounded-lg shadow-elegant border border-border overflow-hidden">
                    {expertises.map((e) => (
                      <Link
                        key={e.slug}
                        to={`/expertises/${e.slug}`}
                        className="block px-4 py-3 text-sm text-navy hover:bg-cream hover:text-gold transition-colors"
                      >
                        {e.shortTitle}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {mainLinks.slice(2).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(linkBase, isActive ? activeColor : linkColor)}
              >
                {link.label}
              </NavLink>
            ))}

            <Link to="/rendez-vous">
              <Button className="bg-gold hover:bg-gold-dark text-navy font-semibold">
                Prendre RDV
              </Button>
            </Link>
          </div>

          {/* Mobile button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className={cn('w-6 h-6', solid ? 'text-navy' : 'text-white')} />
            ) : (
              <Menu className={cn('w-6 h-6', solid ? 'text-navy' : 'text-white')} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-md">
          <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
            {mainLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'block py-2 px-3 rounded font-medium',
                    isActive ? 'bg-cream text-gold' : 'text-navy hover:bg-cream',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <details className="group">
              <summary className="py-2 px-3 rounded font-medium text-navy hover:bg-cream flex items-center justify-between cursor-pointer list-none">
                Expertises
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                {expertises.map((e) => (
                  <Link
                    key={e.slug}
                    to={`/expertises/${e.slug}`}
                    className="block py-2 text-sm text-navy hover:text-gold"
                  >
                    {e.shortTitle}
                  </Link>
                ))}
              </div>
            </details>
            <Link to="/rendez-vous" className="block pt-3">
              <Button className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold">
                Prendre RDV
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
