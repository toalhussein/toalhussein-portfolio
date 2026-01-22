import { redirect } from 'next/navigation'
import { defaultLocale } from '@/lib/i18n'

// Redirect root to default locale (Arabic)
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}

