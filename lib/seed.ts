import bcryptjs from 'bcryptjs'
import { connectDB } from './mongodb'
import { User, Campaign, Event, Blog, Gallery, Testimonial, Settings } from './models'
import {
  aboutParagraphs,
  achievements,
  contactDetails,
  englishTagline,
  organizationName,
} from './site-content'

const defaultSettings = [
  {
    key: 'homepage_hero',
    value: {
      title: organizationName,
      subtitle: englishTagline,
      description: aboutParagraphs.join(' '),
      ctaText: 'Donate Now',
      ctaLink: '/donate',
    },
  },
  {
    key: 'impact_numbers',
    value: {
      treesPlanted: achievements[0].value,
      notebooksMade: achievements[1].value,
      healthAwarenessCamps: achievements[2].value,
      animalsProtected: achievements[3].value,
    },
  },
  {
    key: 'about_content',
    value: {
      mission: aboutParagraphs[1],
      vision: aboutParagraphs[0],
      description: aboutParagraphs.join(' '),
    },
  },
  {
    key: 'footer_data',
    value: {
      address: contactDetails.registeredAddress,
      phone: contactDetails.phone,
      email: contactDetails.email,
      socialLinks: {
        facebook: 'https://facebook.com/sansarkalyantrust',
        instagram: 'https://instagram.com/sansarkalyantrust',
        twitter: 'https://twitter.com/sansarkalyan',
        youtube: '',
      },
    },
  },
  {
    key: 'contact_info',
    value: {
      address: contactDetails.registeredAddress,
      phone: contactDetails.phone,
      whatsapp: contactDetails.phone,
      email: contactDetails.email,
      registrationNo: contactDetails.registrationNo,
      upi: contactDetails.upi,
    },
  },
]

const defaultTestimonials = [
  {
    name: 'Dr. Shekhar Rana',
    designation: 'Founder, Sansar Kalyan Trust',
    message: 'Our mission is to create a lasting impact in the lives of those who need it most. Every small act of kindness can change the world.',
    photo: '/founder_ShekharRana.jpeg',
    order: 1,
    isActive: true,
  },
  {
    name: 'Rajesh Kumar',
    designation: 'Volunteer Coordinator',
    message: 'Working with Sansar Kalyan Trust has been a life-changing experience. The impact we create together is truly remarkable.',
    photo: '/placeholder-user.jpg',
    order: 2,
    isActive: true,
  },
  {
    name: 'Priya Sharma',
    designation: 'Community Member',
    message: 'The health camps organized by Sansar Kalyan Trust provided free medical checkups for our entire village. We are grateful for their service.',
    photo: '/placeholder-user.jpg',
    order: 3,
    isActive: true,
  },
]

const defaultCampaigns = [
  {
    slug: 'har-daan-ek-pehchaan',
    title: 'Har Daan Ek Pehchaan',
    description: 'Every donation creates an identity for someone in need. Support our core mission of healthcare, education, and community development.',
    fullDescription: 'Har Daan Ek Pehchaan is our flagship campaign that embodies the spirit of Sansar Kalyan Trust. Every donation, no matter how small, creates a positive identity and impact in someone\'s life. Through this campaign, we fund our healthcare camps, education programs, and community development initiatives across rural India.',
    image: '/Help_activity.jpeg',
    galleryImages: ['/Help_childs.jpeg', '/help_families.jpeg', '/help_peoples.jpeg'],
    goal: 500000,
    raised: 125000,
    donors: 450,
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
  },
  {
    slug: 'swasth-samaj-sashakt-bharat',
    title: 'Swasth Samaj Sashakt Bharat',
    description: 'Supporting health camps and medical awareness programs in rural communities to ensure universal access to quality healthcare.',
    fullDescription: 'Our healthcare initiative brings free medical checkups, medicines, and health awareness to remote villages. We organize regular health camps with qualified doctors and medical professionals to serve communities that lack access to basic healthcare facilities.',
    image: '/medicine_camp.jpeg',
    galleryImages: ['/medicine_camp2.jpeg', '/Help-poor-peoples.jpeg'],
    goal: 300000,
    raised: 180000,
    donors: 320,
    status: 'active',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2025-06-30'),
  },
  {
    slug: 'sadak-suraksha-pashu-raksha',
    title: 'Sadak Suraksha Pashu Raksha',
    description: 'Street animal rescue and care program to protect and support stray animals across districts.',
    fullDescription: 'This campaign focuses on rescuing and caring for stray animals across multiple districts. We provide medical treatment, food, shelter, and rehabilitation for injured and abandoned animals, working towards a more compassionate society.',
    image: '/Activity-camp.jpeg',
    galleryImages: ['/Activity-1.jpeg', '/Activity-2.jpeg'],
    goal: 150000,
    raised: 45000,
    donors: 120,
    status: 'active',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2025-03-31'),
  },
  {
    slug: 'spread-of-education',
    title: 'Spread of Education',
    description: 'To ensure no child goes without learning — distributing books, notebooks, stationery; making upcycled copies from old textbooks.',
    fullDescription: 'To ensure no child goes without learning — distributing books, notebooks, stationery; making upcycled copies from old textbooks.',
    image: '/gifts_students.jpeg',
    galleryImages: ['/school_students_help.jpeg', '/gifts_students.jpeg'],
    goal: 200000,
    raised: 75000,
    donors: 200,
    status: 'active',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2025-12-31'),
  },
]

