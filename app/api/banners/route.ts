import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, verifySessionFromRequest } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { Banner } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { bannerSchema, syncMediaFields } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySessionFromRequest(request)
    const isAdmin = session && ['superadmin', 'admin', 'editor'].includes(session.role)

    const db = await connectDB()
    if (db) {
      const query: Record<string, unknown> = {}
      if (!isAdmin) query.isActive = true

      const banners = await Banner.find(query).sort({ order: 1 }).lean()
      return NextResponse.json({ data: banners })
    }

    return NextResponse.json({ data: [] })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const validation = bannerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = syncMediaFields(validation.data)
    const db = await connectDB()

    if (db) {
      const banner = await Banner.create(data)
      await logAudit(auth.session, 'create', 'banner', banner._id.toString())
      return NextResponse.json(banner, { status: 201 })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 })
  }
}
