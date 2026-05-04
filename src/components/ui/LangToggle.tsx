import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Visible FR/EN toggle. EN is a placeholder for now (toast notice). */
export default function LangToggle({ solid }: { solid: boolean }) {
  const handleToggle = () => {
    const current = document.documentElement.lang === 'en' ? 'en' : 'fr'
    const next = current === 'en' ? 'fr' : 'en'
    document.documentElement.lang = next
    try { localStorage.setItem('lang', next) } catch {}
    if (next === 'en') {
      import('sonner').then(({ toast }) =>
        toast.info('English version available soon.', { duration: 3000 }),
      )
    }
  }
  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        'hidden md:flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase font-medium transition-colors',
        solid ? 'text-navy hover:text-gold' : 'text-white hover:text-gold-light',
      )}
      title="Langue / Language"
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5" />
      <span>FR / EN</span>
    </button>
  )
}
