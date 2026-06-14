import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, verifySessionFromRequest } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { TeamMember } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { teamMemberSchema, syncMediaFields } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    const isAdmin = session && ['superadmin', 'admin', 'editor'].includes(session.role)

    const db = await connectDB()
    if (db) {
      const query: Record<string, unknown> = {}
      if (!isAdmin) query.isActive = true

      const members = await TeamMember.find(query).sort({ order: 1 }).lean()
      return NextResponse.json({ data: members })
    }

    return NextResponse.json({ data: [] })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const validation = teamMemberSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = syncMediaFields(validation.data)
    const db = await connectDB()

    if (db) {
      const member = await TeamMember.create(data)
      await logAudit(auth.session, 'create', 'team', member._id.toString())
      return NextResponse.json(member, { status: 201 })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
