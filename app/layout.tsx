import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "الحسين عبدالصبور | مطور تطبيقات الموبايل",
  description: "مطور تطبيقات موبايل محترف متخصص في Flutter و Kotlin و تطوير التطبيقات المتعددة المنصات",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    siteName: "toalhussein",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@toalhussein",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
