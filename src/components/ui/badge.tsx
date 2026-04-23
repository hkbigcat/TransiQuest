import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Badge({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border border-neonGreen/50 bg-neonGreen/10 px-3 py-1 text-xs font-semibold text-neonGreen',
        className,
      )}
    >
      {children}
    </span>
  )
}
