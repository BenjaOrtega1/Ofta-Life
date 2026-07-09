import { CalendarCheck, Clock, MapPin, MessageCircle, Navigation, Phone, Stethoscope } from "lucide-react";
import { business, directionsUrl, whatsappUrl } from "../../constants/business";

const serif = { fontFamily: "'Instrument Serif', Georgia, serif" } as const;
const mono = { fontFamily: "'DM Mono', monospace" } as const;

const locationDetails = [
  { Icon: MapPin, title: "Dirección", value: business.address },
  { Icon: Clock, title: "Horario", value: business.hours },
  { Icon: MessageCircle, title: "WhatsApp", value: business.whatsappLabel },
  { Icon: Phone, title: "Llamada directa", value: business.phoneLabel },
];

function MapFrame() {
  return (
    <div className="relative min-h-[420px] overflow-hidden bg-[#f4f7fc] lg:min-h-[760px]" aria-label={`Mapa de ubicación de ${business.businessName} en ${business.address}`}>
      <iframe
        title={`Mapa de ${business.businessName} en ${business.city}`}
        src={business.googleMapsEmbedUrl}
        className="absolute inset-0 h-full w-full border-0 grayscale-[18%] contrast-[1.04] saturate-[.88]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

export function LocationSection() {
  return (
    <section id="ubicacion" className="relative bg-white/60 text-foreground backdrop-blur-[60px]">
      <div className="grid gap-0 lg:grid-cols-[1.22fr_0.78fr] lg:items-stretch">
        <MapFrame />
        <div className="self-center px-6 py-16 md:px-12 md:py-24 lg:px-16">
          <p className="mb-5 text-[12px] tracking-[0.16em] uppercase text-primary" style={mono}>Ubicación</p>
          <h2 className="text-balance font-normal leading-[0.95] tracking-[-0.02em] text-foreground" style={{ ...serif, fontSize: "clamp(2.6rem, 7vw, 5rem)" }}>
            Bulnes, atención cercana y agenda directa.
          </h2>
          <p className="mt-7 max-w-[460px] text-[15px] leading-[1.8] text-foreground/62">
            Estamos en {business.address}. Escríbenos por WhatsApp o llama para coordinar tu atención.
          </p>

          <div className="mt-12 grid gap-6">
            {locationDetails.map(({ Icon, title, value }) => (
              <div key={title} className="flex gap-4 border-t border-foreground/10 pt-5">
                <Icon className="mt-1 shrink-0 text-primary" size={17} />
                <div>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/36" style={mono}>{title}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground/68">{value || "Por confirmar"}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-4 border-t border-foreground/10 pt-5">
              <Stethoscope className="mt-1 shrink-0 text-primary" size={17} />
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-foreground/36" style={mono}>Atención</p>
                <p className="mt-2 text-[15px] leading-relaxed text-foreground/68">Consulta y óptica en un mismo lugar</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-3.5 text-[13px] tracking-wide text-white transition hover:bg-[#15399f]">
              <MessageCircle size={15} /> Agendar por WhatsApp
            </a>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-foreground/14 px-5 py-3.5 text-[13px] tracking-wide text-foreground transition hover:border-foreground/34">
              <Navigation size={15} /> Cómo llegar
            </a>
          </div>
        </div>
      </div>

      <div id="agendar" className="relative bg-[#0c1628]/80 px-6 py-16 text-white backdrop-blur-[60px] md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-[980px] text-center">
          <span className="inline-flex items-center gap-2.5 text-white">
            <span className="inline-flex flex-col justify-center">
              <span className="text-[30px] font-semibold leading-none tracking-[-0.035em] text-white">OftaLife</span>
              <span className="mt-1 text-[10px] font-medium leading-none tracking-[0.01em] text-[#49d45f]">Ver bien, vivir mejor.</span>
            </span>
            <span className="sr-only">{business.businessName}</span>
          </span>
          <h2 className="mt-8 text-balance font-normal leading-[0.95] tracking-[-0.02em] text-white" style={{ ...serif, fontSize: "clamp(2.7rem, 8vw, 5.8rem)" }}>
            OftaLife te acompaña día a día.
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.8] text-white/58">
            Agenda una consulta o escríbenos por WhatsApp. Te ayudamos a encontrar una solución visual cómoda, precisa y coherente con tu rutina.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappUrl} className="inline-flex items-center justify-center gap-2 bg-white px-7 py-4 text-[13px] tracking-wide text-foreground transition hover:bg-white/90">
              <CalendarCheck size={16} /> Agendar consulta
            </a>
            <a href={whatsappUrl} className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-[13px] tracking-wide text-white transition hover:border-white/48">
              <MessageCircle size={16} /> Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
