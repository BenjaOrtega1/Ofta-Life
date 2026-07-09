import { BadgeCheck } from "lucide-react";

const mono = { fontFamily: "'DM Mono', monospace" } as const;

export interface Review {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  date: string;
  rating: number;
  reviewText: string;
}

export function ReviewCard({ review, featured = false }: { review: Review; featured?: boolean }) {
  return (
    <article
      className={[
        "flex h-full min-h-[300px] flex-col bg-[#f4f7fc] p-7 transition-opacity md:p-8",
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
        <div className="flex gap-1 text-[#ffc107]">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </div>

      <p className="text-pretty text-[16px] leading-[1.82] text-foreground/68">&ldquo;{review.reviewText}&rdquo;</p>

      <div className="mt-auto pt-8">
        <div className="inline-flex items-center gap-2 text-[11px] tracking-wide text-[#2A8A5B]">
          <BadgeCheck size={14} aria-hidden="true" />
          Paciente verificado
        </div>
      </div>
    </article>
  );
}
