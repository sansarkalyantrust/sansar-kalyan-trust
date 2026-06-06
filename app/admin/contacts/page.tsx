'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Eye } from 'lucide-react'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      setContacts(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [])
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Delete this message?')) return
    setContacts(contacts.filter((c) => c._id !== id))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading messages...</p>
          </Card>
        ) : contacts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No messages received yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <Card key={contact._id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-foreground">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteContact(contact._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground line-clamp-2">{contact.message}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
