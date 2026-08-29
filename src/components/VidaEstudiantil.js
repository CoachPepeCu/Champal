"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const BASE = "/images/conoce-champal/vida-estudiantil";
const CARD_WIDTH = 240;
const CARD_GAP = 12;
const STEP = CARD_WIDTH + CARD_GAP;
const TRANSITION_MS = 600;

export const vidaEstudiantilExperiences = [
  {
    id: "eventos-celebraciones",
    title: "Eventos y celebraciones escolares",
    backgroundImage: `${BASE}/background-01.webp`,
    thumbnailImage: `${BASE}/thumbnail-01.webp`,
    backgroundAlt: "Dos alumnas caracterizadas de catrinas durante una celebración escolar de Día de Muertos",
    thumbnailAlt: "Una alumna comparte una actividad escolar con su padre",
    backgroundPosition: "50% 50%",
    mobileBackgroundPosition: "20% 50%",
    thumbnailPosition: "50% 50%",
    titleTop: 7,
  },
  {
    id: "proyectos-colaborativos",
    title: "Proyectos colaborativos",
    backgroundImage: `${BASE}/background-02.webp`,
    thumbnailImage: `${BASE}/thumbnail-02.webp`,
    backgroundAlt: "Estudiantes de primaria construyen juntos un proyecto con bloques de colores",
    thumbnailAlt: "Una familia colabora con una alumna en una actividad con tableta",
    backgroundPosition: "50% 50%",
    mobileBackgroundPosition: "52% 50%",
    thumbnailPosition: "50% 50%",
    titleTop: 11,
  },
  {
    id: "liderazgo-estudiantil",
    title: "Liderazgo estudiantil",
    backgroundImage: `${BASE}/background-03.webp`,
    thumbnailImage: `${BASE}/thumbnail-03.webp`,
    backgroundAlt: "Jóvenes Champal participan unidos en una dinámica de liderazgo al aire libre",
    thumbnailAlt: "Estudiante sonríe durante un campamento de preparatoria Champal",
    backgroundPosition: "50% 50%",
    mobileBackgroundPosition: "50% 50%",
    thumbnailPosition: "50% 50%",
    titleTop: 9,
  },
  {
    id: "amistades-convivencia",
    title: "Amistades y convivencia",
    backgroundImage: `${BASE}/background-04.webp`,
    thumbnailImage: `${BASE}/thumbnail-04.webp`,
    backgroundAlt: "Familias y estudiantes participan en una dinámica de convivencia al aire libre",
    thumbnailAlt: "Grupo de alumnas Champal sonríe reunido durante una convivencia",
    backgroundPosition: "50% 50%",
    mobileBackgroundPosition: "48% 50%",
    thumbnailPosition: "50% 50%",
    titleTop: 20,
  },
  {
    id: "participacion-comunidad",
    title: "Participación en la comunidad",
    backgroundImage: `${BASE}/background-05.webp`,
    thumbnailImage: `${BASE}/thumbnail-05.webp`,
    backgroundAlt: "Dos alumnas pequeñas conviven y juegan juntas en el campus",
    thumbnailAlt: "Madres y padres participan con sus hijas en una actividad de la comunidad Champal",
    backgroundPosition: "50% 50%",
    mobileBackgroundPosition: "50% 50%",
    thumbnailPosition: "50% 50%",
    titleTop: 5,
  },
  {
    id: "experiencias-nivel",
    title: "Experiencias por nivel",
    backgroundImage: `${BASE}/background-06.webp`,
    thumbnailImage: `${BASE}/thumbnail-06.webp`,
    backgroundAlt: "Grupo de estudiantes Champal visita las pirámides de Teotihuacán",
    thumbnailAlt: "Estudiante realiza una actividad de aventura entre los árboles",
    backgroundPosition: "50% 50%",
    mobileBackgroundPosition: "50% 50%",
    thumbnailPosition: "50% 50%",
    titleTop: 192,
  },
  {
    id: "actividades-solidarias",
    title: "Actividades solidarias",
    backgroundImage: `${BASE}/background-07.webp`,
    thumbnailImage: `${BASE}/thumbnail-07.webp`,
    backgroundAlt: "Alumna y su madre participan juntas en una actividad solidaria",
    thumbnailAlt: "Dos alumnas entregan una caja durante una actividad solidaria",
    backgroundPosition: "50% 50%",
    mobileBackgroundPosition: "50% 50%",
    thumbnailPosition: "50% 50%",
    titleTop: 36,
  },
  {
    id: "talento-champal",
    title: "Talento Champal",
    backgroundImage: `${BASE}/background-08.webp`,
    thumbnailImage: `${BASE}/thumbnail-08.webp`,
    backgroundAlt: "Tres alumnas interpretan música con guitarras en el campus",
    thumbnailAlt: "Alumna baila sobre el escenario durante una presentación artística",
    backgroundPosition: "50% 50%",
    mobileBackgroundPosition: "50% 50%",
    thumbnailPosition: "50% 50%",
    titleTop: 32,
  },
  {
    id: "momentos-historia",
    title: "Momentos para su historia",
    backgroundImage: `${BASE}/background-09.webp`,
    thumbnailImage: `${BASE}/thumbnail-09.webp`,
    backgroundAlt: "Jóvenes Champal disfrutan una celebración escolar con espuma",
    thumbnailAlt: "Alumna observa un globo rojo durante una actividad en el patio",
    backgroundPosition: "50% 50%",
    mobileBackgroundPosition: "50% 50%",
    thumbnailPosition: "50% 50%",
    titleTop: 71,
  },
];

