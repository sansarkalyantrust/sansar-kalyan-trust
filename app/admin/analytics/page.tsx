'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card } from '@/components/ui/card'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const metrics = [
    { label: 'Campaigns', key: 'totalCampaigns' },
    { label: 'Events', key: 'totalEvents' },
    { label: 'Blog Posts', key: 'totalBlogs' },
    { label: 'Gallery Items', key: 'totalGalleryItems' },
    { label: 'Contacts', key: 'totalContacts' },
    { label: 'Volunteers', key: 'totalVolunteers' },
    { label: 'Donations', key: 'totalDonations' },
    { label: 'Pending Reviews', key: 'pendingReviews' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        {loading ? (
          <Card className="p-12 text-center text-muted-foreground">Loading stats...</Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <Card key={m.key} className="p-6 text-center">
                <p className="text-3xl font-bold text-primary">{stats[m.key] ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
