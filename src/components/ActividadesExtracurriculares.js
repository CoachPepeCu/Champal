"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const W = 1440;
const H = 760;
const BASE = "/images/conoce-champal/actividades-x";
const xPct = (n) => `${((n / W) * 100).toFixed(6)}%`;
const yPct = (n) => `${((n / H) * 100).toFixed(6)}%`;
const cq = (n) => `${((n / W) * 100).toFixed(6)}cqw`;

export const activities = [
  { id: "club-rayados", title: "CLUB RAYADOS", description: "Recibimos a niños y jóvenes que desean aprender el fútbol.", image: "club-rayados-rgba.webp", imageAlt: "Ilustración de jugador de Club Rayados", headerColor: "#1e385b", left: 760, top: 109, grayTop: 16, titleTop: 5, titleWidth: 104, frontVariant: "tae", imageWidth: 111, imageHeight: 141, imageLeft: 12, imageTop: 33 },
  { id: "taller-poms", title: "TALLER DE POMS", description: "Motivamos la disciplina y arte a través de la música y habilidades de trabajo en equipo", image: "taller-poms-rgba.webp", imageAlt: "Ilustración de estudiante con pompones", headerColor: "#580066", left: 967, top: 106, grayTop: 35, titleTop: 5, titleWidth: 104, frontVariant: "general", imageWidth: 111, imageHeight: 157, imageLeft: 31, imageTop: 29 },
  { id: "taller-ajedrez", title: "TALLER DE AJEDREZ", description: "Motivamos la disciplina y el uso de estrategias que cultiven la mente y el pensamiento crítico", image: "taller-ajedrez-rgba.webp", imageAlt: "Ilustración de estudiante jugando ajedrez", headerColor: "#44484d", left: 1175, top: 111, grayTop: 16, titleTop: 5, titleWidth: 104, frontVariant: "general", imageWidth: 152, imageHeight: 133, imageLeft: -1, imageTop: 37 },
  { id: "tae-kwon-do", title: "TAE KWON DO", description: "Fortalecemos la disciplina, el respeto, la coordinación y la confianza a través de la práctica del Tae Kwon Do.", image: "tae-kwon-do-rgba.webp", imageAlt: "Ilustración de estudiante practicando Tae Kwon Do", headerColor: "#bc0000", left: 134, top: 328, grayTop: 16, titleTop: 2, titleWidth: 78, frontVariant: "tae", imageWidth: 114, imageHeight: 121, imageLeft: 50, imageTop: 30 },
  { id: "taller-arte", title: "TALLER DE ARTE", description: "Promovemos habilidades artísticas como parte del desarrollo integral de la persona", image: "taller-arte-rgba.webp", imageAlt: "Ilustración de estudiante pintando", headerColor: "#34ac00", left: 351, top: 328, grayTop: 15, titleTop: 5, titleWidth: 104, frontVariant: "arte", imageWidth: 107, imageHeight: 130, imageLeft: 77, imageTop: 40, accentWidth: 56.35, accentHeight: 63.75, accentLeft: 26.65, accentTop: 45.25 },
  { id: "taller-lego", title: "TALLER DE LEGO", description: "Con la ayuda de LEGO, los niños exploran matemáticas, ciencias y lenguaje", image: "taller-lego-rgba.webp", imageAlt: "Ilustración de personaje de LEGO", headerColor: "#ff0004", left: 561, top: 328, grayTop: 23, titleTop: 5, titleWidth: 104, frontVariant: "general", imageWidth: 103, imageHeight: 134, imageLeft: 22, imageTop: 52 },
  { id: "taller-musica", title: "TALLER DE MÚSICA", description: "El espacio para seguir desarrollando habilidades artísticas dentro del colegio", image: "taller-musica-rgba.webp", imageAlt: "Ilustración de estudiante tocando guitarra", headerColor: "#fecf3b", left: 755, top: 328, grayTop: 29, titleTop: 5, titleWidth: 104, frontVariant: "general", imageWidth: 105, imageHeight: 110, imageLeft: 21, imageTop: 57 },
  { id: "basquetbol", title: "BÁSQUETBOL", description: "Aprenden el trabajo en equipo, el compañerismo, la generosidad y la solidaridad, mientras desarrollan sus habilidades físicas.", image: "basquetbol-rgba.webp", imageAlt: "Ilustración de jugador de básquetbol", headerColor: "#1e385b", left: 953, top: 327, grayTop: 33, titleTop: 5, titleWidth: 119, frontVariant: "general", imageWidth: 70, imageHeight: 159, imageLeft: 48, imageTop: 32 },
  { id: "taller-robotica", title: "TALLER DE ROBÓTICA", description: "Participamos en diversos torneos de robótica a nivel local, nacional e internacional", image: "taller-robotica-rgba.webp", imageAlt: "Ilustración de robot", headerColor: "#5b94e1", left: 1142, top: 328, grayTop: 32, titleTop: 5, titleWidth: 104, frontVariant: "general", imageWidth: 66, imageHeight: 103, imageLeft: 42, imageTop: 61 },
  { id: "iniciacion-deportiva", title: "INICIACIÓN DEPORTIVA", description: "Desarrollo motriz, cognoscitivo y psicosocial a través de la inclusión", image: "iniciacion-deportiva-rgba.webp", imageAlt: "Ilustración de grupo de iniciación deportiva", headerColor: "#6d8db8", left: 435, top: 534, grayTop: 17, titleTop: 5, titleWidth: 104, frontVariant: "general", imageWidth: 126, imageHeight: 126, imageLeft: 10, imageTop: 36 },
  { id: "taller-frances", title: "TALLER DE FRANCÉS", description: "Colaboración con la Alianza Francesa para acompañar en el aprendizaje de un tercer idioma", image: "taller-frances-rgba.webp", imageAlt: "Ilustración de profesor con bandera de Francia", left: 645, top: 537, grayTop: 14, titleTop: 5, titleWidth: 104, frontVariant: "french", imageWidth: 120, imageHeight: 131, imageLeft: 21, imageTop: 35 },
  { id: "taller-ingles", title: "TALLER DE INGLÉS", description: "Extendemos el tiempo de inmersión en el idioma inglés para apoyarlos en su desempeño", image: "taller-ingles-rgba.webp", imageAlt: "Ilustración de profesor con bandera del Reino Unido", left: 855, top: 537, grayTop: 14, titleTop: 5, titleWidth: 104, frontVariant: "english", imageWidth: 119, imageHeight: 141, imageLeft: 14, imageTop: 31 },
];

