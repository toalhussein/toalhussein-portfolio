# CV Download Feature - Setup Instructions

This feature allows you to upload and manage your CV through the admin panel and display a download button in the hero section.

## Database Setup

1. **Run the SQL migration** in your Supabase SQL Editor:
   ```sql
   -- Open supabase/cv_storage.sql and run the SQL commands
   ```
   This will:
   - Add `cv_url` column to the profiles table
   - Create policies for CV file access

2. **Create Storage Bucket** in Supabase Dashboard:
   - Go to Storage section
   - Click "New bucket"
   - Name: `cv-files`
   - Make it **Public**
   - Click "Create bucket"

3. **Apply Storage Policies** (already in the SQL file):
   - The migration includes policies for:
     - Public read access
     - Admin-only upload/update/delete

## How to Use

### Upload CV (Admin)

1. Login to admin panel: `/admin/login`
2. Navigate to "السيرة الذاتية" (CV) from the sidebar
3. Click "Choose File" and select your CV (PDF only, max 5MB)
4. Click "Upload CV" or "Replace CV"
5. The CV will be uploaded and the download button will appear on your portfolio

### View CV (Public)

- The "Download CV" button appears automatically in the hero section when a CV is uploaded
- Visitors can click to download your CV
- The button shows:
  - Arabic: "تحميل السيرة الذاتية"
  - English: "Download CV"

## Features

✅ **PDF Only**: Only PDF files are accepted for CV upload
✅ **Size Limit**: Maximum file size is 5MB
✅ **Replace**: Uploading a new CV automatically replaces the old one
✅ **Delete**: Remove your CV anytime from the admin panel
✅ **Public URL**: CV is publicly accessible for download
✅ **Secure**: Only admins can upload/delete CVs
✅ **Bilingual**: Button text adapts to user's language preference

## File Structure

```
lib/
  actions/
    cv.ts                    # Server actions for CV operations
components/
  admin/
    CVUpload.tsx            # CV upload component
app/
  (admin)/
    admin/
      cv/
        page.tsx            # CV management page
  (public)/
    [locale]/
      page.tsx              # Homepage (includes CV button)
components/
  sections/
    HeroSection.tsx         # Hero section with CV download button
supabase/
  cv_storage.sql            # Database migration for CV feature
```

## Security

- Only users with `admin` role can upload/delete CVs
- Public can only read/download CVs
- File type validation (PDF only)
- File size validation (max 5MB)
- Old CV files are automatically deleted when replaced

## Troubleshooting

**CV upload fails:**
- Make sure the storage bucket `cv-files` exists and is public
- Check that storage policies are applied correctly
- Verify file is PDF and under 5MB

**Download button doesn't appear:**
- Check if CV is uploaded in admin panel
- Verify the CV URL is saved in the profiles table
- Clear cache and refresh the page

**Permission denied:**
- Ensure your user has `admin` role in the profiles table
- Check storage policies are correctly applied
