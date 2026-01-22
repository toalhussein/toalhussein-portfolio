'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminStatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: 'primary' | 'accent' | 'warning' | 'success'
}

const colorClasses = {
  primary: {
    bg: 'bg-primary/20',
    text: 'text-primary',
    border: 'border-primary/30',
  },
  accent: {
    bg: 'bg-accent/20',
    text: 'text-accent',
    border: 'border-accent/30',
  },
  warning: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
  },
  success: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30',
  },
}

export function AdminStatsCard({ title, value, icon: Icon, color }: AdminStatsCardProps) {
  const colors = colorClasses[color]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        'p-6 rounded-xl bg-surface border transition-all duration-300',
        colors.border,
        'hover:shadow-glow-sm'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-foreground-secondary text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={cn('p-3 rounded-lg', colors.bg)}>
          <Icon size={24} className={colors.text} />
        </div>
      </div>
    </motion.div>
  )
}
