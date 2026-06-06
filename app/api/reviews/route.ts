import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Review } from '@/lib/models'
import { reviewSchema as reviewValidation } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const db = await connectDB()
    if (db) {
      const query: any = {}
      if (status) query.status = status
      if (featured === 'true') query.featured = true

      const total = await Review.countDocuments(query)
      const reviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      return NextResponse.json({
        data: reviews,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      })
    }

    return NextResponse.json({ data: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = reviewValidation.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const db = await connectDB()
    if (db) {
      const review = await Review.create({ ...validation.data, status: 'pending' })
      return NextResponse.json(
        { data: review, message: 'Thank you for your review! It will be visible after approval.' },
        { status: 201 }
      )
    }

    return NextResponse.json(
      { message: 'Thank you for your review! It will be visible after approval.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
