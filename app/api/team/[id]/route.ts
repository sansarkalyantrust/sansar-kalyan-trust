import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, requireAdminRole, canDelete } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { TeamMember } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { teamMemberSchema, syncMediaFields } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await connectDB()

    if (db) {
      const member = await TeamMember.findById(id).lean()
      if (!member) {
        return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
      }
      return NextResponse.json(member)
    }

    return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()
    const validation = teamMemberSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = syncMediaFields(validation.data)
    const db = await connectDB()

    if (db) {
      const member = await TeamMember.findByIdAndUpdate(id, { $set: data }, { new: true })
      if (!member) {
        return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'update', 'team', id)
      return NextResponse.json(member)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
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
      const member = await TeamMember.findByIdAndDelete(id)
      if (!member) {
        return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'delete', 'team', id)
      return NextResponse.json({ success: true, message: 'Team member deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
