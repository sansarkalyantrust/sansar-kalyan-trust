import mongoose from 'mongoose'

const cloudinaryAssetSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
    asset_id: { type: String, required: true },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    format: { type: String, default: 'jpg' },
    uploaded_at: { type: Date, default: Date.now },
  },
  { _id: false }
)

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin', 'editor'], default: 'admin' },
    avatar: { type: String },
    avatarAsset: cloudinaryAssetSchema,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Media Asset Library
const mediaAssetSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true, unique: true },
    secure_url: { type: String, required: true },
    asset_id: { type: String, required: true },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    format: { type: String, default: 'jpg' },
    uploaded_at: { type: Date, default: Date.now },
    folder: { type: String, required: true },
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
    imageAsset: cloudinaryAssetSchema,
    galleryImages: [{ type: String }],
    galleryAssets: [cloudinaryAssetSchema],
    goal: { type: Number, required: true },
    raised: { type: Number, default: 0 },
    donors: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'inactive', 'completed', 'draft', 'published'], default: 'active' },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ogImageAsset: cloudinaryAssetSchema,
  },
  { timestamps: true }
)
campaignSchema.index({ status: 1 })

// Event Schema
const eventSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    imageAsset: cloudinaryAssetSchema,
    images: [{ type: String }],
    galleryAssets: [cloudinaryAssetSchema],
    date: { type: Date, required: true },
    time: { type: String },
    venue: { type: String },
    location: { type: String },
    registrationLink: { type: String },
    type: { type: String, required: true },
    status: { type: String, enum: ['upcoming', 'completed', 'draft', 'published'], default: 'upcoming' },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
)
eventSchema.index({ status: 1 })

// Blog Post Schema
const blogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    imageAsset: cloudinaryAssetSchema,
    featuredImageAsset: cloudinaryAssetSchema,
    ogImageAsset: cloudinaryAssetSchema,
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: String, default: 'Sansar Kalyan Trust' },
    readTime: { type: Number, default: 5 },
    published: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
    publishDate: { type: Date },
    scheduledPublishDate: { type: Date },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
)
blogSchema.index({ category: 1 })
blogSchema.index({ tags: 1 })
blogSchema.index({ published: 1 })
blogSchema.index({ status: 1 })

// Gallery Album Schema
const galleryAlbumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    coverAsset: cloudinaryAssetSchema,
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Gallery Schema
const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    imageAsset: cloudinaryAssetSchema,
    category: { type: String },
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryAlbum' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
)

// Impact Story Schema
const impactStorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    featuredImageAsset: cloudinaryAssetSchema,
    galleryAssets: [cloudinaryAssetSchema],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
)

// Team Member Schema
const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    bio: { type: String },
    photo: { type: String },
    photoAsset: cloudinaryAssetSchema,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Banner Schema
const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String },
    imageAsset: cloudinaryAssetSchema,
    link: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
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

// Review Schema
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

// Testimonial Schema
const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    message: { type: String, required: true },
    photo: { type: String },
    photoAsset: cloudinaryAssetSchema,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Settings Schema
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
)

// Audit Log Schema
const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: String },
    email: { type: String, required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
)
auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ entityType: 1 })

// Page View Schema
const pageViewSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    referrer: { type: String },
    userAgent: { type: String },
    sessionId: { type: String },
  },
  { timestamps: true }
)
pageViewSchema.index({ createdAt: -1 })
pageViewSchema.index({ path: 1 })

export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const MediaAsset = mongoose.models.MediaAsset || mongoose.model('MediaAsset', mediaAssetSchema)
export const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema)
export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)
export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)
export const GalleryAlbum = mongoose.models.GalleryAlbum || mongoose.model('GalleryAlbum', galleryAlbumSchema)
export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema)
export const ImpactStory = mongoose.models.ImpactStory || mongoose.model('ImpactStory', impactStorySchema)
export const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema)
export const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema)
export const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema)
export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema)
export const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema)
export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)
export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema)
export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema)
export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema)
export const PageView = mongoose.models.PageView || mongoose.model('PageView', pageViewSchema)

export { cloudinaryAssetSchema }
