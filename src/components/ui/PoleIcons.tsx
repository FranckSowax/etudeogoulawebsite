/**
 * Line-art SVG pictograms for the 6 expertise poles.
 * Stroke 1.2, currentColor, viewBox 32×32 — designed to feel gravé.
 */

type Props = { className?: string; size?: number }

function S(props: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={props.size ?? 32}
      height={props.size ?? 32}
      className={props.className}
      aria-hidden
    >
      {props.children}
    </svg>
  )
}

/** Maison + clé : droit immobilier */
export function ImmobilierIcon(p: Props) {
  return (
    <S {...p}>
      <path d="M4 15L16 5L28 15" />
      <path d="M6.5 13V27H25.5V13" />
      <path d="M13 27V19H19V27" />
      <circle cx="22" cy="20" r="1.4" />
      <path d="M22 21.4V25" />
      <path d="M22.8 23.5H21.5" />
    </S>
  )
}

/** Balance romaine : successions & libéralités */
export function SuccessionIcon(p: Props) {
  return (
    <S {...p}>
      <path d="M16 5V27" />
      <path d="M10 27H22" />
      <path d="M6 11L16 7L26 11" />
      <path d="M3 17L6 11L9 17" />
      <path d="M3 17C3 18.7 4.3 20 6 20S9 18.7 9 17" />
      <path d="M23 17L26 11L29 17" />
      <path d="M23 17C23 18.7 24.3 20 26 20S29 18.7 29 17" />
    </S>
  )
}

/** 3 figures stylisées : droit de la famille */
export function FamilleIcon(p: Props) {
  return (
    <S {...p}>
      <circle cx="16" cy="9" r="3" />
      <path d="M10 22C10 18.5 12.5 16.5 16 16.5S22 18.5 22 22" />
      <circle cx="6" cy="13" r="2" />
      <path d="M2 22C2 19.8 3.8 18 6 18C6.7 18 7.4 18.2 8 18.5" />
      <circle cx="26" cy="13" r="2" />
      <path d="M30 22C30 19.8 28.2 18 26 18C25.3 18 24.6 18.2 24 18.5" />
      <path d="M2 26H30" />
    </S>
  )
}

/** Bâtiment à colonnes : sociétés & OHADA */
export function SocieteIcon(p: Props) {
  return (
    <S {...p}>
      <path d="M4 27V11L16 5L28 11V27" />
      <path d="M3 27H29" />
      <path d="M9 27V14M14 27V14M18 27V14M23 27V14" />
      <path d="M4 11H28" />
      <path d="M13 27V20H19V27" />
    </S>
  )
}

/** Plume + parchemin : authentification & dépôt d'actes */
export function ActeIcon(p: Props) {
  return (
    <S {...p}>
      <path d="M21 4L28 11L14 25L7 26L8 19L21 4Z" />
      <path d="M19 6L26 13" />
      <path d="M7 26L4 29" />
      <path d="M3 22L8.5 17" />
      <circle cx="22" cy="22" r="2.4" />
      <path d="M19 25L20.5 22.5L22.5 24.5L25 22" />
    </S>
  )
}

/** Colonne ionique : conseil patrimonial */
export function PatrimoineIcon(p: Props) {
  return (
    <S {...p}>
      <path d="M5 6H27" />
      <path d="M3 8H29" />
      <path d="M6 8C6 9 6.8 10 8 10S10 11 10 12V22" />
      <path d="M22 12C22 11 22.8 10 24 10S26 9 26 8" />
      <path d="M10 12H22" />
      <path d="M11 22V12M14 22V12M18 22V12M21 22V12" />
      <path d="M9 22H23" />
      <path d="M3 24H29" />
      <path d="M5 26H27" />
      <path d="M6 28H26" />
    </S>
  )
}

/** Map slug → icon component (matches `lib/services.tsx` slugs). */
export const POLE_ICONS = {
  immobilier:  ImmobilierIcon,
  succession:  SuccessionIcon,
  famille:     FamilleIcon,
  societe:     SocieteIcon,
  acte:        ActeIcon,
  patrimoine:  PatrimoineIcon,
} as const

export type PoleSlug = keyof typeof POLE_ICONS
