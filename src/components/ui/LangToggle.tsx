import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

/** FR/EN toggle wired to the i18n context — flips the active language. */
export default function LangToggle({ solid }: { solid: boolean }) {
  const { lang, setLang } = useI18n()
  const next = lang === 'fr' ? 'en' : 'fr'
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      className={cn(
        'hidden md:flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase font-medium transition-colors',
        solid ? 'text-navy hover:text-gold' : 'text-white hover:text-gold-light',
      )}
      title={lang === 'fr' ? 'Switch to English' : 'Basculer en français'}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5" />
      <span>
        <span className={lang === 'fr' ? 'text-gold' : ''}>FR</span>
        <span className="opacity-50 mx-0.5">/</span>
        <span className={lang === 'en' ? 'text-gold' : ''}>EN</span>
      </span>
    </button>
  )
}
