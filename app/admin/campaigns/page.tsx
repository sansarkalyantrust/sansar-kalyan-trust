'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { CampaignForm } from '@/components/admin/campaign-form'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns')
      const data = await response.json()
      setCampaigns(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [])
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCampaign = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      const response = await fetch(`/api/campaigns/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCampaigns(campaigns.filter((c) => c.slug !== slug))
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
            }}
            className="bg-primary hover:bg-primary/90"
          >
            {showForm ? 'Cancel' : 'New Campaign'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <CampaignForm
            onSuccess={() => {
              setShowForm(false)
              fetchCampaigns()
            }}
          />
        )}

        {/* Campaigns List */}
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading campaigns...</p>
          </Card>
        ) : campaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No campaigns yet</p>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
              Create First Campaign
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.slug} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-foreground">{campaign.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(campaign.slug)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCampaign(campaign.slug)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Goal: </span>
                    <span className="font-semibold text-foreground">₹{campaign.goal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      campaign.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : campaign.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
