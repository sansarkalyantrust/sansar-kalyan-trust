'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Eye } from 'lucide-react'

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVolunteers()
  }, [])

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('/api/volunteer')
      const data = await response.json()
      setVolunteers(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [])
    } catch (error) {
      console.error('Failed to fetch volunteers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVolunteer = async (id: string) => {
    if (!confirm('Delete this application?')) return
    setVolunteers(volunteers.filter((v) => v._id !== id))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Volunteer Applications</h1>

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading applications...</p>
          </Card>
        ) : volunteers.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No volunteer applications yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {volunteers.map((volunteer) => (
              <Card key={volunteer._id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-foreground">{volunteer.name}</h3>
                    <p className="text-sm text-muted-foreground">{volunteer.email} • {volunteer.city}</p>
                    {volunteer.skills && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {volunteer.skills.map((skill: string, index: number) => (
                          <span
                            key={`${volunteer._id}-${skill}-${index}`}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteVolunteer(volunteer._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground line-clamp-2">{volunteer.motivation}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
