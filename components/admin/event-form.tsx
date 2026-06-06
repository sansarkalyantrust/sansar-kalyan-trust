'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'

interface EventFormProps {
  initialData?: any
  onSuccess?: () => void
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    date: initialData?.date || '',
    type: initialData?.type || '',
    status: initialData?.status || 'upcoming',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/events', {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save event')
        return
      }

      setSuccess('Event saved successfully!')
      if (onSuccess) {
        setTimeout(onSuccess, 1500)
      }

      if (!initialData) {
        setFormData({
          title: '',
          slug: '',
          description: '',
          image: '',
          date: '',
          type: '',
          status: 'upcoming',
        })
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {initialData ? 'Edit Event' : 'New Event'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Event Title
          </label>
          <Input
            type="text"
            name="title"
            placeholder="e.g., Health Camp - Rohtak"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            URL Slug
          </label>
          <Input
            type="text"
            name="slug"
            placeholder="e.g., health-camp-rohtak"
            value={formData.slug}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Event details..."
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading}
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Image URL
          </label>
          <Input
            type="url"
            name="image"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Event Date
          </label>
          <Input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Event Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select type...</option>
            <option value="Health Camp">Health Camp</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
            <option value="Community">Community</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 h-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            'Update Event'
          ) : (
            'Create Event'
          )}
        </Button>
      </form>
    </Card>
  )
}
