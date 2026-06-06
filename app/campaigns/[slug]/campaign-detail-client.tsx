"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RazorpayButton } from "@/components/razorpay-button";
import { Users, Heart, Share2, ArrowLeft, Calendar } from "lucide-react";

interface Campaign {
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
  status: string;
  category?: string;
}

interface CampaignDetailClientProps {
  campaign: Campaign;
  relatedCampaigns: Campaign[];
}

export default function CampaignDetailClient({
  campaign,
  relatedCampaigns,
}: CampaignDetailClientProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const remaining = campaign.goal - campaign.raised;

  const allImages = [campaign.image, ...(campaign.galleryImages || [])].filter(Boolean) as string[];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: campaign.description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto max-w-6xl px-4">
            <Link
              href="/campaigns"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campaigns
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Image Gallery */}
              <div>
                {allImages.length > 0 ? (
                  <div className="space-y-4">
                    <motion.div
                      key={currentImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                    >
                      <Image
                        src={allImages[currentImage]}
                        alt={campaign.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </motion.div>

                    {allImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {allImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImage(idx)}
                            className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                              currentImage === idx
                                ? "ring-2 ring-primary"
                                : "opacity-60 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`${campaign.title} ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Heart className="w-24 h-24 text-primary/40" />
                  </div>
                )}
              </div>

              {/* Right: Campaign Info */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {campaign.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {campaign.description}
                  </p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">
                      ₹{campaign.raised.toLocaleString()} raised
                    </span>
                    <span className="text-muted-foreground">
                      ₹{campaign.goal.toLocaleString()} goal
                    </span>
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="p-4 rounded-lg bg-muted/30">
                    <Users className="w-5 h-5 text-primary mb-2" />
                    <div className="text-2xl font-bold">{campaign.donors}</div>
                    <div className="text-sm text-muted-foreground">Donors</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <Heart className="w-5 h-5 text-primary mb-2" />
                    <div className="text-2xl font-bold">
                      ₹{remaining.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Remaining
                    </div>
                  </div>
                </motion.div>

                {(campaign.startDate || campaign.endDate) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex gap-4 text-sm text-muted-foreground"
                  >
                    {campaign.startDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Starts {new Date(campaign.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {campaign.endDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Ends {new Date(campaign.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share this campaign
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Make a Donation
              </h2>

              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium">
                  Select Amount
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[500, 1000, 2500, 5000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        donationAmount === amount
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      ₹{amount.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Custom Amount
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={donorInfo.name}
                      onChange={(e) =>
                        setDonorInfo({ ...donorInfo, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={donorInfo.email}
                      onChange={(e) =>
                        setDonorInfo({ ...donorInfo, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={donorInfo.phone}
                    onChange={(e) =>
                      setDonorInfo({ ...donorInfo, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <RazorpayButton
                amount={donationAmount}
                donorName={donorInfo.name || "Anonymous"}
                donorEmail={donorInfo.email || "donor@example.com"}
                donorPhone={donorInfo.phone}
                campaignSlug={campaign.slug}
                onSuccess={() => {
                  alert(
                    "Thank you for your generous donation! You will receive a confirmation email shortly."
                  );
                  window.location.reload();
                }}
              />
            </motion.div>
          </div>
        </section>

        {/* Full Description */}
        {campaign.fullDescription && (
          <section className="py-16 bg-background">
            <div className="container mx-auto max-w-6xl px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">About This Campaign</h2>
                <div className="prose prose-lg max-w-none">
                  {campaign.fullDescription.split("\n").map((paragraph, idx) => (
                    <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Related Campaigns */}
        {relatedCampaigns.length > 0 && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto max-w-6xl px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">Related Campaigns</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedCampaigns.map((related) => (
                    <Link
                      key={related._id}
                      href={`/campaigns/${related.slug}`}
                      className="block group"
                    >
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                      >
                        {related.image && (
                          <div className="relative aspect-video">
                            <Image
                              src={related.image}
                              alt={related.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                            {related.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {related.description}
                          </p>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${Math.min(
                                  (related.raised / related.goal) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                            <span>₹{related.raised.toLocaleString()}</span>
                            <span>₹{related.goal.toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
