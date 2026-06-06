import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { BlogList } from '@/components/blog-list'

export const metadata = {
  title: 'Blog | Sansar Kalyan Trust',
  description: 'Read our latest articles and stories about our impact and initiatives.',
}

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="Blog"
          subtitle="Stories, news, and impact from the field."
        />

        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <BlogList />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
