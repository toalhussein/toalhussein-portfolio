'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Tech } from '@/types'
import { X } from 'lucide-react'

interface TechSelectorProps {
  value: string[] // Array of tech IDs
  onChange: (techIds: string[]) => void
}

export function TechSelector({ value, onChange }: TechSelectorProps) {
  const [allTech, setAllTech] = useState<Tech[]>([])
  const [selectedTech, setSelectedTech] = useState<Tech[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Fetch all available tech
  useEffect(() => {
    const fetchTech = async () => {
      const supabase = createClient()
      const { data } = await (supabase as any)
        .from('tech')
        .select('*')
        .order('name', { ascending: true })
      
      setAllTech(data || [])
    }
    fetchTech()
  }, [])

  // Update selected tech when value changes
  useEffect(() => {
    if (allTech.length > 0 && value.length > 0) {
      const selected = allTech.filter(tech => value.includes(tech.id))
      setSelectedTech(selected)
    } else {
      setSelectedTech([])
    }
  }, [value, allTech])

  const filteredTech = allTech.filter(tech => 
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !value.includes(tech.id)
  )

  const handleAdd = (tech: Tech) => {
    onChange([...value, tech.id])
    setSearchTerm('')
    setIsOpen(false)
  }

  const handleRemove = (techId: string) => {
    onChange(value.filter(id => id !== techId))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        التقنيات المستخدمة
      </label>
      
      {/* Selected Technologies */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTech.map(tech => (
          <div
            key={tech.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-sm"
          >
            <span>{tech.name}</span>
            <button
              type="button"
              onClick={() => handleRemove(tech.id)}
              className="hover:text-primary-light transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Search/Add */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="ابحث عن تقنية..."
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary transition-colors"
        />

        {/* Dropdown */}
        {isOpen && filteredTech.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredTech.map(tech => (
              <button
                key={tech.id}
                type="button"
                onClick={() => handleAdd(tech)}
                className="w-full text-left px-4 py-2 hover:bg-surface-light transition-colors text-foreground"
              >
                {tech.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
