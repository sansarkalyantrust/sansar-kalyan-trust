import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, requireAdminRole, canDelete } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { Testimonial } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { syncMediaFields } from '@/lib/validations'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()
    const data = syncMediaFields(body)

    const db = await connectDB()
    if (db) {
      const testimonial = await Testimonial.findByIdAndUpdate(id, { $set: data }, { new: true })
      if (!testimonial) {
        return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'update', 'testimonial', id)
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
  const auth = await requireAdminRole(request)
  if (auth instanceof NextResponse) return auth
  if (!canDelete(auth.session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const db = await connectDB()

    if (db) {
      await Testimonial.findByIdAndDelete(id)
      await logAudit(auth.session, 'delete', 'testimonial', id)
      return NextResponse.json({ success: true, message: 'Testimonial deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
