import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import type { Variants } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  Eye,
  Glasses,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { business, whatsappUrl } from "../constants/business";
import { LocationSection } from "../components/sections/location-section";
import { ReviewsSection } from "../components/sections/reviews-section";

const serif = { fontFamily: "'Instrument Serif', Georgia, serif" } as const;
const mono = { fontFamily: "'DM Mono', monospace" } as const;

const IMG = {
  clinic: "https://images.unsplash.com/photo-1759262151080-e05ba1c6294f?auto=format&fit=crop&w=1200&q=82",
  crystal: "https://images.unsplash.com/photo-1614715838608-dd527c46231d?auto=format&fit=crop&w=900&q=82",
  frames: "https://images.unsplash.com/photo-1711564354308-77285d9fe3c7?auto=format&fit=crop&w=900&q=82",
  sun: "https://images.unsplash.com/photo-1615210768832-159ca3912a05?auto=format&fit=crop&w=900&q=82",
  contacts: "https://images.unsplash.com/photo-1591643529995-aef2e1e6f281?auto=format&fit=crop&w=900&q=82",
  care: "https://images.unsplash.com/photo-1516117525866-d85459db7457?auto=format&fit=crop&w=900&q=82",
};

type Category = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  Icon: typeof Glasses;
};

type HeroBeat = {
  kicker: string;
  title: string;
  body: string;
  align?: "left" | "right";
  cta?: boolean;
};

const TOTAL_HERO_FRAMES = 486;
const HERO_FRAME_BASE = "/sequence/webp";
const HERO_AUTO_SCROLL_DURATION_MS = 9000;

const HERO_BEATS: HeroBeat[] = [
  {
    kicker: "OftaLife Bulnes",
    title: "Entrar a una visión más clara.",
    body: "Consulta oftalmológica, diagnóstico y óptica premium en un recorrido pensado para tu vida diaria.",
    cta: true,
  },
  {
    kicker: "Diagnóstico",
    title: "Primero entendemos tus ojos.",
    body: "La recomendación nace de una evaluación profesional: tu receta, tus hábitos y lo que necesitas resolver cada día.",
  },
  {
    kicker: "Cristales",
    title: "La precisión sigue contigo.",
    body: "Antirreflejo, progresivos, fotocromáticos y tratamientos elegidos para que ver bien no dependa solo de la consulta.",
    align: "right",
  },
  {
    kicker: "Monturas",
    title: "Lo clínico también puede sentirse propio.",
    body: "Monturas, lentes de contacto y asesoría de calce para que la solución tenga comodidad, presencia y criterio.",
  },
  {
    kicker: "Acompañamiento",
    title: "Ver bien. Vivir mejor.",
    body: "Ajustes, seguimiento y una experiencia cercana para que cada lente funcione después de salir por la puerta.",
    align: "right",
    cta: true,
  },
];

