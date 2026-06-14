'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { MediaPicker } from '@/components/admin/media-picker'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2 } from 'lucide-react'
import Image from 'next/image'
import type { CloudinaryAsset } from '@/lib/types/cloudinary-asset'

interface Album {
  _id: string
  title: string
  slug: string
  description?: string
  status: string
  coverAsset?: CloudinaryAsset
}

interface GalleryImage {
  _id: string
  title: string
  description?: string
  image?: string
  imageAsset?: CloudinaryAsset
  order?: number
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAlbumForm, setShowAlbumForm] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)
  const [editingAlbumSlug, setEditingAlbumSlug] = useState<string | null>(null)
  const [albumForm, setAlbumForm] = useState({ title: '', slug: '', description: '', status: 'draft' })
  const [coverAsset, setCoverAsset] = useState<CloudinaryAsset | null>(null)
  const [imageForm, setImageForm] = useState({ title: '', description: '', order: 0 })
  const [imageAsset, setImageAsset] = useState<CloudinaryAsset | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAlbums()
  }, [])

  useEffect(() => {
    if (selectedAlbum) fetchImages(selectedAlbum._id)
  }, [selectedAlbum])

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/gallery-albums')
      const data = await res.json()
      setAlbums(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchImages = async (albumId: string) => {
    try {
      const res = await fetch(`/api/gallery?albumId=${albumId}&limit=100`)
      const data = await res.json()
      setImages(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const resetAlbumForm = () => {
    setAlbumForm({ title: '', slug: '', description: '', status: 'draft' })
    setCoverAsset(null)
    setEditingAlbumSlug(null)
    setShowAlbumForm(false)
  }

  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...albumForm, coverAsset }
      const url = editingAlbumSlug ? `/api/gallery-albums/${editingAlbumSlug}` : '/api/gallery-albums'
      const method = editingAlbumSlug ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) {
        resetAlbumForm()
        fetchAlbums()
      }
    } finally {
      setSaving(false)
    }
  }

  const handleEditAlbum = (album: Album) => {
    setEditingAlbumSlug(album.slug)
    setAlbumForm({ title: album.title, slug: album.slug, description: album.description || '', status: album.status })
    setCoverAsset(album.coverAsset || null)
    setShowAlbumForm(true)
  }

  const handleDeleteAlbum = async (slug: string) => {
    if (!confirm('Delete this album and all its images?')) return
    const res = await fetch(`/api/gallery-albums/${slug}`, { method: 'DELETE' })
    if (res.ok) {
      if (selectedAlbum?.slug === slug) setSelectedAlbum(null)
      fetchAlbums()
    }
  }

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAlbum) return
    setSaving(true)
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...imageForm, albumId: selectedAlbum._id, imageAsset, status: 'published' }),
      })
      if (res.ok) {
        setImageForm({ title: '', description: '', order: 0 })
        setImageAsset(null)
        setShowImageForm(false)
        fetchImages(selectedAlbum._id)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Delete this image?')) return
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    if (res.ok && selectedAlbum) fetchImages(selectedAlbum._id)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <Button onClick={() => { resetAlbumForm(); setShowAlbumForm(true) }}>New Album</Button>
        </div>

        {showAlbumForm && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">{editingAlbumSlug ? 'Edit Album' : 'New Album'}</h2>
            <form onSubmit={handleAlbumSubmit} className="space-y-4">
              <Input placeholder="Title" value={albumForm.title} onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })} required />
              <Input placeholder="Slug" value={albumForm.slug} onChange={(e) => setAlbumForm({ ...albumForm, slug: e.target.value })} required />
              <textarea placeholder="Description" value={albumForm.description} onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-md" />
              <select value={albumForm.status} onChange={(e) => setAlbumForm({ ...albumForm, status: e.target.value })} className="w-full px-3 py-2 border rounded-md">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <MediaPicker folder="gallery" label="Cover Image" value={coverAsset} onChange={setCoverAsset} />
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Album'}</Button>
                <Button type="button" variant="outline" onClick={resetAlbumForm}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Albums</h2>
            {loading ? (
              <Card className="p-8 text-center text-muted-foreground">Loading...</Card>
            ) : albums.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">No albums yet</Card>
            ) : (
              <div className="space-y-2">
                {albums.map((album) => (
                  <Card
                    key={album._id}
                    className={`p-4 cursor-pointer transition-colors ${selectedAlbum?._id === album._id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedAlbum(album)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{album.title}</h3>
                        <p className="text-xs text-muted-foreground">{album.status}</p>
                      </div>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="ghost" onClick={() => handleEditAlbum(album)}><Edit2 className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDeleteAlbum(album.slug)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{selectedAlbum ? `Images: ${selectedAlbum.title}` : 'Select an album'}</h2>
              {selectedAlbum && (
                <Button size="sm" onClick={() => setShowImageForm(!showImageForm)}>Add Image</Button>
              )}
            </div>

            {showImageForm && selectedAlbum && (
              <Card className="p-4 mb-4">
                <form onSubmit={handleImageSubmit} className="space-y-3">
                  <Input placeholder="Title" value={imageForm.title} onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })} required />
                  <Input placeholder="Description" value={imageForm.description} onChange={(e) => setImageForm({ ...imageForm, description: e.target.value })} />
                  <MediaPicker folder="gallery" label="Image" value={imageAsset} onChange={setImageAsset} />
                  <Button type="submit" size="sm" disabled={saving}>Upload</Button>
                </form>
              </Card>
            )}

            {selectedAlbum ? (
              images.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">No images in this album</Card>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img) => (
                    <Card key={img._id} className="p-2">
                      <div className="relative aspect-square rounded overflow-hidden mb-2">
                        <Image src={img.imageAsset?.secure_url || img.image || ''} alt={img.title} fill className="object-cover" />
                      </div>
                      <p className="text-sm font-medium truncate">{img.title}</p>
                      <Button size="sm" variant="ghost" className="text-red-600 w-full mt-1" onClick={() => handleDeleteImage(img._id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <Card className="p-8 text-center text-muted-foreground">Select an album to manage images</Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
