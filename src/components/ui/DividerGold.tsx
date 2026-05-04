/** Decorative gold rule, 1px high, configurable width. */
export default function DividerGold({ width = 80, className = '' }: { width?: number; className?: string }) {
  return <span className={`block h-px bg-bronze ${className}`} style={{ width }} aria-hidden />
}
