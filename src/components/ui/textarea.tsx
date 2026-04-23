import * as React from 'react'
import { cn } from '../../lib/utils'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-xl border border-neonBlue/40 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-neonBlue focus:shadow-neon',
      className,
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
