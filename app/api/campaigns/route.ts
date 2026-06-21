import { NextRequest, NextResponse } from 'next/server'
import { requireEditor } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { Campaign } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { campaignCreateSchema, generateSlug, syncMediaFields } from '@/lib/validations'
import { keyPrograms } from '@/lib/site-content'

const mockCampaigns = keyPrograms.map((program, index) => ({
  slug: program.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  title: program.title,
  description: program.quote,
  fullDescription: program.points.join('\n'),
  image: ['/Activity3.jpeg', '/medicine_camp.jpeg', '/Activity-cloth-help.jpeg'][index],
  galleryImages: [],
  goal: 0,
  raised: 0,
  donors: 0,
  status: 'active',
}))

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

    let filtered = mockCampaigns
    if (status) {
      filtered = mockCampaigns.filter((campaign) => campaign.status === status)
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
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()

    const validation = campaignCreateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const data = syncMediaFields(validation.data)
    const slug = data.slug || generateSlug(data.title)

    const db = await connectDB()

    if (db) {
      const existing = await Campaign.findOne({ slug })
      if (existing) {
        return NextResponse.json({ error: 'Campaign with this slug already exists' }, { status: 409 })
      }

      const campaign = await Campaign.create({ ...data, slug })
      await logAudit(auth.session, 'create', 'campaign', campaign._id.toString())
      return NextResponse.json(campaign, { status: 201 })
    }

    const newCampaign = { ...data, slug, _id: Math.random().toString(36), createdAt: new Date() }
    await logAudit(auth.session, 'create', 'campaign', newCampaign._id)
    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
