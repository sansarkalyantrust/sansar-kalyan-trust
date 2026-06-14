import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { BlogList } from '@/components/blog-list'

export const metadata = {
  title: 'Blog Category | Sansar Kalyan Trust',
  description: 'Browse blog posts by category.',
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const decoded = decodeURIComponent(category)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PageHero title={`Category: ${decoded}`} subtitle="Articles in this category" />
        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <BlogList category={decoded} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
