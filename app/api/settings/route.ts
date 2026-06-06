import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Settings } from '@/lib/models'

const defaultSettings: Record<string, any> = {
  homepage_hero: {
    title: 'Sansar Kalyan Trust',
    subtitle: 'Har Daan Ek Pehchaan',
    description: 'Empowering communities through education, health, and environment.',
  },
  impact_numbers: {
    familiesHelped: 5000,
    eventsOrganized: 150,
    volunteersActive: 200,
    donationsReceived: 1200000,
  },
  about_content: {
    mission: 'To uplift underprivileged communities through accessible healthcare, quality education, and sustainable environmental initiatives.',
    vision: 'A world where every individual has access to healthcare, education, and opportunities for growth.',
    description: 'Sansar Kalyan Trust is a registered non-profit organization working across India.',
  },
  footer_data: {
    address: 'Rohtak, Haryana, India',
    phone: '+91 9999999999',
    email: 'info@sansarkalyan.org',
    socialLinks: { facebook: '', instagram: '', twitter: '', youtube: '' },
  },
  contact_info: {
    address: 'Rohtak, Haryana, India',
    phone: '+91 9999999999',
    email: 'info@sansarkalyan.org',
    officeHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
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
      return NextResponse.json(setting)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
