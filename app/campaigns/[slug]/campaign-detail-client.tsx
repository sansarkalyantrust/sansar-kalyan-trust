'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Heart, Share2 } from 'lucide-react'

interface Campaign {
  slug: string
  title: string
  heading: string
  quote: string
  points: string[]
  image: string
}

export default function CampaignDetailClient({ campaign }: { campaign: Campaign }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: campaign.quote,
          url: shareUrl,
        })
      } catch {
        return
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto max-w-6xl px-4">
            <Link
              href="/campaigns"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campaigns
            </Link>
          </div>
        </div>

        <section className="py-16 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-primary font-semibold mb-2">{campaign.heading}</p>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {campaign.title}
                  </h1>
                  <p className="text-lg text-primary font-semibold leading-relaxed">
                    {campaign.quote}
                  </p>
                </div>

                <Card className="p-6">
                  <ul className="space-y-3">
                    {campaign.points.map((point) => (
                      <li key={point} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/donate">
                    <Button className="gap-2">
                      <Heart className="h-4 w-4" />
                      Support Program
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share this campaign
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
