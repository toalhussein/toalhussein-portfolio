'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  bucket?: string
  folder?: string
  label?: string
  aspectRatio?: 'square' | 'video' | 'portrait'
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  bucket = 'project-images',
  folder = 'covers',
  label = 'رفع صورة',
  aspectRatio = 'video',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[9/16]',
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      
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
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      onChange(urlData.publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError('فشل في رفع الصورة')
    } finally {
      setIsUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (!value || !onRemove) return

    try {
      const supabase = createClient()
      
      // Extract path from URL
      const url = new URL(value)
      const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`)
      if (pathParts.length > 1) {
        await supabase.storage.from(bucket).remove([pathParts[1]])
      }
      
      onRemove()
    } catch (err) {
      console.error('Remove error:', err)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      
      {value ? (
        <div className={`relative ${aspectClasses[aspectRatio]} rounded-lg overflow-hidden bg-surface-light border border-border`}>
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={`relative ${aspectClasses[aspectRatio]} rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-surface-light cursor-pointer transition-colors flex flex-col items-center justify-center gap-2`}
        >
          {isUploading ? (
            <Loader2 size={32} className="text-primary animate-spin" />
          ) : (
            <>
              <Upload size={32} className="text-foreground-secondary" />
              <span className="text-sm text-foreground-secondary">
                اضغط لرفع صورة
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
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
