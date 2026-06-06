import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Gallery } from '@/lib/models'

const mockGallery = [
  { _id: '1', title: 'Health Camp 2024', image: '/medicine_camp.jpeg', category: 'Healthcare', description: 'Free health checkup camp', order: 1 },
  { _id: '2', title: 'Medicine Distribution', image: '/medicine_camp2.jpeg', category: 'Healthcare', description: 'Free medicine distribution', order: 2 },
  { _id: '3', title: 'Education Program', image: '/school_camp.jpeg', category: 'Education', description: 'Night education classes', order: 3 },
  { _id: '4', title: 'Student Gifts', image: '/gifts_students.jpeg', category: 'Education', description: 'Books and stationery', order: 4 },
  { _id: '5', title: 'Tree Plantation', image: '/Activity-plants.jpeg', category: 'Environment', description: 'Community tree plantation', order: 5 },
  { _id: '6', title: 'Group Plantation', image: '/Activity-group-plants.jpeg', category: 'Environment', description: 'Volunteers planting trees', order: 6 },
  { _id: '7', title: 'Cloth Distribution', image: '/help_cloth_charity.jpeg', category: 'Charity', description: 'Warm clothes distribution', order: 7 },
  { _id: '8', title: 'Community Help', image: '/Help_activity.jpeg', category: 'Community', description: 'Supporting families', order: 8 },
  { _id: '9', title: 'Children Support', image: '/Help_childs.jpeg', category: 'Community', description: 'Helping children', order: 9 },
  { _id: '10', title: 'Family Aid', image: '/help_families.jpeg', category: 'Community', description: 'Providing essentials', order: 10 },
  { _id: '11', title: 'Community Camp', image: '/Activity-camp.jpeg', category: 'Events', description: 'Community awareness camp', order: 11 },
  { _id: '12', title: 'Charity Event', image: '/Activity-charity.jpeg', category: 'Charity', description: 'Charity event', order: 12 },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')

    const db = await connectDB()

    if (db) {
      const query: any = {}
      if (category && category !== 'All') query.category = category

      const total = await Gallery.countDocuments(query)
      const items = await Gallery.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      return NextResponse.json({
        data: items,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      })
    }

    let filtered = mockGallery
    if (category && category !== 'All') filtered = filtered.filter(g => g.category === category)

    return NextResponse.json({
      data: filtered,
      pagination: { page: 1, limit: 20, total: filtered.length, pages: 1 },
    })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 })
    }

    const db = await connectDB()
    if (db) {
      const item = await Gallery.create(body)
      return NextResponse.json(item, { status: 201 })
    }

    const newItem = { ...body, _id: Math.random().toString(36), createdAt: new Date() }
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery item:', error)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const db = await connectDB()
    if (db) {
      await Gallery.findByIdAndDelete(id)
      return NextResponse.json({ success: true, message: 'Gallery item deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
