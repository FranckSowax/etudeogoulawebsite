import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X, ChevronDown, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { expertises } from '@/lib/services'
import { cn } from '@/lib/utils'
import LangToggle from '@/components/ui/LangToggle'

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
  const reduce = useReducedMotion()

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

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

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
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src="/logo.png"
              alt="Étude Notariale S.O. Nkondawiri"
              className="h-10 sm:h-12 md:h-14 w-auto flex-shrink-0"
            />
            <div className="hidden sm:block min-w-0">
              <p className={cn('font-serif font-semibold text-base md:text-lg leading-tight truncate', solid ? 'text-navy' : 'text-white')}>
                Étude Notariale
              </p>
              <p className={cn('text-xs', solid ? 'text-gold' : 'text-gold-light')}>
                S.O. Nkondawiri
              </p>
            </div>
          </Link>

          {/* Desktop nav (md+) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-7">
            <NavLink to="/" end className={({ isActive }) => cn(linkBase, isActive ? activeColor : linkColor)}>
              Accueil
            </NavLink>
            <NavLink to="/etude" className={({ isActive }) => cn(linkBase, 'hidden lg:inline', isActive ? activeColor : linkColor)}>
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
                onClick={() => setExpertisesOpen(false)}
              >
                Expertises
                <ChevronDown className="w-4 h-4" />
              </NavLink>
              <AnimatePresence>
                {expertisesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 pt-2 w-72"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/honoraires" className={({ isActive }) => cn(linkBase, isActive ? activeColor : linkColor)}>
              Honoraires
            </NavLink>
            <NavLink to="/faq" className={({ isActive }) => cn(linkBase, 'hidden lg:inline', isActive ? activeColor : linkColor)}>
              FAQ
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => cn(linkBase, isActive ? activeColor : linkColor)}>
              Contact
            </NavLink>

            <LangToggle solid={solid} />
            <Button asChild className="bg-gold hover:bg-gold-dark text-navy font-semibold">
              <Link to="/rendez-vous">Prendre RDV</Link>
            </Button>
          </div>

          {/* Mobile actions: always-visible RDV button + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              asChild
              size="sm"
              className="bg-gold hover:bg-gold-dark text-navy font-semibold h-10 px-3"
            >
              <Link to="/rendez-vous">
                <Calendar className="w-4 h-4 mr-1.5" />
                RDV
              </Link>
            </Button>
            <button
              type="button"
              className="p-2 -mr-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
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
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden bg-white border-t shadow-md"
          >
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {mainLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      'block py-3 px-3 rounded font-medium',
                      isActive ? 'bg-cream text-gold' : 'text-navy hover:bg-cream',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <details className="group">
                <summary className="py-3 px-3 rounded font-medium text-navy hover:bg-cream flex items-center justify-between cursor-pointer list-none">
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
              <div className="pt-3">
                <Button asChild className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold h-12">
                  <Link to="/rendez-vous">Prendre RDV</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
