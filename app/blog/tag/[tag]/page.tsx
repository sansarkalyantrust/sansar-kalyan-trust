import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { BlogList } from '@/components/blog-list'

export const metadata = {
  title: 'Blog Tag | Sansar Kalyan Trust',
  description: 'Browse blog posts by tag.',
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PageHero title={`Tag: ${decoded}`} subtitle="Articles with this tag" />
        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <BlogList tag={decoded} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
