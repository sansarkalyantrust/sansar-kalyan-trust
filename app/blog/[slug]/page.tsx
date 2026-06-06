import { notFound } from "next/navigation";
import { Blog } from "@/lib/models";
import { connectDB, isMongoConnected } from "@/lib/mongodb";
import { mockBlogs } from "@/lib/mock-data";
import BlogDetailClient from "./blog-detail-client";
import { Metadata } from "next";

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string) {
  if (await isMongoConnected()) {
    await connectDB();
    const blog = await Blog.findOne({ slug, published: true }).lean();
    if (!blog) return null;
    return JSON.parse(JSON.stringify(blog));
  }
  
  // Fallback to mock data
  return mockBlogs.find((b) => b.slug === slug && b.published) || null;
}

async function getRelatedBlogs(currentSlug: string, category?: string) {
  if (await isMongoConnected()) {
    await connectDB();
    const query: any = { slug: { $ne: currentSlug }, published: true };
    if (category) query.category = category;
    
    const blogs = await Blog.find(query)
      .limit(3)
      .select("title slug description image category author createdAt readTime")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(blogs));
  }
  
  return mockBlogs
    .filter((b) => b.slug !== currentSlug && b.published)
    .slice(0, 3);
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    return {
      title: "Blog Post Not Found | Sansar Kalyan Trust",
    };
  }
  
  return {
    title: `${blog.seoTitle || blog.title} | Sansar Kalyan Trust`,
    description: blog.seoDescription || blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: blog.image ? [{ url: blog.image }] : [],
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    notFound();
  }
  
  const relatedBlogs = await getRelatedBlogs(slug, blog.category);
  
  return (
    <BlogDetailClient blog={blog} relatedBlogs={relatedBlogs} />
  );
}
