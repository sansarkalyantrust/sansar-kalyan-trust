// Mock data for fallback when MongoDB is not available

export interface MockCampaign {
  _id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  image?: string;
  galleryImages?: string[];
  goal: number;
  raised: number;
  donors: number;
  startDate?: string;
  endDate?: string;
  status: "active" | "inactive" | "completed";
  category?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const mockCampaigns: MockCampaign[] = [
  {
    _id: "1",
    slug: "health-camp-rohtak",
    title: "Free Health Camp - Rohtak",
    description: "Medical checkup and health awareness program for the community.",
    fullDescription: "Join our comprehensive health camp providing free medical checkups, consultations, and health awareness programs for underprivileged communities in Rohtak.",
    image: "/medicine_camp.jpeg",
    galleryImages: ["/medicine_camp.jpeg"],
    goal: 50000,
    raised: 25000,
    donors: 45,
    startDate: "2024-12-15",
    endDate: "2024-12-20",
    status: "active",
    category: "Health",
  },
  {
    _id: "2",
    slug: "education-drive",
    title: "Free Night Education Drive",
    description: "Interactive learning session for underprivileged children.",
    fullDescription: "Our night education drive brings quality education to children who cannot attend regular schools due to various constraints.",
    image: "/school_camp.jpeg",
    galleryImages: ["/school_camp.jpeg"],
    goal: 30000,
    raised: 15000,
    donors: 30,
    startDate: "2024-12-20",
    endDate: "2025-01-20",
    status: "active",
    category: "Education",
  },
  {
    _id: "3",
    slug: "tree-plantation",
    title: "Tree Plantation Drive",
    description: "Community environmental conservation initiative.",
    fullDescription: "Join us in our mission to plant 1000 trees and create a greener environment for future generations.",
    image: "/Activity-plants.jpeg",
    galleryImages: ["/Activity-plants.jpeg"],
    goal: 20000,
    raised: 10000,
    donors: 25,
    startDate: "2024-12-22",
    endDate: "2024-12-25",
    status: "active",
    category: "Environment",
  },
];

export interface MockBlog {
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
  seoTitle?: string;
  seoDescription?: string;
}

export const mockBlogs: MockBlog[] = [
  {
    _id: "1",
    slug: "impact-of-health-camps",
    title: "Impact of Health Camps on Rural Communities",
    description: "How health camps are transforming healthcare access in rural areas.",
    image: "/medicine_camp.jpeg",
    content: "# Impact of Health Camps\n\nHealth camps play a crucial role in providing healthcare access to rural communities...\n\n## Key Benefits\n\n- Free medical checkups\n- Health awareness programs\n- Early disease detection\n\nOur health camps have helped over 500 families in the past year alone.",
    category: "Healthcare",
    tags: ["health", "community", "impact"],
    author: "Sansar Kalyan Trust",
    readTime: 5,
    published: true,
    createdAt: new Date("2024-11-15").toISOString(),
  },
  {
    _id: "2",
    slug: "education-for-all",
    title: "Education for All: Our Night School Initiative",
    description: "Bringing education to children who cannot attend regular schools.",
    image: "/school_camp.jpeg",
    content: "# Education for All\n\nOur night school initiative ensures that every child gets access to quality education...\n\n## Why Night Schools?\n\nMany children work during the day to support their families. Night schools provide them an opportunity to learn and grow.",
    category: "Education",
    tags: ["education", "children", "initiative"],
    author: "Sansar Kalyan Trust",
    readTime: 4,
    published: true,
    createdAt: new Date("2024-11-20").toISOString(),
  },
];
