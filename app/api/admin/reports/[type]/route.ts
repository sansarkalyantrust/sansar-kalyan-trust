import { NextRequest, NextResponse } from 'next/server'
import { requireAdminRole } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import {
  buildReport,
  isValidReportFormat,
  isValidReportType,
} from '@/lib/services/reports.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const auth = await requireAdminRole(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { type } = await params
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv'
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    if (!isValidReportType(type)) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    if (!isValidReportFormat(format)) {
      return NextResponse.json({ error: 'Invalid format. Use csv, xlsx, or pdf.' }, { status: 400 })
    }

    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const { buffer, contentType, filename } = await buildReport(type, format, from, to)

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