function headerBackground(activity) {
  if (activity.frontVariant === "french") return "linear-gradient(89.99999935879003deg, #19457c 3%, #fff 42.173%, #fff 56.163%, #f61b0b 100%)";
  if (activity.frontVariant === "english") return "linear-gradient(139.74489875011056deg, #2163ae 5.1963%, #2163ae 12.136%, #fff 19.077%, #fff 34.998%, #f23b1f 39.489%)";
  return activity.headerColor;
}

function FrontCard({ activity }) {
  const body = activity.frontVariant === "tae" ? "caja-tae.svg" : "caja-general.svg";
  return (
    <div className="frontCard ax-front" data-card-layer="frontCard">
      <div className="ax-gray-layer" aria-hidden="true">
        <Image src={`${BASE}/${body}`} alt="" width={150} height={131} className="ax-gray-shape" />
      </div>
      {activity.frontVariant === "arte" && <Image src={`${BASE}/acento-arte.svg`} alt="" aria-hidden width={57} height={64} className="ax-accent" />}
      <Image src={`${BASE}/${activity.image}`} alt={activity.imageAlt} width={activity.imageWidth} height={activity.imageHeight} className="ax-illustration" />
    </div>
  );
}

function ActivityCard({ activity, touchOpen, onTouchToggle, onRevealMeasured, reduceMotion }) {
  const descriptionRef = useRef(null);
  const descriptionTextRef = useRef(null);
  const focusFrameRef = useRef(null);
  const [mouseHover, setMouseHover] = useState(false);
  const [keyboardFocusVisible, setKeyboardFocusVisible] = useState(false);
  const [revealDistance, setRevealDistance] = useState(0);
  const active = mouseHover || keyboardFocusVisible || touchOpen;
  const darkTitle = activity.headerColor === "#fecf3b" || ["french", "english"].includes(activity.frontVariant);

  useLayoutEffect(() => {
    const description = descriptionRef.current;
    const descriptionText = descriptionTextRef.current;
    if (!description || !descriptionText) return undefined;

    const measure = () => {
      const textBottom = descriptionText.offsetTop + descriptionText.offsetHeight;
      const frontCoverTop = activity.grayTop + 4;
      const nextDistance = Math.max(0, textBottom + 8 - frontCoverTop);
      setRevealDistance((current) => current === nextDistance ? current : nextDistance);
      onRevealMeasured(activity.id, nextDistance);
    };

    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(description);
    observer?.observe(descriptionText);

    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [activity.grayTop, activity.id, onRevealMeasured]);

  useEffect(() => () => {
    if (focusFrameRef.current !== null) cancelAnimationFrame(focusFrameRef.current);
  }, []);

  const style = {
    "--card-left": xPct(activity.left), "--card-top": yPct(activity.top),
    "--gray-top": cq(activity.grayTop), "--title-top": cq(activity.titleTop), "--title-width": cq(activity.titleWidth),
    "--image-width": cq(activity.imageWidth), "--image-height": cq(activity.imageHeight), "--image-left": cq(activity.imageLeft), "--image-top": cq(activity.imageTop),
    "--m-gray-top": `${activity.grayTop}px`, "--m-title-top": `${activity.titleTop}px`, "--m-title-width": `${activity.titleWidth}px`,
    "--m-image-width": `${activity.imageWidth}px`, "--m-image-height": `${activity.imageHeight}px`, "--m-image-left": `${activity.imageLeft}px`, "--m-image-top": `${activity.imageTop}px`,
    "--accent-width": cq(activity.accentWidth || 0), "--accent-height": cq(activity.accentHeight || 0), "--accent-left": cq(activity.accentLeft || 0), "--accent-top": cq(activity.accentTop || 0),
    "--m-accent-width": `${activity.accentWidth || 0}px`, "--m-accent-height": `${activity.accentHeight || 0}px`, "--m-accent-left": `${activity.accentLeft || 0}px`, "--m-accent-top": `${activity.accentTop || 0}px`,
    "--description-reveal": `${revealDistance}px`,
    "--interaction-duration": reduceMotion ? "0.01ms" : "340ms",
  };
  return (
    <article
      className="activityCard ax-activity"
      style={style}
      data-activity-id={activity.id}
      data-active={active ? "true" : "false"}
      role="button"
      tabIndex={0}
      aria-label={activity.title}
      aria-describedby={`${activity.id}-description`}
      aria-expanded={active}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setMouseHover(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setMouseHover(false);
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "touch" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) onTouchToggle(activity.id);
      }}
      onFocus={(event) => {
        const target = event.currentTarget;
        focusFrameRef.current = requestAnimationFrame(() => {
          setKeyboardFocusVisible(target.matches(":focus-visible"));
          focusFrameRef.current = null;
        });
      }}
      onBlur={() => {
        if (focusFrameRef.current !== null) cancelAnimationFrame(focusFrameRef.current);
        focusFrameRef.current = null;
        setKeyboardFocusVisible(false);
      }}
    >
      <div
        ref={descriptionRef}
        className="descriptionCard ax-description"
        data-card-layer="descriptionCard"
        style={{ background: headerBackground(activity) }}
      >
        <h3 className={`ax-card-title ${darkTitle ? "text-[#003750]" : "text-white"}`}>{activity.title}</h3>
        <div className="ax-description-panel">
          <p ref={descriptionTextRef} id={`${activity.id}-description`} className="descriptionText">{activity.description}</p>
        </div>
      </div>
      <FrontCard activity={activity} />
    </article>
  );
}

