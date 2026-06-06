'use client'

import { AdminLayout } from '@/components/admin/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BlogPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
          <Button className="bg-primary hover:bg-primary/90">New Blog Post</Button>
        </div>

        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Blog management panel</p>
          <p className="text-sm text-muted-foreground">Create, edit, and manage blog posts here</p>
        </Card>
      </div>
    </AdminLayout>
  )
}
