import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الحسين عبدالصبور | مطور تطبيقات الموبايل',
  description: 'مطور تطبيقات موبايل محترف متخصص في Flutter و Kotlin',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
