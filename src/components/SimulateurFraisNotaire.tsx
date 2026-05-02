import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, Calculator, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type AcquisitionType = 'neuf' | 'ancien' | 'terrain'

const formatXAF = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' FCFA'

/**
 * Émoluments du notaire — barème dégressif indicatif (proportionnel au prix).
 * Les taux ci-dessous correspondent à une pratique gabonaise courante mais ne
 * remplacent pas un devis officiel de l'étude.
 */
const emolumentsBrackets = [
  { upTo: 10_000_000, rate: 0.04 },     // jusqu'à 10M : 4%
  { upTo: 50_000_000, rate: 0.025 },    // 10M -> 50M : 2,5%
  { upTo: 200_000_000, rate: 0.015 },   // 50M -> 200M : 1,5%
  { upTo: Infinity, rate: 0.01 },       // au-delà : 1%
]

function computeEmoluments(price: number) {
  let remaining = price
  let total = 0
  let lastCap = 0
  for (const b of emolumentsBrackets) {
    const slice = Math.min(remaining, b.upTo - lastCap)
    if (slice <= 0) break
    total += slice * b.rate
    remaining -= slice
    lastCap = b.upTo
    if (remaining <= 0) break
  }
  return total
}

function computeRegistrationDuties(price: number, type: AcquisitionType) {
  // Taux indicatifs — à adapter à la situation fiscale
  const rate = type === 'neuf' ? 0.05 : 0.06
  return price * rate
}

function computeLandRegistry(price: number) {
  // Conservation foncière + publication ~ 1.5%
  return price * 0.015
}

function computeDisbursements() {
  // Débours forfaitaires (extraits, copies, taxes diverses)
  return 250_000
}

export default function SimulateurFraisNotaire() {
  const [priceStr, setPriceStr] = useState('50000000')
  const [type, setType] = useState<AcquisitionType>('ancien')
  const reduce = useReducedMotion()

  const price = Math.max(0, Number(priceStr.replace(/\s/g, '')) || 0)

  const result = useMemo(() => {
    const emoluments = computeEmoluments(price)
    const registration = computeRegistrationDuties(price, type)
    const landRegistry = type === 'terrain' ? computeLandRegistry(price) * 0.7 : computeLandRegistry(price)
    const disbursements = computeDisbursements()
    const total = emoluments + registration + landRegistry + disbursements
    return { emoluments, registration, landRegistry, disbursements, total }
  }, [price, type])

  const totalRate = price > 0 ? (result.total / price) * 100 : 0

  return (
    <TooltipProvider>
      <div className="bg-white rounded-lg shadow-elegant overflow-hidden border border-border">
        <div className="bg-navy text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">Simulateur de frais de notaire</h2>
              <p className="text-sm text-gray-300">Estimation indicative pour un achat immobilier au Gabon</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-0">
          <div className="p-6 lg:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-border">
            <div className="space-y-2">
              <Label htmlFor="price">Prix d'achat du bien (FCFA)</Label>
              <Input
                id="price"
                inputMode="numeric"
                pattern="[0-9 ]*"
                value={priceStr}
                onChange={(e) => setPriceStr(e.target.value.replace(/[^\d ]/g, ''))}
                placeholder="50 000 000"
                className="text-lg"
              />
              <input
                type="range"
                min={5_000_000}
                max={500_000_000}
                step={1_000_000}
                value={price}
                onChange={(e) => setPriceStr(e.target.value)}
                className="w-full accent-gold"
                aria-label="Curseur prix d'achat"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 M</span>
                <span>500 M</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type d'acquisition</Label>
              <Select value={type} onValueChange={(v) => setType(v as AcquisitionType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ancien">Bien ancien (existant)</SelectItem>
                  <SelectItem value="neuf">Bien neuf (VEFA / récent)</SelectItem>
                  <SelectItem value="terrain">Terrain nu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-cream rounded-lg p-4 text-xs text-muted-foreground flex items-start gap-2">
              <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <p>
                Les montants indiqués sont une <strong>estimation indicative</strong> basée sur la
                pratique gabonaise courante. Pour un devis précis adapté à votre dossier, contactez
                directement l'étude.
              </p>
            </div>
          </div>

          <div className="p-6 lg:p-8 bg-cream">
            <h3 className="font-serif text-lg font-semibold text-navy mb-4">Détail de l'estimation</h3>

            <div className="space-y-3">
              <Row
                label="Émoluments du notaire"
                tooltip="Rémunération réglementée du notaire, proportionnelle au prix selon un barème dégressif."
                value={result.emoluments}
              />
              <Row
                label="Droits d'enregistrement"
                tooltip="Taxes perçues pour le compte de l'État (taux variable selon le type de bien)."
                value={result.registration}
              />
              <Row
                label="Conservation foncière"
                tooltip="Frais d'inscription du nouveau propriétaire au registre foncier."
                value={result.landRegistry}
              />
              <Row
                label="Débours et formalités"
                tooltip="Extraits, copies, taxes diverses payées par le notaire pour le compte du client."
                value={result.disbursements}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <span className="font-serif text-lg font-semibold text-navy">Total estimé</span>
                <motion.span
                  key={result.total}
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="font-serif text-2xl sm:text-3xl font-bold text-gold"
                >
                  {formatXAF(result.total)}
                </motion.span>
              </div>
              {price > 0 && (
                <p className="text-xs text-muted-foreground text-right mt-1">
                  soit environ {totalRate.toFixed(1)}% du prix d'achat
                </p>
              )}
            </div>

            <Button asChild className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold mt-6">
              <Link to="/rendez-vous">
                <Calendar className="w-4 h-4 mr-2" />
                Demander un devis officiel
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

function Row({ label, tooltip, value }: { label: string; tooltip: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-navy underline decoration-dotted underline-offset-2 cursor-help">
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
      </Tooltip>
      <span className="font-medium text-navy">{formatXAF(value)}</span>
    </div>
  )
}
