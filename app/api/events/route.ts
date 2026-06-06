import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Event } from '@/lib/models'
import { eventCreateSchema, generateSlug } from '@/lib/validations'

const mockEvents = [
  {
    slug: 'health-camp-rohtak',
    title: 'Free Health Camp - Rohtak',
    description: 'Medical checkup and health awareness program for the community.',
    image: '/medicine_camp.jpeg',
    date: new Date('2024-12-15').toISOString(),
    time: '9:00 AM - 5:00 PM',
    venue: 'Community Hall, Rohtak',
    type: 'Health Camp',
    status: 'upcoming',
  },
  {
    slug: 'education-drive',
    title: 'Free Night Education Drive',
    description: 'Interactive learning session for underprivileged children.',
    image: '/school_camp.jpeg',
    date: new Date('2024-12-20').toISOString(),
    time: '6:00 PM - 9:00 PM',
    venue: 'Open Ground, Sector 5, Rohtak',
    type: 'Education',
    status: 'upcoming',
  },
  {
    slug: 'tree-plantation',
    title: 'Tree Plantation Drive',
    description: 'Community environmental conservation initiative.',
    image: '/Activity-plants.jpeg',
    date: new Date('2024-12-22').toISOString(),
    time: '7:00 AM - 12:00 PM',
    venue: 'Village Park, Rohtak',
    type: 'Environment',
    status: 'upcoming',
  },
  {
    slug: 'cloth-distribution',
    title: 'Winter Cloth Distribution',
    description: '500+ families benefited from cloth distribution drive.',
    image: '/help_cloth_charity.jpeg',
    date: new Date('2024-03-15').toISOString(),
    time: '10:00 AM - 4:00 PM',
    venue: 'Community Center, Rohtak',
    type: 'Charity',
    status: 'completed',
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const db = await connectDB()

    if (db) {
      const query: any = {}
      if (status) query.status = status
      if (type) query.type = type

      const total = await Event.countDocuments(query)
      const events = await Event.find(query)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      return NextResponse.json({
        data: events,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      })
    }

    let filtered = mockEvents
    if (status) filtered = filtered.filter(e => e.status === status)
    if (type) filtered = filtered.filter(e => e.type === type)

    return NextResponse.json({
      data: filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      pagination: { page: 1, limit: 10, total: filtered.length, pages: 1 },
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = eventCreateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = validation.data
    const slug = data.slug || generateSlug(data.title)

    const db = await connectDB()
    if (db) {
      const event = await Event.create({ ...data, slug })
      return NextResponse.json(event, { status: 201 })
    }

    const newEvent = { ...data, slug, _id: Math.random().toString(36), createdAt: new Date() }
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
