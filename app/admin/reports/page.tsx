'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card } from '@/components/ui/card'

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats)
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        {!stats ? (
          <Card className="p-12 text-center text-muted-foreground">Loading report...</Card>
        ) : (
          <>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Donation Summary</h2>
              <p>Total Donations: {stats.totalDonations ?? 0}</p>
              <p>Total Amount: ₹{(stats.totalDonationAmount ?? 0).toLocaleString('en-IN')}</p>
              <p>Unique Donors: {stats.totalDonors ?? 0}</p>
            </Card>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              {(stats.recentTransactions || []).length === 0 ? (
                <p className="text-muted-foreground">No recent transactions</p>
              ) : (
                <ul className="space-y-2">
                  {stats.recentTransactions.map((t: any) => (
                    <li key={t._id} className="text-sm border-b pb-2">
                      {t.donorName} — ₹{t.amount?.toLocaleString('en-IN')} — {t.status}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
