'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { MediaPicker } from '@/components/admin/media-picker'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2, Loader2 } from 'lucide-react'
import type { CloudinaryAsset } from '@/lib/types/cloudinary-asset'

interface Banner {
  _id: string
  title: string
  subtitle?: string
  link?: string
  order: number
  isActive: boolean
  imageAsset?: CloudinaryAsset
}

const emptyForm = { title: '', subtitle: '', link: '', order: 0, isActive: true }

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [imageAsset, setImageAsset] = useState<CloudinaryAsset | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchBanners() }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners')
      const data = await res.json()
      setBanners(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setImageAsset(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (banner: Banner) => {
    setEditingId(banner._id)
    setFormData({ title: banner.title, subtitle: banner.subtitle || '', link: banner.link || '', order: banner.order, isActive: banner.isActive })
    setImageAsset(banner.imageAsset || null)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...formData, imageAsset }
      const url = editingId ? `/api/banners/${editingId}` : '/api/banners'
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) { resetForm(); fetchBanners() }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' })
    if (res.ok) setBanners(banners.filter((b) => b._id !== id))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <Button onClick={() => showForm ? resetForm() : setShowForm(true)}>{showForm ? 'Cancel' : 'New Banner'}</Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <Input placeholder="Subtitle" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
              <Input placeholder="Link URL" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
              <Input type="number" placeholder="Order" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Active</label>
              <MediaPicker folder="banners" label="Banner Image" value={imageAsset} onChange={setImageAsset} />
              <Button type="submit" disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : 'Save'}</Button>
            </form>
          </Card>
        )}

        {loading ? (
          <Card className="p-12 text-center text-muted-foreground">Loading...</Card>
        ) : (
          <div className="space-y-3">
            {banners.map((banner) => (
              <Card key={banner._id} className="p-4 flex justify-between">
                <div>
                  <h3 className="font-bold">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground">{banner.subtitle} · {banner.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(banner)}><Edit2 className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(banner._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
