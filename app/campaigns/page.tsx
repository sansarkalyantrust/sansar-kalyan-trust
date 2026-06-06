import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { CampaignsList } from '@/components/campaigns-list'

export const metadata = {
  title: 'Campaigns | Sansar Kalyan Trust',
  description: 'View our active campaigns and initiatives to help communities.',
}

export default function CampaignsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="Our Campaigns"
          subtitle="Support causes that matter to our communities."
        />

        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <CampaignsList />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
