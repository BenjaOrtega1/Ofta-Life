import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
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
  hero: "https://images.unsplash.com/photo-1560087542-435cccba352e?auto=format&fit=crop&w=2200&q=82",
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
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "26%"]);
  const fade = useTransform(scrollYProgress, [0, 0.62], [1, 0]);
  const rise = useTransform(scrollYProgress, [0, 0.62], ["0%", reduceMotion ? "0%" : "-10%"]);

  return (
    <section id="inicio" ref={ref} className="relative min-h-[92vh] overflow-hidden bg-[#08101e] md:min-h-screen">
      <motion.div className="absolute inset-0 origin-center" style={{ y: bgY, scale: reduceMotion ? 1 : 1.08 }}>
        <img src={IMG.hero} alt="Paciente probándose lentes en una óptica contemporánea" className="h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,18,0.08),rgba(5,9,18,0.38)_48%,rgba(5,9,18,0.88))]" />
      </motion.div>

      <motion.div className="relative z-10 flex min-h-[92vh] flex-col justify-end px-6 pb-12 pt-28 md:min-h-screen md:px-12 md:pb-16 lg:px-16" style={{ opacity: fade, y: rise }}>
        <FadeUp>
          <div className="mb-7">
            <Logo inverted />
          </div>
          <p className="max-w-[300px] text-[10px] leading-loose tracking-[0.14em] uppercase text-white/62 sm:max-w-[620px] sm:text-[12px] sm:tracking-[0.18em]" style={mono}>
            Clínica visual & óptica premium
          </p>
          <h1 className="mt-5 max-w-[960px] text-balance font-normal leading-[0.92] tracking-[-0.02em] text-white sm:leading-[0.9] sm:tracking-[-0.025em]" style={{ ...serif, fontSize: "clamp(3rem, 11vw, 6rem)" }}>
            Ver mejor. <br />
            <em>Vivirlo <span className="block sm:inline">todos los días.</span></em>
          </h1>
          <p className="mt-7 max-w-[330px] text-pretty text-[15px] leading-[1.75] text-white/66 md:max-w-[480px] md:text-[18px]">
            Diagnóstico experto, cristales de precisión y una selección de lentes pensada para acompañar tu rutina con comodidad y presencia.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#catalogo" className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3.5 text-[13px] tracking-wide text-foreground transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Ver catálogo <ArrowRight size={15} />
            </a>
            <a href="#agendar" className="inline-flex items-center justify-center gap-2 border border-white/32 px-6 py-3.5 text-[13px] tracking-wide text-white transition-colors hover:border-white/62 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Agendar consulta
            </a>
          </div>
          <div className="mt-12 flex items-center gap-2 text-white/30" style={mono}>
            <ChevronDown size={14} aria-hidden="true" />
            <span className="text-[10px] tracking-[0.24em] uppercase">Explorar</span>
          </div>
        </FadeUp>
      </motion.div>
    </section>
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
