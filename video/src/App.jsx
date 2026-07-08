import { useEffect, useMemo, useRef, useState } from "react";

const TOTAL_FRAMES = 486;

const storyBeats = [
  {
    kicker: "Inicio",
    title: "La escena despierta con el movimiento.",
    body: "Cada pixel avanza al ritmo del scroll, como si la pagina respirara contigo.",
  },
  {
    kicker: "Entrada",
    title: "El video se convierte en una coreografia controlada.",
    body: "No hay autoplay ni controles: solo desplazamiento, pausa y descubrimiento.",
  },
  {
    kicker: "Ritmo",
    title: "Los textos aparecen justo cuando la mirada los necesita.",
    body: "La imagen sostiene la atmosfera; la palabra marca el pulso de la historia.",
  },
  {
    kicker: "Detalle",
    title: "Cada frame esta precargado para evitar parpadeos.",
    body: "La secuencia WebP vive en public/sequence/webp y se dibuja sobre canvas.",
  },
  {
    kicker: "Cierre",
    title: "Una pieza simple, lista para adaptar.",
    body: "Cambia los textos, la cantidad de frames o la altura del scroll desde el codigo.",
  },
];

export default function App() {
  const sectionRef = useRef(null);
  const rafRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);

  const frameSrc = useMemo(() => {
    return `/sequence/webp/frame_${String(currentFrame).padStart(5, "0")}.webp`;
  }, [currentFrame]);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const nextProgress = Math.min(1, Math.max(0, -rect.top / distance));
      const nextFrame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(nextProgress * (TOTAL_FRAMES - 1)) + 1));

      setProgress(nextProgress);
      setCurrentFrame(nextFrame);
    };

    const tick = () => {
      update();
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main>
      <section ref={sectionRef} className="scroll-story">
        <div className="stage">
          <img
            className="sequence-image"
            src={frameSrc}
            alt=""
            aria-hidden="true"
          />
          <div className="shade" />
          <div className="progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>
        <div className="story-panels">
          {storyBeats.map((beat) => (
            <article className="beat-panel" key={beat.title}>
              <div>
                <p>{beat.kicker}</p>
                <h1>{beat.title}</h1>
                <span>{beat.body}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="afterword">
        <h2>Fin del recorrido.</h2>
        <p>La pagina queda lista para cambiar textos, frames o ritmo de scroll.</p>
      </section>
    </main>
  );
}
