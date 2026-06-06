"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { Lightbox } from "@/components/lightbox";
import { FadeIn } from "@/components/motion-wrapper";

interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  image: string;
  category?: string;
}

// Fallback images from /public
const fallbackImages: GalleryImage[] = [
  {
    _id: "1",
    title: "Health Camp",
    image: "/medicine_camp.jpeg",
    category: "Health",
  },
  {
    _id: "2",
    title: "Education Program",
    image: "/school_camp.jpeg",
    category: "Education",
  },
  {
    _id: "3",
    title: "Tree Plantation",
    image: "/Activity-plants.jpeg",
    category: "Environment",
  },
  {
    _id: "4",
    title: "Cloth Distribution",
    image: "/help_cloth_charity.jpeg",
    category: "Charity",
  },
  {
    _id: "5",
    title: "Community Activity",
    image: "/Activity-camp.jpeg",
    category: "Community",
  },
  {
    _id: "6",
    title: "Helping Hands",
    image: "/Help_activity.jpeg",
    category: "Charity",
  },
  {
    _id: "7",
    title: "Child Support",
    image: "/Help_childs.jpeg",
    category: "Education",
  },
  {
    _id: "8",
    title: "Founder",
    image: "/founder_SankarRana.jpeg",
    category: "Team",
  },
  {
    _id: "9",
    title: "Hero Banner",
    image: "/hero.png",
    category: "General",
  },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(fallbackImages);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery?limit=50", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setImages(data.data);
          const cats = ["All", ...(data.data.map((img: any) => img.category).filter(Boolean) as string[])];
          setCategories(cats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const lightboxImages = filteredImages.map((img) => img.image);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="Gallery"
          subtitle="Moments from our camps, drives, and community work."
        />

        {/* Category Filter */}
        <section className="py-8 bg-background border-b sticky top-16 z-30">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No images found in this category.
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredImages.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted hover:shadow-xl transition-all duration-300">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-white/80 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.category && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 text-xs font-medium rounded-full">
                          {item.category}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  );
}
