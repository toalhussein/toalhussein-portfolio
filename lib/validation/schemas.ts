import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const projectSchema = z.object({
  title_ar: z.string().min(3),
  title_en: z.string().min(3),
  summary_ar: z.string().min(10),
  summary_en: z.string().min(10),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  repo_url: z.string().url().optional().or(z.literal('')),
  live_url: z.string().url().optional().or(z.literal('')),
  cover_image_path: z.string().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  tech_ids: z.array(z.string().uuid()).optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>

export const screenshotSchema = z.object({
  image_path: z.string().min(1),
  caption_ar: z.string().optional(),
  caption_en: z.string().optional(),
  sort_order: z.number().int().default(0),
})

export type ScreenshotFormData = z.infer<typeof screenshotSchema>

export const workSchema = z.object({
  company_or_client: z.string().min(2).max(200),
  role_title_ar: z.string().min(3).max(200),
  role_title_en: z.string().min(3).max(200),
  description_ar: z.string().max(2000).optional(),
  description_en: z.string().max(2000).optional(),
  start_date: z.string(),
  end_date: z.string().optional().or(z.literal('')),
  published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

export type WorkFormData = z.infer<typeof workSchema>

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
