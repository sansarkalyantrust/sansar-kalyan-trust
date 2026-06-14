import { z } from 'zod'

export const cloudinaryAssetSchema = z.object({
  public_id: z.string(),
  secure_url: z.string().url(),
  asset_id: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  uploaded_at: z.union([z.string(), z.date()]).optional(),
})

// Campaign Validations
export const campaignCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  fullDescription: z.string().optional(),
  image: z.string().optional(),
  imageAsset: cloudinaryAssetSchema.optional(),
  galleryImages: z.array(z.string()).optional(),
  galleryAssets: z.array(cloudinaryAssetSchema).optional(),
  goal: z.number().positive('Goal must be a positive number'),
  raised: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['active', 'inactive', 'completed', 'draft', 'published']).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImageAsset: cloudinaryAssetSchema.optional(),
})

export const campaignUpdateSchema = campaignCreateSchema.partial()

// Event Validations
export const eventCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().optional(),
  imageAsset: cloudinaryAssetSchema.optional(),
  images: z.array(z.string()).optional(),
  galleryAssets: z.array(cloudinaryAssetSchema).optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  venue: z.string().optional(),
  location: z.string().optional(),
  registrationLink: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  status: z.enum(['upcoming', 'completed', 'draft', 'published']).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const eventUpdateSchema = eventCreateSchema.partial()

// Blog Validations
export const blogCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  image: z.string().optional(),
  imageAsset: cloudinaryAssetSchema.optional(),
  featuredImageAsset: cloudinaryAssetSchema.optional(),
  ogImageAsset: cloudinaryAssetSchema.optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  published: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'scheduled']).optional(),
  publishDate: z.string().optional(),
  scheduledPublishDate: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const blogUpdateSchema = blogCreateSchema.partial()

// Contact Validations
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// Volunteer Validations
export const volunteerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  city: z.string().min(2, 'City is required'),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  motivation: z.string().min(20, 'Please provide a brief motivation (min 20 chars)'),
})

// Donation Validations
export const donationSchema = z.object({
  amount: z.number().positive('Amount must be positive').min(1, 'Minimum donation is ₹1'),
  donorName: z.string().min(2, 'Name is required'),
  donorEmail: z.string().email('Invalid email'),
  donorPhone: z.string().optional(),
  campaignSlug: z.string().optional(),
  method: z.enum(['online', 'upi', 'bank', 'razorpay']).optional(),
})

// Review Validations
export const reviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// Testimonial Validations
export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  designation: z.string().min(2, 'Designation is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  photo: z.string().optional(),
  photoAsset: cloudinaryAssetSchema.optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
})

// Gallery Validations
export const gallerySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  imageAsset: cloudinaryAssetSchema.optional(),
  category: z.string().optional(),
  albumId: z.string().optional(),
  order: z.number().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export const galleryAlbumSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  coverAsset: cloudinaryAssetSchema.optional(),
  status: z.enum(['draft', 'published']).optional(),
  order: z.number().optional(),
})

export const impactStorySchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  content: z.string().min(50),
  featuredImageAsset: cloudinaryAssetSchema.optional(),
  galleryAssets: z.array(cloudinaryAssetSchema).optional(),
  status: z.enum(['draft', 'published']).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const teamMemberSchema = z.object({
  name: z.string().min(2),
  designation: z.string().min(2),
  bio: z.string().optional(),
  photoAsset: cloudinaryAssetSchema.optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
})

export const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  imageAsset: cloudinaryAssetSchema.optional(),
  link: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
})

// Auth Validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
  role: z.enum(['admin', 'editor']).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Settings Validations
export const settingsSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
})

export function syncMediaFields<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data } as Record<string, unknown>
  if (result.imageAsset && typeof result.imageAsset === 'object') {
    result.image = (result.imageAsset as { secure_url: string }).secure_url
  }
  if (result.featuredImageAsset && typeof result.featuredImageAsset === 'object') {
    result.image = (result.featuredImageAsset as { secure_url: string }).secure_url
  }
  if (result.photoAsset && typeof result.photoAsset === 'object') {
    result.photo = (result.photoAsset as { secure_url: string }).secure_url
  }
  if (Array.isArray(result.galleryAssets)) {
    result.galleryImages = (result.galleryAssets as { secure_url: string }[]).map((a) => a.secure_url)
    result.images = result.galleryImages
  }
  return result as T
}

// Helper to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
