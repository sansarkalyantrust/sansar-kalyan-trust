import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Review } from '@/lib/models'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const db = await connectDB()
    if (db) {
      const review = await Review.findByIdAndUpdate(id, { $set: body }, { new: true })
      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
      }
      return NextResponse.json(review)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await connectDB()

    if (db) {
      await Review.findByIdAndDelete(id)
      return NextResponse.json({ success: true, message: 'Review deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
