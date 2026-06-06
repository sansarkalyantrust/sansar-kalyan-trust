import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Campaign } from '@/lib/models'
import { campaignCreateSchema, generateSlug } from '@/lib/validations'

// Mock campaigns fallback
const mockCampaigns = [
  {
    slug: 'har-daan-ek-pehchaan',
    title: 'Har Daan Ek Pehchaan',
    description: 'Every donation creates an identity for someone in need. Support our core mission of healthcare, education, and community development.',
    fullDescription: 'Har Daan Ek Pehchaan is our flagship campaign that embodies the spirit of Sansar Kalyan Trust.',
    image: '/Help_activity.jpeg',
    galleryImages: ['/Help_childs.jpeg', '/help_families.jpeg'],
    goal: 500000,
    raised: 125000,
    donors: 450,
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
  },
  {
    slug: 'swasth-samaj-sashakt-bharat',
    title: 'Swasth Samaj Sashakt Bharat',
    description: 'Supporting health camps and medical awareness programs in rural communities.',
    fullDescription: 'Our healthcare initiative brings free medical checkups and medicines to remote villages.',
    image: '/medicine_camp.jpeg',
    galleryImages: ['/medicine_camp2.jpeg'],
    goal: 300000,
    raised: 180000,
    donors: 320,
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2025-06-30',
  },
  {
    slug: 'sadak-suraksha-pashu-raksha',
    title: 'Sadak Suraksha Pashu Raksha',
    description: 'Street animal rescue and care program to protect and support stray animals.',
    image: '/Activity-camp.jpeg',
    goal: 150000,
    raised: 45000,
    donors: 120,
    status: 'active',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
  },
  {
    slug: 'free-night-street-education',
    title: 'Free Night Street Education',
    description: 'Empowering underprivileged children through free education programs.',
    image: '/school_camp.jpeg',
    galleryImages: ['/school_camp2.jpeg', '/gifts_students.jpeg'],
    goal: 200000,
    raised: 75000,
    donors: 200,
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2025-12-31',
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const db = await connectDB()

    if (db) {
      const query: any = {}
      if (status) query.status = status

      const total = await Campaign.countDocuments(query)
      const campaigns = await Campaign.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      return NextResponse.json({
        data: campaigns,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    }

    // Fallback to mock data
    let filtered = mockCampaigns
    if (status) {
      filtered = mockCampaigns.filter(c => c.status === status)
    }

    return NextResponse.json({
      data: filtered,
      pagination: { page: 1, limit: 10, total: filtered.length, pages: 1 },
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = campaignCreateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const data = validation.data
    const slug = data.slug || generateSlug(data.title)

    const db = await connectDB()

    if (db) {
      const existing = await Campaign.findOne({ slug })
      if (existing) {
        return NextResponse.json({ error: 'Campaign with this slug already exists' }, { status: 409 })
      }

      const campaign = await Campaign.create({ ...data, slug })
      return NextResponse.json(campaign, { status: 201 })
    }

    // Mock fallback
    const newCampaign = { ...data, slug, _id: Math.random().toString(36), createdAt: new Date() }
    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