const CATEGORIES: Category[] = [
  {
    id: "cristales",
    title: "Cristales a medida",
    eyebrow: "Precisión diaria",
    description: "Cristales antirreflejo, fotocromáticos y progresivos calibrados para tu receta, tu trabajo y tus rutinas.",
    image: IMG.crystal,
    Icon: Sparkles,
  },
  {
    id: "monturas",
    title: "Monturas ópticas",
    eyebrow: "Calce y estilo",
    description: "Selección curada de monturas livianas, resistentes y favorecedoras para uso intensivo todos los días.",
    image: IMG.frames,
    Icon: Glasses,
  },
  {
    id: "sol",
    title: "Lentes de sol",
    eyebrow: "Protección urbana",
    description: "Filtros UV y diseños con carácter para proteger la vista sin perder presencia.",
    image: IMG.sun,
    Icon: Sun,
  },
  {
    id: "contacto",
    title: "Lentes de contacto",
    eyebrow: "Libertad visual",
    description: "Opciones diarias, mensuales y multifocales con acompañamiento para una adaptación cómoda.",
    image: IMG.contacts,
    Icon: Eye,
  },
  {
    id: "oftalmologia",
    title: "Atención oftalmológica",
    eyebrow: "Cuidado clínico",
    description: "Consulta profesional para detectar, corregir y acompañar cambios visuales con criterio médico.",
    image: IMG.care,
    Icon: ShieldCheck,
  },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function heroFrameSrc(frame: number) {
  return `${HERO_FRAME_BASE}/frame_${String(frame).padStart(5, "0")}.webp`;
}

function FadeUp({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DrawLine({ className = "", light = false }: { className?: string; light?: boolean }) {
  return <div className={cx("h-px w-full", light ? "bg-white/15" : "bg-foreground/10", className)} />;
}

function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  return <motion.div className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left bg-primary" style={{ scaleX }} />;
}

function Logo({ inverted = false, compact = false }: { inverted?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center">
      <span className="inline-flex flex-col justify-center" aria-label={business.businessName}>
        <span className={cx("font-semibold leading-none tracking-[-0.035em]", compact ? "text-[18px]" : "text-[30px]", inverted ? "text-white" : "text-[#1018df]")}>
          OftaLife
        </span>
        {!compact && (
          <span className={cx("mt-1 text-[10px] font-medium leading-none tracking-[0.01em]", inverted ? "text-[#49d45f]" : "text-[#0a9f23]")}>
            Ver bien, vivir mejor.
          </span>
        )}
      </span>
      <span className="sr-only">
        <span className="block text-[15px] font-medium tracking-tight">{business.businessName}</span>
        <span>{business.city}</span>
      </span>
    </span>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = [
    ["Inicio", "inicio"],
    ["Clínica", "clinica"],
    ["Catálogo", "catalogo"],
    ["Reseñas", "resenas"],
    ["Ubicación", "ubicacion"],
  ];

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("inicio");
      if (!hero) {
        setScrolled(window.scrollY > 36);
        return;
      }

      setScrolled(hero.getBoundingClientRect().bottom <= 86);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav
        className={cx(
          "fixed left-0 right-0 top-[2px] z-[60] flex h-[64px] items-center justify-between px-5 transition-all duration-500 md:px-10 lg:px-14",
          scrolled ? "bg-white/88 shadow-[0_1px_0_rgba(12,22,40,0.08)] backdrop-blur-xl" : "bg-transparent",
        )}
        aria-label="Navegación principal"
      >
        <a href="#inicio" aria-label="Ir al inicio">
          <Logo inverted={!scrolled} compact />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className={cx(
                "text-[12px] tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
                scrolled ? "text-foreground/68 hover:text-foreground" : "text-white/72 hover:text-white",
              )}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#agendar"
            className={cx(
              "hidden items-center gap-2 px-5 py-2.5 text-[12px] tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:inline-flex",
              scrolled ? "bg-primary text-white hover:bg-[#15399f]" : "bg-white text-foreground hover:bg-white/90",
            )}
          >
            <CalendarCheck size={14} />
            Agendar
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className={cx(
              "grid size-10 place-items-center border transition-colors md:hidden",
              scrolled ? "border-foreground/10 bg-white/70 text-foreground" : "border-white/24 bg-black/12 text-white backdrop-blur",
            )}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col bg-white px-6 pb-8 pt-24 md:hidden"
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <button type="button" onClick={() => setOpen(false)} className="absolute right-5 top-5 grid size-11 place-items-center text-foreground" aria-label="Cerrar menú">
            <X size={23} />
          </button>
          <Logo />
          <div className="mt-10">
            {links.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="block border-b border-foreground/10 py-4 text-[2rem] leading-none text-foreground"
                style={serif}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="mt-auto grid gap-3">
            <a href="#agendar" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 text-[13px] tracking-wide text-white">
              <CalendarCheck size={16} /> Agendar consulta
            </a>
            <a href={whatsappUrl} className="inline-flex items-center justify-center gap-2 border border-foreground/15 px-6 py-4 text-[13px] tracking-wide text-foreground">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
}

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const frameSrc = useMemo(() => heroFrameSrc(currentFrame), [currentFrame]);
  const activeBeatIndex = Math.min(HERO_BEATS.length - 1, Math.floor(progress * HERO_BEATS.length));

  useEffect(() => {
    if (reduceMotion) {
      setProgress(0);
      setCurrentFrame(1);
      return undefined;
    }

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
      const nextFrame = Math.min(TOTAL_HERO_FRAMES, Math.max(1, Math.round(nextProgress * (TOTAL_HERO_FRAMES - 1)) + 1));

      setProgress((value) => (Math.abs(value - nextProgress) > 0.001 ? nextProgress : value));
      setCurrentFrame((value) => (value === nextFrame ? value : nextFrame));
    };

    const requestUpdate = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const getHeroBounds = () => {
      const section = sectionRef.current;
      if (!section) return null;

      const start = section.offsetTop;
      const end = Math.max(start, start + section.offsetHeight - window.innerHeight);

      return { start, end };
    };

    const cancelAutoScroll = () => {
      if (scrollAnimationRef.current !== null) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }

      restoreScrollBehavior();
    };

    const shouldAutoAdvance = () => {
      const bounds = getHeroBounds();
      if (!bounds) return false;

      const scrollY = window.scrollY;
      return scrollY >= bounds.start - 2 && scrollY < bounds.end - 8;
    };

    let previousScrollBehavior: string | null = null;

    const forceInstantScroll = () => {
      if (previousScrollBehavior !== null) return;

      previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
    };

    const restoreScrollBehavior = () => {
      if (previousScrollBehavior === null) return;

      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      previousScrollBehavior = null;
    };

    const startAutoScroll = () => {
      const bounds = getHeroBounds();
      if (!bounds || scrollAnimationRef.current !== null) return;

      const startY = window.scrollY;
      const distance = bounds.end - startY;
      if (distance <= 8) return;

      const fullDistance = Math.max(1, bounds.end - bounds.start);
      const duration = Math.max(1800, HERO_AUTO_SCROLL_DURATION_MS * (distance / fullDistance));
      const startedAt = performance.now();

      forceInstantScroll();

      const step = (now: number) => {
        const elapsed = now - startedAt;
        const t = Math.min(1, elapsed / duration);
        window.scrollTo({ top: startY + distance * t, left: 0, behavior: "auto" });

        if (t < 1) {
          scrollAnimationRef.current = window.requestAnimationFrame(step);
          return;
        }

        scrollAnimationRef.current = null;
        window.scrollTo({ top: bounds.end, left: 0, behavior: "auto" });
        restoreScrollBehavior();
      };

      scrollAnimationRef.current = window.requestAnimationFrame(step);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY < -2) {
        cancelAutoScroll();
        return;
      }

      if (event.deltaY <= 2 || !shouldAutoAdvance()) return;

      event.preventDefault();
      startAutoScroll();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isInteractiveTarget = target instanceof HTMLElement && target.closest("a,button,input,textarea,select,[contenteditable='true']");
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isInteractiveTarget
      ) {
        return;
      }

      if (!["ArrowDown", "PageDown", " ", "End"].includes(event.key) || !shouldAutoAdvance()) return;

      event.preventDefault();
      startAutoScroll();
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const currentY = event.touches[0]?.clientY;

      if (startY === null || currentY === undefined) return;

      const deltaY = startY - currentY;

      if (deltaY < -12) {
        cancelAutoScroll();
        touchStartYRef.current = currentY;
        return;
      }

      if (deltaY <= 12 || !shouldAutoAdvance()) return;

      event.preventDefault();
      touchStartYRef.current = null;
      startAutoScroll();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAutoScroll();
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    let cancelled = false;
    let frame = 1;
    let timeoutId: number | undefined;

    const preloadNext = () => {
      if (cancelled || frame > TOTAL_HERO_FRAMES) return;

      const image = new Image();
      image.decoding = "async";
      image.src = heroFrameSrc(frame);
      frame += 1;
      timeoutId = window.setTimeout(preloadNext, frame < 72 ? 12 : 28);
    };

    preloadNext();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [reduceMotion]);

  return (
    <section id="inicio" ref={sectionRef} className="relative isolate min-h-[630vh] bg-[#070d1a] text-white">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#070d1a]">
        <img src={frameSrc} alt="" aria-hidden="true" draggable={false} className="h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,8,16,0.82),rgba(4,8,16,0.34)_42%,rgba(4,8,16,0.18)_64%,rgba(4,8,16,0.58))]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(4,8,16,0.76),rgba(4,8,16,0.08)_46%,rgba(4,8,16,0.28))]" />
        <HeroTextOverlay beat={HERO_BEATS[activeBeatIndex]} index={activeBeatIndex} />
        <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-20 h-px overflow-hidden bg-white/22 md:bottom-8 md:left-12 md:right-12 lg:left-16 lg:right-16" aria-hidden="true">
          <span className="block h-full origin-left bg-[#49d45f]" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span className="sr-only">Recorrido visual desde la entrada hasta el interior de OftaLife.</span>
      </div>
    </section>
  );
}

const HERO_EASE_SWIFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const HERO_EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

type HeroTextChoreography = {
  container: Variants;
  kicker: Variants;
  word: Variants;
  body: Variants;
  action: Variants;
};

function createHeroTextChoreography(direction: -1 | 1): HeroTextChoreography {
  return {
    container: {
      hidden: {},
      show: { transition: { delayChildren: 0.03, staggerChildren: 0.045 } },
    },
    kicker: {
      hidden: { opacity: 0, x: direction * 22, filter: "blur(2px)" },
      show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.46, ease: HERO_EASE_SOFT } },
    },
    word: {
      hidden: (wordIndex: number) => ({
        opacity: 0,
        x: direction * (18 + Math.min(wordIndex, 5) * 2),
        filter: "blur(2px)",
      }),
      show: (wordIndex: number) => ({
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: { duration: 0.5, delay: wordIndex * 0.026, ease: HERO_EASE_SWIFT },
      }),
    },
    body: {
      hidden: { opacity: 0, x: direction * 18, filter: "blur(2px)" },
      show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5, delay: 0.08, ease: HERO_EASE_SOFT } },
    },
    action: {
      hidden: { opacity: 0, x: direction * 14 },
      show: { opacity: 1, x: 0, transition: { duration: 0.44, delay: 0.14, ease: HERO_EASE_SOFT } },
    },
  };
}

