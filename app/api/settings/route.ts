import { NextRequest, NextResponse } from 'next/server'
import { requireEditor } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { Settings } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import {
  aboutParagraphs,
  contactDetails,
  englishTagline,
  organizationName,
} from '@/lib/site-content'

const defaultSettings: Record<string, any> = {
  homepage_hero: {
    title: organizationName,
    subtitle: englishTagline,
    description: aboutParagraphs.join(' '),
  },
  impact_numbers: {
    treesPlanted: 350,
    notebooksMade: 270,
    healthAwarenessCamps: 20,
    animalsProtected: 100,
  },
  about_content: {
    mission: aboutParagraphs[1],
    vision: aboutParagraphs[0],
    description: aboutParagraphs.join(' '),
  },
  footer_data: {
    address: contactDetails.registeredAddress,
    phone: contactDetails.phone,
    email: contactDetails.email,
    tagline: aboutParagraphs[1],
    socialLinks: { facebook: '', instagram: '', twitter: '', youtube: '' },
  },
  contact_info: {
    address: contactDetails.registeredAddress,
    phone: contactDetails.phone,
    whatsapp: contactDetails.phone,
    email: contactDetails.email,
    registrationNo: contactDetails.registrationNo,
    upi: contactDetails.upi,
  },
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get('key')

    const db = await connectDB()
    if (db) {
      if (key) {
        const setting = await Settings.findOne({ key }).lean()
        return NextResponse.json({ data: setting?.value || defaultSettings[key] || null })
      }
      const settings = await Settings.find().lean()
      const settingsMap: Record<string, any> = {}
      settings.forEach((s: any) => { settingsMap[s.key] = s.value })
      return NextResponse.json({ data: { ...defaultSettings, ...settingsMap } })
    }

    if (key) {
      return NextResponse.json({ data: defaultSettings[key] || null })
    }
    return NextResponse.json({ data: defaultSettings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    const db = await connectDB()
    if (db) {
      const setting = await Settings.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      )
      await logAudit(auth.session, 'update', 'settings', key)
      return NextResponse.json(setting)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
