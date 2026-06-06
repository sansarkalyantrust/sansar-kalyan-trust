import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sansar Kalyan Trust - NGO for Health, Education & Growth',
  description: 'Sansar Kalyan Trust is dedicated to providing healthcare, education, and community support to underprivileged communities in India.',
  generator: 'v0.app',
  keywords: 'NGO, healthcare, education, community development, charity, India',
  authors: [{ name: 'Sansar Kalyan Trust' }],
  openGraph: {
    title: 'Sansar Kalyan Trust',
    description: 'Dedicated to health, education, and community development',
    url: 'https://www.sansarkalyan.org',
    siteName: 'Sansar Kalyan Trust',
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
