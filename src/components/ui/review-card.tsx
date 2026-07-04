import { ArrowRight, BadgeCheck } from "lucide-react";
import type { GoogleReview } from "../../data/google-reviews";
import { StarRating } from "./star-rating";

const mono = { fontFamily: "'DM Mono', monospace" } as const;

export function ReviewCard({ review, featured = false }: { review: GoogleReview; featured?: boolean }) {
  return (
    <article
      className={[
        "flex h-full min-h-[340px] flex-col bg-[#f4f7fc] p-7 transition-opacity md:p-8",
        featured ? "opacity-100" : "opacity-78",
      ].join(" ")}
    >
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-[13px] font-medium tracking-wide text-white">
            {review.reviewerInitials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium text-foreground">{review.reviewerName}</p>
            <p className="mt-1 text-[11px] text-foreground/44" style={mono}>{review.date}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      <p className="text-pretty text-[16px] leading-[1.82] text-foreground/68">&ldquo;{review.reviewText}&rdquo;</p>

      <div className="mt-auto pt-8">
        <div className="mb-5 inline-flex items-center gap-2 text-[11px] tracking-wide text-[#2A8A5B]">
          <BadgeCheck size={14} aria-hidden="true" />
          Resena verificada en Google
        </div>
        <a
          href={review.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="flex w-fit items-center gap-2 text-[12px] tracking-wide text-primary transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Abrir Google <ArrowRight size={13} />
        </a>
      </div>
    </article>
  );
}
