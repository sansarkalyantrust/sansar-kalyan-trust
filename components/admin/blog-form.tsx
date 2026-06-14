'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { MediaPicker } from './media-picker'
import { RichTextEditor } from './rich-text-editor'
import type { CloudinaryAsset } from '@/lib/types/cloudinary-asset'

interface BlogFormProps {
  initialData?: any
  onSuccess?: () => void
}

const CATEGORIES = ['Healthcare', 'Education', 'Environment', 'Community', 'General']

export function BlogForm({ initialData, onSuccess }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    category: initialData?.category || 'General',
    author: initialData?.author || 'Sansar Kalyan Trust',
    tags: (initialData?.tags || []).join(', '),
    published: initialData?.published ?? false,
  })
  const [imageAsset, setImageAsset] = useState<CloudinaryAsset | null>(
    initialData?.featuredImageAsset || initialData?.imageAsset || null
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
        content: initialData.content || '',
        category: initialData.category || 'General',
        author: initialData.author || 'Sansar Kalyan Trust',
        tags: (initialData.tags || []).join(', '),
        published: initialData.published ?? false,
      })
      setImageAsset(initialData.featuredImageAsset || initialData.imageAsset || null)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const tags = formData.tags
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean)

      const payload = {
        title: formData.title,
        slug: formData.slug || undefined,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        tags,
        published: formData.published,
        featuredImageAsset: imageAsset,
        imageAsset,
        image: imageAsset?.secure_url,
      }

      const url = initialData?.slug ? `/api/blog/${initialData.slug}` : '/api/blog'
      const method = initialData?.slug ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to save blog post')
        return
      }

      setSuccess('Blog post saved successfully!')
      if (onSuccess) setTimeout(onSuccess, 1500)

      if (!initialData) {
        setFormData({
          title: '',
          slug: '',
          description: '',
          content: '',
          category: 'General',
          author: 'Sansar Kalyan Trust',
          tags: '',
          published: false,
        })
        setImageAsset(null)
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
        {initialData ? 'Edit Blog Post' : 'New Blog Post'}
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
          <label className="block text-sm font-medium text-foreground mb-2">Title</label>
          <Input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={loading} />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">URL Slug</label>
          <Input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="auto-generated from title if empty"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading}
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Content</label>
          <RichTextEditor
            value={formData.content}
            onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
            disabled={loading}
          />
        </div>

        <MediaPicker folder="blogs" label="Featured Image" value={imageAsset} onChange={setImageAsset} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Author</label>
            <Input type="text" name="author" value={formData.author} onChange={handleChange} disabled={loading} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Tags (comma-separated)</label>
          <Input type="text" name="tags" value={formData.tags} onChange={handleChange} disabled={loading} />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            disabled={loading}
            className="h-4 w-4 rounded border-input"
          />
          <label htmlFor="published" className="text-sm font-medium text-foreground">
            Publish immediately
          </label>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            'Update Blog Post'
          ) : (
            'Create Blog Post'
          )}
        </Button>
      </form>
    </Card>
  )
}
