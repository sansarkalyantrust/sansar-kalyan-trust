'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { MediaPicker } from '@/components/admin/media-picker'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2, Loader2 } from 'lucide-react'
import type { CloudinaryAsset } from '@/lib/types/cloudinary-asset'

interface ImpactStory {
  _id: string
  slug: string
  title: string
  content: string
  status: string
  seoTitle?: string
  seoDescription?: string
  featuredImageAsset?: CloudinaryAsset
}

const emptyForm = { title: '', slug: '', content: '', status: 'draft', seoTitle: '', seoDescription: '' }

export default function ImpactStoriesAdminPage() {
  const [stories, setStories] = useState<ImpactStory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [featuredImage, setFeaturedImage] = useState<CloudinaryAsset | null>(null)
  const [galleryAssets, setGalleryAssets] = useState<CloudinaryAsset[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchStories() }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/impact-stories?limit=100')
      const data = await res.json()
      setStories(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setFeaturedImage(null)
    setGalleryAssets([])
    setEditingSlug(null)
    setShowForm(false)
  }

  const handleEdit = (story: ImpactStory) => {
    setEditingSlug(story.slug)
    setFormData({
      title: story.title,
      slug: story.slug,
      content: story.content,
      status: story.status,
      seoTitle: story.seoTitle || '',
      seoDescription: story.seoDescription || '',
    })
    setFeaturedImage(story.featuredImageAsset || null)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...formData, featuredImageAsset: featuredImage, galleryAssets }
      const url = editingSlug ? `/api/impact-stories/${editingSlug}` : '/api/impact-stories'
      const res = await fetch(url, { method: editingSlug ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) { resetForm(); fetchStories() }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this impact story?')) return
    const res = await fetch(`/api/impact-stories/${slug}`, { method: 'DELETE' })
    if (res.ok) setStories(stories.filter((s) => s.slug !== slug))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Impact Stories</h1>
          <Button onClick={() => showForm ? resetForm() : setShowForm(true)}>{showForm ? 'Cancel' : 'New Story'}</Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <Input placeholder="Slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write the impact story..."
              />
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-md">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <MediaPicker folder="impact-stories" label="Featured Image" value={featuredImage} onChange={setFeaturedImage} />
              <MediaPicker folder="impact-stories" label="Gallery" value={galleryAssets} onChange={setGalleryAssets} multiple />
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="SEO Title" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} />
                <Input placeholder="SEO Description" value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} />
              </div>
              <Button type="submit" disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : 'Save'}</Button>
            </form>
          </Card>
        )}

        {loading ? (
          <Card className="p-12 text-center text-muted-foreground">Loading...</Card>
        ) : (
          <div className="space-y-3">
            {stories.map((story) => (
              <Card key={story.slug} className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{story.title}</h3>
                  <p className="text-sm text-muted-foreground">{story.status}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(story)}><Edit2 className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(story.slug)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
