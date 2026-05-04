import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fr } from '@/locales/fr'
import { en } from '@/locales/en'

export type Lang = 'fr' | 'en'

type Dict = typeof fr

type I18nCtx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
}

const Ctx = createContext<I18nCtx | null>(null)

const dicts: Record<Lang, Dict> = { fr, en: en as Dict }

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'fr'
    const stored = localStorage.getItem('lang')
    return stored === 'en' ? 'en' : 'fr'
  })

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('lang', lang) } catch {}
  }, [lang])

  return (
    <Ctx.Provider value={{ lang, setLang: setLangState, t: dicts[lang] }}>
      {children}
    </Ctx.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>')
  return ctx
}

export function useT() {
  return useI18n().t
}