const trackItems = [
  { ...vidaEstudiantilExperiences.at(-1), cloneKey: "leading", clone: true },
  ...vidaEstudiantilExperiences,
  { ...vidaEstudiantilExperiences[0], cloneKey: "trailing-1", clone: true },
  { ...vidaEstudiantilExperiences[1], cloneKey: "trailing-2", clone: true },
];

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new window.Image();
    image.src = src;
    const finish = () => resolve();
    if (image.complete) {
      image.decode?.().then(finish, finish) ?? finish();
      return;
    }
    image.onload = () => image.decode?.().then(finish, finish) ?? finish();
    image.onerror = finish;
  });
}

function CarouselCard({ experience, clone }) {
  return (
    <article
      className="ve-card"
      aria-hidden={clone ? "true" : undefined}
      data-clone={clone ? "true" : undefined}
    >
      <Image
        src={experience.thumbnailImage}
        alt={clone ? "" : experience.thumbnailAlt}
        fill
        sizes="240px"
        className="ve-card-image"
        style={{ objectPosition: experience.thumbnailPosition }}
      />
      <div className="ve-card-title" style={{ top: experience.titleTop }}>
        <h3>{experience.title}</h3>
        <span aria-hidden="true" />
      </div>
    </article>
  );
}

export default function VidaEstudiantil() {
  const reduceMotion = useReducedMotion();
  const regionRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const resetFrameRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState(null);
  const [trackPosition, setTrackPosition] = useState(1);
  const [trackAnimated, setTrackAnimated] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const duration = reduceMotion ? 20 : TRANSITION_MS;
  const active = vidaEstudiantilExperiences[activeIndex];
  const incoming = incomingIndex === null ? null : vidaEstudiantilExperiences[incomingIndex];

  useEffect(() => () => {
    window.clearTimeout(transitionTimerRef.current);
    if (resetFrameRef.current !== null) cancelAnimationFrame(resetFrameRef.current);
  }, []);

  useEffect(() => {
    const previous = (activeIndex - 1 + vidaEstudiantilExperiences.length) % vidaEstudiantilExperiences.length;
    const next = (activeIndex + 1) % vidaEstudiantilExperiences.length;
    preloadImage(vidaEstudiantilExperiences[previous].backgroundImage);
    preloadImage(vidaEstudiantilExperiences[next].backgroundImage);
  }, [activeIndex]);

  const navigate = useCallback(async (direction) => {
    if (transitioning) return;

    setTransitioning(true);
    const count = vidaEstudiantilExperiences.length;
    const nextIndex = (activeIndex + direction + count) % count;
    await preloadImage(vidaEstudiantilExperiences[nextIndex].backgroundImage);

    setIncomingIndex(nextIndex);
    setTrackAnimated(true);
    setTrackPosition((current) => current + direction);

    transitionTimerRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setIncomingIndex(null);

      const canonicalPosition = nextIndex + 1;
      setTrackAnimated(false);
      setTrackPosition(canonicalPosition);
      resetFrameRef.current = requestAnimationFrame(() => {
        setTransitioning(false);
        resetFrameRef.current = null;
      });
    }, duration);
  }, [activeIndex, duration, transitioning]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
    }
  };

  return (
    <section className="vida-estudiantil" aria-labelledby="vida-estudiantil-title">
      <motion.div
        className="ve-backgrounds"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.78, delay: reduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          key={`active-${active.id}`}
          src={active.backgroundImage}
          alt=""
          fill
          unoptimized
          preload={activeIndex === 0 && incomingIndex === null}
          sizes="100vw"
          className="ve-background ve-background-current"
          style={{ objectPosition: active.backgroundPosition, "--mobile-object-position": active.mobileBackgroundPosition }}
        />
        {incoming && (
          <Image
            key={`incoming-${incoming.id}`}
            src={incoming.backgroundImage}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="ve-background ve-background-incoming"
            style={{ objectPosition: incoming.backgroundPosition, "--mobile-object-position": incoming.mobileBackgroundPosition, "--fade-duration": `${duration}ms` }}
            onLoad={(event) => event.currentTarget.classList.add("is-visible")}
          />
        )}
      </motion.div>

      <div className="ve-stage">
        <header className="ve-copy">
          <div className="ve-copy-shadow" aria-hidden="true" />
          <motion.div
            className="ve-eyebrow"
            initial={reduceMotion ? false : { opacity: 0, x: -90 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <span aria-hidden="true" /><p>VIDA ESTUDIANTIL</p>
          </motion.div>
          <motion.div
            className="ve-title-reveal"
            initial={reduceMotion ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 id="vida-estudiantil-title">Una comunidad que acompaña, celebra y crece unida</h2>
          </motion.div>
        </header>

        <div
          ref={regionRef}
          className="ve-carousel-region"
          role="region"
          aria-label="Experiencias de Vida Estudiantil"
          aria-roledescription="carrusel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="ve-viewport"
            initial={reduceMotion ? false : { opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.78, delay: reduceMotion ? 0 : 1.52, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="ve-track"
              style={{
                transform: `translate3d(${-trackPosition * STEP}px, 0, 0)`,
                transitionDuration: trackAnimated ? `${duration}ms` : "0ms",
              }}
            >
              {trackItems.map((experience) => (
                <CarouselCard
                  key={experience.clone ? `${experience.id}-${experience.cloneKey}` : experience.id}
                  experience={experience}
                  clone={experience.clone}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="ve-controls"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: reduceMotion ? 1 : [0.55, 1.22, 0.92, 1] }}
            transition={{
              opacity: { duration: reduceMotion ? 0 : 0.18, delay: reduceMotion ? 0 : 2.34 },
              scale: { duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 2.34, times: [0, 0.48, 0.72, 1], ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <button
              type="button"
              className="ve-control"
              aria-label="Foto anterior"
              disabled={transitioning}
              onClick={() => navigate(-1)}
            >
              <Image src={`${BASE}/control-prev.svg`} alt="" width={45} height={45} />
            </button>
            <button
              type="button"
              className="ve-control ve-control-next"
              aria-label="Foto siguiente"
              disabled={transitioning}
              onClick={() => navigate(1)}
            >
              <Image src={`${BASE}/control-next.svg`} alt="" width={45} height={45} />
            </button>
          </motion.div>
          <p className="sr-only" aria-live="polite" aria-atomic="true">{activeIndex + 1} de 9</p>
        </div>
      </div>

      <style>{`
        .vida-estudiantil{position:relative;isolation:isolate;width:100%;min-height:100dvh;overflow-x:clip;background:#15100f;color:#fff}
        .ve-stage{position:relative;z-index:1;isolation:isolate;width:min(100vw,calc(100dvh * 1440 / 760));aspect-ratio:1440/760;margin-inline:auto;overflow:hidden;container-type:inline-size}
        .ve-backgrounds,.ve-background{position:absolute;inset:0}.ve-backgrounds{z-index:0;background:#15100f}.ve-background{object-fit:cover}
        .ve-background-current{opacity:1}.ve-background-incoming{opacity:0;transition:opacity var(--fade-duration,600ms) cubic-bezier(.22,1,.36,1)}.ve-background-incoming.is-visible{opacity:1}
        .ve-copy{position:absolute;z-index:3;left:3.125%;top:9.6053%;width:22.9167%;font-family:var(--font-fredoka),sans-serif;text-shadow:0 4px 4px rgba(0,0,0,.25)}
        .ve-copy-shadow{position:absolute;z-index:-1;left:-7%;top:-16%;width:111%;height:108%;background:rgba(91,91,91,.6);filter:blur(33.5px);pointer-events:none}
        .ve-eyebrow{display:flex;align-items:center;gap:.9722cqw;height:1.25cqw;font-family:var(--font-outfit),sans-serif;text-shadow:none}
        .ve-eyebrow span{width:3.8889cqw;height:.4167cqw;flex:none;background:#aa181f}.ve-eyebrow p{margin:0;white-space:nowrap;color:#d9ebf3;font-size:1.0417cqw;font-weight:600;line-height:1.25cqw;letter-spacing:.012em}
        .ve-title-reveal{overflow:hidden}.ve-copy h2{margin:.6944cqw 0 0;font-size:2.5cqw;font-weight:500;line-height:1.2222}
        .ve-carousel-region{position:absolute;z-index:4;inset:0;outline:none}
        .ve-viewport{position:absolute;left:55.2778%;top:53.4211%;width:45.2778%;height:42.1053%;overflow:hidden;padding:10px 20px;box-sizing:border-box}
        .ve-track{display:flex;align-items:flex-start;gap:${CARD_GAP}px;width:max-content;will-change:transform;transition-property:transform;transition-timing-function:cubic-bezier(.22,1,.36,1)}
        .ve-card{position:relative;width:${CARD_WIDTH}px;height:300px;flex:0 0 ${CARD_WIDTH}px;overflow:hidden;background:#555;box-shadow:0 4px 8px rgba(0,0,0,.18)}
        .ve-card-image{object-fit:cover}.ve-card-title{position:absolute;z-index:2;left:0;width:100%;height:25px;display:flex;flex-direction:column;align-items:center;background:rgba(137,137,137,.8)}
        .ve-card-title h3{width:100%;margin:0;padding:0 4px;box-sizing:border-box;overflow:hidden;white-space:nowrap;text-align:center;font-family:var(--font-fredoka),sans-serif;font-size:14px;font-weight:500;line-height:20px;color:#fff}
        .ve-card-title span{display:block;width:46px;height:3px;background:#c30505}
        .ve-controls{position:absolute;left:61.6667%;top:91.9737%;display:flex;align-items:center;gap:14px}
        .ve-control{display:grid;place-items:center;width:45px;height:45px;padding:0;border:1px solid rgba(255,255,255,.92);border-radius:50%;background:transparent;cursor:pointer;transition:transform 220ms ease,filter 220ms ease,outline-color 220ms ease}
        .ve-control img{display:block;width:45px;height:45px}.ve-control:hover:not(:disabled){transform:scale(1.08);filter:drop-shadow(0 0 8px rgba(113,211,255,.95))}
        .ve-control-next img{transform:rotate(180deg)}
        .ve-control:focus-visible{outline:3px solid #79d8ff;outline-offset:4px;transform:scale(1.06);filter:drop-shadow(0 0 9px rgba(113,211,255,.95))}
        .ve-control:active:not(:disabled){transform:scale(.94)}.ve-control:disabled{cursor:default}
        @media (min-width:1024px){.vida-estudiantil{width:100vw;overflow:hidden}}
        @media (max-width:1023px){
          .ve-backgrounds{height:760px;bottom:auto}.ve-stage{width:100%;height:760px;aspect-ratio:auto;min-height:760px}
          .ve-copy{left:5%;top:7%;width:min(44%,390px)}.ve-eyebrow{gap:12px;height:18px}.ve-eyebrow span{width:48px;height:6px}.ve-eyebrow p{font-size:14px;line-height:18px}.ve-copy h2{margin-top:10px;font-size:clamp(32px,5vw,42px);line-height:1.12}
          .ve-viewport{left:42%;top:52%;width:58%;height:320px;padding:10px 20px}.ve-controls{left:auto;right:5%;top:auto;bottom:15px}
        }
        @media (max-width:639px){
          .ve-stage{height:820px;min-height:820px;overflow:hidden}
          .ve-backgrounds{height:400px;bottom:auto}.ve-background{object-position:var(--mobile-object-position,50% 50%)!important;filter:saturate(.96)}
          .ve-backgrounds:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.12) 0%,rgba(0,0,0,.08) 33%,rgba(17,12,11,.38) 48%,rgba(17,12,11,.78) 100%)}
          .ve-copy{left:24px;top:34px;width:calc(100% - 48px)}.ve-copy-shadow{left:-12px;top:-12px;width:min(370px,100%);height:205px;filter:blur(28px)}
          .ve-eyebrow{gap:10px}.ve-eyebrow span{width:42px}.ve-eyebrow p{font-size:13px}.ve-copy h2{max-width:330px;font-size:clamp(31px,9.8vw,38px);line-height:1.1}
          .ve-viewport{left:12px;top:423px;width:calc(100% - 24px);height:320px;padding:10px 12px}
          .ve-controls{left:24px;right:auto;bottom:20px;gap:14px}.ve-control,.ve-control img{width:48px;height:48px}
        }
        @media (prefers-reduced-motion:reduce){.ve-background-incoming,.ve-track,.ve-control{transition-duration:20ms!important}}
      `}</style>
    </section>
  );
}
