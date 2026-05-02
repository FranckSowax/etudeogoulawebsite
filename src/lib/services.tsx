import { Home, Users, Building2, FileText, BookOpen, Briefcase, Scale, Landmark } from 'lucide-react'
import type { ReactNode } from 'react'

export type Expertise = {
  slug: string
  icon: ReactNode
  title: string
  shortTitle: string
  description: string
  items: string[]
  metaTitle: string
  metaDescription: string
}

export const expertises: Expertise[] = [
  {
    slug: 'immobilier',
    icon: <Home className="w-8 h-8" />,
    title: 'Droit Immobilier & Transactions',
    shortTitle: 'Droit Immobilier',
    description:
      "Notaire spécialisé en achat immobilier au Gabon : actes de vente, donation, partage, hypothèques et baux. Sécurisez vos transactions immobilières à Libreville.",
    items: [
      'Achat immobilier au Gabon',
      'Vente et cession immobilière',
      'Donation et partage de biens',
      'Hypothèques et cautions',
      'Baux et copropriété',
    ],
    metaTitle: 'Notaire Achat Immobilier Gabon — Vente, Donation, Hypothèque | Libreville',
    metaDescription:
      "Cabinet notarial à Libreville pour l'achat immobilier au Gabon. Actes de vente, donation, hypothèques. Sécurité juridique garantie.",
  },
  {
    slug: 'successions',
    icon: <Scale className="w-8 h-8" />,
    title: 'Successions & Libéralités',
    shortTitle: 'Successions',
    description:
      "Règlement de successions, donations, testaments. Notre notaire vous accompagne dans la transmission patrimoniale au Gabon avec rigueur et bienveillance.",
    items: [
      'Règlement de succession',
      'Testament et codicille',
      'Donation entre époux',
      'Partage successoral',
      'Déclaration de succession',
    ],
    metaTitle: 'Succession Gabon — Notaire Testament & Donation | Libreville',
    metaDescription:
      'Notaire à Libreville pour le règlement de succession au Gabon : testament, donation, partage. Conseil patrimonial personnalisé.',
  },
  {
    slug: 'famille',
    icon: <Users className="w-8 h-8" />,
    title: 'Droit de la Famille',
    shortTitle: 'Droit de la Famille',
    description:
      "Mariage, contrat, divorce, adoption, filiation. Nous accompagnons les familles dans toutes les étapes importantes de leur vie au Gabon.",
    items: [
      'Contrats de mariage',
      'Régimes matrimoniaux',
      'Divorce et liquidation',
      'Adoption et filiation',
      'Pension alimentaire',
    ],
    metaTitle: 'Notaire Droit de la Famille Gabon — Mariage, Divorce, Adoption | Libreville',
    metaDescription:
      'Cabinet notarial à Libreville : contrat de mariage, divorce, adoption au Gabon. Conseil et accompagnement personnalisé.',
  },
  {
    slug: 'societes',
    icon: <Building2 className="w-8 h-8" />,
    title: 'Droit des Sociétés & Actes Commerciaux',
    shortTitle: 'Droit des Sociétés',
    description:
      "Création de sociétés, cession de fonds de commerce, baux commerciaux. Conseil et sécurité juridique pour les entreprises au Gabon.",
    items: [
      'Constitution de sociétés (SARL, SA)',
      'Cession de parts ou de fonds',
      'Baux commerciaux',
      'Pactes d\'associés',
      'Modifications statutaires',
    ],
    metaTitle: 'Notaire Droit des Sociétés Gabon — Création, Cession | Libreville',
    metaDescription:
      'Notaire au Gabon pour la création de société, cession de fonds, baux commerciaux. Conseil aux entreprises à Libreville.',
  },
  {
    slug: 'authentification',
    icon: <FileText className="w-8 h-8" />,
    title: 'Authentification & Dépôt d\'Actes',
    shortTitle: 'Authentification',
    description:
      "Rédaction et authentification de tous actes notariés. Authenticité et sécurité juridique garanties pour vos documents importants.",
    items: [
      'Actes authentiques sur-mesure',
      'Dépôt et conservation d\'actes',
      'Procurations notariées',
      'Reconnaissance de dette',
      'Copies authentiques',
    ],
    metaTitle: 'Acte Notarié Libreville — Authentification & Dépôt | Notaire Gabon',
    metaDescription:
      "Rédaction et authentification d'actes notariés à Libreville. Dépôt d'actes, procurations, copies authentiques au Gabon.",
  },
  {
    slug: 'patrimoine',
    icon: <Landmark className="w-8 h-8" />,
    title: 'Conseil Patrimonial',
    shortTitle: 'Conseil Patrimonial',
    description:
      "Stratégie patrimoniale, transmission, optimisation fiscale. Notre notaire conseille particuliers et chefs d'entreprise au Gabon.",
    items: [
      'Audit patrimonial',
      'Planification successorale',
      'Optimisation fiscale',
      'Démembrement de propriété',
      'Protection du conjoint',
    ],
    metaTitle: 'Conseil Patrimonial Gabon — Notaire Stratégie & Transmission | Libreville',
    metaDescription:
      'Conseil patrimonial à Libreville : audit, transmission, optimisation fiscale. Notaire au service de votre patrimoine au Gabon.',
  },
]

export const expertiseIcons = {
  Home,
  Users,
  Building2,
  FileText,
  BookOpen,
  Briefcase,
  Scale,
  Landmark,
}
