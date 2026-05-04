import { cn } from '@/lib/utils'

/** Animated circular monogram "SON" — homage to notarial seal traditions.
 *  Outer ring rotates slowly (60s), inner letters stay fixed. */
export default function MonogramSON({ className, size = 80 }: { className?: string; size?: number }) {
  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      aria-label="Étude Suzanne Ogoula Nkondawiri"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 animate-[spin_60s_linear_infinite]"
        style={{ width: size, height: size }}
      >
        <defs>
          <path id="circlePath" d="M 50,50 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" fill="none" />
        </defs>
        <text fill="currentColor" className="text-[7px] tracking-[0.3em] uppercase" letterSpacing="2">
          <textPath href="#circlePath" startOffset="0">
            ÉTUDE NOTARIALE · S.O. NKONDAWIRI · LIBREVILLE · GABON ·
          </textPath>
        </text>
      </svg>
      <div className="font-serif font-semibold text-current select-none" style={{ fontSize: size * 0.32 }}>
        SON
      </div>
    </div>
  )
}
