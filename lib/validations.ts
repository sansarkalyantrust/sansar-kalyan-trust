import { z } from 'zod'

// Campaign Validations
export const campaignCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  fullDescription: z.string().optional(),
  image: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  goal: z.number().positive('Goal must be a positive number'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['active', 'inactive', 'completed']).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const campaignUpdateSchema = campaignCreateSchema.partial()

// Event Validations
export const eventCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  venue: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  status: z.enum(['upcoming', 'completed']).optional(),
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
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  published: z.boolean().optional(),
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
  order: z.number().optional(),
  isActive: z.boolean().optional(),
})

// Gallery Validations
export const gallerySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  category: z.string().optional(),
  order: z.number().optional(),
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

// Helper to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
