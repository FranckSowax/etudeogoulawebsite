import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import { Button } from '@/components/ui/button'
import { useT } from '@/lib/i18n'

export default function NotFound() {
  const t = useT()
  return (
    <>
      <Seo title={`${t.pages.notFound.title} — Étude Ogoula Nkondawiri`} description={t.pages.notFound.desc} />
      <section className="min-h-[60vh] flex items-center justify-center bg-cream">
        <div className="text-center px-4">
          <p className="text-gold font-medium tracking-wider uppercase text-sm">404</p>
          <h1 className="mt-3 text-4xl font-serif font-bold text-navy">{t.pages.notFound.title}</h1>
          <p className="mt-4 text-muted-foreground">{t.pages.notFound.desc}</p>
          <Button asChild className="bg-navy hover:bg-navy-light text-white mt-8">
            <Link to="/">{t.pages.notFound.back}</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
