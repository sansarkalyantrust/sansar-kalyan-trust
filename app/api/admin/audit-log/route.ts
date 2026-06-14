import { NextRequest, NextResponse } from 'next/server'
import { requireAdminRole } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { AuditLog } from '@/lib/models'

export async function GET(request: NextRequest) {
  const auth = await requireAdminRole(request)
  if (auth instanceof NextResponse) return auth

  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const action = searchParams.get('action')
    const entityType = searchParams.get('entityType')

    const db = await connectDB()
    if (!db) {
      return NextResponse.json({
        data: [],
        pagination: { page, limit, total: 0, pages: 0 },
      })
    }

    const query: Record<string, string> = {}
    if (action) query.action = action
    if (entityType) query.entityType = entityType

    const total = await AuditLog.countDocuments(query)
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return NextResponse.json({
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching audit log:', error)
    return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 })
  }
}
