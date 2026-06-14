'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image,
  MessageSquare,
  Users,
  LogOut,
  Menu,
  X,
  Settings,
  MessageCircle,
  Star,
  Quote,
  BarChart3,
  FileBarChart,
  BookOpen,
  UserCircle,
  Flag,
  ClipboardList,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  userName?: string
}

export function AdminLayout({ children, userName = 'Admin' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Campaigns', href: '/admin/campaigns', icon: FileText },
    { label: 'Events', href: '/admin/events', icon: Calendar },
    { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
    { label: 'Gallery', href: '/admin/gallery', icon: Image },
    { label: 'Impact Stories', href: '/admin/impact-stories', icon: BookOpen },
    { label: 'Team', href: '/admin/team', icon: UserCircle },
    { label: 'Banners', href: '/admin/banners', icon: Flag },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Contact Messages', href: '/admin/contacts', icon: MessageSquare },
    { label: 'Volunteer Apps', href: '/admin/volunteers', icon: Users },
    { label: 'Donations', href: '/admin/donations', icon: MessageCircle },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Reports', href: '/admin/reports', icon: FileBarChart },
    { label: 'Audit Log', href: '/admin/audit-log', icon: ClipboardList },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/admin" className="font-bold text-lg text-foreground">
              SKT Admin
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link href="/admin/settings">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4 mr-2" />
              {sidebarOpen && 'Settings'}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {userName}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
            >
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