const defaultEvents = [
  {
    slug: 'health-camp-rohtak',
    title: 'Free Health Camp - Rohtak',
    description: 'Medical checkup and health awareness program for the community. Free medicines and consultation provided by experienced doctors.',
    image: '/medicine_camp.jpeg',
    images: ['/medicine_camp2.jpeg', '/Help-poor-peoples.jpeg'],
    date: new Date('2024-12-15'),
    time: '9:00 AM - 5:00 PM',
    venue: 'Community Hall, Rohtak, Haryana',
    type: 'Health Camp',
    status: 'upcoming',
  },
  {
    slug: 'education-outreach',
    title: 'Education Outreach',
    description: 'A volunteer displays APJ Kalam-inspired notebooks made for underprivileged students.',
    image: '/gifts_students.jpeg',
    images: ['/school_students_help.jpeg', '/gifts_students.jpeg'],
    date: new Date('2024-12-20'),
    time: '6:00 PM - 9:00 PM',
    venue: 'Rohtak, Haryana',
    type: 'Education',
    status: 'upcoming',
  },
  {
    slug: 'tree-plantation',
    title: 'Tree Plantation Drive',
    description: 'Community environmental conservation initiative. Join us to plant 500 trees and contribute to a greener tomorrow.',
    image: '/Activity-plants.jpeg',
    images: ['/Activity-plants2.jpeg', '/Activity-group-plants.jpeg'],
    date: new Date('2024-12-22'),
    time: '7:00 AM - 12:00 PM',
    venue: 'Village Park, Bhiwani Road, Rohtak',
    type: 'Environment',
    status: 'upcoming',
  },
  {
    slug: 'cloth-distribution-drive',
    title: 'Clothes & Food Drive',
    description: 'Children and families receive donated clothes and food during a community drive.',
    image: '/help_cloth_charity.jpeg',
    images: ['/Activity-cloth-help.jpeg', '/help_families.jpeg'],
    date: new Date('2024-03-15'),
    time: '10:00 AM - 4:00 PM',
    venue: 'Community Center, Rohtak',
    type: 'Charity',
    status: 'completed',
  },
]

const defaultBlogs = [
  {
    slug: 'swasth-samaj-sashakt-bharat',
    title: 'SWASTH SAMAJ SASHAKT BHARAT',
    description: '"When both humans and animals are healthy, society becomes truly strong."',
    content: `Free Veterinary Health Camps in gaushalas and rural areas — consultation, treatment, vaccination & de-worming.\n\nFree Human Health Camps for rural and labour communities — free BP, sugar check-ups, doctor consultation, free medicine.`,
    image: '/medicine_camp.jpeg',
    category: 'Healthcare',
    tags: ['health camp', 'rural healthcare', 'community service'],
    author: 'Sansar Kalyan Trust',
    readTime: 4,
    published: true,
  },
  {
    slug: 'spread-of-education',
    title: 'Spread of Education',
    description: 'To ensure no child goes without learning — distributing books, notebooks, stationery; making upcycled copies from old textbooks.',
    content: `To ensure no child goes without learning — distributing books, notebooks, stationery; making upcycled copies from old textbooks.`,
    image: '/gifts_students.jpeg',
    category: 'Education',
    tags: ['education', 'notebooks', 'underprivileged children'],
    author: 'Sansar Kalyan Trust',
    readTime: 5,
    published: true,
  },
  {
    slug: 'protection-of-nature',
    title: 'Protection of Nature',
    description: 'To conserve the environment through tree plantation drives, awareness campaigns, and distributing saplings to schools and communities.',
    content: `To conserve the environment through tree plantation drives, awareness campaigns, and distributing saplings to schools and communities.`,
    image: '/Activity-plants.jpeg',
    category: 'Environment',
    tags: ['tree plantation', 'environment', 'green initiative'],
    author: 'Sansar Kalyan Trust',
    readTime: 4,
    published: true,
  },
]

