import { Home, Users, Building2, FileText, BookOpen, Briefcase, Scale, Landmark } from 'lucide-react'
import type { ReactNode } from 'react'

export type ExpertiseSection = {
  heading: string
  paragraphs: string[]
}

export type ExpertiseFigure = {
  value: string
  label: string
}

export type ExpertiseFaq = {
  q: string
  a: string
}

export type Expertise = {
  slug: string
  icon: ReactNode
  title: string
  shortTitle: string
  description: string
  items: string[]
  metaTitle: string
  metaDescription: string
  /** Long-form intro (1-3 paragraphs) shown at the top of the detail page */
  intro: string[]
  /** 3-5 themed sections of detailed content */
  sections: ExpertiseSection[]
  /** Key figures highlighted next to the intro */
  figures?: ExpertiseFigure[]
  /** Page-specific FAQ — also rendered as JSON-LD FAQPage */
  faqs: ExpertiseFaq[]
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
      'Baux d\'habitation et baux commerciaux',
      'Copropriété et règlement de copropriété',
    ],
    metaTitle: 'Notaire Achat Immobilier Gabon — Vente, Donation, Hypothèque | Libreville',
    metaDescription:
      "Étude notariale à Libreville pour l'achat immobilier au Gabon. Actes de vente, donation, hypothèques. Sécurité juridique garantie.",
    intro: [
      "L'achat immobilier au Gabon est une opération qui engage durablement votre patrimoine. Le notaire, officier public, est le garant de la sécurité juridique de la transaction : il vérifie le titre de propriété, contrôle l'origine du bien sur 30 ans, s'assure de la liberté du vendeur et procède à l'inscription du nouveau propriétaire à la conservation foncière.",
      "Implantée à Libreville depuis près de vingt ans, l'Étude Notariale Ogoula Nkondawiri accompagne particuliers, expatriés et investisseurs dans toutes leurs transactions immobilières au Gabon : achat d'un terrain, d'une villa, d'un appartement, vente d'un bien, donation, hypothèque ou bail commercial.",
    ],
    figures: [
      { value: '+20 ans', label: "d'expérience en transactions immobilières" },
      { value: '30 ans', label: "d'origine de propriété vérifiée" },
      { value: '7%', label: 'de droits d\'enregistrement (indicatif)' },
    ],
    sections: [
      {
        heading: 'Achat immobilier au Gabon : les étapes clés',
        paragraphs: [
          "Toute transaction immobilière au Gabon débute par une promesse de vente ou un compromis qui fixe les conditions de l'opération. Le notaire vérifie alors le titre foncier, l'absence de servitudes ou d'inscriptions hypothécaires et la conformité urbanistique du bien.",
          "Vient ensuite la signature de l'acte authentique de vente à l'étude : le prix est versé sur le compte séquestre de l'étude, l'acte est signé par les parties, puis enregistré et publié à la conservation foncière. Le nouvel acquéreur reçoit, à l'issue de cette procédure, un titre foncier à son nom.",
        ],
      },
      {
        heading: 'Vente immobilière : sécuriser votre cession',
        paragraphs: [
          "Vendre un bien immobilier au Gabon nécessite de réunir un dossier rigoureux : titre de propriété, plan cadastral, quitus fiscal, état civil. Notre étude rédige l'acte de vente, calcule la plus-value éventuelle et veille à la libération des fonds dans les meilleurs délais.",
          "En cas de bien indivis ou démembré, nous accompagnons l'ensemble des co-vendeurs et garantissons l'équilibre des intérêts.",
        ],
      },
      {
        heading: 'Donation, partage et hypothèque',
        paragraphs: [
          "La donation immobilière permet de transmettre un bien de son vivant. Au Gabon, elle est soumise à des droits réduits sous certaines conditions et peut être assortie d'une réserve d'usufruit pour le donateur.",
          "L'hypothèque conventionnelle, indispensable pour garantir un prêt bancaire, est inscrite par le notaire à la conservation foncière. La mainlevée intervient au remboursement complet du crédit.",
        ],
      },
      {
        heading: 'Baux et copropriété',
        paragraphs: [
          "Nous rédigeons baux d'habitation, baux commerciaux et baux à construction, en sécurisant les clauses sensibles : durée, indexation, dépôt de garantie, charges, état des lieux. Pour les ensembles immobiliers, nous établissons les règlements de copropriété et accompagnons la création des syndicats.",
        ],
      },
    ],
    faqs: [
      {
        q: "Quels sont les frais d'achat immobilier au Gabon ?",
        a: "Les frais à prévoir incluent les émoluments du notaire (rémunération réglementée, proportionnelle au prix), les droits d'enregistrement perçus pour l'État, les frais de conservation foncière et les débours (extraits, copies, taxes). Notre simulateur en ligne vous donne une estimation indicative.",
      },
      {
        q: "Combien de temps prend un achat immobilier au Gabon ?",
        a: "Du compromis à la signature définitive, comptez en moyenne 2 à 3 mois si le titre foncier est en règle. Pour un bien à régulariser ou en succession, le délai peut s'allonger à 6 mois ou plus.",
      },
      {
        q: "Un étranger peut-il acheter un bien immobilier au Gabon ?",
        a: "Oui, sous réserve du respect de la législation foncière gabonaise. Notre étude vous accompagne dans toutes les démarches administratives et fiscales applicables aux non-résidents.",
      },
      {
        q: "Que faire si le titre foncier n'est pas à jour ?",
        a: "Avant toute vente, il convient de régulariser le titre : succession, partage, mutation. Notre étude prend en charge l'ensemble de la procédure pour permettre la cession dans des conditions sécurisées.",
      },
    ],
  },
  {
    slug: 'successions',
    icon: <Scale className="w-8 h-8" />,
    title: 'Successions & Libéralités',
    shortTitle: 'Successions',
    description:
      "Règlement de successions, donations, testaments. Notre notaire vous accompagne dans la transmission patrimoniale au Gabon avec rigueur et bienveillance.",
    items: [
      'Règlement de succession complète',
      'Testament authentique et codicille',
      'Donation entre époux et donation-partage',
      'Partage successoral (amiable ou judiciaire)',
      'Déclaration de succession et calcul des droits',
      'Acte de notoriété',
    ],
    metaTitle: 'Succession Gabon — Notaire Testament & Donation | Libreville',
    metaDescription:
      "Notaire à Libreville pour le règlement de succession au Gabon : testament, donation, partage. Conseil patrimonial personnalisé.",
    intro: [
      "Le décès d'un proche entraîne l'ouverture d'une succession qui doit être réglée selon les règles du droit gabonais. Le notaire identifie les héritiers, dresse l'inventaire du patrimoine, calcule les droits dus à l'État et organise le partage des biens.",
      "Notre étude vous accompagne avec discrétion et rigueur dans cette étape sensible, qu'il s'agisse d'une succession simple ou d'un dossier complexe (immobilier, héritiers à l'étranger, contestations).",
    ],
    figures: [
      { value: '6 à 24', label: 'mois pour régler une succession' },
      { value: '4 actes', label: 'clés : notoriété, inventaire, partage, déclaration' },
      { value: '100%', label: 'de confidentialité garantie' },
    ],
    sections: [
      {
        heading: "Les étapes du règlement d'une succession au Gabon",
        paragraphs: [
          "La succession s'ouvre dès le décès. Le notaire établit d'abord l'acte de notoriété, qui identifie les héritiers et fixe leurs droits respectifs. Il dresse ensuite l'inventaire du patrimoine du défunt : comptes bancaires, immobilier, titres, dettes.",
          "Vient le calcul des droits de mutation à titre gratuit, dus à l'État, dont le taux dépend du lien de parenté. La déclaration de succession est déposée auprès de l'administration fiscale, puis le partage est organisé entre les héritiers.",
        ],
      },
      {
        heading: 'Testament et donation : anticiper la transmission',
        paragraphs: [
          "Rédiger un testament authentique permet d'organiser de son vivant la transmission de son patrimoine. Le testament olographe, écrit de la main du testateur, doit être déposé chez un notaire pour être opposable.",
          "La donation-partage est un outil puissant pour anticiper la transmission tout en évitant les conflits familiaux : elle fige la valeur des biens donnés au jour de l'acte.",
        ],
      },
      {
        heading: 'Successions complexes : notre accompagnement',
        paragraphs: [
          "Lorsqu'un dossier comporte des héritiers résidant à l'étranger, des biens situés dans plusieurs pays ou des conflits familiaux, le notaire devient un pivot indispensable. Nous coordonnons les démarches avec les avocats, les administrations et les notaires étrangers.",
          "En cas de désaccord, le partage peut être judiciaire : nous préparons les actes nécessaires et représentons les intérêts de la famille dans les meilleures conditions.",
        ],
      },
    ],
    faqs: [
      {
        q: 'Combien de temps prend une succession au Gabon ?',
        a: "Une succession simple peut être réglée en 6 à 12 mois. Un dossier complexe (immobilier, héritiers à l'étranger, contestations) peut prendre 18 à 24 mois.",
      },
      {
        q: 'Quels sont les droits de succession au Gabon ?',
        a: "Les droits de mutation à titre gratuit varient selon le lien de parenté entre le défunt et l'héritier. Notre étude calcule précisément les droits applicables à votre situation.",
      },
      {
        q: 'Que faire en cas de désaccord entre héritiers ?',
        a: "Nous privilégions toujours le partage amiable. En cas de blocage, le partage judiciaire peut être envisagé : nous préparons les actes et assistons les parties devant le tribunal.",
      },
      {
        q: "Faut-il un testament si l'on est marié et que l'on a des enfants ?",
        a: "Pas nécessairement, mais un testament permet de protéger le conjoint survivant, d'avantager un enfant, ou d'effectuer des legs particuliers. Une consultation patrimoniale est recommandée.",
      },
    ],
  },
  {
    slug: 'famille',
    icon: <Users className="w-8 h-8" />,
    title: 'Droit de la Famille',
    shortTitle: 'Droit de la Famille',
    description:
      "Mariage, contrat, divorce, adoption, filiation. Nous accompagnons les familles dans toutes les étapes importantes de leur vie au Gabon.",
    items: [
      'Contrats de mariage et changement de régime',
      'Régimes matrimoniaux (communauté, séparation, participation)',
      'Divorce et liquidation du régime matrimonial',
      'Adoption simple et plénière',
      'Reconnaissance et filiation',
      'Pension alimentaire et obligations alimentaires',
    ],
    metaTitle: 'Notaire Droit de la Famille Gabon — Mariage, Divorce, Adoption | Libreville',
    metaDescription:
      'Étude notariale à Libreville : contrat de mariage, divorce, adoption au Gabon. Conseil et accompagnement personnalisé.',
    intro: [
      "Le droit de la famille touche aux moments les plus importants de la vie : mariage, naissance d'un enfant, séparation, transmission. À chacune de ces étapes, le notaire conseille, sécurise et formalise les choix patrimoniaux qui engagent la famille sur le long terme.",
      "Notre étude accompagne couples, parents et enfants au Gabon avec la même exigence d'écoute et de discrétion, qu'il s'agisse de rédiger un contrat de mariage, de liquider un régime matrimonial après divorce ou d'organiser une adoption.",
    ],
    sections: [
      {
        heading: 'Choisir son régime matrimonial',
        paragraphs: [
          "Le choix du régime matrimonial est l'une des décisions patrimoniales les plus importantes du couple. Communauté réduite aux acquêts, séparation de biens, participation aux acquêts : chaque régime a ses avantages selon la situation professionnelle et patrimoniale des époux.",
          "Notre étude vous présente les options, simule les conséquences en cas de divorce ou de décès, et rédige le contrat de mariage avant la cérémonie.",
        ],
      },
      {
        heading: 'Divorce : la liquidation patrimoniale',
        paragraphs: [
          "Lors d'un divorce, la liquidation du régime matrimonial est l'étape déterminante : qui garde quoi ? Comment évaluer les biens ? Comment compenser les déséquilibres ?",
          "Le notaire dresse l'état liquidatif, propose les modalités de partage et rédige l'acte de partage en lien avec les avocats. Nous privilégions toujours les solutions amiables, plus rapides et moins coûteuses.",
        ],
      },
      {
        heading: "Adoption, filiation et protection de l'enfant",
        paragraphs: [
          "Adoption simple, adoption plénière, reconnaissance d'enfant naturel, légitimation : autant d'actes qui modifient durablement les liens de filiation et les droits successoraux. Nous accompagnons les familles dans toutes ces démarches.",
        ],
      },
    ],
    faqs: [
      {
        q: 'Faut-il signer un contrat de mariage au Gabon ?',
        a: "Le contrat de mariage n'est pas obligatoire : à défaut, les époux sont mariés sous le régime légal de la communauté. Mais signer un contrat permet d'adapter le régime aux situations particulières (entrepreneurs, second mariage, écart de patrimoine).",
      },
      {
        q: 'Peut-on changer de régime matrimonial ?',
        a: 'Oui, après deux ans de mariage, les époux peuvent changer de régime par acte notarié, sous certaines conditions. Notre étude vous accompagne dans cette procédure.',
      },
      {
        q: 'Comment se passe la liquidation après un divorce ?',
        a: "Le notaire évalue les biens communs, calcule la part de chaque époux et propose un projet de partage. Si un accord est trouvé, l'acte de partage est signé à l'étude. Sinon, le tribunal tranche.",
      },
    ],
  },
  {
    slug: 'societes',
    icon: <Building2 className="w-8 h-8" />,
    title: 'Droit des Sociétés & Actes Commerciaux',
    shortTitle: 'Droit des Sociétés',
    description:
      "Création de sociétés, cession de fonds de commerce, baux commerciaux. Conseil et sécurité juridique pour les entreprises au Gabon.",
    items: [
      'Constitution de sociétés (SARL, SA, SAS, SCI)',
      'Cession de parts sociales ou de fonds de commerce',
      'Baux commerciaux et baux à construction',
      "Pactes d'associés et clauses spécifiques",
      'Modifications statutaires',
      'Dissolution et liquidation amiable',
    ],
    metaTitle: 'Notaire Droit des Sociétés Gabon — Création, Cession | Libreville',
    metaDescription:
      'Notaire au Gabon pour la création de société, cession de fonds, baux commerciaux. Conseil aux entreprises à Libreville.',
    intro: [
      "Créer, transmettre ou réorganiser une société au Gabon nécessite des actes solides, conformes à l'acte uniforme OHADA et adaptés à la situation économique de l'entreprise. Le notaire est l'acteur clé pour sécuriser ces opérations sensibles.",
      "Que vous lanciez une SARL, cédiez un fonds de commerce, ou rédigiez un pacte d'associés, notre étude accompagne dirigeants, investisseurs et associés à Libreville avec une approche pragmatique et orientée vers la performance.",
    ],
    sections: [
      {
        heading: "Constitution de société : choisir la bonne structure",
        paragraphs: [
          "SARL, SA, SAS, société civile : chaque forme a ses avantages selon le projet, le nombre d'associés et le besoin de capitaux. Notre étude vous conseille sur la forme la plus adaptée à votre activité au Gabon.",
          "Nous rédigeons les statuts conformes à l'acte uniforme OHADA, accompagnons l'apport des capitaux et déposons les actes au registre du commerce et du crédit mobilier.",
        ],
      },
      {
        heading: "Cession de parts ou de fonds de commerce",
        paragraphs: [
          "La cession de parts sociales ou d'un fonds de commerce est une opération à enjeux : valorisation, garantie d'actif et de passif, formalités de publicité, fiscalité. Le notaire sécurise le processus de bout en bout.",
          "Notre étude rédige l'acte de cession, organise le séquestre des fonds, et accompagne les parties dans les déclarations fiscales et sociales obligatoires.",
        ],
      },
      {
        heading: "Pactes d'associés et baux commerciaux",
        paragraphs: [
          "Le pacte d'associés organise la gouvernance de l'entreprise au-delà des statuts : droit de préemption, droit de sortie conjointe, clauses d'exclusion. Notre étude rédige des pactes sur-mesure, adaptés aux équilibres souhaités entre associés.",
          "Pour les baux commerciaux, nous sécurisons les clauses sensibles (durée, indexation, charges, répartition des travaux) afin de protéger durablement les intérêts du bailleur comme du preneur.",
        ],
      },
    ],
    faqs: [
      {
        q: 'Combien de temps faut-il pour créer une société au Gabon ?',
        a: "De la rédaction des statuts à l'immatriculation, comptez 2 à 4 semaines selon la forme choisie et la disponibilité des associés.",
      },
      {
        q: 'Qui paie les frais de cession de fonds de commerce ?',
        a: "L'usage veut que les frais soient à la charge de l'acquéreur, mais cela peut être négocié dans l'acte. Notre étude vous conseille sur les pratiques les plus courantes.",
      },
      {
        q: "Faut-il systématiquement passer chez le notaire pour créer une société ?",
        a: "Pas toujours, mais pour une SCI, un apport en immobilier ou un pacte d'associés sécurisé, l'intervention du notaire est fortement recommandée — voire obligatoire.",
      },
    ],
  },
  {
    slug: 'authentification',
    icon: <FileText className="w-8 h-8" />,
    title: "Authentification & Dépôt d'Actes",
    shortTitle: 'Authentification',
    description:
      "Rédaction et authentification de tous actes notariés. Authenticité et sécurité juridique garanties pour vos documents importants.",
    items: [
      "Actes authentiques sur-mesure",
      "Dépôt et conservation d'actes",
      'Procurations notariées',
      'Reconnaissance de dette',
      'Copies authentiques et copies exécutoires',
      'Affidavit et certifications',
    ],
    metaTitle: "Acte Notarié Libreville — Authentification & Dépôt | Notaire Gabon",
    metaDescription:
      "Rédaction et authentification d'actes notariés à Libreville. Dépôt d'actes, procurations, copies authentiques au Gabon.",
    intro: [
      "L'acte notarié est revêtu de la force probante : il fait foi par lui-même de son contenu et de la date à laquelle il a été établi. Il dispose en outre de la force exécutoire, qui permet, le cas échéant, de procéder à l'exécution forcée sans avoir à obtenir préalablement un jugement.",
      "Notre étude rédige et authentifie tous types d'actes : procurations, reconnaissances de dette, conventions diverses, dépôt d'écrits sous seing privé. Nous conservons l'original (la minute) dans nos archives pendant 75 ans et délivrons les copies authentiques nécessaires.",
    ],
    sections: [
      {
        heading: "Pourquoi recourir à un acte authentique ?",
        paragraphs: [
          "Trois avantages majeurs distinguent l'acte notarié : la date certaine, la force probante et la force exécutoire. Une fois signé chez le notaire, l'acte ne peut plus être contesté quant à sa date ou son contenu, et il ouvre droit à l'exécution forcée.",
          "C'est pourquoi de nombreux engagements importants — reconnaissance de dette, procuration générale, contrat de mariage, vente immobilière — gagnent à être passés par devant notaire.",
        ],
      },
      {
        heading: "Dépôt d'écrits et conservation des actes",
        paragraphs: [
          "Vous pouvez déposer chez le notaire un document que vous souhaitez sécuriser : testament, contrat, procès-verbal, tout écrit dont vous voulez préserver l'intégrité et la date. Le notaire dresse alors un acte de dépôt qui confère au document une date certaine.",
          "Nos archives conservent les minutes pendant la durée légale, et nous délivrons des copies authentiques sur demande des intéressés.",
        ],
      },
      {
        heading: "Procurations et copies exécutoires",
        paragraphs: [
          "La procuration notariée permet de donner pouvoir à un tiers de signer en votre nom des actes importants : achat, vente, démarche administrative. Sa validité internationale est largement reconnue.",
          "La copie exécutoire, revêtue de la formule exécutoire, permet de poursuivre directement l'exécution forcée d'une créance reconnue par acte authentique.",
        ],
      },
    ],
    faqs: [
      {
        q: "Quelle est la différence entre acte authentique et acte sous seing privé ?",
        a: "L'acte sous seing privé est rédigé par les parties seules. L'acte authentique est établi par un officier public (notaire), qui en garantit la légalité, la date et le contenu. Il a force probante et exécutoire.",
      },
      {
        q: 'Combien de temps un acte notarié est-il conservé ?',
        a: 'La minute originale est conservée par le notaire pendant 75 ans, puis transférée aux archives nationales. Vous pouvez à tout moment demander une copie authentique.',
      },
      {
        q: "Une procuration notariée gabonaise est-elle valable à l'étranger ?",
        a: "Oui, sous réserve d'une légalisation ou d'une apostille. Notre étude effectue les démarches nécessaires pour rendre la procuration opposable dans le pays cible.",
      },
    ],
  },
  {
    slug: 'patrimoine',
    icon: <Landmark className="w-8 h-8" />,
    title: 'Conseil Patrimonial',
    shortTitle: 'Conseil Patrimonial',
    description:
      "Stratégie patrimoniale, transmission, optimisation fiscale. Notre notaire conseille particuliers et chefs d'entreprise au Gabon.",
    items: [
      'Audit patrimonial complet',
      'Planification successorale',
      'Optimisation fiscale légale',
      'Démembrement de propriété (usufruit / nue-propriété)',
      'Protection du conjoint survivant',
      "Stratégie d'investissement immobilier",
    ],
    metaTitle: 'Conseil Patrimonial Gabon — Notaire Stratégie & Transmission | Libreville',
    metaDescription:
      'Conseil patrimonial à Libreville : audit, transmission, optimisation fiscale. Notaire au service de votre patrimoine au Gabon.',
    intro: [
      "Le notaire n'est pas qu'un rédacteur d'actes : il est aussi un conseil patrimonial, capable d'analyser votre situation globale (familiale, professionnelle, fiscale) et de proposer une stratégie adaptée à vos objectifs.",
      "Au Gabon, où le patrimoine est souvent constitué d'immobilier et de parts d'entreprise, la planification est essentielle pour protéger le conjoint, anticiper la transmission et optimiser la fiscalité dans le respect strict de la loi.",
    ],
    sections: [
      {
        heading: "L'audit patrimonial : la première étape",
        paragraphs: [
          "Lors d'une consultation patrimoniale, le notaire analyse votre situation : composition du patrimoine, régime matrimonial, situation familiale, projets de vie. Il identifie les risques (succession non préparée, conjoint mal protégé, fiscalité élevée) et propose des leviers d'action.",
        ],
      },
      {
        heading: 'Démembrement et donation : transmettre intelligemment',
        paragraphs: [
          "Le démembrement de propriété (séparation de l'usufruit et de la nue-propriété) est un outil puissant : il permet de transmettre la nue-propriété à ses enfants tout en conservant l'usage et les revenus du bien. À l'extinction de l'usufruit, la pleine propriété se reconstitue dans la tête du nu-propriétaire, sans nouveaux droits.",
          "La donation-partage permet de figer la valeur des biens donnés et de prévenir les conflits familiaux à l'ouverture de la succession.",
        ],
      },
      {
        heading: 'Protection du conjoint et entrepreneuriat',
        paragraphs: [
          "La donation entre époux, le changement de régime matrimonial, la souscription d'une assurance-vie ou la constitution d'une SCI familiale : autant d'outils combinables pour protéger le conjoint survivant.",
          "Pour les chefs d'entreprise, nous accompagnons la transmission du capital, le pacte Dutreil-équivalent local le cas échéant, et la séparation du patrimoine professionnel et personnel.",
        ],
      },
    ],
    faqs: [
      {
        q: 'À partir de quel patrimoine consulter un notaire pour un conseil patrimonial ?',
        a: "Il n'y a pas de seuil minimum. Dès que vous possédez un bien immobilier, des parts d'entreprise ou que vous fondez une famille, une consultation peut révéler des optimisations significatives.",
      },
      {
        q: "Combien coûte une consultation patrimoniale ?",
        a: 'Une première consultation est généralement facturée à un forfait raisonnable. Pour un audit complet, nous établissons un devis sur mesure en fonction du temps nécessaire.',
      },
      {
        q: "Le notaire peut-il remplacer mon comptable ou mon avocat ?",
        a: "Non, ces métiers sont complémentaires. Le notaire intervient sur la sécurité juridique des actes et la stratégie patrimoniale. Nous travaillons régulièrement avec des conseils fiscaux et des avocats pour vos dossiers complexes.",
      },
    ],
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
