import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Donation } from '@/lib/models'
import { donationSchema } from '@/lib/validations'

const mockDonations: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const campaignSlug = searchParams.get('campaign')

    const db = await connectDB()

    if (db) {
      const query: any = {}
      if (status) query.status = status
      if (campaignSlug) query.campaignSlug = campaignSlug

      const total = await Donation.countDocuments(query)
      const donations = await Donation.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      const totalAmount = await Donation.aggregate([
        { $match: { ...query, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])

      return NextResponse.json({
        data: donations,
        totalAmount: totalAmount[0]?.total || 0,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      })
    }

    return NextResponse.json({
      data: mockDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      totalAmount: mockDonations.reduce((sum, d) => sum + (d.amount || 0), 0),
      pagination: { page: 1, limit: 10, total: mockDonations.length, pages: 1 },
    })
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = donationSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const db = await connectDB()
    if (db) {
      const donation = await Donation.create({
        ...validation.data,
        status: 'completed',
      })
      return NextResponse.json(donation, { status: 201 })
    }

    const newDonation = {
      ...validation.data,
      _id: Math.random().toString(36),
      status: 'completed',
      createdAt: new Date(),
    }
    mockDonations.push(newDonation)

    return NextResponse.json(newDonation, { status: 201 })
  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json({ error: 'Failed to process donation' }, { status: 500 })
  }
}
