'use client'

import { HTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CardProps {
  variant?: 'default' | 'glow' | 'elevated'
  hoverable?: boolean
  className?: string
  children?: ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, children }, ref) => {
    const baseStyles = 'rounded-xl bg-surface border border-border'
    
    const variants = {
      default: '',
      glow: 'shadow-glow-sm',
      elevated: 'shadow-lg',
    }
    
    const hoverStyles = hoverable
      ? 'transition-all duration-300 hover:border-primary/50 hover:shadow-glow cursor-pointer'
      : ''
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-0', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0 flex items-center gap-4', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardContent, CardFooter }
