import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Props = {
  to?: string
  href?: string
  children: React.ReactNode
  className?: string
}

/** Premium link with sliding gold underline + arrow. Use for "En savoir plus" links. */
export default function GoldLink({ to, href, children, className }: Props) {
  const inner = (
    <span className={cn(
      'group inline-flex items-center gap-2 text-bronze hover:text-ink transition-colors text-sm font-medium tracking-wider uppercase',
      className,
    )}>
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 w-full h-px bg-bronze origin-left scale-x-30 group-hover:scale-x-100 transition-transform duration-300" />
      </span>
      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
    </span>
  )
  if (to) return <Link to={to}>{inner}</Link>
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
  return inner
}
