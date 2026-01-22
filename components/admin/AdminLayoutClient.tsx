'use client'

import { ReactNode, useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'

interface AdminLayoutClientProps {
  children: ReactNode
  user: {
    email: string
    displayName: string | null
  }
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <AdminHeader 
          user={user}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
