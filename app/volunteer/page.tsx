import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { VolunteerForm } from '@/components/volunteer-form'

export const metadata = {
  title: 'Volunteer | Sansar Kalyan Trust',
  description: 'Join our volunteer program and help us make a difference in communities.',
}

export default function VolunteerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="Volunteer"
          subtitle="Join our team and serve your community."
        />

        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-2xl px-4">
            <VolunteerForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
