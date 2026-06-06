import { notFound } from "next/navigation";
import { Campaign } from "@/lib/models";
import { connectDB, isMongoConnected } from "@/lib/mongodb";
import { mockCampaigns } from "@/lib/mock-data.ts";
import CampaignDetailClient from "./campaign-detail-client";
import { Metadata } from "next";

interface CampaignDetailProps {
  params: Promise<{ slug: string }>;
}

async function getCampaign(slug: string) {
  if (await isMongoConnected()) {
    await connectDB();
    const campaign = await Campaign.findOne({ slug }).lean();
    if (!campaign) return null;
    return JSON.parse(JSON.stringify(campaign));
  }
  
  // Fallback to mock data
  return mockCampaigns.find((c) => c.slug === slug) || null;
}

async function getRelatedCampaigns(currentSlug: string, category?: string) {
  if (await isMongoConnected()) {
    await connectDB();
    const query: any = { slug: { $ne: currentSlug }, status: "active" };
    if (category) query.category = category;
    
    const campaigns = await Campaign.find(query)
      .limit(3)
      .select("title slug description image goal raised")
      .lean();
    return JSON.parse(JSON.stringify(campaigns));
  }
  
  return mockCampaigns
    .filter((c) => c.slug !== currentSlug && c.status === "active")
    .slice(0, 3);
}

export async function generateMetadata({ params }: CampaignDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  
  if (!campaign) {
    return {
      title: "Campaign Not Found | Sansar Kalyan Trust",
    };
  }
  
  return {
    title: `${campaign.title} | Sansar Kalyan Trust`,
    description: campaign.seoDescription || campaign.description,
    openGraph: {
      title: campaign.title,
      description: campaign.description,
      images: campaign.image ? [{ url: campaign.image }] : [],
      type: "article",
    },
  };
}

export default async function CampaignDetailPage({ params }: CampaignDetailProps) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  
  if (!campaign) {
    notFound();
  }
  
  const relatedCampaigns = await getRelatedCampaigns(slug, campaign.category);
  
  return (
    <CampaignDetailClient 
      campaign={campaign} 
      relatedCampaigns={relatedCampaigns} 
    />
  );
}
