import bcryptjs from 'bcryptjs'
import { connectDB } from './mongodb'
import { User, Campaign, Event, Blog, Gallery, Testimonial, Settings } from './models'

const defaultSettings = [
  {
    key: 'homepage_hero',
    value: {
      title: 'Sansar Kalyan Trust',
      subtitle: 'Har Daan Ek Pehchaan',
      description: 'Empowering communities through education, health, and environment.',
      ctaText: 'Donate Now',
      ctaLink: '/donate',
    },
  },
  {
    key: 'impact_numbers',
    value: {
      familiesHelped: 5000,
      eventsOrganized: 150,
      volunteersActive: 200,
      donationsReceived: 1200000,
    },
  },
  {
    key: 'about_content',
    value: {
      mission: 'To uplift underprivileged communities through accessible healthcare, quality education, and sustainable environmental initiatives.',
      vision: 'A world where every individual has access to healthcare, education, and opportunities for growth regardless of their socio-economic background.',
      description: 'Sansar Kalyan Trust is a registered non-profit organization working across India to bring positive change in communities through healthcare camps, free education programs, environmental conservation, and community welfare initiatives.',
    },
  },
  {
    key: 'footer_data',
    value: {
      address: 'Rohtak, Haryana, India',
      phone: '+91 9999999999',
      email: 'info@sansarkalyan.org',
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
      address: 'Rohtak, Haryana, India',
      phone: '+91 9999999999',
      email: 'info@sansarkalyan.org',
      officeHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
    },
  },
]

const defaultTestimonials = [
  {
    name: 'Sankar Rana',
    designation: 'Founder, Sansar Kalyan Trust',
    message: 'Our mission is to create a lasting impact in the lives of those who need it most. Every small act of kindness can change the world.',
    photo: '/founder_SankarRana.jpeg',
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
    slug: 'free-night-street-education',
    title: 'Free Night Street Education',
    description: 'Empowering underprivileged children through free education programs conducted in evening hours for those who work during the day.',
    fullDescription: 'Our night education program provides free tutoring and skill development for children who cannot attend school during the day. We operate learning centers in multiple locations, offering basic literacy, numeracy, and life skills training to help break the cycle of poverty.',
    image: '/school_camp.jpeg',
    galleryImages: ['/school_camp2.jpeg', '/school_students_help.jpeg', '/gifts_students.jpeg'],
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
    slug: 'education-drive',
    title: 'Free Night Education Drive',
    description: 'Interactive learning session for underprivileged children with books, stationery, and refreshments provided.',
    image: '/school_camp.jpeg',
    images: ['/school_camp2.jpeg', '/gifts_students.jpeg'],
    date: new Date('2024-12-20'),
    time: '6:00 PM - 9:00 PM',
    venue: 'Open Ground, Sector 5, Rohtak',
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
    title: 'Winter Cloth Distribution',
    description: '500+ families benefited from our cloth distribution drive. Warm clothes distributed to those in need.',
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
    slug: 'health-camp-impact-story',
    title: 'Health Camp Impact: 500+ Lives Touched',
    description: 'Read how our health camps are bringing medical care to remote villages and changing lives.',
    content: `Our recent health camp in Rohtak district touched over 500 lives in a single day. With a team of 15 doctors and 30 volunteers, we provided free medical checkups, distributed medicines, and organized health awareness sessions.\n\nThe camp focused on common health issues affecting rural populations including diabetes screening, blood pressure monitoring, eye checkups, and dental consultations. Many patients received their first professional medical consultation ever.\n\nKey Highlights:\n- 500+ patients examined\n- Free medicines distributed worth ₹2,00,000\n- 50 patients referred for specialist treatment\n- Health awareness materials distributed in Hindi\n\nWe are committed to organizing monthly health camps across different villages to ensure healthcare reaches every doorstep.`,
    image: '/medicine_camp.jpeg',
    category: 'Healthcare',
    tags: ['health camp', 'rural healthcare', 'community service'],
    author: 'Sansar Kalyan Trust',
    readTime: 4,
    published: true,
  },
  {
    slug: 'education-initiative-success',
    title: 'Breaking Barriers: Night Education Success',
    description: 'Stories of children who are now pursuing their dreams through our free night education program.',
    content: `Our Free Night Education program has been transforming lives since its inception. Children who work during the day to support their families now have access to quality education in the evening hours.\n\nThis month, we celebrate the success of 30 students who appeared for their board examinations after preparing through our night school program. These students, aged 12-18, attend our classes from 6 PM to 9 PM daily.\n\nOur curriculum covers:\n- Basic literacy and numeracy\n- Hindi and English language skills\n- Mathematics and Science fundamentals\n- Computer basics\n- Life skills and personality development\n\nWe provide free books, stationery, and refreshments to all students. Our dedicated volunteer teachers ensure each child receives personalized attention.`,
    image: '/school_camp.jpeg',
    category: 'Education',
    tags: ['education', 'night school', 'underprivileged children'],
    author: 'Sansar Kalyan Trust',
    readTime: 5,
    published: true,
  },
  {
    slug: 'environmental-conservation-drive',
    title: 'Green Future: Our Tree Plantation Journey',
    description: 'How our community is working together to plant 10,000 trees and create a sustainable environment.',
    content: `Sansar Kalyan Trust has embarked on an ambitious mission to plant 10,000 trees across Haryana. Our environmental conservation drive brings together volunteers, school children, and community members to create a greener, healthier environment.\n\nSo far, we have planted over 3,000 trees including neem, peepal, mango, and ashoka varieties. Each planted tree is maintained by our volunteer network for the first year to ensure survival.\n\nOur Environmental Initiatives:\n- Tree plantation drives every month\n- Awareness workshops in schools\n- Plastic-free campaigns\n- Water conservation projects\n- Composting training for farmers\n\nJoin us in our next plantation drive and be part of the solution to climate change.`,
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
    // Seed Super Admin
    const existingAdmin = await User.findOne({ email: 'admin@sansarkalyan.org' })
    if (!existingAdmin) {
      const hashedPassword = await bcryptjs.hash('Admin@123', 10)
      await User.create({
        email: 'admin@sansarkalyan.org',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'superadmin',
        isActive: true,
      })
      console.log('Super Admin created: admin@sansarkalyan.org / Admin@123')
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