export default function ActividadesExtracurriculares() {
  const reduceMotion = useReducedMotion();
  const measurementsRef = useRef(new Map());
  const [touchOpenId, setTouchOpenId] = useState(null);
  const [firstRowReveal, setFirstRowReveal] = useState(0);

  const updateFirstRowReveal = useCallback(() => {
    const cardsInFirstRow = window.innerWidth >= 640 ? 3 : window.innerWidth >= 348 ? 2 : 1;
    const firstRowIds = activities.slice(0, cardsInFirstRow).map(({ id }) => id);
    const measuredFirstRow = firstRowIds.map((id) => measurementsRef.current.get(id)).filter(Number.isFinite);
    if (measuredFirstRow.length !== firstRowIds.length) return;
    const nextMaximum = Math.max(...measuredFirstRow);
    setFirstRowReveal((current) => current === nextMaximum ? current : nextMaximum);
  }, []);

  const handleRevealMeasured = useCallback((activityId, distance) => {
    measurementsRef.current.set(activityId, distance);
    updateFirstRowReveal();
  }, [updateFirstRowReveal]);

  useEffect(() => {
    const closeOnOutsideTouch = (event) => {
      if (event.pointerType !== "touch" || event.target.closest("[data-activity-id]")) return;
      setTouchOpenId(null);
    };
    document.addEventListener("pointerdown", closeOnOutsideTouch, true);
    return () => document.removeEventListener("pointerdown", closeOnOutsideTouch, true);
  }, []);

  useEffect(() => {
    updateFirstRowReveal();
    window.addEventListener("resize", updateFirstRowReveal);
    return () => window.removeEventListener("resize", updateFirstRowReveal);
  }, [updateFirstRowReveal]);

  return (
    <section className="actividades-x" aria-labelledby="actividades-x-title">
      <div className="ax-stage">
        <Image src={`${BASE}/fondo-nebula.webp`} alt="" fill priority sizes="(min-width: 1440px) 1440px, 100vw" className="ax-background" />
        <Image src={`${BASE}/olas-inferiores.svg`} alt="" width={1440} height={295} className="ax-waves" />
        <header className="ax-header">
          <div className="ax-eyebrow"><span /><p>Actividades extracurriculares</p></div>
          <h1 id="actividades-x-title">Más allá del aula, cada interés encuentra un espacio para crecer.</h1>
        </header>
        <div className="ax-cards" style={{ "--first-row-reveal": `${firstRowReveal}px` }}>
          {activities.map((activity) => <ActivityCard
            key={activity.id}
            activity={activity}
            touchOpen={touchOpenId === activity.id}
            onTouchToggle={(activityId) => setTouchOpenId((current) => current === activityId ? null : activityId)}
            onRevealMeasured={handleRevealMeasured}
            reduceMotion={reduceMotion}
          />)}
        </div>
      </div>
      <style>{`
        .actividades-x{position:relative;overflow-x:clip;overflow-y:visible;background:#07030f;color:#fff}
        .ax-stage{position:relative;isolation:isolate;width:100%;min-height:100vh;margin-inline:auto;padding:40px 16px 80px;container-type:inline-size}
        .ax-background{z-index:-2;object-fit:cover}.ax-waves{position:absolute;z-index:-1;bottom:0;left:-35%;width:170%;height:24%;object-fit:fill;pointer-events:none}
        .ax-header{position:relative;z-index:3;max-width:560px;margin:0 auto 36px}.ax-eyebrow{display:flex;align-items:center;gap:12px;filter:drop-shadow(0 4px 4px rgba(0,0,0,.25))}
        .ax-eyebrow span{flex:0 0 40px;height:6px;background:#aa181f}.ax-eyebrow p{margin:0;font-family:var(--font-outfit),sans-serif;font-size:12px;line-height:18px;letter-spacing:.012em}
        .ax-header h1{margin:12px 0 0;font-family:var(--font-fredoka),sans-serif;font-size:clamp(34px,10vw,46px);font-weight:500;line-height:1.09;text-shadow:0 4px 4px rgba(0,0,0,.25),0 4px 4px rgba(0,0,0,.25)}
        .ax-cards{position:relative;display:grid;grid-template-columns:150px;justify-content:center;justify-items:center;column-gap:16px;row-gap:24px;padding-top:max(0px,calc(var(--first-row-reveal,0px) - 36px))}
        .ax-activity{position:relative;width:150px;height:250px;overflow:visible;z-index:0;outline:none}.ax-activity[data-active="true"]{z-index:20}.ax-description,.ax-front{position:absolute;top:0;left:0;width:150px;will-change:transform;transition-duration:var(--interaction-duration);transition-timing-function:cubic-bezier(.22,1,.36,1)}
        .ax-description{z-index:1;min-height:150px;padding:0;border:2px solid #fdc119;border-radius:10px;color:#000;text-align:center;font-size:11px;line-height:1.2;letter-spacing:.04em;overflow:hidden;transform:translateY(0);transition-property:transform}.ax-description-panel{min-height:92px;margin:36px 8px 8px;padding:12px 4px 10px;border-radius:9px;background:#fff}.ax-description p{margin:0}.ax-activity[data-active="true"] .ax-description{transform:translateY(calc(0px - var(--description-reveal)))}
        .ax-front{z-index:2;height:150px;transform:scale(1);transform-origin:center center;transition-property:transform,filter}.ax-activity[data-active="true"] .ax-front{transform:scale(1.05);filter:drop-shadow(0 7px 6px rgba(0,0,0,.28)) drop-shadow(0 0 12px rgba(255,255,255,.58))}.ax-activity:focus-visible .ax-front{outline:3px solid #fff;outline-offset:5px}
        .ax-card-title{position:absolute;z-index:4;top:var(--m-title-top);left:50%;width:var(--m-title-width);margin:0;transform:translateX(-50%);font-family:var(--font-fredoka),sans-serif;font-size:14px;font-weight:600;line-height:14px;letter-spacing:1.4px;text-align:center;text-transform:uppercase}
        .ax-gray-layer{position:absolute;z-index:1;top:var(--m-gray-top);left:-2px;width:150px;height:135px;pointer-events:none}.ax-gray-shape{position:absolute;top:4.488px;left:0;width:150px;height:130.512px}
        .ax-illustration,.ax-accent{position:absolute;z-index:3;pointer-events:none;object-fit:contain;overflow:visible}.ax-illustration{top:var(--m-image-top);left:var(--m-image-left);width:var(--m-image-width);height:var(--m-image-height)}
        .ax-accent{top:var(--m-accent-top);left:var(--m-accent-left);width:var(--m-accent-width);height:var(--m-accent-height)}
        @media(min-width:348px){.ax-cards{grid-template-columns:repeat(2,150px)}}
        @media(min-width:640px){.ax-stage{padding-inline:32px}.ax-header{margin-inline:0}.ax-eyebrow p{font-size:14px}.ax-cards{grid-template-columns:repeat(3,150px);column-gap:28px;row-gap:32px}}
        @media(min-width:1024px){
          .ax-stage{width:100%;max-width:1440px;min-height:0;aspect-ratio:1440/760;padding:0}.ax-background{object-fit:fill}.ax-waves{top:62.105263%;bottom:auto;left:0;width:100%;height:38.815789%}
          .ax-header{position:absolute;top:13.947368%;left:10.486111%;width:36.25%;max-width:none;margin:0}.ax-eyebrow{gap:.972222cqw}.ax-eyebrow span{flex-basis:3.888889cqw;height:.416667cqw}.ax-eyebrow p{font-size:1.041667cqw;line-height:1.25cqw}
          .ax-header h1{margin-top:.694444cqw;font-size:3.194444cqw;line-height:3.472222cqw}.ax-cards{position:absolute;inset:0;display:block;padding-top:0}
          .ax-activity{position:absolute;top:var(--card-top);left:var(--card-left);width:10.416667cqw;height:12.777778cqw}.ax-description,.ax-front{width:10.416667cqw}
          .ax-description{min-height:10.416667cqw;border-width:.138889cqw;border-radius:.694444cqw;font-size:.763889cqw}.ax-description-panel{min-height:6.388889cqw;margin:2.5cqw .555556cqw .555556cqw;padding:.833333cqw .277778cqw .694444cqw;border-radius:.625cqw}.ax-front{height:10.416667cqw}
          .ax-card-title{top:var(--title-top);width:var(--title-width);font-size:.972222cqw;line-height:.972222cqw;letter-spacing:.097222cqw}.ax-gray-layer{top:var(--gray-top);left:-.138889cqw;width:10.416667cqw;height:9.375cqw}.ax-gray-shape{top:.311667cqw;width:10.416667cqw;height:9.063333cqw}
          .ax-illustration{top:var(--image-top);left:var(--image-left);width:var(--image-width);height:var(--image-height)}.ax-accent{top:var(--accent-top);left:var(--accent-left);width:var(--accent-width);height:var(--accent-height)}
        }
      `}</style>
    </section>
  );
}
