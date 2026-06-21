import { notFound } from 'next/navigation'
import CampaignDetailClient from './campaign-detail-client'
import { Metadata } from 'next'
import { keyPrograms } from '@/lib/site-content'

interface CampaignDetailProps {
  params: Promise<{ slug: string }>
}

const slugFor = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

async function getCampaign(slug: string) {
  const program = keyPrograms.find((item) => slugFor(item.heading) === slug)
  if (!program) return null

  return {
    slug,
    title: program.title,
    heading: program.heading,
    quote: program.quote,
    points: program.points,
    image:
      slug === 'har-daan-ek-pehchaan'
        ? '/Activity3.jpeg'
        : slug === 'swasth-samaj-sashakt-bharat'
          ? '/medicine_camp.jpeg'
          : '/Activity-cloth-help.jpeg',
  }
}

export async function generateMetadata({ params }: CampaignDetailProps): Promise<Metadata> {
  const { slug } = await params
  const campaign = await getCampaign(slug)

  if (!campaign) {
    return {
      title: 'Campaign Not Found | Sansar Kalyan Trust',
    }
  }

  return {
    title: `${campaign.title} | Sansar Kalyan Trust`,
    description: campaign.quote,
  }
}

export default async function CampaignDetailPage({ params }: CampaignDetailProps) {
  const { slug } = await params
  const campaign = await getCampaign(slug)

  if (!campaign) {
    notFound()
  }

  return <CampaignDetailClient campaign={campaign} />
}
