"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, Clock, MapPin, ArrowLeft, Share2, CheckCircle } from "lucide-react";

interface Event {
  _id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  date: string;
  time?: string;
  venue?: string;
  type: string;
  status: string;
}

interface EventDetailClientProps {
  event: Event;
  relatedEvents: Event[];
}

export default function EventDetailClient({ event, relatedEvents }: EventDetailClientProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date() || event.status === "completed";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  const allImages = [event.image, ...(event.images || [])].filter(Boolean) as string[];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto max-w-6xl px-4">
            <Link
              href="/events"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Image Gallery */}
              <div>
                {allImages.length > 0 ? (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                    >
                      <Image
                        src={allImages[0]}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </motion.div>

                    {allImages.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {allImages.slice(1, 4).map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-lg overflow-hidden"
                          >
                            <Image
                              src={img}
                              alt={`${event.title} ${idx + 2}`}
                              fill
                              className="object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Calendar className="w-24 h-24 text-primary/40" />
                  </div>
                )}
              </div>

              {/* Right: Event Info */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    {isPast ? (
                      <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Upcoming
                      </span>
                    )}
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {event.type}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {event.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {event.description}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold">Date & Time</div>
                      <div className="text-sm text-muted-foreground">
                        {eventDate.toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {event.time && <div>{event.time}</div>}
                      </div>
                    </div>
                  </div>

                  {event.venue && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold">Venue</div>
                        <div className="text-sm text-muted-foreground">
                          {event.venue}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share this event
                </motion.button>

                {!isPast && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Link
                      href="/contact"
                      className="block w-full py-3 px-6 bg-primary text-primary-foreground text-center font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Register for this Event
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto max-w-6xl px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">Related Events</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedEvents.map((related) => {
                    const relatedDate = new Date(related.date);
                    const relatedIsPast = relatedDate < new Date() || related.status === "completed";
                    
                    return (
                      <Link
                        key={related._id}
                        href={`/events/${related.slug}`}
                        className="block group"
                      >
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                        >
                          {related.image && (
                            <div className="relative aspect-video">
                              <Image
                                src={related.image}
                                alt={related.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              {relatedIsPast ? (
                                <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                                  Completed
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                  Upcoming
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {related.type}
                              </span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {related.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {related.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {relatedDate.toLocaleDateString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
