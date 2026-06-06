import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { EventsList } from '@/components/events-list'

export const metadata = {
  title: 'Events | Sansar Kalyan Trust',
  description: 'Join our upcoming events and activities in the community.',
}

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="Events"
          subtitle="Join our camps, drives, and community programs."
        />

        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <EventsList />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
