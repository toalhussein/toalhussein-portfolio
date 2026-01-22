'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-surface-light text-foreground-secondary border-border',
      primary: 'bg-primary/20 text-primary border-primary/30',
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
