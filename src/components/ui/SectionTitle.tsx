import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  align?: 'left' | 'center'
}

/** Large editorial-style serif title for section heads. */
export default function SectionTitle({ children, className, as: Tag = 'h2', align = 'left' }: Props) {
  return (
    <Tag
      className={cn(
        'font-serif font-medium text-ink leading-[1.08] tracking-[-0.01em]',
        '[font-size:clamp(1.875rem,3.6vw,3rem)]',
        align === 'center' && 'text-center mx-auto',
        'max-w-[28ch]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
