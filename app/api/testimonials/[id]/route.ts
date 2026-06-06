import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Testimonial } from '@/lib/models'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const db = await connectDB()
    if (db) {
      const testimonial = await Testimonial.findByIdAndUpdate(id, { $set: body }, { new: true })
      if (!testimonial) {
        return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
      }
      return NextResponse.json(testimonial)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
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
      await Testimonial.findByIdAndDelete(id)
      return NextResponse.json({ success: true, message: 'Testimonial deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
