import { Link } from 'react-router-dom'
import { Award, Shield, Gavel, BookOpen } from 'lucide-react'
import Seo from '@/components/Seo'
import { Button } from '@/components/ui/button'

export default function Etude() {
  return (
    <>
      <Seo
        title="L'Étude Notariale Ogoula Nkondawiri — Notaire à Libreville, Gabon"
        description="Découvrez l'Étude Notariale Suzanne Ogoula Nkondawiri à Libreville : équipe, valeurs, déontologie et expertise au service des particuliers et des entreprises au Gabon."
        canonical="/etude"
      />

      <section className="bg-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-sm font-medium tracking-wider uppercase">L'Étude</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-serif font-bold text-white">
            Une étude notariale au cœur de Libreville
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Depuis 2005, l'Étude Notariale Suzanne Ogoula Nkondawiri accompagne particuliers, familles
            et entreprises du Gabon dans la sécurisation de leurs actes les plus importants.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <img
            src="/notary-portrait.jpg"
            alt="Maître Suzanne Ogoula Nkondawiri"
            className="rounded-lg shadow-elegant"
            loading="lazy"
          />
          <div>
            <h2 className="text-3xl font-serif font-bold text-navy mb-4">
              Maître Suzanne Ogoula Nkondawiri
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Notaire titulaire diplômée, Maître Ogoula Nkondawiri exerce à Libreville depuis près de
              vingt ans. Elle met son expertise du droit gabonais et de la pratique notariale au service
              de ses clients : sécurité juridique, conseil personnalisé et confidentialité absolue.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              L'étude est organisée autour d'une équipe de clercs et de collaborateurs spécialisés en
              droit immobilier, droit des sociétés, successions et droit de la famille.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-navy text-center mb-12">Nos valeurs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-7 h-7" />, title: 'Sécurité', text: 'Chaque acte est rédigé avec la rigueur de la pratique notariale.' },
              { icon: <Award className="w-7 h-7" />, title: 'Excellence', text: 'Près de 20 ans d\'expérience au service de nos clients.' },
              { icon: <Gavel className="w-7 h-7" />, title: 'Authenticité', text: 'Force probante et exécutoire des actes notariés.' },
              { icon: <BookOpen className="w-7 h-7" />, title: 'Conseil', text: 'Une approche pédagogique pour vous accompagner sereinement.' },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 gradient-navy rounded-lg flex items-center justify-center mb-4 text-gold">
                  {v.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-navy mb-4">Déontologie</h2>
          <p className="text-muted-foreground leading-relaxed">
            Officier public, le notaire est tenu au secret professionnel le plus strict, à l'impartialité
            et au devoir de conseil. Nos honoraires sont conformes au tarif réglementé applicable au Gabon.
          </p>
          <Link to="/honoraires" className="inline-block mt-8">
            <Button className="bg-gold hover:bg-gold-dark text-navy font-semibold">
              Consulter nos honoraires
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
