'use client'

import { AdminLayout } from '@/components/admin/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function GalleryPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Gallery Management</h1>
          <Button className="bg-primary hover:bg-primary/90">Upload Images</Button>
        </div>

        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Gallery management panel</p>
          <p className="text-sm text-muted-foreground">Upload, organize, and manage gallery images here</p>
        </Card>
      </div>
    </AdminLayout>
  )
}
