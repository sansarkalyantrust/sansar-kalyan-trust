import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { ContentCard } from '@/components/content-card'
import { connectDB } from '@/lib/mongodb'
import { ImpactStory } from '@/lib/models'
import Link from 'next/link'

export const metadata = {
  title: 'Impact Stories | Sansar Kalyan Trust',
  description: 'Real stories of transformation from the communities we serve.',
}

const fallbackStories = [
  {
    slug: 'health-camp-village',
    title: 'Health Camp Transforms Remote Village',
    content: 'Our health camp brought medical care to over 500 villagers who had never seen a doctor.',
    featuredImageAsset: null,
  },
]

export default async function ImpactStoriesPage() {
  let stories: any[] = fallbackStories

  const db = await connectDB()
  if (db) {
    const docs = await ImpactStory.find({ status: 'published' }).sort({ createdAt: -1 }).lean()
    if (docs.length > 0) stories = docs
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PageHero title="Impact Stories" subtitle="Real stories of change from the field" />
        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <Link key={story.slug} href={`/impact-stories/${story.slug}`}>
                  <ContentCard
                    image={story.featuredImageAsset?.secure_url || story.image}
                    alt={story.title}
                    title={story.title}
                    description={typeof story.content === 'string' ? story.content.slice(0, 120) + '...' : ''}
                    href={`/impact-stories/${story.slug}`}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
