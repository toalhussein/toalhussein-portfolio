-- ============================================
-- Portfolio Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name', 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TECH TABLE (technologies/skills)
-- ============================================
CREATE TABLE public.tech (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT,
  category TEXT NOT NULL DEFAULT 'tools' CHECK (category IN ('mobile', 'backend', 'database', 'devops', 'tools', 'design')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial tech stack
INSERT INTO public.tech (name, category, sort_order) VALUES
  ('Flutter', 'mobile', 1),
  ('Kotlin', 'mobile', 2),
  ('Android', 'mobile', 3),
  ('GetX', 'mobile', 4),
  ('Firebase', 'backend', 5),
  ('Supabase', 'backend', 6),
  ('REST API', 'backend', 7),
  ('C++', 'backend', 8),
  ('Qt', 'backend', 9),
  ('PostgreSQL', 'database', 10),
  ('MySQL', 'database', 11),
  ('SQLite', 'database', 12),
  ('GitHub Actions', 'devops', 13),
  ('GitHub', 'devops', 14),
  ('Postman', 'tools', 15),
  ('Google Maps', 'tools', 16),
  ('Figma', 'design', 17);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary_ar TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  repo_url TEXT,
  live_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  cover_image_path TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PROJECT_TECH TABLE (many-to-many)
-- ============================================
CREATE TABLE public.project_tech (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  tech_id UUID NOT NULL REFERENCES public.tech(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tech_id)
);

-- ============================================
-- PROJECT_SCREENSHOTS TABLE
-- ============================================
CREATE TABLE public.project_screenshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  caption_ar TEXT,
  caption_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- WORKS TABLE (experience/timeline)
-- ============================================
CREATE TABLE public.works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_or_client TEXT NOT NULL,
  role_title_ar TEXT NOT NULL,
  role_title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE (contact form)
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'ar' CHECK (locale IN ('ar', 'en')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tech ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- TECH policies (public read, admin write)
CREATE POLICY "Public can view tech" ON public.tech
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tech" ON public.tech
  FOR ALL USING (public.is_admin());

-- PROJECTS policies
CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can view all projects" ON public.projects
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE USING (public.is_admin());

-- PROJECT_TECH policies
CREATE POLICY "Public can view project_tech" ON public.project_tech
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage project_tech" ON public.project_tech
  FOR ALL USING (public.is_admin());

-- PROJECT_SCREENSHOTS policies
CREATE POLICY "Public can view project_screenshots" ON public.project_screenshots
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage project_screenshots" ON public.project_screenshots
  FOR ALL USING (public.is_admin());

-- WORKS policies
CREATE POLICY "Public can view published works" ON public.works
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can view all works" ON public.works
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert works" ON public.works
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update works" ON public.works
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete works" ON public.works
  FOR DELETE USING (public.is_admin());

-- MESSAGES policies
CREATE POLICY "Public can insert messages" ON public.messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view messages" ON public.messages
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update messages" ON public.messages
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete messages" ON public.messages
  FOR DELETE USING (public.is_admin());

-- ============================================
-- STORAGE BUCKET (for project images)
-- ============================================
-- Run this separately in Supabase Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('project-images', 'project-images', true);

-- CREATE POLICY "Public can view project images"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'project-images');

-- CREATE POLICY "Admins can upload project images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'project-images' AND public.is_admin());

-- CREATE POLICY "Admins can update project images"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'project-images' AND public.is_admin());

-- CREATE POLICY "Admins can delete project images"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'project-images' AND public.is_admin());

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
