import Seo from '@/components/Seo'

export default function Blog() {
  return (
    <>
      <Seo
        title="Actualités juridiques — Notaire au Gabon | Cabinet Ogoula Nkondawiri"
        description="Actualités, conseils et analyses juridiques par l'Étude Notariale Ogoula Nkondawiri : achat immobilier, succession, droit des affaires au Gabon."
        canonical="/blog"
      />

      <section className="bg-navy py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-sm font-medium tracking-wider uppercase">Actualités</span>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            Actualités juridiques & conseils
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Décryptages et conseils pratiques pour vos démarches notariales au Gabon.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            Le blog est en cours de préparation. Revenez très bientôt pour découvrir nos premiers articles.
          </p>
        </div>
      </section>
    </>
  )
}
