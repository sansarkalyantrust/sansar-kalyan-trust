'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { MediaPicker } from './media-picker'
import type { CloudinaryAsset } from '@/lib/types/cloudinary-asset'

interface CampaignFormProps {
  initialData?: any
  onSuccess?: () => void
}

export function CampaignForm({ initialData, onSuccess }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    fullDescription: initialData?.fullDescription || '',
    goal: initialData?.goal || '',
    raised: initialData?.raised || '',
    status: initialData?.status || 'active',
  })
  const [imageAsset, setImageAsset] = useState<CloudinaryAsset | null>(
    initialData?.imageAsset || null
  )
  const [galleryAssets, setGalleryAssets] = useState<CloudinaryAsset[]>(
    initialData?.galleryAssets || []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        fullDescription: initialData.fullDescription || '',
        goal: initialData.goal || '',
        raised: initialData.raised || '',
        status: initialData.status || 'active',
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
        goal: Number(formData.goal),
        raised: formData.raised ? Number(formData.raised) : 0,
        imageAsset,
        galleryAssets,
        image: imageAsset?.secure_url,
      }

      const url = initialData?.slug ? `/api/campaigns/${initialData.slug}` : '/api/campaigns'
      const method = initialData?.slug ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to save campaign')
        return
      }

      setSuccess('Campaign saved successfully!')
      if (onSuccess) setTimeout(onSuccess, 1500)

      if (!initialData) {
        setFormData({ title: '', slug: '', description: '', fullDescription: '', goal: '', raised: '', status: 'active' })
        setImageAsset(null)
        setGalleryAssets([])
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
        {initialData ? 'Edit Campaign' : 'New Campaign'}
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
          <label className="block text-sm font-medium text-foreground mb-2">Campaign Title</label>
          <Input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={loading} />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">URL Slug</label>
          <Input type="text" name="slug" value={formData.slug} onChange={handleChange} required disabled={loading} />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required disabled={loading} rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <MediaPicker folder="campaigns" label="Banner Image" value={imageAsset} onChange={setImageAsset} />
        <MediaPicker folder="campaigns" label="Gallery Images" value={galleryAssets} onChange={setGalleryAssets} multiple />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Goal Amount (₹)</label>
          <Input type="number" name="goal" value={formData.goal} onChange={handleChange} required disabled={loading} />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Amount Raised (₹)</label>
          <Input type="number" name="raised" value={formData.raised} onChange={handleChange} disabled={loading} />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} disabled={loading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : initialData ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </form>
    </Card>
  )
}
