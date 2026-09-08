'use client'

import { HTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string
  subtitle?: string
  withHoverEffect?: boolean
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, title, subtitle, withHoverEffect = false, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <section
        ref={ref}
        className={cn(
          'relative overflow-hidden py-20 md:py-28 lg:py-32',
          withHoverEffect && 'group',
          className
        )}
        {...props}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {withHoverEffect && (
          <motion.div
            className={
              'absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 '
            }
            style={{ opacity: isHovered ? 1 : 0 }}
            transition={{ opacity: { duration: 0.3 } }}
          />
        )}

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
            >
              <span className="eyebrow mb-4 block">toalhussein / portfolio</span>
              {title && (
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mt-6 h-1 w-20 origin-left rounded-full bg-gradient-to-r from-primary to-accent"
                style={{ transform: isHovered ? 'scaleX(1.2)' : 'scaleX(1)' }}
              />
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
