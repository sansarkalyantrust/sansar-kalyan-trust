import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Campaign } from '@/lib/models'
import { campaignUpdateSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const db = await connectDB()

    if (db) {
      const campaign = await Campaign.findOne({ slug }).lean()
      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
      }
      return NextResponse.json(campaign)
    }

    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    const validation = campaignUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const db = await connectDB()
    if (db) {
      const campaign = await Campaign.findOneAndUpdate(
        { slug },
        { $set: validation.data },
        { new: true }
      )
      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
      }
      return NextResponse.json(campaign)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
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
      const campaign = await Campaign.findOneAndDelete({ slug })
      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, message: 'Campaign deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
  }
}
