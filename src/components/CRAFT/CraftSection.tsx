"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const CRAFT_ASSETS = {
  background: "/images/CRAFT/Fondo Craft.webp",
  sign: "/images/CRAFT/LETRERO Craft.webp",
  robot: "/images/CRAFT/Robot_Craft.webm",
  pleca: "/images/CRAFT/Pleca.webp",
};

const CRAFT_SLIDES = [
  {
    image: "/images/CRAFT/CR2.webp",
    text: "Exploramos ideas con autonomía",
    graphic: "/images/CRAFT/1.webp",
    textLayout: { x: 639, y: 150, width: 697 },
    graphicLayout: { x: 1169, y: 235, width: 194, height: 313 },
    graphicTransform: "none",
  },
  {
    image: "/images/CRAFT/CR1.webp",
    text: "Colaboramos para construir juntos",
    graphic: "/images/CRAFT/3.webp",
    textLayout: { x: 618, y: 120, width: 745 },
    graphicLayout: { x: 922, y: 335, width: 538, height: 274 },
    graphicTransform: "none",
  },
  {
    image: "/images/CRAFT/CR3.webp",
    text: "Pensamos, probamos y mejoramos",
    graphic: "/images/CRAFT/2.webp",
    textLayout: { x: 618, y: 120, width: 745 },
    graphicLayout: { x: 1111, y: 272, width: 329, height: 295 },
    graphicTransform: "none",
  },
  {
    image: "/images/CRAFT/CR4.webp",
    text: "Aprendemos creando soluciones reales",
    graphic: "/images/CRAFT/5.webp",
    textLayout: { x: 586, y: 122, width: 854 },
    graphicLayout: { x: 1013, y: 307, width: 419, height: 302 },
    graphicTransform: "scaleX(-1)",
  },
  {
    image: "/images/CRAFT/CR5.webp",
    text: "Desarrollamos habilidades para el futuro",
    graphic: "/images/CRAFT/4.webp",
    textLayout: { x: 586, y: 122, width: 854 },
    graphicLayout: { x: 1090, y: 392, width: 350, height: 217 },
    graphicTransform: "none",
  },
] as const;

const STEP_DEGREES = 360 / CRAFT_SLIDES.length;
const STEP_DURATION_MS = 900;
const STEP_TOTAL_MS = 4200;
const RING_DEPTH = 430;

const px = (value: number) => `${value}px`;

