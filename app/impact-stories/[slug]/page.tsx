import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { connectDB } from '@/lib/mongodb'
import { ImpactStory } from '@/lib/models'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { SafeHtml } from '@/components/safe-html'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const db = await connectDB()
  if (db) {
    const story = await ImpactStory.findOne({ slug, status: 'published' }).lean()
    if (story) {
      return {
        title: `${story.title} | Impact Stories`,
        description: story.seoDescription || story.content?.slice(0, 160),
      }
    }
  }
  return { title: 'Impact Story | Sansar Kalyan Trust' }
}

export default async function ImpactStoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let story: any = null

  const db = await connectDB()
  if (db) {
    story = await ImpactStory.findOne({ slug, status: 'published' }).lean()
  }

  if (!story) notFound()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto max-w-4xl px-4">
            <Link href="/impact-stories" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Impact Stories
            </Link>
          </div>
        </div>

        <article className="py-12 md:py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{story.title}</h1>

            {story.featuredImageAsset?.secure_url && (
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                <Image src={story.featuredImageAsset.secure_url} alt={story.title} fill className="object-cover" />
              </div>
            )}

            <SafeHtml html={story.content} className="prose prose-lg max-w-none dark:prose-invert" />

            {story.galleryAssets && story.galleryAssets.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                {story.galleryAssets.map((asset: { public_id: string; secure_url: string }) => (
                  <div key={asset.public_id} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image src={asset.secure_url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
