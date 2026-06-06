'use client'

import { useEvents } from '@/lib/hooks/useApi'
import { ContentCard } from '@/components/content-card'
import { Skeleton } from '@/components/ui/skeleton'

export function EventsList() {
  const { events, isLoading, isError } = useEvents()

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full h-48 rounded-lg" />
              <Skeleton className="w-full h-4 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          Unable to load events. Please try again later.
        </p>
      </div>
    )
  }

  const upcomingEvents = events.filter((e: any) => new Date(e.date) > new Date())
  const pastEvents = events.filter((e: any) => new Date(e.date) <= new Date())

  return (
    <div className="space-y-16">
      {/* Upcoming */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
          Upcoming
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event: any) => (
              <ContentCard
                key={event.slug}
                image={event.image}
                alt={event.title}
                title={event.title}
                description={`${event.description} · ${event.type}`}
                date={event.date}
                href={`/events/${event.slug}`}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No upcoming events at this time.</p>
          )}
        </div>
      </div>

      {/* Past */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Past Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event: any) => (
              <ContentCard
                key={event.slug}
                image={event.image}
                alt={event.title}
                title={event.title}
                description={event.description}
                date={event.date}
                href={`/events/${event.slug}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
