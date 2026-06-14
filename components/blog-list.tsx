'use client'

import { useState, useEffect } from 'react'
import { ContentCard } from '@/components/content-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface BlogPost {
  slug: string
  title: string
  description: string
  image?: string
  category: string
  createdAt?: string
}

export function BlogList({ category, tag }: { category?: string; tag?: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 9

  useEffect(() => {
    setPage(1)
  }, [category, tag, searchQuery])

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(false)
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          published: 'true',
        })
        if (category) params.set('category', category)
        if (tag) params.set('tag', tag)
        if (searchQuery) params.set('search', searchQuery)

        const res = await fetch(`/api/blog?${params}`)
        const data = await res.json()
        setPosts(data.data || [])
        setTotalPages(data.pagination?.pages || 1)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [page, category, tag, searchQuery])

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Unable to load blog posts. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="w-full py-6 bg-card border-b border-border rounded-lg">
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full h-48 rounded-lg" />
              <Skeleton className="w-full h-4 rounded" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <ContentCard
                key={post.slug}
                image={post.image || '/Activity-camp.jpeg'}
                alt={post.title}
                title={post.title}
                description={post.description}
                date={post.createdAt || ''}
                badge={post.category}
                href={`/blog/${post.slug}`}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1) }}
                    className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => { e.preventDefault(); setPage(p) }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1) }}
                    className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
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
