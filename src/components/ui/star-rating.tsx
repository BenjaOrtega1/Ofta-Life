import { Star } from "lucide-react";

export function StarRating({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={index < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-foreground/18"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
