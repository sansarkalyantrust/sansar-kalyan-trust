'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { MediaPicker } from '@/components/admin/media-picker'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2, Loader2 } from 'lucide-react'
import type { CloudinaryAsset } from '@/lib/types/cloudinary-asset'

interface BlogPost {
  _id: string
  slug: string
  title: string
  description: string
  content: string
  category: string
  tags?: string[]
  author?: string
  status?: string
  published?: boolean
  seoTitle?: string
  seoDescription?: string
  featuredImageAsset?: CloudinaryAsset
  createdAt?: string
}

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  content: '',
  category: '',
  tags: '',
  author: 'Sansar Kalyan Trust',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [featuredImage, setFeaturedImage] = useState<CloudinaryAsset | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog?limit=100')
      const data = await response.json()
      setPosts(Array.isArray(data?.data) ? data.data : [])
    } catch (err) {
      console.error('Failed to fetch blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setFeaturedImage(null)
    setEditingSlug(null)
    setShowForm(false)
    setError(null)
  }

  const handleEdit = (post: BlogPost) => {
    setEditingSlug(post.slug)
    setFormData({
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: post.content || '',
      category: post.category,
      tags: (post.tags || []).join(', '),
      author: post.author || 'Sansar Kalyan Trust',
      status: post.status || (post.published ? 'published' : 'draft'),
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
    })
    setFeaturedImage(post.featuredImageAsset || null)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        published: formData.status === 'published',
        featuredImageAsset: featuredImage,
      }

      const url = editingSlug ? `/api/blog/${editingSlug}` : '/api/blog'
      const method = editingSlug ? 'PUT' : 'POST'

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

      resetForm()
      fetchPosts()
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
      if (response.ok) {
        setPosts(posts.filter((p) => p.slug !== slug))
      }
    } catch (err) {
      console.error('Failed to delete blog post:', err)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
          <Button
            onClick={() => {
              if (showForm) resetForm()
              else setShowForm(true)
            }}
            className="bg-primary hover:bg-primary/90"
          >
            {showForm ? 'Cancel' : 'New Blog Post'}
          </Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">{editingSlug ? 'Edit Blog Post' : 'New Blog Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required disabled={saving} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required disabled={saving} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  disabled={saving}
                  rows={2}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  disabled={saving}
                  rows={10}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background font-mono text-sm"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required disabled={saving} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} disabled={saving} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <MediaPicker folder="blogs" label="Featured Image" value={featuredImage} onChange={setFeaturedImage} />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SEO Title</label>
                  <Input value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} disabled={saving} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SEO Description</label>
                  <Input value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} disabled={saving} />
                </div>
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : editingSlug ? 'Update Post' : 'Create Post'}
              </Button>
            </form>
          </Card>
        )}

        {loading ? (
          <Card className="p-12 text-center"><p className="text-muted-foreground">Loading blog posts...</p></Card>
        ) : posts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No blog posts yet</p>
            <Button onClick={() => setShowForm(true)}>Create First Post</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.slug} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">{post.category} · {post.status || (post.published ? 'published' : 'draft')}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{post.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(post)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(post.slug)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
