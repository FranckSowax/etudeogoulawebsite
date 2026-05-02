import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type RevealProps = {
  children: ReactNode
  delay?: number
  /** Translation in pixels (default 12) */
  y?: number
  className?: string
  /** Render once vs repeatedly when scrolled into view */
  once?: boolean
}

export default function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
