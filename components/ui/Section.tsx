'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string
  subtitle?: string
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, title, subtitle, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('py-20 md:py-28', className)}
        {...props}
      >
        <div className="container mx-auto px-4 md:px-6">
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 md:mb-16"
            >
              {title && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
              <div className="mt-6 w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </motion.div>
          )}
          {children}
        </div>
      </section>
    )
  }
)

Section.displayName = 'Section'

export { Section }
