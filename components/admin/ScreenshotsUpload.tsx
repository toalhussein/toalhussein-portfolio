'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Screenshot {
  id?: string
  image_path: string
  caption_ar?: string
  caption_en?: string
  sort_order: number
}

interface ScreenshotsUploadProps {
  value: Screenshot[]
  onChange: (screenshots: Screenshot[]) => void
  bucket?: string
  folder?: string
  label?: string
  maxFiles?: number
}

export function ScreenshotsUpload({
  value = [],
  onChange,
  bucket = 'project-images',
  folder = 'screenshots',
  label = 'لقطات الشاشة',
  maxFiles = 10,
}: ScreenshotsUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (value.length + files.length > maxFiles) {
      setError(`الحد الأقصى ${maxFiles} صور`)
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const newScreenshots: Screenshot[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type
        if (!file.type.startsWith('image/')) {
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          continue
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // Upload file
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          continue
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path)

        newScreenshots.push({
          image_path: urlData.publicUrl,
          sort_order: value.length + i,
        })
      }

      onChange([...value, ...newScreenshots])
    } catch (err) {
      console.error('Upload error:', err)
      setError('فشل في رفع بعض الصور')
    } finally {
      setIsUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const handleRemove = async (index: number) => {
    const screenshot = value[index]
    
    try {
      const supabase = createClient()
      
      // Extract path from URL and delete from storage
      const url = new URL(screenshot.image_path)
      const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`)
      if (pathParts.length > 1) {
        await supabase.storage.from(bucket).remove([pathParts[1]])
      }
    } catch (err) {
      console.error('Remove error:', err)
    }

    // Remove from list
    const newScreenshots = value.filter((_, i) => i !== index)
    // Update sort orders
    newScreenshots.forEach((s, i) => {
      s.sort_order = i
    })
    onChange(newScreenshots)
  }

  const handleCaptionChange = (index: number, field: 'caption_ar' | 'caption_en', captionValue: string) => {
    const newScreenshots = [...value]
    newScreenshots[index] = {
      ...newScreenshots[index],
      [field]: captionValue,
    }
    onChange(newScreenshots)
  }

  const moveScreenshot = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= value.length) return
    
    const newScreenshots = [...value]
    const [moved] = newScreenshots.splice(fromIndex, 1)
    newScreenshots.splice(toIndex, 0, moved)
    
    // Update sort orders
    newScreenshots.forEach((s, i) => {
      s.sort_order = i
    })
    
    onChange(newScreenshots)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      {/* Uploaded screenshots grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((screenshot, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden bg-surface-light border border-border"
            >
              <div className="aspect-[9/16] relative">
                <Image
                  src={screenshot.image_path}
                  alt={`Screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-between p-2">
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveScreenshot(index, index - 1)}
                      disabled={index === 0}
                      className="p-1 rounded bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white text-xs"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveScreenshot(index, index + 1)}
                      disabled={index === value.length - 1}
                      className="p-1 rounded bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white text-xs"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Caption inputs */}
              <div className="p-2 space-y-1">
                <input
                  type="text"
                  placeholder="وصف بالعربي"
                  value={screenshot.caption_ar || ''}
                  onChange={(e) => handleCaptionChange(index, 'caption_ar', e.target.value)}
                  className="w-full text-xs px-2 py-1 rounded bg-surface border border-border text-foreground"
                />
                <input
                  type="text"
                  placeholder="Caption in English"
                  value={screenshot.caption_en || ''}
                  onChange={(e) => handleCaptionChange(index, 'caption_en', e.target.value)}
                  className="w-full text-xs px-2 py-1 rounded bg-surface border border-border text-foreground"
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {value.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-surface-light cursor-pointer transition-colors p-6 flex flex-col items-center justify-center gap-2"
        >
          {isUploading ? (
            <Loader2 size={32} className="text-primary animate-spin" />
          ) : (
            <>
              <Upload size={32} className="text-foreground-secondary" />
              <span className="text-sm text-foreground-secondary">
                اضغط لإضافة لقطات شاشة ({value.length}/{maxFiles})
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
        disabled={isUploading}
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
