import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  cite?: string
  className?: string
}

/** Editorial pull-quote with leading gold bar. */
export default function PullQuote({ children, cite, className }: Props) {
  return (
    <blockquote className={cn('relative pl-6 my-8', className)}>
      <span aria-hidden className="absolute left-0 top-1 bottom-1 w-px bg-gold" />
      <p className="font-serif italic text-navy/90 leading-[1.4] [font-size:clamp(1.25rem,2vw,1.625rem)]">
        {children}
      </p>
      {cite && (
        <cite className="block mt-3 text-[11px] tracking-[0.2em] uppercase text-gold not-italic">
          — {cite}
        </cite>
      )}
    </blockquote>
  )
}
