import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { googleReviews, googleReviewsSummary } from "../../data/google-reviews";
import { ReviewCard } from "../ui/review-card";
import { StarRating } from "../ui/star-rating";

const serif = { fontFamily: "'Instrument Serif', Georgia, serif" } as const;
const mono = { fontFamily: "'DM Mono', monospace" } as const;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ReviewsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: googleReviews.length > 2, skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasReviews = googleReviews.length > 0;
  const rating = googleReviewsSummary.businessRating;

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setSnapCount(emblaApi.scrollSnapList().length);
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || paused || googleReviews.length < 2) return;
    const timer = window.setInterval(() => emblaApi.scrollNext(), 6500);
    return () => window.clearInterval(timer);
  }, [emblaApi, paused]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  };

  return (
    <section id="resenas" className="overflow-hidden bg-white px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-5 text-[12px] tracking-[0.16em] uppercase text-primary" style={mono}>Reseñas</p>
          <h2 className="max-w-[760px] text-balance font-normal leading-[0.95] tracking-[-0.02em] text-foreground" style={{ ...serif, fontSize: "clamp(2.6rem, 7vw, 5rem)" }}>
            Historias de quienes confiaron en OftaLife
          </h2>
          <p className="mt-6 max-w-[520px] text-pretty text-[15px] leading-[1.78] text-foreground/60">
            Experiencias reales de pacientes que eligieron cuidar su visión con nosotros.
          </p>
        </div>

        <div className="md:text-right">
          <div className="flex items-center gap-3 md:justify-end">
            <span className="text-[4rem] font-medium leading-none tracking-[-0.03em] text-foreground">
              {rating ? rating.toFixed(1) : "--"}
            </span>
            <div>
              <StarRating rating={rating ?? 0} />
              <p className="mt-2 text-[12px] text-foreground/48" style={mono}>
                {googleReviewsSummary.totalReviews > 0 ? `${googleReviewsSummary.totalReviews} reseñas en Google` : "Reseñas verificables"}
              </p>
            </div>
          </div>
          <a
            href={googleReviewsSummary.googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] tracking-wide text-primary hover:underline"
          >
            Ver perfil en Google <ArrowRight size={12} />
          </a>
        </div>
      </div>

      <div className="mb-12 h-px w-full bg-foreground/10" />

      {!hasReviews && (
        <div className="mx-auto max-w-[780px] bg-[#f4f7fc] px-7 py-12 text-center md:px-12">
          <StarRating rating={0} />
          <p className="mx-auto mt-5 max-w-[560px] text-[23px] leading-[1.45] text-foreground" style={serif}>
            Pronto mostraremos aquí experiencias reales de pacientes de OftaLife.
          </p>
          <p className="mx-auto mt-4 max-w-[540px] text-[14px] leading-[1.75] text-foreground/56">
            Este espacio se actualiza manualmente con reseñas reales copiadas desde Google Business Profile y enlazadas a su fuente.
          </p>
          <a
            href={googleReviewsSummary.googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 bg-primary px-6 py-3.5 text-[13px] tracking-wide text-white transition hover:bg-[#15399f]"
          >
            Ver perfil en Google <ArrowRight size={14} />
          </a>
        </div>
      )}

      {hasReviews && (
        <div
          className="relative -mx-6 md:-mx-12 lg:-mx-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Carrusel de reseñas verificadas de Google"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y gap-5 px-6 md:px-12 lg:px-16">
              {googleReviews.map((review, index) => (
                <div
                  key={`${review.reviewerName}-${review.date}`}
                  className={cx(
                    "min-w-0 shrink-0 basis-[82%] md:basis-[520px]",
                    index !== selectedIndex && "md:basis-[420px]",
                  )}
                >
                  <ReviewCard review={review} featured={index === selectedIndex} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-5 px-6 md:px-12 lg:px-16">
            <div className="flex gap-2" aria-label="Indicadores de reseñas">
              {Array.from({ length: snapCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTo(index)}
                  className={cx("h-1.5 transition-all", index === selectedIndex ? "w-8 bg-primary" : "w-3 bg-foreground/16 hover:bg-foreground/32")}
                  aria-label={`Ir a reseña ${index + 1}`}
                  aria-current={index === selectedIndex}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={scrollPrev} className="grid size-11 place-items-center border border-foreground/12 text-foreground transition hover:border-foreground/32" aria-label="Reseña anterior">
                <ArrowLeft size={17} />
              </button>
              <button type="button" onClick={scrollNext} className="grid size-11 place-items-center bg-primary text-white transition hover:bg-[#15399f]" aria-label="Reseña siguiente">
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
