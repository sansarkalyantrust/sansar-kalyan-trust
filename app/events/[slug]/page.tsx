import { notFound } from "next/navigation";
import { Event } from "@/lib/models";
import { connectDB, isMongoConnected } from "@/lib/mongodb";
import { mockEvents } from "@/app/api/events/route";
import EventDetailClient from "./event-detail-client";
import { Metadata } from "next";

interface EventDetailProps {
  params: Promise<{ slug: string }>;
}

// Mock events from API route (for fallback)
const mockEventsData = [
  {
    slug: 'health-camp-rohtak',
    title: 'Free Health Camp - Rohtak',
    description: 'Medical checkup and health awareness program for the community.',
    image: '/medicine_camp.jpeg',
    images: ['/medicine_camp.jpeg'],
    date: new Date('2024-12-15').toISOString(),
    time: '9:00 AM - 5:00 PM',
    venue: 'Community Hall, Rohtak',
    type: 'Health Camp',
    status: 'upcoming',
  },
  {
    slug: 'education-drive',
    title: 'Free Night Education Drive',
    description: 'Interactive learning session for underprivileged children.',
    image: '/school_camp.jpeg',
    images: ['/school_camp.jpeg'],
    date: new Date('2024-12-20').toISOString(),
    time: '6:00 PM - 9:00 PM',
    venue: 'Open Ground, Sector 5, Rohtak',
    type: 'Education',
    status: 'upcoming',
  },
  {
    slug: 'tree-plantation',
    title: 'Tree Plantation Drive',
    description: 'Community environmental conservation initiative.',
    image: '/Activity-plants.jpeg',
    images: ['/Activity-plants.jpeg'],
    date: new Date('2024-12-22').toISOString(),
    time: '7:00 AM - 12:00 PM',
    venue: 'Village Park, Rohtak',
    type: 'Environment',
    status: 'upcoming',
  },
  {
    slug: 'cloth-distribution',
    title: 'Winter Cloth Distribution',
    description: '500+ families benefited from cloth distribution drive.',
    image: '/help_cloth_charity.jpeg',
    images: ['/help_cloth_charity.jpeg'],
    date: new Date('2024-03-15').toISOString(),
    time: '10:00 AM - 4:00 PM',
    venue: 'Community Center, Rohtak',
    type: 'Charity',
    status: 'completed',
  },
];

async function getEvent(slug: string) {
  if (await isMongoConnected()) {
    await connectDB();
    const event = await Event.findOne({ slug }).lean();
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
  }
  
  // Fallback to mock data
  return mockEventsData.find((e) => e.slug === slug) || null;
}

async function getRelatedEvents(currentSlug: string, type?: string) {
  if (await isMongoConnected()) {
    await connectDB();
    const query: any = { slug: { $ne: currentSlug } };
    if (type) query.type = type;
    
    const events = await Event.find(query)
      .limit(3)
      .select("title slug description image date time venue type status")
      .sort({ date: 1 })
      .lean();
    return JSON.parse(JSON.stringify(events));
  }
  
  return mockEventsData
    .filter((e) => e.slug !== currentSlug)
    .slice(0, 3);
}

export async function generateMetadata({ params }: EventDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  
  if (!event) {
    return {
      title: "Event Not Found | Sansar Kalyan Trust",
    };
  }
  
  return {
    title: `${event.seoTitle || event.title} | Sansar Kalyan Trust`,
    description: event.seoDescription || event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.image ? [{ url: event.image }] : [],
      type: "article",
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  
  if (!event) {
    notFound();
  }
  
  const relatedEvents = await getRelatedEvents(slug, event.type);
  
  return (
    <EventDetailClient event={event} relatedEvents={relatedEvents} />
  );
}
