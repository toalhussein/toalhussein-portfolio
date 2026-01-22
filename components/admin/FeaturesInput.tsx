'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui'

interface FeaturesInputProps {
  label: string
  value: string[]
  onChange: (features: string[]) => void
  placeholder?: string
  dir?: 'ltr' | 'rtl'
}

export function FeaturesInput({ 
  label, 
  value, 
  onChange, 
  placeholder = 'أضف ميزة...',
  dir = 'rtl'
}: FeaturesInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      {/* List of features */}
      {value.length > 0 && (
        <div className="space-y-2 mb-3">
          {value.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-surface border border-border rounded-lg"
            >
              <span className="flex-1 text-foreground" dir={dir}>{feature}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1 text-foreground-secondary hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input for new feature */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          dir={dir}
          className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary transition-colors"
        />
        <Button
          type="button"
          onClick={handleAdd}
          variant="primary"
          disabled={!inputValue.trim()}
        >
          <Plus size={18} />
          إضافة
        </Button>
      </div>
    </div>
  )
}
