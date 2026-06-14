'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { MediaPicker } from '@/components/admin/media-picker'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2, Loader2 } from 'lucide-react'
import type { CloudinaryAsset } from '@/lib/types/cloudinary-asset'

interface TeamMember {
  _id: string
  name: string
  designation: string
  bio?: string
  order: number
  isActive: boolean
  photoAsset?: CloudinaryAsset
}

const emptyForm = { name: '', designation: '', bio: '', order: 0, isActive: true }

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [photoAsset, setPhotoAsset] = useState<CloudinaryAsset | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchMembers() }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/team')
      const data = await res.json()
      setMembers(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setPhotoAsset(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (member: TeamMember) => {
    setEditingId(member._id)
    setFormData({ name: member.name, designation: member.designation, bio: member.bio || '', order: member.order, isActive: member.isActive })
    setPhotoAsset(member.photoAsset || null)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...formData, photoAsset }
      const url = editingId ? `/api/team/${editingId}` : '/api/team'
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) { resetForm(); fetchMembers() }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return
    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' })
    if (res.ok) setMembers(members.filter((m) => m._id !== id))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <Button onClick={() => showForm ? resetForm() : setShowForm(true)}>{showForm ? 'Cancel' : 'Add Member'}</Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <Input placeholder="Designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
              </div>
              <textarea placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-md" />
              <Input type="number" placeholder="Order" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Active</label>
              <MediaPicker folder="team" label="Photo" value={photoAsset} onChange={setPhotoAsset} />
              <Button type="submit" disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : 'Save'}</Button>
            </form>
          </Card>
        )}

        {loading ? (
          <Card className="p-12 text-center text-muted-foreground">Loading...</Card>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <Card key={member._id} className="p-4 flex justify-between">
                <div>
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.designation} · {member.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(member)}><Edit2 className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(member._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
