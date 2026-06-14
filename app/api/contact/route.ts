import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, requireAdminRole, canDelete } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { Contact } from '@/lib/models'
import { rateLimit } from '@/lib/rate-limit'
import { logAudit } from '@/lib/services/audit.service'
import { contactSchema } from '@/lib/validations'
import {
  sendContactAcknowledgement,
  sendContactAdminNotification,
} from '@/lib/email'

const mockInquiries: any[] = []

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

      const total = await Contact.countDocuments(query)
      const contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

      return NextResponse.json({
        data: contacts,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      })
    }

    return NextResponse.json({
      data: mockInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      pagination: { page: 1, limit: 10, total: mockInquiries.length, pages: 1 },
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
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

    const validation = contactSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const db = await connectDB()
    const contactData = validation.data

    if (db) {
      const contact = await Contact.create(contactData)

      void sendContactAcknowledgement({ name: contactData.name, email: contactData.email }).catch(console.error)
      void sendContactAdminNotification(contactData).catch(console.error)

      return NextResponse.json(
        { data: contact, message: 'Thank you for contacting us. We will get back to you soon.' },
        { status: 201 }
      )
    }

    const newInquiry = { ...contactData, _id: Math.random().toString(36), status: 'new', createdAt: new Date() }
    mockInquiries.push(newInquiry)

    void sendContactAcknowledgement({ name: contactData.name, email: contactData.email }).catch(console.error)
    void sendContactAdminNotification(contactData).catch(console.error)

    return NextResponse.json(
      { data: newInquiry, message: 'Thank you for contacting us. We will get back to you soon.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
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
      const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true })
      if (!contact) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'update', 'contact', id, { status })
      return NextResponse.json(contact)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
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

    const db = await connectDB()
    if (db) {
      await Contact.findByIdAndDelete(id)
      await logAudit(auth.session, 'delete', 'contact', id)
      return NextResponse.json({ success: true, message: 'Contact deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}
