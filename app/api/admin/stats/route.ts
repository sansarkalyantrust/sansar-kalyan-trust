import { NextResponse } from "next/server";
import { connectDB, isMongoConnected } from "@/lib/mongodb";
import {
  Campaign,
  Event,
  Blog,
  Gallery,
  Contact,
  Volunteer,
  Donation,
  Review,
} from "@/lib/models";

export async function GET() {
  try {
    if (!(await isMongoConnected())) {
      // Return mock data if MongoDB not connected
      return NextResponse.json({
        totalCampaigns: 4,
        totalEvents: 3,
        totalBlogs: 3,
        totalGalleryItems: 6,
        totalContacts: 0,
        totalVolunteers: 0,
        totalDonations: 0,
        totalDonationAmount: 0,
        totalDonors: 0,
        pendingReviews: 0,
        recentTransactions: [],
        recentContacts: [],
      });
    }

    await connectDB();

    const [
      totalCampaigns,
      totalEvents,
      totalBlogs,
      totalGalleryItems,
      totalContacts,
      totalVolunteers,
      totalDonations,
      totalDonationAmount,
      totalDonors,
      pendingReviews,
    ] = await Promise.all([
      Campaign.countDocuments(),
      Event.countDocuments(),
      Blog.countDocuments({ published: true }),
      Gallery.countDocuments(),
      Contact.countDocuments(),
      Volunteer.countDocuments(),
      Donation.countDocuments({ status: "completed" }),
      Donation.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then((result) => (result.length > 0 ? result[0].total : 0)),
      Donation.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: "$donorEmail" } },
      ]).then((result) => result.length),
      Review.countDocuments({ status: "pending" }),
    ]);

    // Recent transactions
    const recentTransactions = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      totalCampaigns,
      totalEvents,
      totalBlogs,
      totalGalleryItems,
      totalContacts,
      totalVolunteers,
      totalDonations,
      totalDonationAmount,
      totalDonors,
      pendingReviews,
      recentTransactions,
      recentContacts,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
