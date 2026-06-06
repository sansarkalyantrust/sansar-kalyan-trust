"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

export function StarRating({ rating, onRate, size = 20, interactive = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star
            className={`w-${size / 5} h-${size / 5} ${
              star <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-muted-foreground"
            }`}
            size={size}
          />
        </button>
      ))}
    </div>
  );
}
