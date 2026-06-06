import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Event } from '@/lib/models'
import { eventUpdateSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const db = await connectDB()

    if (db) {
      const event = await Event.findOne({ slug }).lean()
      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }
      return NextResponse.json(event)
    }

    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    const validation = eventUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const db = await connectDB()
    if (db) {
      const event = await Event.findOneAndUpdate(
        { slug },
        { $set: validation.data },
        { new: true }
      )
      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }
      return NextResponse.json(event)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const db = await connectDB()

    if (db) {
      const event = await Event.findOneAndDelete({ slug })
      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, message: 'Event deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
