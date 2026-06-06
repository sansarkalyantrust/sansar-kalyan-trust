'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { EventForm } from '@/components/admin/event-form'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEvents(events.filter((e) => e.slug !== slug))
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90"
          >
            {showForm ? 'Cancel' : 'New Event'}
          </Button>
        </div>

        {showForm && (
          <EventForm
            onSuccess={() => {
              setShowForm(false)
              fetchEvents()
            }}
          />
        )}

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading events...</p>
          </Card>
        ) : events.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No events yet</p>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
              Create First Event
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <Card key={event.slug} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-foreground">{event.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteEvent(event.slug)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    <span className="font-semibold text-foreground">{event.type}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    event.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
