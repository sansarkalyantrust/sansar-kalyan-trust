"use client";

import { useState } from "react";
import { StarRating } from "./star-rating";
import { motion } from "framer-motion";

interface ReviewFormProps {
  onSuccess?: () => void;
}

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message || formData.rating === 0) {
      setError("Please fill in all fields and select a rating");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "", rating: 0 });
        onSuccess?.();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit review");
      }
    } catch (err) {
      setError("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-green-50 dark:bg-green-950 rounded-lg text-center"
      >
        <div className="text-green-600 dark:text-green-400 font-semibold text-lg">
          Thank you for your review!
        </div>
        <p className="text-green-700 dark:text-green-300 mt-2">
          Your review has been submitted and will be visible after approval.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Your Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email Address *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="john@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Rating *</label>
        <StarRating
          rating={formData.rating}
          onRate={(rating) => setFormData({ ...formData, rating })}
          interactive
          size={32}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Your Review *</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Share your experience..."
          required
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
