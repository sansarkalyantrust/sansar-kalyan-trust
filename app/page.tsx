import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, Stethoscope, BookOpen, Sprout, ArrowRight, Users, Calendar, HandHeart, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { HomepageClient } from '@/components/homepage-client'

export const metadata = {
  title: 'Sansar Kalyan Trust - NGO for Health, Education & Growth',
  description: 'Sansar Kalyan Trust operates across health, nature, humanity, animal welfare, and education.',
  openGraph: {
    title: 'Sansar Kalyan Trust',
    description: 'Empowering Health • Protecting Nature • Serving Humanity • Voicing the Voiceless • Spreading Education',
    url: 'https://www.sansarkalyan.org',
    siteName: 'Sansar Kalyan Trust',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HomepageClient />
      </main>
      <Footer />
    </div>
  )
}
