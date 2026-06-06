import { MetadataRoute } from 'next'
import { Campaign, Blog, Event } from '@/lib/models'
import { connectDB, isMongoConnected } from '@/lib/mongodb'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/campaigns`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  if (await isMongoConnected()) {
    try {
      await connectDB()

      // Get all active campaigns
      const campaigns = await Campaign.find({ status: 'active' })
        .select('slug updatedAt')
        .lean()

      const campaignRoutes: MetadataRoute.Sitemap = campaigns.map((campaign: any) => ({
        url: `${baseUrl}/campaigns/${campaign.slug}`,
        lastModified: campaign.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))

      // Get all published blogs
      const blogs = await Blog.find({ published: true })
        .select('slug updatedAt')
        .lean()

      const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updatedAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))

      // Get all events
      const events = await Event.find({})
        .select('slug updatedAt')
        .lean()

      const eventRoutes: MetadataRoute.Sitemap = events.map((event: any) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: event.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }))

      return [...staticRoutes, ...campaignRoutes, ...blogRoutes, ...eventRoutes]
    } catch (error) {
      console.error('Error generating sitemap:', error)
      return staticRoutes
    }
  }

  return staticRoutes
}
