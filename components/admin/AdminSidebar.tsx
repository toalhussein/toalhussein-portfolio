'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Mail,
  Settings,
  Home,
  X,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: LayoutDashboard, label: 'نظرة عامة', href: '/admin' },
  { icon: FolderGit2, label: 'المشاريع', href: '/admin/projects' },
  { icon: Briefcase, label: 'الأعمال', href: '/admin/works' },
  { icon: Mail, label: 'الرسائل', href: '/admin/messages' },
  { icon: FileText, label: 'السيرة الذاتية', href: '/admin/cv' },
  { icon: Settings, label: 'الإعدادات', href: '/admin/settings' },
]

interface AdminSidebarProps {
  isMobileMenuOpen?: boolean
  onCloseMobileMenu?: () => void
}

export function AdminSidebar({ isMobileMenuOpen = false, onCloseMobileMenu }: AdminSidebarProps) {
  const pathname = usePathname()
  
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2" onClick={onCloseMobileMenu}>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            toalhussein
          </span>
        </Link>
        {/* Close button for mobile */}
        {onCloseMobileMenu && (
          <button
            onClick={onCloseMobileMenu}
            className="lg:hidden p-2 text-foreground-secondary hover:text-foreground"
          >
            <X size={24} />
          </button>
        )}
        <p className="text-xs text-foreground-secondary mt-1 hidden lg:block absolute top-14 start-6">لوحة التحكم</p>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onCloseMobileMenu}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative',
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-foreground-secondary hover:bg-surface-light hover:text-foreground'
                  )}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute start-0 w-1 h-8 bg-primary rounded-full"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {/* Back to site */}
      <div className="p-4 border-t border-border">
        <Link
          href="/ar"
          onClick={onCloseMobileMenu}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground-secondary hover:bg-surface-light hover:text-foreground transition-colors"
        >
          <Home size={20} />
          <span>العودة للموقع</span>
        </Link>
      </div>
    </>
  )
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 min-h-screen bg-surface border-e border-border hidden lg:flex lg:flex-col">
        <SidebarContent />
      </aside>
      
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobileMenu}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 start-0 bottom-0 w-64 bg-surface border-e border-border z-50 lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
