import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import Seo from '@/components/Seo'
import { Button } from '@/components/ui/button'
import SimulateurFraisNotaire from '@/components/SimulateurFraisNotaire'

export default function Honoraires() {
  return (
    <>
      <Seo
        title="Honoraires & Tarifs — Notaire au Gabon | Étude Ogoula Nkondawiri"
        description="Tarifs indicatifs et émoluments du notaire au Gabon : achat immobilier, succession, société, actes authentiques. Transparence et conseil à l'étude Ogoula Nkondawiri à Libreville."
        canonical="/honoraires"
      />

      <section className="bg-navy py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-sm font-medium tracking-wider uppercase">Honoraires</span>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            Honoraires & tarifs indicatifs
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Une grille claire pour anticiper sereinement le coût de vos démarches notariales au Gabon.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Les frais de notaire au Gabon comprennent généralement trois composantes : les
            <strong> émoluments</strong> du notaire (rémunération réglementée), les
            <strong> droits d'enregistrement</strong> (perçus pour le compte de l'État) et les
            <strong> frais de conservation foncière</strong> pour les actes immobiliers.
          </p>

          <div className="mb-12">
            <SimulateurFraisNotaire />
          </div>

          <h2 className="text-2xl font-serif font-bold text-navy mb-6">Tarifs indicatifs</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-navy text-white text-left">
                  <th className="p-4 font-serif">Acte</th>
                  <th className="p-4 font-serif">Honoraires indicatifs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Vente immobilière', 'Tarif réglementé proportionnel'],
                  ['Donation entre vifs', 'Tarif réglementé proportionnel'],
                  ['Succession (déclaration + partage)', 'Selon actif net'],
                  ['Constitution de société', 'Forfait + droits d\'enregistrement'],
                  ['Procuration authentique', 'Forfait fixe'],
                  ['Consultation juridique', 'Sur devis'],
                ].map(([acte, prix]) => (
                  <tr key={acte} className="bg-white">
                    <td className="p-4 text-navy font-medium">{acte}</td>
                    <td className="p-4 text-muted-foreground">{prix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground mt-4 italic">
            Tarifs indicatifs susceptibles d'évoluer. Pour un devis précis, contactez l'étude.
          </p>

          <div className="mt-12 text-center">
            <Button asChild className="bg-gold hover:bg-gold-dark text-navy font-semibold">
              <Link to="/rendez-vous">
                <Calendar className="w-4 h-4 mr-2" />
                Demander un devis personnalisé
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
