import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, requireAdminRole, canDelete } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { Volunteer } from '@/lib/models'
import { rateLimit } from '@/lib/rate-limit'
import { logAudit } from '@/lib/services/audit.service'
import { volunteerSchema } from '@/lib/validations'
import {
  sendVolunteerConfirmation,
  sendVolunteerAdminNotification,
} from '@/lib/email'

const mockApplications: any[] = []

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
}

export async function GET(request: NextRequest) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const db = await connectDB()

    if (db) {
      const query: any = {}
      if (status) query.status = status

      const total = await Volunteer.countDocuments(query)
      const volunteers = await Volunteer.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      return NextResponse.json({
        data: volunteers,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      })
    }

    return NextResponse.json({
      data: mockApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      pagination: { page: 1, limit: 10, total: mockApplications.length, pages: 1 },
    })
  } catch (error) {
    console.error('Error fetching volunteers:', error)
    return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(ip, { windowMs: 60 * 1000, max: 10 })
    if (!limit.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()

    const validation = volunteerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const db = await connectDB()
    const volunteerData = validation.data

    if (db) {
      const volunteer = await Volunteer.create(volunteerData)

      void sendVolunteerConfirmation({ name: volunteerData.name, email: volunteerData.email }).catch(console.error)
      void sendVolunteerAdminNotification(volunteerData).catch(console.error)

      return NextResponse.json(
        { data: volunteer, message: 'Thank you for your interest in volunteering. We will review your application.' },
        { status: 201 }
      )
    }

    const newApp = { ...volunteerData, _id: Math.random().toString(36), status: 'pending', createdAt: new Date() }
    mockApplications.push(newApp)

    void sendVolunteerConfirmation({ name: volunteerData.name, email: volunteerData.email }).catch(console.error)
    void sendVolunteerAdminNotification(volunteerData).catch(console.error)

    return NextResponse.json(
      { data: newApp, message: 'Thank you for your interest in volunteering. We will review your application.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating volunteer application:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 })
    }

    const db = await connectDB()
    if (db) {
      const volunteer = await Volunteer.findByIdAndUpdate(id, { status }, { new: true })
      if (!volunteer) {
        return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'update', 'volunteer', id, { status })
      return NextResponse.json(volunteer)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating volunteer:', error)
    return NextResponse.json({ error: 'Failed to update volunteer' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminRole(request)
  if (auth instanceof NextResponse) return auth
  if (!canDelete(auth.session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const db = await connectDB()
    if (db) {
      await Volunteer.findByIdAndDelete(id)
      await logAudit(auth.session, 'delete', 'volunteer', id)
      return NextResponse.json({ success: true, message: 'Volunteer application deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting volunteer:', error)
    return NextResponse.json({ error: 'Failed to delete volunteer' }, { status: 500 })
  }
}
