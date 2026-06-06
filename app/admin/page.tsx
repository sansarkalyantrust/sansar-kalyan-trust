import { validateSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, Calendar, Image, MessageSquare, Users, Heart, DollarSign, Star } from 'lucide-react'

async function getDashboardStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/stats`, {
      cache: 'no-store',
    });
    
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }
  
  // Fallback mock data
  return {
    totalCampaigns: 4,
    totalEvents: 3,
    totalBlogs: 3,
    totalGalleryItems: 6,
    totalContacts: 0,
    totalVolunteers: 0,
    totalDonations: 0,
    totalDonationAmount: 0,
    totalDonors: 0,
    pendingReviews: 0,
    recentTransactions: [],
    recentContacts: [],
  };
}

export const metadata = {
  title: 'Admin Dashboard | Sansar Kalyan Trust',
  description: 'Admin dashboard for managing NGO content',
}

export default async function AdminDashboard() {
  const session = await validateSession()

  if (!session) {
    redirect('/login')
  }

  const stats = await getDashboardStats()

  const statCards = [
    {
      label: 'Total Donations',
      value: stats.totalDonations,
      subtitle: `₹${stats.totalDonationAmount.toLocaleString()}`,
      icon: DollarSign,
      href: '/admin/donations',
      color: 'bg-green-50 dark:bg-green-950',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Unique Donors',
      value: stats.totalDonors,
      icon: Users,
      href: '/admin/donations',
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Active Campaigns',
      value: stats.totalCampaigns,
      icon: Heart,
      href: '/admin/campaigns',
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Events',
      value: stats.totalEvents,
      icon: Calendar,
      href: '/admin/events',
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Blog Posts',
      value: stats.totalBlogs,
      icon: FileText,
      href: '/admin/blog',
      color: 'bg-indigo-50 dark:bg-indigo-950',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Gallery Items',
      value: stats.totalGalleryItems,
      icon: Image,
      href: '/admin/gallery',
      color: 'bg-pink-50 dark:bg-pink-950',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
    {
      label: 'Contact Messages',
      value: stats.totalContacts,
      icon: MessageSquare,
      href: '/admin/contacts',
      color: 'bg-red-50 dark:bg-red-950',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Volunteer Apps',
      value: stats.totalVolunteers,
      icon: Users,
      href: '/admin/volunteers',
      color: 'bg-teal-50 dark:bg-teal-950',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
    {
      label: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: Star,
      href: '/admin/reviews',
      color: 'bg-yellow-50 dark:bg-yellow-950',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
  ]

  return (
    <AdminLayout userName={session.name}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {session.name}!</h2>
          <p className="text-white/90">
            Manage your NGO content, campaigns, and community interactions from here.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={`${card.href}-${card.label}`} href={card.href}>
                <Card className={`p-6 hover:shadow-md hover:scale-105 transition-all cursor-pointer ${card.color}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{card.value}</p>
                      {card.subtitle && (
                        <p className="text-lg font-semibold text-primary mt-1">{card.subtitle}</p>
                      )}
                    </div>
                    <Icon className={`h-10 w-10 ${card.iconColor}`} />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Recent Transactions</h3>
              <Link href="/admin/donations">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            {stats.recentTransactions && stats.recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {stats.recentTransactions.slice(0, 5).map((tx: any) => (
                  <div key={tx._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{tx.donorName}</p>
                      <p className="text-xs text-muted-foreground">{tx.donorEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{tx.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">No transactions yet</p>
            )}
          </Card>

          {/* Recent Contacts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Recent Contact Messages</h3>
              <Link href="/admin/contacts">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            {stats.recentContacts && stats.recentContacts.length > 0 ? (
              <div className="space-y-3">
                {stats.recentContacts.slice(0, 5).map((contact: any) => (
                  <div key={contact._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{contact.message}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground capitalize">{contact.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">No contact messages yet</p>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link href="/admin/campaigns">
              <Button variant="outline" className="w-full justify-start">
                <Heart className="w-4 h-4 mr-2" />
                Manage Campaigns
              </Button>
            </Link>
            <Link href="/admin/events">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Events
              </Button>
            </Link>
            <Link href="/admin/blog">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Manage Blog Posts
              </Button>
            </Link>
            <Link href="/admin/reviews">
              <Button variant="outline" className="w-full justify-start">
                <Star className="w-4 h-4 mr-2" />
                Review Approvals
              </Button>
            </Link>
            <Link href="/admin/gallery">
              <Button variant="outline" className="w-full justify-start">
                <Image className="w-4 h-4 mr-2" />
                Manage Gallery
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full justify-start">
                Manage Settings
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
