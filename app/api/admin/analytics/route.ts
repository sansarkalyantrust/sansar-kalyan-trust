import { NextRequest, NextResponse } from 'next/server'
import { requireEditor } from '@/lib/api-auth'
import { connectDB, isMongoConnected } from '@/lib/mongodb'
import {
  Donation,
  Campaign,
  PageView,
  Blog,
  Event,
  Contact,
  Volunteer,
} from '@/lib/models'
import {
  parseDateRange,
  getDateGroupId,
  type AnalyticsRange,
} from '@/lib/analytics-utils'

const VALID_RANGES: AnalyticsRange[] = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']

export async function GET(request: NextRequest) {
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const searchParams = request.nextUrl.searchParams
    const rangeParam = (searchParams.get('range') || 'monthly') as AnalyticsRange
    const range = VALID_RANGES.includes(rangeParam) ? rangeParam : 'monthly'
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const { startDate, endDate } = parseDateRange(range, from, to)
    const dateGroupId = getDateGroupId(range)
    const dateMatch = { createdAt: { $gte: startDate, $lte: endDate } }

    if (!(await isMongoConnected())) {
      return NextResponse.json(getMockAnalytics())
    }

    await connectDB()

    const [
      donationTrends,
      campaignPerformance,
      eventViews,
      blogViews,
      monthlyActivity,
      totalVisitorsResult,
      totalPageViews,
    ] = await Promise.all([
      Donation.aggregate([
        { $match: { status: 'completed', ...dateMatch } },
        {
          $group: {
            _id: dateGroupId,
            amount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, period: '$_id', amount: 1, count: 1 } },
      ]),

      Donation.aggregate([
        { $match: { status: 'completed', ...dateMatch } },
        {
          $group: {
            _id: { $ifNull: ['$campaignSlug', 'general'] },
            totalAmount: { $sum: '$amount' },
            donationCount: { $sum: 1 },
          },
        },
        { $sort: { totalAmount: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'campaigns',
            localField: '_id',
            foreignField: 'slug',
            as: 'campaign',
          },
        },
        {
          $project: {
            _id: 0,
            slug: '$_id',
            title: {
              $ifNull: [{ $arrayElemAt: ['$campaign.title', 0] }, 'General Donations'],
            },
            totalAmount: 1,
            donationCount: 1,
          },
        },
      ]),

      PageView.aggregate([
        {
          $match: {
            ...dateMatch,
            path: { $regex: '^/events', $options: 'i' },
          },
        },
        {
          $group: {
            _id: dateGroupId,
            views: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, period: '$_id', views: 1 } },
      ]),

      PageView.aggregate([
        {
          $match: {
            ...dateMatch,
            path: { $regex: '^/blog', $options: 'i' },
          },
        },
        {
          $group: {
            _id: dateGroupId,
            views: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, period: '$_id', views: 1 } },
      ]),

      Promise.all([
        Donation.countDocuments({ status: 'completed', ...dateMatch }),
        Contact.countDocuments(dateMatch),
        Volunteer.countDocuments(dateMatch),
        Blog.countDocuments({ published: true, ...dateMatch }),
        Event.countDocuments(dateMatch),
        Campaign.countDocuments(dateMatch),
      ]).then(([donations, contacts, volunteers, blogs, events, campaigns]) => ({
        donations,
        contacts,
        volunteers,
        blogs,
        events,
        campaigns,
      })),

      PageView.aggregate([
        { $match: dateMatch },
        { $group: { _id: '$sessionId' } },
        { $count: 'total' },
      ]),

      PageView.countDocuments(dateMatch),
    ])

    const totalVisitors = totalVisitorsResult[0]?.total ?? 0

    return NextResponse.json({
      range,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      donationTrends,
      campaignPerformance,
      eventViews,
      blogViews,
      monthlyActivity,
      totalVisitors,
      totalPageViews,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

function getMockAnalytics() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return {
    range: 'monthly',
    startDate: new Date(Date.now() - 180 * 86400000).toISOString(),
    endDate: new Date().toISOString(),
    donationTrends: months.map((m, i) => ({
      period: `2025-${String(i + 1).padStart(2, '0')}`,
      amount: (i + 1) * 5000,
      count: (i + 1) * 3,
    })),
    campaignPerformance: [
      { slug: 'health-camp', title: 'Health Camp', totalAmount: 25000, donationCount: 12 },
      { slug: 'education', title: 'Education Fund', totalAmount: 18000, donationCount: 8 },
    ],
    eventViews: months.map((_, i) => ({
      period: `2025-${String(i + 1).padStart(2, '0')}`,
      views: (i + 1) * 20,
    })),
    blogViews: months.map((_, i) => ({
      period: `2025-${String(i + 1).padStart(2, '0')}`,
      views: (i + 1) * 35,
    })),
    monthlyActivity: {
      donations: 24,
      contacts: 15,
      volunteers: 8,
      blogs: 3,
      events: 2,
      campaigns: 4,
    },
    totalVisitors: 450,
    totalPageViews: 1200,
  }
}
