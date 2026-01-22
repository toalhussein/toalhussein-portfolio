// Database types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
      tech: {
        Row: {
          id: string
          name: string
          icon: string | null
          category: 'mobile' | 'backend' | 'database' | 'devops' | 'tools' | 'design'
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          category?: 'mobile' | 'backend' | 'database' | 'devops' | 'tools' | 'design'
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          category?: 'mobile' | 'backend' | 'database' | 'devops' | 'tools' | 'design'
          sort_order?: number
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title_ar: string
          title_en: string
          summary_ar: string
          summary_en: string
          description_ar: string | null
          description_en: string | null
          slug: string
          repo_url: string | null
          live_url: string | null
          featured: boolean
          cover_image_path: string | null
          features_ar: string[] | null
          features_en: string[] | null
          published: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title_ar: string
          title_en: string
          summary_ar: string
          summary_en: string
          description_ar?: string | null
          description_en?: string | null
          slug: string
          repo_url?: string | null
          live_url?: string | null
          featured?: boolean
          cover_image_path?: string | null
          features_ar?: string[] | null
          features_en?: string[] | null
          published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_ar?: string
          title_en?: string
          summary_ar?: string
          summary_en?: string
          description_ar?: string | null
          description_en?: string | null
          slug?: string
          repo_url?: string | null
          live_url?: string | null
          featured?: boolean
          cover_image_path?: string | null
          features_ar?: string[] | null
          features_en?: string[] | null
          published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      project_tech: {
        Row: {
          project_id: string
          tech_id: string
        }
        Insert: {
          project_id: string
          tech_id: string
        }
        Update: {
          project_id?: string
          tech_id?: string
        }
      }
      project_screenshots: {
        Row: {
          id: string
          project_id: string
          image_path: string
          caption_ar: string | null
          caption_en: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          image_path: string
          caption_ar?: string | null
          caption_en?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          image_path?: string
          caption_ar?: string | null
          caption_en?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      works: {
        Row: {
          id: string
          company_or_client: string
          role_title_ar: string
          role_title_en: string
          description_ar: string | null
          description_en: string | null
          start_date: string
          end_date: string | null
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_or_client: string
          role_title_ar: string
          role_title_en: string
          description_ar?: string | null
          description_en?: string | null
          start_date: string
          end_date?: string | null
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_or_client?: string
          role_title_ar?: string
          role_title_en?: string
          description_ar?: string | null
          description_en?: string | null
          start_date?: string
          end_date?: string | null
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          locale: 'ar' | 'en'
          status: 'new' | 'read' | 'archived'
          ip_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          locale?: 'ar' | 'en'
          status?: 'new' | 'read' | 'archived'
          ip_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          locale?: 'ar' | 'en'
          status?: 'new' | 'read' | 'archived'
          ip_hash?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type Profile = Tables<'profiles'>
export type Tech = Tables<'tech'>
export type Project = Tables<'projects'>
export type ProjectTech = Tables<'project_tech'>
export type ProjectScreenshot = Tables<'project_screenshots'>
export type Work = Tables<'works'>
export type Message = Tables<'messages'>

// Extended types with relations
export type ProjectWithTech = Project & {
  tech: Tech[]
}

export type ProjectWithScreenshots = Project & {
  screenshots: ProjectScreenshot[]
}

export type ProjectFull = Project & {
  tech: Tech[]
  screenshots: ProjectScreenshot[]
}
