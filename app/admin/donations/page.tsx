'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Download, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DonationsPage() {
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalAmount, setTotalAmount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [campaignFilter, setCampaignFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDonations, setTotalDonations] = useState(0)
  const limit = 10

  useEffect(() => {
    fetchDonations()
  }, [statusFilter, campaignFilter, currentPage])

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      })
      
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (campaignFilter !== 'all') params.append('campaignSlug', campaignFilter)

      const response = await fetch(`/api/donations?${params}`)
      const data = await response.json()
      const donationsList = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
      setDonations(donationsList)
      
      const amount = typeof data?.totalAmount === 'number'
        ? data.totalAmount
        : donationsList.reduce((sum: number, donation: any) => sum + (donation.amount || 0), 0)
      setTotalAmount(amount)
      
      if (data?.pagination) {
        setTotalPages(data.pagination.pages || 1)
        setTotalDonations(data.pagination.total || donationsList.length)
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDonation = async (id: string) => {
    if (!confirm('Delete this donation record?')) return
    
    try {
      const response = await fetch(`/api/donations/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setDonations(donations.filter((d) => d._id !== id))
      }
    } catch (error) {
      console.error('Failed to delete donation:', error)
    }
  }

  const exportToCSV = () => {
    const headers = ['Date', 'Donor Name', 'Email', 'Phone', 'Amount', 'Status', 'Campaign']
    const rows = donations.map((donation) => [
      new Date(donation.createdAt).toLocaleDateString(),
      donation.donorName,
      donation.donorEmail,
      donation.donorPhone || 'N/A',
      donation.amount,
      donation.status,
      donation.campaignSlug || 'General'
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const filteredDonations = donations.filter(donation => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        donation.donorName?.toLowerCase().includes(query) ||
        donation.donorEmail?.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Donations</h1>
          <div className="flex gap-3">
            <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Card className="px-6 py-3 bg-green-50 dark:bg-green-950">
              <p className="text-sm text-muted-foreground">Total Raised</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{totalAmount.toLocaleString('en-IN')}
              </p>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search Donor</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Campaign Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Campaign</label>
              <select
                value={campaignFilter}
                onChange={(e) => {
                  setCampaignFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Campaigns</option>
                <option value="health-camp-rohtak">Health Camp</option>
                <option value="education-drive">Education Drive</option>
                <option value="tree-plantation">Tree Plantation</option>
                <option value="">General Donations</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Donations List */}
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading donations...</p>
          </Card>
        ) : filteredDonations.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No donations found</p>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {filteredDonations.map((donation) => (
                <Card key={donation._id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{donation.donorName}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          donation.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : donation.status === 'pending'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {donation.status}
                        </span>
                        {donation.campaignSlug && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                            {donation.campaignSlug}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{donation.donorEmail}</p>
                      {donation.donorPhone && (
                        <p className="text-sm text-muted-foreground">{donation.donorPhone}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(donation.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          ₹{donation.amount?.toLocaleString('en-IN')}
                        </p>
                        {donation.method && (
                          <p className="text-xs text-muted-foreground capitalize">{donation.method}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteDonation(donation._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalDonations)} of {totalDonations} donations
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
