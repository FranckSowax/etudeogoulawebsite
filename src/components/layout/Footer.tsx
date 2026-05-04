import { Link } from 'react-router-dom'
import MonogramSON from '@/components/ui/MonogramSON'
import { expertises } from '@/lib/services'
import { useT } from '@/lib/i18n'

export default function Footer() {
  const t = useT()
  return (
    <footer className="bg-navy-dark text-white pt-16 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="inline-block mb-5 text-gold">
              <MonogramSON size={88} />
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs whitespace-pre-line">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold font-medium mb-5">
              {t.footer.sections.navigation}
            </h4>
            <ul className="space-y-3">
              {t.footer.nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-white/65 hover:text-white text-sm transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold font-medium mb-5">
              {t.footer.sections.poles}
            </h4>
            <ul className="space-y-3">
              {expertises.map((e) => (
                <li key={e.slug}>
                  <Link
                    to={`/expertises/${e.slug}`}
                    className="text-white/65 hover:text-white text-sm transition-colors"
                  >
                    {e.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold font-medium mb-5">
              {t.footer.sections.legal}
            </h4>
            <ul className="space-y-3">
              {t.footer.legal.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/65 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} Étude Notariale Suzanne Ogoula Nkondawiri · {t.footer.copyright}
          </p>
          <p className="italic">{t.footer.member}</p>
        </div>
      </div>
    </footer>
  )
}
