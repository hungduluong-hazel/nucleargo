import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/context'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NuclearGo — Global Nuclear Program Intelligence',
  description:
    'Track every emerging nuclear program worldwide — from policy decisions to first power.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
