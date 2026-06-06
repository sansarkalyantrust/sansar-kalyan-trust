"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StarRating } from "@/components/star-rating";
import { Trash2, Check, X, Star } from "lucide-react";

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/reviews" : `/api/reviews?status=${filter}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: string, value?: any) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...value }),
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reviews Management</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 border-b">
        {(["pending", "approved", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              filter === f
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
            {f === "pending" && reviews.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                {reviews.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-${i}`} className="p-6 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No reviews found.</p>
        </div>
      ) : (
        <motion.div layout className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{review.name}</h3>
                  <p className="text-sm text-muted-foreground">{review.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={review.rating} size={16} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                      review.status
                    )}`}
                  >
                    {review.status}
                  </span>
                  {review.featured && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <Star className="w-3 h-3 inline mr-1" />
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <p className="text-muted-foreground">{review.message}</p>

              {/* Actions */}
              <div className="flex gap-2">
                {review.status !== "approved" && (
                  <button
                    onClick={() => handleAction(review._id, "approve")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                )}
                {review.status !== "rejected" && (
                  <button
                    onClick={() => handleAction(review._id, "reject")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                )}
                <button
                  onClick={() =>
                    handleAction(review._id, "feature", {
                      featured: !review.featured,
                    })
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    review.featured
                      ? "bg-primary text-primary-foreground"
                      : "border hover:bg-muted"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  {review.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
