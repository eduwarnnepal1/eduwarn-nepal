import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/context/language-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// Enhanced SEO metadata for better ranking on SEE, Science, Math, Computer learning searches
export const metadata: Metadata = {
  title: 'EduWarn Nepal | Free SEE Preparation, Science, Math & Computer Learning',
  description: 'Best free online learning platform in Nepal for SEE exam preparation, science education, mathematics tutorials, and computer science courses. Join thousands of students preparing for success.',
  keywords: [
    'SEE preparation Nepal',
    'free learning Nepal',
    'science education',
    'mathematics tutorials',
    'computer science courses',
    'online learning Nepal',
    'exam preparation',
    'grade 10 science',
    'NEB exam prep',
    'education platform Nepal',
    'student resources',
    'career guidance',
  ],
  authors: [{ name: 'EduWarn Nepal' }],
  creator: 'EduWarn Team',
  publisher: 'EduWarn Nepal',
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'EduWarn Nepal | Free SEE Prep & Online Learning Platform',
    description: 'Free online learning for SEE exam preparation, science, mathematics, and computer courses in Nepal. Learn from expert instructors.',
    type: 'website',
    locale: 'en_NP',
    url: 'https://eduwarn.com',
    siteName: 'EduWarn Nepal',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'EduWarn Nepal - Free Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduWarn Nepal | Free SEE Preparation',
    description: 'Learn science, math, computer science and prepare for SEE exams online in Nepal',
    images: ['/logo.jpg'],
  },
  alternates: {
    canonical: 'https://eduwarn.com',
  },
    generator: 'v0.app'
}

// <CHANGE> Added viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        {/* <CHANGE> Added ThemeProvider and LanguageProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