const HERO_TEXT_CHOREOGRAPHIES: HeroTextChoreography[] = HERO_BEATS.map((beat, index) =>
  createHeroTextChoreography(beat.align === "right" || index % 2 === 1 ? 1 : -1),
);

function AnimatedHeroHeading({
  title,
  HeadingTag,
  choreography,
  reduceMotion,
}: {
  title: string;
  HeadingTag: "h1" | "h2";
  choreography: HeroTextChoreography;
  reduceMotion: boolean | null;
}) {
  const words = title.split(" ");

  return (
    <HeadingTag className="text-balance font-normal leading-[0.9] tracking-[-0.028em] text-white" style={{ ...serif, fontSize: "clamp(3.1rem, 10vw, 6rem)" }}>
      {words.map((word, wordIndex) => (
        <motion.span
          key={`${word}-${wordIndex}`}
          custom={wordIndex}
          variants={reduceMotion ? undefined : choreography.word}
          className="inline-block transform-gpu will-change-transform"
          style={{ marginRight: wordIndex < words.length - 1 ? "0.18em" : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </HeadingTag>
  );
}

function HeroTextOverlay({ beat, index }: { beat: HeroBeat; index: number }) {
  const reduceMotion = useReducedMotion();
  const HeadingTag = (index === 0 ? "h1" : "h2") as "h1" | "h2";
  const choreography = HERO_TEXT_CHOREOGRAPHIES[index % HERO_TEXT_CHOREOGRAPHIES.length];

  return (
    <div
      className={cx(
        "pointer-events-none absolute inset-0 z-10 flex items-end px-6 pb-24 pt-28 md:items-center md:px-12 md:py-28 lg:px-16",
        beat.align === "right" ? "md:justify-end" : "md:justify-start",
      )}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={beat.title}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          exit={reduceMotion ? undefined : { opacity: 0, x: beat.align === "right" ? 24 : -24, filter: "blur(3px)", transition: { duration: 0.34, ease: HERO_EASE_SOFT } }}
          variants={reduceMotion ? undefined : choreography.container}
          className={cx("pointer-events-auto max-w-[690px]", beat.align === "right" && "md:max-w-[620px]")}
          style={{ perspective: "900px", textShadow: "0 18px 42px rgba(0,0,0,0.42)" }}
        >
          <motion.p variants={reduceMotion ? undefined : choreography.kicker} className="mb-5 inline-flex border border-white/28 bg-black/28 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#70e67e] backdrop-blur-sm sm:text-[11px]" style={mono}>
            {beat.kicker}
          </motion.p>
          <AnimatedHeroHeading title={beat.title} HeadingTag={HeadingTag} choreography={choreography} reduceMotion={reduceMotion} />
          <motion.p variants={reduceMotion ? undefined : choreography.body} className="mt-6 max-w-[520px] text-pretty text-[16px] leading-[1.75] text-white/74 md:text-[18px]">
            {beat.body}
          </motion.p>
          {beat.cta && (
            <motion.div variants={reduceMotion ? undefined : choreography.action} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#catalogo" className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3.5 text-[13px] tracking-wide text-foreground transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Ver catálogo <ArrowRight size={15} />
              </a>
              <a href="#agendar" className="inline-flex items-center justify-center gap-2 border border-white/34 px-6 py-3.5 text-[13px] tracking-wide text-white transition-colors hover:border-white/62 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Agendar consulta
              </a>
            </motion.div>
          )}
          {index === 0 && (
            <motion.div variants={reduceMotion ? undefined : choreography.action} className="mt-10 flex items-center gap-2 text-white/34" style={mono}>
              <ChevronDown size={14} aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.24em]">Explorar</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Clinic() {
  return (
    <section id="clinica" className="bg-white px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <FadeUp>
          <p className="mb-5 text-[12px] tracking-[0.16em] uppercase text-primary" style={mono}>Clínica</p>
          <h2 className="max-w-[780px] text-balance font-normal leading-[0.95] tracking-[-0.02em] text-foreground" style={{ ...serif, fontSize: "clamp(2.6rem, 7vw, 5rem)" }}>
            Cuidado visual privado, cercano y bien resuelto.
          </h2>
        </FadeUp>
        <FadeUp delay={0.1} className="max-w-[560px] lg:justify-self-end">
          <p className="text-pretty text-[16px] leading-[1.8] text-foreground/66">
           En OftaLife creemos que cuidar tu visión va mucho más allá de una consulta. Te acompañamos en cada paso: desde la evaluación inicial hasta la elección de tus lentes, sus ajustes y el seguimiento, para que cada solución se adapte realmente a tu forma de vivir.
          </p>
        </FadeUp>
      </div>

      <DrawLine className="my-12 md:my-16" />

      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <FadeUp className="relative min-h-[420px] overflow-hidden bg-secondary md:min-h-[560px]">
          <img src={IMG.clinic} alt="Sala de espera luminosa de una clínica visual" className="h-full w-full object-cover" loading="lazy" />
        </FadeUp>
        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
          {[
            ["Evaluación completa", "Mirada clínica antes de recomendar cristales, monturas o lentes de contacto."],
            ["Asesoría óptica", "Calce, materiales y tratamientos elegidos para tu uso diario, no solo para la vitrina."],
            ["Acompañamiento", "Ajustes y orientación posterior para que la adaptación sea natural."],
          ].map(([title, text], index) => (
            <FadeUp key={title} delay={index * 0.08}>
              <div className="group border-t border-foreground/10 py-7">
                <span className="mb-6 block text-[11px] text-foreground/36" style={mono}>0{index + 1}</span>
                <h3 className="text-[20px] font-medium tracking-tight text-foreground">{title}</h3>
                <p className="mt-3 max-w-[420px] text-[14px] leading-[1.7] text-foreground/56">{text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Catalog() {
  const [active, setActive] = useState("todos");
  const visible = active === "todos" ? CATEGORIES : CATEGORIES.filter((item) => item.id === active);

  return (
    <section id="catalogo" className="bg-[#f4f7fc] px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <FadeUp className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
        <div>
          <p className="mb-5 text-[12px] tracking-[0.16em] uppercase text-primary" style={mono}>Catálogo</p>
          <h2 className="text-balance font-normal leading-[0.95] tracking-[-0.02em] text-foreground" style={{ ...serif, fontSize: "clamp(2.6rem, 7vw, 5rem)" }}>
            Soluciones visuales <br />
            <em>para tu día a día.</em>
          </h2>
        </div>
        <p className="max-w-[390px] text-pretty text-[15px] leading-[1.75] text-foreground/60">
          Una galeria curada para partir desde lo que necesitas resolver, no desde un producto suelto.
        </p>
      </FadeUp>

      <div className="mb-10 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Categorías del catálogo">
        {["todos", ...CATEGORIES.map((item) => item.id)].map((id) => {
          const label = id === "todos" ? "Todos" : CATEGORIES.find((item) => item.id === id)?.title;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={cx(
                "shrink-0 border px-4 py-2.5 text-[12px] tracking-wide transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
                active === id ? "border-primary bg-primary text-white" : "border-foreground/10 bg-white/72 text-foreground/62 hover:border-foreground/28 hover:text-foreground",
              )}
              role="tab"
              aria-selected={active === id}
            >
              {label}
            </button>
          );
        })}
      </div>

      <motion.div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5" layout>
        {visible.map((item, index) => (
          <motion.article
            key={item.id}
            layout
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className={cx("group relative overflow-hidden bg-white", visible.length === 1 && "xl:col-span-5")}
          >
            <div className={cx("relative overflow-hidden", visible.length === 1 ? "aspect-[16/7]" : "aspect-[4/5]")}>
              <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]" loading="lazy" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,18,0)_20%,rgba(5,9,18,0.74))]" />
              <div className="absolute left-5 top-5 grid size-10 place-items-center bg-white text-primary">
                <item.Icon size={17} aria-hidden="true" />
              </div>
            </div>
            <div className="p-6">
              <p className="mb-3 text-[10px] tracking-[0.16em] uppercase text-primary" style={mono}>{item.eyebrow}</p>
              <h3 className="text-[22px] font-medium leading-tight tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-4 text-[14px] leading-[1.65] text-foreground/58">{item.description}</p>
              <a href="#agendar" className="mt-6 inline-flex items-center gap-2 text-[13px] tracking-wide text-foreground transition-colors hover:text-primary">
                Consultar solución <ArrowRight size={14} />
              </a>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="bg-[#070d1a] px-6 py-8 text-white md:px-12 lg:px-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Logo inverted compact />
        <div className="flex flex-wrap gap-5 md:gap-7">
          {[["Clínica", "clinica"], ["Catálogo", "catalogo"], ["Reseñas", "resenas"], ["Ubicación", "ubicacion"], ["Agendar", "agendar"]].map(([label, id]) => (
            <a key={id} href={`#${id}`} className="text-[10px] tracking-[0.14em] uppercase text-white/28 transition hover:text-white/70" style={mono}>
              {label}
            </a>
          ))}
        </div>
        <p className="text-[11px] text-white/18" style={mono}>(c) {year} {business.businessName}</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="bg-background text-foreground">
      <ScrollBar />
      <Nav />
      <main>
        <Hero />
        <Clinic />
        <Catalog />
        <ReviewsSection />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
