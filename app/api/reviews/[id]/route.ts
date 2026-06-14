import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, requireAdminRole, canDelete } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { Review } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()

    const db = await connectDB()
    if (db) {
      const review = await Review.findByIdAndUpdate(id, { $set: body }, { new: true })
      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'update', 'review', id)
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
  const auth = await requireAdminRole(request)
  if (auth instanceof NextResponse) return auth
  if (!canDelete(auth.session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const db = await connectDB()

    if (db) {
      await Review.findByIdAndDelete(id)
      await logAudit(auth.session, 'delete', 'review', id)
      return NextResponse.json({ success: true, message: 'Review deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
