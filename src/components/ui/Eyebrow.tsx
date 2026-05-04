import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center'
  tone?: 'gold' | 'paper' | 'ink'
}

/** Small premium label with leading gold rule. Used above section titles. */
export default function Eyebrow({ children, className, align = 'left', tone = 'gold' }: Props) {
  const colorClass = tone === 'paper' ? 'text-white/70' : tone === 'ink' ? 'text-navy' : 'text-gold'
  const ruleClass  = tone === 'paper' ? 'bg-cream/40' : 'bg-gold'
  return (
    <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center', className)}>
      <span className={cn('block w-10 h-px', ruleClass)} />
      <span className={cn('text-[11px] font-medium tracking-[0.22em] uppercase', colorClass)}>
        {children}
      </span>
    </div>
  )
}
