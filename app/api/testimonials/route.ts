import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Testimonial } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'

    const db = await connectDB()
    if (db) {
      const query: any = {}
      if (activeOnly) query.isActive = true

      const testimonials = await Testimonial.find(query).sort({ order: 1 }).lean()
      return NextResponse.json({ data: testimonials })
    }

    return NextResponse.json({ data: [] })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.designation || !body.message) {
      return NextResponse.json({ error: 'Name, designation, and message are required' }, { status: 400 })
    }

    const db = await connectDB()
    if (db) {
      const testimonial = await Testimonial.create(body)
      return NextResponse.json(testimonial, { status: 201 })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
