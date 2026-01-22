'use client'

import { AdminStatsCard } from './AdminStatsCard'
import { Briefcase, FolderGit2, Mail, Eye } from 'lucide-react'

interface StatsData {
  projects: number
  works: number
  messages: number
}

interface AdminStatsGridProps {
  stats: StatsData
}

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  const statsConfig = [
    {
      title: 'إجمالي المشاريع',
      value: stats.projects,
      icon: FolderGit2,
      color: 'primary' as const,
    },
    {
      title: 'إجمالي الأعمال',
      value: stats.works,
      icon: Briefcase,
      color: 'accent' as const,
    },
    {
      title: 'رسائل جديدة',
      value: stats.messages,
      icon: Mail,
      color: 'warning' as const,
    },
    {
      title: 'إجمالي المشاهدات',
      value: '—',
      icon: Eye,
      color: 'success' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <AdminStatsCard key={index} {...stat} />
      ))}
    </div>
  )
}
