'use client'

import { useBlogPosts } from '@/lib/hooks/useApi'
import { ContentCard } from '@/components/content-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function BlogList() {
  const { posts, isLoading, isError } = useBlogPosts()
  const [searchQuery, setSearchQuery] = useState('')

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          Unable to load blog posts. Please try again later.
        </p>
      </div>
    )
  }

  const filteredPosts = searchQuery
    ? posts.filter((p: any) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts

  return (
    <div className="space-y-12">
      {/* Search */}
      <div className="w-full py-6 bg-card border-b border-border rounded-lg">
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Blog Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full h-48 rounded-lg" />
              <Skeleton className="w-full h-4 rounded" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post: any) => (
            <ContentCard
              key={post.slug}
              image={post.image}
              alt={post.title}
              title={post.title}
              description={post.description}
              date={post.date}
              badge={post.category}
              href={`/blog/${post.slug}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            {searchQuery ? 'No articles found matching your search.' : 'No blog posts available.'}
          </p>
        </div>
      )}
    </div>
  )
}
