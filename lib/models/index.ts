import mongoose from 'mongoose'

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin', 'editor'], default: 'admin' },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Campaign Schema
const campaignSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String },
    image: { type: String },
    galleryImages: [{ type: String }],
    goal: { type: Number, required: true },
    raised: { type: Number, default: 0 },
    donors: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'active' },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
)

// Event Schema
const eventSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    images: [{ type: String }],
    date: { type: Date, required: true },
    time: { type: String },
    venue: { type: String },
    type: { type: String, required: true },
    status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
)

// Blog Post Schema
const blogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: String, default: 'Sansar Kalyan Trust' },
    readTime: { type: Number, default: 5 },
    published: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
)

// Gallery Schema
const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    category: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Donation Schema
const donationSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    campaignSlug: { type: String },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['online', 'upi', 'bank', 'razorpay'], default: 'razorpay' },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    donorPhone: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionId: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    receipt: { type: String },
  },
  { timestamps: true }
)

// Contact Inquiry Schema
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  },
  { timestamps: true }
)

// Volunteer Application Schema
const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    skills: [{ type: String }],
    motivation: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
)

// Review Schema (NEW)
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Testimonial Schema (NEW)
const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    message: { type: String, required: true },
    photo: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Settings Schema (NEW)
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
)

// Create and export models
export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema)
export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)
export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)
export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema)
export const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema)
export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema)
export const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema)
export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)
export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema)
export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema)