export default function CraftSection() {
  const [step, setStep] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [showIncomingFace, setShowIncomingFace] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const lowerRef = useRef<HTMLDivElement | null>(null);
  const autoplayTimerRef = useRef<number | null>(null);
  const resumeAutoplayTimerRef = useRef<number | null>(null);
  const wheelAccumRef = useRef(0);
  const wheelTimeRef = useRef(0);
  const wheelStepStartedAtRef = useRef(0);

  const startAutoplay = () => {
    if (autoplayTimerRef.current !== null) {
      window.clearInterval(autoplayTimerRef.current);
    }

    autoplayTimerRef.current = window.setInterval(() => {
      setDirection(1);
      setShowIncomingFace(false);
      setIsTurning(true);
      setStep((current) => current + 1);
    }, STEP_TOTAL_MS);
  };

  const pauseAutoplayTemporarily = () => {
    if (autoplayTimerRef.current !== null) {
      window.clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    if (resumeAutoplayTimerRef.current !== null) {
      window.clearTimeout(resumeAutoplayTimerRef.current);
    }

    resumeAutoplayTimerRef.current = window.setTimeout(() => {
      startAutoplay();
    }, 5000);
  };

  useEffect(() => {
    startAutoplay();

    return () => {
      if (autoplayTimerRef.current !== null) {
        window.clearInterval(autoplayTimerRef.current);
      }
      if (resumeAutoplayTimerRef.current !== null) {
        window.clearTimeout(resumeAutoplayTimerRef.current);
      }
    };
  }, []);

  const currentIndex = ((displayIndex % CRAFT_SLIDES.length) + CRAFT_SLIDES.length) % CRAFT_SLIDES.length;
  const incomingIndex = useMemo(
    () => (currentIndex + direction + CRAFT_SLIDES.length) % CRAFT_SLIDES.length,
    [currentIndex, direction],
  );

  useEffect(() => {
    if (!isTurning) return;

    const incomingTimer = window.setTimeout(() => {
      setShowIncomingFace(true);
    }, Math.round(STEP_DURATION_MS * 0.52));

    return () => window.clearTimeout(incomingTimer);
  }, [isTurning, step]);

  const ringTransform =
    `translateZ(-${RING_DEPTH}px) rotateX(${step * STEP_DEGREES}deg)`;

  const handleTransitionEnd = () => {
    const settledIndex = ((step % CRAFT_SLIDES.length) + CRAFT_SLIDES.length) % CRAFT_SLIDES.length;
    setDisplayIndex(settledIndex);
    setShowIncomingFace(false);
    setIsTurning(false);
  };
  const moveStep = (nextDirection: 1 | -1) => {
    if (isTurning) return;

    pauseAutoplayTemporarily();
    wheelStepStartedAtRef.current = performance.now();
    setDirection(nextDirection);
    setShowIncomingFace(false);
    setIsTurning(true);
    setStep((current) => current + nextDirection);
  };

  useEffect(() => {
    const lower = lowerRef.current;
    if (!lower) return;

    const onWheel = (event: WheelEvent) => {
      const rect = lower.getBoundingClientRect();
      const centerVisible = rect.top < window.innerHeight * 0.82 && rect.bottom > window.innerHeight * 0.18;
      if (!centerVisible) return;

      const now = performance.now();
      if (now - wheelTimeRef.current > 220) {
        wheelAccumRef.current = 0;
      }
      wheelTimeRef.current = now;
      wheelAccumRef.current += event.deltaY;

      // Hacia arriba:
      // 1) el primer gesto mueve un STEP del cilindro;
      // 2) durante ~300 ms absorbemos la inercia del mismo gesto;
      // 3) si el usuario sigue desplazando hacia arriba después de eso,
      //    dejamos de hacer preventDefault para que la página continúe subiendo.
      if (isTurning && event.deltaY < 0) {
        const elapsedSinceStep =
          now - wheelStepStartedAtRef.current;

        wheelAccumRef.current = 0;

        if (elapsedSinceStep < 300) {
          event.preventDefault();
        }

        return;
      }

      if (Math.abs(wheelAccumRef.current) < 55) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const nextDirection: 1 | -1 = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      moveStep(nextDirection);
    };

    lower.addEventListener("wheel", onWheel, { passive: false });
    return () => lower.removeEventListener("wheel", onWheel);
  }, [isTurning]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const lower = lowerRef.current;
      if (!lower) return;

      const rect = lower.getBoundingClientRect();
      const active = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
      if (!active) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveStep(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveStep(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isTurning]);

  return (
    <section className="craft" aria-labelledby="craft-title">
      <style>{`
        .craft {
          width: 100%;
          overflow-x: hidden;
          background: #c29354;
        }

        /* =========================
           PARTE SUPERIOR
           ========================= */
        .craft__top {
          position: relative;
          width: 100%;
          aspect-ratio: 1440 / 760;
          min-height: 760px;
          overflow: hidden;
          background:
            #d8b27c
            url("${CRAFT_ASSETS.background}")
            center top / cover
            no-repeat;
        }

        .craft__top-stage {
          position: relative;
          width: min(1440px, 100%);
          height: 100%;
          min-height: 760px;
          margin: 0 auto;
        }

        .craft__eyebrow {
          position: absolute;
          left: 47.5694%;
          top: 7.3684%;
          margin: 0;
          font-family: "Outfit", sans-serif;
          font-size: clamp(24px, 2.222vw, 32px);
          font-weight: 600;
          line-height: 1;
          letter-spacing: .1em;
          color: #fff;
          white-space: nowrap;
        }

        .craft__taller {
          position: absolute;
          left: 47.5694%;
          top: 13.5526%;
          margin: 0;
          z-index: 2;
          font-family: "Fredoka", "Fredoka One", sans-serif;
          font-size: clamp(38px, 3.333vw, 48px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: .1em;
          color: #fff;
          text-shadow: 0 5px 5px rgba(0,0,0,.25);
          white-space: nowrap;
        }

        .craft__red-line {
          position: absolute;
          left: 64.7222%;
          top: 16.1842%;
          width: 14.0972%;
          height: 9px;
          z-index: 3;
          background: #da2028;
        }

        .craft__sign {
          position: absolute;
          left: 46.8056%;
          top: 12.6316%;
          width: 32.5%;
          height: 36.9737%;
          display: block;
          object-fit: contain;
          object-position: left top;
          pointer-events: none;
        }

        .craft__subtitle {
          position: absolute;
          left: 47.7083%;
          top: 40.6579%;
          margin: 0;
          z-index: 4;
          font-family: "Outfit", sans-serif;
          font-size: clamp(18px, 1.528vw, 22px);
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: .05em;
          color: #463113;
          white-space: nowrap;
        }

        .craft__body {
          position: absolute;
          left: 47.8472%;
          top: 49.6053%;
          width: 32.4306%;
          margin: 0;
          z-index: 4;
          font-family: "Outfit", sans-serif;
          font-size: clamp(19px, 1.667vw, 24px);
          font-weight: 400;
          line-height: 1.42;
          letter-spacing: .05em;
          color: #000;
        }

        .craft__robot {
          position: absolute;
          left: 76.0417%;
          top: 54.7368%;
          width: 25.3472%;
          aspect-ratio: 1;
          z-index: 5;
          display: block;
          object-fit: contain;
          object-position: center bottom;
          pointer-events: none;
        }

        /* =========================
           PARTE INFERIOR
           ========================= */
        .craft__lower {
          position: relative;
          width: 100%;
          height: 609px;
          overflow: hidden;
          background:
            linear-gradient(
              180deg,
              #C29354 0%,
              #DBBA8C 37%,
              #DBBA8C 63%,
              #C29354 100%
            );
        }

        .craft__pleca {
          position: absolute;
          left: 50%;
          width: max(1545px, 112vw);
          height: 662px;
          display: block;
          object-fit: cover;
          opacity: .5;
          pointer-events: none;
          user-select: none;
          z-index: 1;
          transform: translateX(-50%);
        }

        .craft__pleca--top {
          top: -485px;
        }

        .craft__pleca--bottom {
          top: 435px;
        }

        /*
          El carrusel ya NO está dividido en foto/texto/gráfico.
          Cada cara es la composición completa de 1440 × 609.
          Así los tres elementos mantienen su relación exacta
          durante TODO el giro.
        */
        .craft__stage {
          position: relative;
          width: 1440px;
          height: 609px;
          margin: 0 auto;
          z-index: 2;
          perspective: 1450px;
          perspective-origin: 50% 50%;
          transform-style: preserve-3d;
          overflow: hidden;
        }

        .craft__composition-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0;
          height: 0;
          transform-style: preserve-3d;
          transition:
            transform ${STEP_DURATION_MS}ms
            cubic-bezier(.22,.78,.2,1);
          will-change: transform;
        }

        .craft__composition-face {
          position: absolute;
          left: -720px;
          top: -304.5px;
          width: 1440px;
          height: 609px;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          overflow: hidden;
          opacity: 0;
          transition: opacity 160ms linear;
          pointer-events: none;
        }

        .craft__composition-face.is-visible {
          opacity: 1;
        }

        .craft__photo {
          position: absolute;
          left: 44px;
          top: 85px;
          width: 500px;
          height: 500px;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 5px 5px 2px rgba(0,0,0,.25);
        }

        .craft__photo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          border-radius: inherit;
        }

        .craft__slide-title {
          position: absolute;
          margin: 0;
          font-family: "Fredoka", sans-serif;
          font-size: 96px;
          font-weight: 600;
          line-height: 100px;
          letter-spacing: 7.68px;
          color: #35220f;
          word-break: break-word;
        }

        .craft__graphic {
          position: absolute;
          display: block;
          object-fit: contain;
          object-position: center;
          transform-origin: center center;
          pointer-events: none;
        }

        .craft__counter {
          position: absolute;
          left: 50%;
          bottom: 10px;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          gap: 8px;
        }

        .craft__dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(53,34,15,.28);
        }

        .craft__dot.is-active {
          background: #35220f;
        }

        @media (max-width: 1439px) and (min-width: 801px) {
          .craft__lower {
            height: calc(100vw * 609 / 1440);
          }

          .craft__stage {
            left: 50%;
            margin-left: -720px;
            transform: scale(calc(100vw / 1440));
            transform-origin: top center;
          }
        }

        @media (max-width: 800px) {
          .craft__top {
            aspect-ratio: auto;
            min-height: 820px;
          }

          .craft__lower {
            height: 850px;
          }

          .craft__stage {
            width: 100%;
            height: 850px;
            margin: 0;
            left: 0;
            transform: none;
            perspective: 1100px;
          }

          .craft__composition-face {
            left: -50vw;
            top: -425px;
            width: 100vw;
            height: 850px;
          }

          .craft__photo {
            left: 24px;
            top: 70px;
            width: calc(100vw - 48px);
            height: calc(100vw - 48px);
          }

          .craft__slide-title {
            left: 24px !important;
            top: calc(100vw + 55px) !important;
            width: calc(100vw - 48px) !important;
            font-size: clamp(46px, 13vw, 72px);
            line-height: 1.04;
            letter-spacing: 2px;
          }

          .craft__graphic {
            left: auto !important;
            right: 18px;
            top: auto !important;
            bottom: 18px;
            width: 150px !important;
            height: 210px !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="craft__top">
        <div className="craft__top-stage">
          <p className="craft__eyebrow">APRENDEMOS HACIENDO</p>

          <h2 className="craft__taller" id="craft-title">
            TALLER
          </h2>

          <span className="craft__red-line" aria-hidden="true" />

          <img
            className="craft__sign"
            src={CRAFT_ASSETS.sign}
            alt=""
            aria-hidden="true"
          />

          <p className="craft__subtitle">
            Un espacio donde las ideas toman forma
          </p>

          <p className="craft__body">
            En el Taller CRAFT la curiosidad se convierte en acción. Aquí,
            nuestros alumnos ponen a prueba sus ideas, trabajan con distintos
            materiales y tecnologías, colaboran, se equivocan, vuelven a
            intentar y descubren que cada proyecto es una oportunidad para
            aprender de una manera diferente.
          </p>

          <video
            className="craft__robot"
            src={CRAFT_ASSETS.robot}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        </div>
      </div>

      <div ref={lowerRef} className="craft__lower">
        <img
          className="craft__pleca craft__pleca--top"
          src={CRAFT_ASSETS.pleca}
          alt=""
          aria-hidden="true"
        />

        <img
          className="craft__pleca craft__pleca--bottom"
          src={CRAFT_ASSETS.pleca}
          alt=""
          aria-hidden="true"
        />

        <div className="craft__stage">
          <div
            className="craft__composition-ring"
            onTransitionEnd={handleTransitionEnd}
            style={{ transform: ringTransform }}
          >
            {CRAFT_SLIDES.map((slide, index) => {
              const visible = !isTurning
                ? index === currentIndex
                : showIncomingFace
                  ? index === incomingIndex
                  : index === currentIndex;

              return (
              <div
                className={`craft__composition-face ${visible ? "is-visible" : ""}`}
                key={`${slide.image}-${slide.text}`}
                style={{
                  transform:
                    `rotateX(${-index * STEP_DEGREES}deg) translateZ(${RING_DEPTH}px)`,
                }}
              >
                <div className="craft__photo">
                  <img src={slide.image} alt={slide.text} />
                </div>

                <p
                  className="craft__slide-title"
                  style={{
                    left: px(slide.textLayout.x),
                    top: px(slide.textLayout.y),
                    width: px(slide.textLayout.width),
                  }}
                >
                  {slide.text}
                </p>

                <img
                  className="craft__graphic"
                  src={slide.graphic}
                  alt=""
                  aria-hidden="true"
                  style={{
                    left: px(slide.graphicLayout.x),
                    top: px(slide.graphicLayout.y),
                    width: px(slide.graphicLayout.width),
                    height: px(slide.graphicLayout.height),
                    transform: slide.graphicTransform,
                  }}
                />
              </div>
              );
            })}
          </div>

          <div className="craft__counter" aria-hidden="true">
            {CRAFT_SLIDES.map((_, index) => (
              <span
                key={index}
                className={`craft__dot ${index === displayIndex ? "is-active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
