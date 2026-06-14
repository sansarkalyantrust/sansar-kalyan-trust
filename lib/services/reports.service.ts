import ExcelJS from 'exceljs'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  Donation,
  Campaign,
  Event,
  Blog,
  Volunteer,
  Contact,
} from '@/lib/models'
import { buildDateFilter, parseReportDateRange } from '@/lib/analytics-utils'

export type ReportType =
  | 'donations'
  | 'campaigns'
  | 'events'
  | 'blogs'
  | 'volunteers'
  | 'contacts'

export type ReportFormat = 'csv' | 'xlsx' | 'pdf'

const REPORT_TYPES: ReportType[] = [
  'donations',
  'campaigns',
  'events',
  'blogs',
  'volunteers',
  'contacts',
]

export function isValidReportType(type: string): type is ReportType {
  return REPORT_TYPES.includes(type as ReportType)
}

export function isValidReportFormat(format: string): format is ReportFormat {
  return format === 'csv' || format === 'xlsx' || format === 'pdf'
}

type ReportRow = Record<string, string | number | boolean | null | undefined>

async function fetchReportData(
  type: ReportType,
  from?: string | null,
  to?: string | null
): Promise<{ headers: string[]; rows: ReportRow[] }> {
  const { startDate, endDate } = parseReportDateRange(from, to)
  const dateFilter = buildDateFilter(startDate, endDate)
  const query = dateFilter ? { ...dateFilter } : {}

  switch (type) {
    case 'donations': {
      const items = await Donation.find(query).sort({ createdAt: -1 }).lean()
      return {
        headers: [
          'Date',
          'Donor Name',
          'Email',
          'Phone',
          'Amount',
          'Status',
          'Campaign',
          'Method',
        ],
        rows: items.map((d) => ({
          Date: new Date(d.createdAt).toISOString().split('T')[0],
          'Donor Name': d.donorName,
          Email: d.donorEmail,
          Phone: d.donorPhone || '',
          Amount: d.amount,
          Status: d.status,
          Campaign: d.campaignSlug || 'General',
          Method: d.method,
        })),
      }
    }
    case 'campaigns': {
      const items = await Campaign.find(query).sort({ createdAt: -1 }).lean()
      return {
        headers: ['Title', 'Slug', 'Goal', 'Raised', 'Donors', 'Status', 'Created'],
        rows: items.map((c) => ({
          Title: c.title,
          Slug: c.slug,
          Goal: c.goal,
          Raised: c.raised,
          Donors: c.donors,
          Status: c.status,
          Created: new Date(c.createdAt).toISOString().split('T')[0],
        })),
      }
    }
    case 'events': {
      const items = await Event.find(query).sort({ date: -1 }).lean()
      return {
        headers: ['Title', 'Slug', 'Date', 'Venue', 'Type', 'Status', 'Created'],
        rows: items.map((e) => ({
          Title: e.title,
          Slug: e.slug,
          Date: new Date(e.date).toISOString().split('T')[0],
          Venue: e.venue || e.location || '',
          Type: e.type,
          Status: e.status,
          Created: new Date(e.createdAt).toISOString().split('T')[0],
        })),
      }
    }
    case 'blogs': {
      const items = await Blog.find(query).sort({ createdAt: -1 }).lean()
      return {
        headers: ['Title', 'Slug', 'Category', 'Author', 'Published', 'Status', 'Created'],
        rows: items.map((b) => ({
          Title: b.title,
          Slug: b.slug,
          Category: b.category,
          Author: b.author,
          Published: b.published ? 'Yes' : 'No',
          Status: b.status,
          Created: new Date(b.createdAt).toISOString().split('T')[0],
        })),
      }
    }
    case 'volunteers': {
      const items = await Volunteer.find(query).sort({ createdAt: -1 }).lean()
      return {
        headers: ['Name', 'Email', 'Phone', 'City', 'Skills', 'Status', 'Created'],
        rows: items.map((v) => ({
          Name: v.name,
          Email: v.email,
          Phone: v.phone,
          City: v.city,
          Skills: (v.skills || []).join(', '),
          Status: v.status,
          Created: new Date(v.createdAt).toISOString().split('T')[0],
        })),
      }
    }
    case 'contacts': {
      const items = await Contact.find(query).sort({ createdAt: -1 }).lean()
      return {
        headers: ['Name', 'Email', 'Phone', 'Message', 'Status', 'Created'],
        rows: items.map((c) => ({
          Name: c.name,
          Email: c.email,
          Phone: c.phone || '',
          Message: c.message,
          Status: c.status,
          Created: new Date(c.createdAt).toISOString().split('T')[0],
        })),
      }
    }
  }
}

function escapeCsvCell(value: unknown): string {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function generateCsv(headers: string[], rows: ReportRow[]): string {
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escapeCsvCell(row[h])).join(',')),
  ]
  return lines.join('\n')
}

export async function generateXlsx(
  headers: string[],
  rows: ReportRow[],
  sheetName: string
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet(sheetName)
  sheet.addRow(headers)
  rows.forEach((row) => {
    sheet.addRow(headers.map((h) => row[h] ?? ''))
  })
  sheet.getRow(1).font = { bold: true }
  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}

export function generatePdf(
  title: string,
  headers: string[],
  rows: ReportRow[]
): Buffer {
  const doc = new jsPDF({ orientation: headers.length > 6 ? 'landscape' : 'portrait' })
  doc.setFontSize(14)
  doc.text(title, 14, 16)
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 24)

  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: rows.map((row) => headers.map((h) => String(row[h] ?? ''))),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [34, 139, 34] },
  })

  return Buffer.from(doc.output('arraybuffer'))
}

export async function buildReport(
  type: ReportType,
  format: ReportFormat,
  from?: string | null,
  to?: string | null
): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
  const { headers, rows } = await fetchReportData(type, from, to)
  const dateSuffix = new Date().toISOString().split('T')[0]
  const baseName = `${type}_report_${dateSuffix}`

  switch (format) {
    case 'csv': {
      const csv = generateCsv(headers, rows)
      return {
        buffer: Buffer.from(csv, 'utf-8'),
        contentType: 'text/csv; charset=utf-8',
        filename: `${baseName}.csv`,
      }
    }
    case 'xlsx': {
      const buffer = await generateXlsx(headers, rows, type)
      return {
        buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: `${baseName}.xlsx`,
      }
    }
    case 'pdf': {
      const title = `${type.charAt(0).toUpperCase() + type.slice(1)} Report`
      const buffer = generatePdf(title, headers, rows)
      return {
        buffer,
        contentType: 'application/pdf',
        filename: `${baseName}.pdf`,
      }
    }
  }
}
