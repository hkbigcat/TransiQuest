import * as React from 'react'
import { cn } from '../../lib/utils'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-xl border border-neonBlue/40 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-neonBlue focus:shadow-neon',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'
