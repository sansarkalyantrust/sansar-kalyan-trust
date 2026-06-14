'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { MediaPicker } from './media-picker'
import type { CloudinaryAsset } from '@/lib/types/cloudinary-asset'

interface EventFormProps {
  initialData?: any
  onSuccess?: () => void
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
    time: initialData?.time || '',
    venue: initialData?.venue || initialData?.location || '',
    registrationLink: initialData?.registrationLink || '',
    type: initialData?.type || '',
    status: initialData?.status || 'upcoming',
  })
  const [imageAsset, setImageAsset] = useState<CloudinaryAsset | null>(initialData?.imageAsset || null)
  const [galleryAssets, setGalleryAssets] = useState<CloudinaryAsset[]>(initialData?.galleryAssets || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
        time: initialData.time || '',
        venue: initialData.venue || initialData.location || '',
        registrationLink: initialData.registrationLink || '',
        type: initialData.type || '',
        status: initialData.status || 'upcoming',
      })
      setImageAsset(initialData.imageAsset || null)
      setGalleryAssets(initialData.galleryAssets || [])
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const payload = {
        ...formData,
        location: formData.venue,
        imageAsset,
        galleryAssets,
        image: imageAsset?.secure_url,
      }

      const url = initialData?.slug ? `/api/events/${initialData.slug}` : '/api/events'
      const method = initialData?.slug ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to save event')
        return
      }

      setSuccess('Event saved successfully!')
      if (onSuccess) setTimeout(onSuccess, 1500)
    } catch (err) {
      setError('An error occurred. Please try again.')
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
          <label className="block text-sm font-medium mb-2">Event Title</label>
          <Input name="title" value={formData.title} onChange={handleChange} required disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">URL Slug</label>
          <Input name="slug" value={formData.slug} onChange={handleChange} required disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required disabled={loading} rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <MediaPicker folder="events" label="Banner Image" value={imageAsset} onChange={setImageAsset} />
        <MediaPicker folder="events" label="Event Gallery" value={galleryAssets} onChange={setGalleryAssets} multiple />

        <div>
          <label className="block text-sm font-medium mb-2">Event Date</label>
          <Input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Event Time</label>
          <Input name="time" value={formData.time} onChange={handleChange} placeholder="10:00 AM" disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <Input name="venue" value={formData.venue} onChange={handleChange} disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Registration Link</label>
          <Input name="registrationLink" value={formData.registrationLink} onChange={handleChange} disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Event Type</label>
          <select name="type" value={formData.type} onChange={handleChange} required disabled={loading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select type...</option>
            <option value="Health Camp">Health Camp</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
            <option value="Community">Community</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} disabled={loading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : initialData ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Card>
  )
}
