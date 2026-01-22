'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, LogOut, User, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface AdminHeaderProps {
  user: {
    email: string
    displayName: string | null
  }
  onToggleMobileMenu?: () => void
}

export function AdminHeader({ user, onToggleMobileMenu }: AdminHeaderProps) {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }
  
  return (
    <header className="h-16 bg-surface border-b border-border px-4 lg:px-8 flex items-center justify-between">
      {/* Mobile menu button */}
      <button
        onClick={onToggleMobileMenu}
        className="lg:hidden p-2 text-foreground-secondary hover:text-foreground"
      >
        <Menu size={24} />
      </button>
      
      {/* Page title - can be dynamic */}
      <div className="hidden lg:block">
        <h2 className="text-lg font-semibold text-foreground">لوحة التحكم</h2>
      </div>
      
      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-light transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={18} className="text-primary" />
          </div>
          <span className="hidden sm:block text-sm text-foreground">
            {user.displayName || user.email}
          </span>
          <ChevronDown size={16} className="text-foreground-secondary" />
        </button>
        
        <AnimatePresence>
          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute end-0 mt-2 w-48 py-2 bg-surface border border-border rounded-lg shadow-lg z-50"
              >
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.displayName || 'المدير'}
                  </p>
                  <p className="text-xs text-foreground-secondary truncate">
                    {user.email}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span>تسجيل الخروج</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
