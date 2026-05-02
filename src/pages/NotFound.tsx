import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <Seo title="Page introuvable — Cabinet Ogoula Nkondawiri" description="La page recherchée n'existe pas." />
      <section className="min-h-[60vh] flex items-center justify-center bg-cream">
        <div className="text-center px-4">
          <p className="text-gold font-medium tracking-wider uppercase text-sm">Erreur 404</p>
          <h1 className="mt-3 text-4xl font-serif font-bold text-navy">Page introuvable</h1>
          <p className="mt-4 text-muted-foreground">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <Link to="/" className="inline-block mt-8">
            <Button className="bg-navy hover:bg-navy-light text-white">Retour à l'accueil</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
