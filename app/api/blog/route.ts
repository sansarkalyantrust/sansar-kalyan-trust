import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Blog } from '@/lib/models'
import { blogCreateSchema, generateSlug } from '@/lib/validations'

const mockBlogPosts = [
  {
    slug: 'health-camp-impact-story',
    title: 'Health Camp Impact: 500+ Lives Touched',
    description: 'Read how our health camps are bringing medical care to remote villages and changing lives.',
    image: '/medicine_camp.jpeg',
    category: 'Healthcare',
    tags: ['health camp', 'rural healthcare'],
    author: 'Sansar Kalyan Trust',
    readTime: 4,
    published: true,
    createdAt: new Date('2024-06-10').toISOString(),
  },
  {
    slug: 'education-initiative-success',
    title: 'Breaking Barriers: Night Education Success',
    description: 'Stories of children who are now pursuing their dreams through our free night education program.',
    image: '/school_camp.jpeg',
    category: 'Education',
    tags: ['education', 'night school'],
    author: 'Sansar Kalyan Trust',
    readTime: 5,
    published: true,
    createdAt: new Date('2024-06-05').toISOString(),
  },
  {
    slug: 'environmental-conservation-drive',
    title: 'Green Future: Our Tree Plantation Journey',
    description: 'How our community is working together to plant 10,000 trees and create a sustainable environment.',
    image: '/Activity-plants.jpeg',
    category: 'Environment',
    tags: ['tree plantation', 'environment'],
    author: 'Sansar Kalyan Trust',
    readTime: 4,
    published: true,
    createdAt: new Date('2024-06-01').toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const published = searchParams.get('published')

    const db = await connectDB()

    if (db) {
      const query: any = {}
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ]
      }
      if (category) query.category = category
      if (published !== null && published !== undefined) query.published = published === 'true'

      const total = await Blog.countDocuments(query)
      const blogs = await Blog.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      return NextResponse.json({
        data: blogs,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      })
    }

    // Fallback
    let filtered = mockBlogPosts
    if (search) {
      const s = search.toLowerCase()
      filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s))
    }
    if (category) filtered = filtered.filter(p => p.category === category)

    return NextResponse.json({
      data: filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      pagination: { page: 1, limit: 10, total: filtered.length, pages: 1 },
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = blogCreateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = validation.data
    const slug = data.slug || generateSlug(data.title)
    const readTime = Math.ceil((data.content?.length || 0) / 1000)

    const db = await connectDB()
    if (db) {
      const blog = await Blog.create({ ...data, slug, readTime: readTime || 5 })
      return NextResponse.json(blog, { status: 201 })
    }

    const newPost = { ...data, slug, readTime, _id: Math.random().toString(36), createdAt: new Date() }
    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}