const defaultGallery = [
  { title: 'Health Camp 2024', image: '/medicine_camp.jpeg', category: 'Healthcare', description: 'Free health checkup camp for villagers', order: 1 },
  { title: 'Medicine Distribution', image: '/medicine_camp2.jpeg', category: 'Healthcare', description: 'Free medicine distribution at health camp', order: 2 },
  { title: 'Education Program', image: '/school_camp.jpeg', category: 'Education', description: 'Night education classes for underprivileged children', order: 3 },
  { title: 'Student Gifts', image: '/gifts_students.jpeg', category: 'Education', description: 'Distribution of books and stationery', order: 4 },
  { title: 'Tree Plantation', image: '/Activity-plants.jpeg', category: 'Environment', description: 'Community tree plantation drive', order: 5 },
  { title: 'Group Plantation', image: '/Activity-group-plants.jpeg', category: 'Environment', description: 'Volunteers planting trees together', order: 6 },
  { title: 'Cloth Distribution', image: '/help_cloth_charity.jpeg', category: 'Charity', description: 'Distributing warm clothes to families', order: 7 },
  { title: 'Community Help', image: '/Help_activity.jpeg', category: 'Community', description: 'Supporting families in need', order: 8 },
  { title: 'Children Support', image: '/Help_childs.jpeg', category: 'Community', description: 'Helping underprivileged children', order: 9 },
  { title: 'Family Aid', image: '/help_families.jpeg', category: 'Community', description: 'Providing essentials to families', order: 10 },
  { title: 'Community Camp', image: '/Activity-camp.jpeg', category: 'Events', description: 'Community awareness camp', order: 11 },
  { title: 'Charity Event', image: '/Activity-charity.jpeg', category: 'Charity', description: 'Charity event for the underprivileged', order: 12 },
]

export async function seedDatabase() {
  const db = await connectDB()
  if (!db) {
    console.log('No database connection. Skipping seed.')
    return
  }

  try {
    // Seed Super Admin from env
    const adminEmail = process.env.ADMIN_EMAIL || 'sansarkalyantrust@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'ShekharRana@123'
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() })
    if (!existingAdmin) {
      const hashedPassword = await bcryptjs.hash(adminPassword, 10)
      await User.create({
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        name: 'Super Admin',
        role: 'superadmin',
        isActive: true,
      })
      console.log(`Super Admin created: ${adminEmail}`)
    }

    // Seed Settings
    for (const setting of defaultSettings) {
      await Settings.findOneAndUpdate(
        { key: setting.key },
        { key: setting.key, value: setting.value },
        { upsert: true }
      )
    }
    console.log('Settings seeded')

    // Seed Testimonials
    const existingTestimonials = await Testimonial.countDocuments()
    if (existingTestimonials === 0) {
      await Testimonial.insertMany(defaultTestimonials)
      console.log('Testimonials seeded')
    }

    // Seed Campaigns
    const existingCampaigns = await Campaign.countDocuments()
    if (existingCampaigns === 0) {
      await Campaign.insertMany(defaultCampaigns)
      console.log('Campaigns seeded')
    }

    // Seed Events
    const existingEvents = await Event.countDocuments()
    if (existingEvents === 0) {
      await Event.insertMany(defaultEvents)
      console.log('Events seeded')
    }

    // Seed Blogs
    const existingBlogs = await Blog.countDocuments()
    if (existingBlogs === 0) {
      await Blog.insertMany(defaultBlogs)
      console.log('Blogs seeded')
    }

    // Seed Gallery
    const existingGallery = await Gallery.countDocuments()
    if (existingGallery === 0) {
      await Gallery.insertMany(defaultGallery)
      console.log('Gallery seeded')
    }

    console.log('Database seeding complete!')
  } catch (error) {
    console.error('Seeding error:', error)
  }
}
