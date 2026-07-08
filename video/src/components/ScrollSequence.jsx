import { useEffect, useMemo, useRef } from "react";

// Cambia totalFrames desde donde uses el componente:
// <ScrollSequence totalFrames={180} />
export default function ScrollSequence({
  totalFrames = 0,
  basePath = "/sequence/webp",
  height = "300vh",
  className = "",
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
  const loadedFramesRef = useRef(0);

  const framePaths = useMemo(() => {
    return Array.from({ length: totalFrames }, (_, index) => {
      const frameNumber = String(index + 1).padStart(5, "0");
      return `${basePath}/frame_${frameNumber}.webp`;
    });
  }, [basePath, totalFrames]);

  useEffect(() => {
    let cancelled = false;
    imagesRef.current = [];
    loadedFramesRef.current = 0;

    framePaths.forEach((src, index) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        imagesRef.current[index] = img;
        loadedFramesRef.current += 1;

        if (index === 0 || index === currentFrameRef.current) {
          drawFrame(index);
        }
      };
      img.src = src;
    });

    return () => {
      cancelled = true;
      imagesRef.current = [];
    };
  }, [framePaths]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const heightPx = window.innerHeight;

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(heightPx * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${heightPx}px`;

      const context = canvas.getContext("2d");
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawFrame(currentFrameRef.current);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const updateFrameFromScroll = () => {
      const section = sectionRef.current;
      if (!section || totalFrames <= 0) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      const rawProgress = scrollableDistance > 0 ? -rect.top / scrollableDistance : 0;
      const progress = Math.min(1, Math.max(0, rawProgress));
      const nextFrame = Math.min(totalFrames - 1, Math.round(progress * (totalFrames - 1)));

      if (nextFrame !== currentFrameRef.current) {
        currentFrameRef.current = nextFrame;
        drawFrame(nextFrame);
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateFrameFromScroll();
      });
    };

    updateFrameFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [totalFrames]);

  function drawFrame(index) {
    const canvas = canvasRef.current;
    const image = getNearestLoadedImage(index);
    if (!canvas || !image) return;

    const context = canvas.getContext("2d");
    const width = window.innerWidth;
    const heightPx = window.innerHeight;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = width / heightPx;

    let drawWidth = width;
    let drawHeight = heightPx;
    let offsetX = 0;
    let offsetY = 0;

    // Dibujo tipo cover para llenar la pantalla en mobile y desktop.
    if (imageRatio > canvasRatio) {
      drawWidth = heightPx * imageRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      drawHeight = width / imageRatio;
      offsetY = (heightPx - drawHeight) / 2;
    }

    context.clearRect(0, 0, width, heightPx);
    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }

  function getNearestLoadedImage(index) {
    if (imagesRef.current[index]) return imagesRef.current[index];

    for (let distance = 1; distance < totalFrames; distance += 1) {
      const previous = imagesRef.current[index - distance];
      const next = imagesRef.current[index + distance];
      if (previous) return previous;
      if (next) return next;
    }

    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{
        position: "relative",
        height,
        width: "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "sticky",
          top: 0,
          display: "block",
          width: "100%",
          height: "100vh",
        }}
      />
    </section>
  );
}
