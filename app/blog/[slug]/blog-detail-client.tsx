"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  content: string;
  category: string;
  tags?: string[];
  author?: string;
  readTime?: number;
  published: boolean;
  createdAt: string;
}

interface BlogDetailClientProps {
  blog: Blog;
  relatedBlogs: Blog[];
}

export default function BlogDetailClient({ blog, relatedBlogs }: BlogDetailClientProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description,
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto max-w-4xl px-4">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {blog.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{blog.readTime} min read</span>
                  </div>
                )}
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{blog.author}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-muted-foreground mb-6">
                {blog.description}
              </p>

              {/* Category and Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {blog.category}
                </span>
                {blog.tags && blog.tags.length > 0 && (
                  <>
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-muted rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </motion.div>

            {/* Featured Image */}
            {blog.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative aspect-video rounded-2xl overflow-hidden mb-12"
              >
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}

            {/* Share Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors mb-8"
            >
              <Share2 className="w-4 h-4" />
              Share this post
            </motion.button>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 bg-background">
          <div className="container mx-auto max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              {blog.content.split("\n").map((paragraph, idx) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h1 key={idx} className="text-4xl font-bold mt-8 mb-4">
                      {paragraph.replace("# ", "")}
                    </h1>
                  );
                } else if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="text-3xl font-bold mt-8 mb-4">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                } else if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={idx} className="text-2xl font-bold mt-6 mb-3">
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                } else if (paragraph.startsWith("- ")) {
                  return (
                    <li key={idx} className="text-muted-foreground mb-2 ml-4">
                      {paragraph.replace("- ", "")}
                    </li>
                  );
                } else if (paragraph.trim()) {
                  return (
                    <p
                      key={idx}
                      className="text-muted-foreground leading-relaxed mb-4"
                    >
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </motion.div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto max-w-6xl px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedBlogs.map((related) => (
                    <Link
                      key={related._id}
                      href={`/blog/${related.slug}`}
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
                          <span className="text-xs font-medium text-primary mb-2 block">
                            {related.category}
                          </span>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {related.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{related.readTime} min read</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
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
