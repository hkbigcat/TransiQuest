import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        default:
          'bg-neonBlue text-black hover:shadow-neon hover:scale-[1.02] active:scale-95',
        secondary:
          'border border-neonBlue/40 bg-panel text-neonBlue hover:bg-neonBlue/15',
        ghost: 'text-neonBlue hover:bg-neonBlue/10',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
