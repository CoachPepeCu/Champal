"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";

// Sección "04_Programas" (node 82:1587): encabezado de cristal sobre un
// fondo de doodles + un carril de 8 tarjetas de programa. En Figma el
// carril es una fila estática (node 116:394 "Pista_Kinder"); el usuario
// pidió convertirlo en un carrusel CIRCULAR (no la marquesina lineal de
// Pre-Kinder en PreKinderTodoComienza.js): 8 tarjetas repartidas en un aro,
// ~3 al frente en todo momento, girando solas, que se detiene y levanta la
// tarjeta bajo el cursor al hacer hover — mismo gesto de "levantar" que ya
// usa PreKinderTodoComienza (translate-y + sombra). El globo de diálogo al
// estilo Pre-Kinder queda pendiente para un siguiente paso.
//
// OJO: aunque los nombres de capa en Figma coinciden con los de las
// tarjetas de Pre-Kinder (Card1_Prelector, Card2_Grafo...), el ARTE es
// distinto — se confirmó bajando ambos y comparando antes de asumir que
// se podían reutilizar los .webp de /images/prekinder/.
const PROGRAMS = [
  {
    key: "filosofia",
    image: "/images/kinder/card-filosofia.png",
    title: ["Filosofía para niños"],
    align: "left",
    textColor: "#fff",
    border: "#cecece",
    message: "Junto con CELAFIN, les damos herramientas para desarrollar un pensamiento reflexivo y apropiado.",
  },
  {
    key: "lectura",
    image: "/images/kinder/card-lectura.png",
    title: ["Programa de Lectura"],
    align: "left",
    textColor: "#fff",
    border: "#5d747f",
    message: "Buscamos que la lectura sea motivadora y que el gusto por leer los acompañe toda la vida.",
  },
  {
    key: "feel",
    image: "/images/kinder/card-feel.png",
    title: ["Aula FEEL"],
    align: "center",
    textColor: "#fff",
    border: "#cecece",
    message: "Desarrollamos habilidades sensoriales mediante experiencias que invitan a explorar y descubrir.",
  },
  {
    key: "intelectuales",
    image: "/images/kinder/card-intelectuales.png",
    title: ["Habilidades Intelectuales"],
    // Título largo: en una sola línea empalmaba con la ilustración de abajo
    // en dos renglones — se achica y se fuerza a una sola línea.
    compact: true,
    align: "center",
    textColor: "#fff",
    border: "#fbfbfb",
    message: "Desafíos divertidos que ejercitan la inteligencia y fortalecen sus habilidades cognitivas.",
  },
  {
    key: "efisica",
    image: "/images/kinder/card-efisica.png",
    title: ["Educación", "Física"],
    align: "left",
    textColor: "#fff",
    border: "#cecece",
    message: "A través del movimiento, descubren las capacidades de su cuerpo e interactúan con su entorno.",
  },
  {
    key: "craft",
    image: "/images/kinder/card-craft.png",
    title: ["Programa CRAFT"],
    align: "center",
    textColor: "#fff",
    border: "#cecece",
    message: "Impulsamos su creatividad mediante experiencias de tecnología con iPads.",
  },
  {
    key: "desarrollo",
    image: "/images/kinder/card-desarrollo.png",
    title: ["Desarrollo Personal", "y Social"],
    align: "center",
    textColor: "#fff",
    border: "#cecece",
    message: "Promovemos la tolerancia, solidaridad y empatía para afrontar situaciones personales y sociales.",
  },
  {
    key: "ritmo",
    image: "/images/kinder/card-ritmo.png",
    title: ["Ritmo y movimiento"],
    align: "left",
    textColor: "#09008a",
    border: "#5d747f",
    message: "La música y el movimiento fortalecen habilidades intelectuales, motrices y de lenguaje.",
  },
];

const TEXT_SHADOW = "0px 2px 3px rgba(10,23,48,0.35)";

const CARD_COUNT = PROGRAMS.length;
const ANGLE_STEP = 360 / CARD_COUNT;
const ROTATION_PERIOD_S = 34; // una vuelta completa cada 34s — giro pausado, no frenético
const DEG_PER_SEC = 360 / ROTATION_PERIOD_S;
const MIN_SCALE = 0.62; // tamaño de las tarjetas hasta atrás del aro
const MIN_OPACITY = 0.55; // nunca casi-invisibles: el aro debe leerse de fondo

// El hover (pausa + se alza) solo debe responder en las tarjetas "al
// frente" — no en las de atrás. Con 8 tarjetas cada 45°, 67.5° (a medio
// camino entre "la vecina" a 45° y "la siguiente" a 90°) es el corte
// natural: en todo momento hay 3 o 4 tarjetas dentro de ese arco frontal,
// que es justo lo que se pidió ("3 o 4 al frente").
const FRONT_DEPTH_THRESHOLD = Math.cos((67.5 * Math.PI) / 180);

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function OrbitCard({ program, index, rotation, radius, hovered, onHoverStart, onHoverEnd }) {
  const angleOffset = index * ANGLE_STEP;

  const transform = useTransform(rotation, (r) => {
    const rad = ((r + angleOffset) * Math.PI) / 180;
    const depth = Math.cos(rad); // -1 (atrás) .. 1 (al frente)
    const x = Math.sin(rad) * radius;
    const scale = lerp(MIN_SCALE, 1, (depth + 1) / 2);
    return `translate(-50%, -50%) translateX(${x}px) scale(${scale})`;
  });
  const opacity = useTransform(rotation, (r) => {
    const rad = ((r + angleOffset) * Math.PI) / 180;
    const depth = Math.cos(rad);
    return lerp(MIN_OPACITY, 1, (depth + 1) / 2);
  });
  const zIndex = useTransform(rotation, (r) => {
    const rad = ((r + angleOffset) * Math.PI) / 180;
    return Math.round(Math.cos(rad) * 100) + 100;
  });
  // Solo las tarjetas "al frente" (ver FRONT_DEPTH_THRESHOLD) deben
  // reaccionar al mouse — las de atrás no disparan el hover aunque el
  // cursor pase sobre ellas.
  const pointerEvents = useTransform(rotation, (r) => {
    const rad = ((r + angleOffset) * Math.PI) / 180;
    return Math.cos(rad) > FRONT_DEPTH_THRESHOLD ? "auto" : "none";
  });

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[190px] sm:w-[240px] lg:w-[320px]"
      style={{ transform, opacity, zIndex: hovered ? 999 : zIndex, pointerEvents }}
    >
      {/* Nube-globo de diálogo — aparece arriba de la tarjeta en hover,
          delante de ella (z-20, si no pintaría detrás por el orden del DOM).
          Misma mecánica que PreKinderTodoComienza.js, pero con la nube y el
          texto que pidió el usuario para Kinder (rectangular, cola centrada
          abajo — el texto se centra sin tener que esquivar una cola lateral
          como en la de Pre-Kinder). */}
      <div
        className={`pointer-events-none absolute -top-[130px] left-1/2 z-20 w-[190px] opacity-0 transition-all duration-300 ease-out sm:-top-[150px] sm:w-[230px] ${
          hovered ? "opacity-100" : ""
        }`}
        style={{
          // -translate-x-1/2 / scale-* como utilidades de Tailwind no
          // generan CSS en este proyecto (mismo hallazgo que el espejo del
          // Hero — ver memoria "champal-tailwind-v4-negative-utilities",
          // que aquí también alcanzó a scale-90, no solo a las negativas).
          // Van por `style` para no depender de esa utilidad.
          transform: hovered ? "translateX(-50%) translateY(-8px) scale(1)" : "translateX(-50%) scale(0.9)",
        }}
      >
        <div className="relative">
          <Image
            src="/images/kinder/nube-programas.webp"
            alt=""
            width={356}
            height={296}
            className="h-auto w-full drop-shadow-[0_16px_28px_rgba(10,23,48,0.38)]"
          />
          <div className="absolute inset-x-[12%] top-[10%] bottom-[24%] flex items-center justify-center overflow-hidden">
            <p
              className="font-hand text-pretty text-center text-[13px] leading-[1.4] text-[#0a1730] sm:text-[15px] sm:leading-[1.45]"
              style={{ textWrap: "pretty" }}
            >
              {program.message}
            </p>
          </div>
        </div>
      </div>

      <div
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        onFocus={onHoverStart}
        onBlur={onHoverEnd}
        tabIndex={0}
        className={`group relative aspect-[320/380] w-full overflow-hidden rounded-[24px] shadow-[0px_10px_15px_-4px_rgba(0,0,0,0.3),0px_38px_42px_-14px_rgba(0,0,0,0.55)] outline-none transition-transform duration-300 ease-out ${
          hovered ? "-translate-y-4 scale-[1.06]" : ""
        }`}
      >
        <Image
          src={program.image}
          alt={program.title.join(" ")}
          fill
          sizes="(max-width: 640px) 190px, (max-width: 1024px) 240px, 320px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-[3.16%_3.13%] rounded-[24px] border-[1.5px]" style={{ borderColor: program.border }} />
        <div
          className={`pointer-events-none absolute inset-x-4 top-[9%] font-serif font-semibold ${
            program.compact
              ? "whitespace-nowrap text-sm leading-[1.15] sm:text-base lg:text-[19px] lg:leading-[22px]"
              : "text-base leading-[1.15] sm:text-xl lg:text-[26px] lg:leading-[28px]"
          } ${program.align === "center" ? "text-center" : "text-left"}`}
          style={{ color: program.textColor, textShadow: TEXT_SHADOW }}
        >
          {program.title.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CircularCarousel() {
  const containerRef = useRef(null);
  const [radius, setRadius] = useState(340);
  const [hoveredKey, setHoveredKey] = useState(null);
  const rotation = useMotionValue(0);
  const paused = hoveredKey !== null;

  useAnimationFrame((_, delta) => {
    if (paused) return;
    rotation.set(rotation.get() + (DEG_PER_SEC * delta) / 1000);
  });

  // Radio del aro relativo al ancho real del carrusel, medido en vivo, para
  // que "~3 tarjetas al frente" se mantenga proporcional en cualquier ancho.
  useResizeRadius(containerRef, setRadius);

  return (
    <div ref={containerRef} className="relative h-[262px] w-full sm:h-[321px] lg:h-[420px]" style={{ perspective: "1400px" }}>
      {PROGRAMS.map((program, index) => (
        <OrbitCard
          key={program.key}
          program={program}
          index={index}
          rotation={rotation}
          radius={radius}
          hovered={hoveredKey === program.key}
          onHoverStart={() => setHoveredKey(program.key)}
          onHoverEnd={() => setHoveredKey((k) => (k === program.key ? null : k))}
        />
      ))}
    </div>
  );
}

// Pequeño hook local: observa el ancho del carrusel y fija el radio del aro
// como una fracción de ese ancho (afinado a ojo para que ronden 3 tarjetas
// visibles al frente sin encimarse demasiado).
function useResizeRadius(ref, setRadius) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width;
      if (width) setRadius(Math.max(120, Math.min(520, width * 0.34)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, setRadius]);
}

export default function KinderProgramas() {
  return (
    <section className="relative overflow-hidden py-14 lg:py-20">
      <div className="absolute inset-0">
        <Image src="/images/kinder/fondo-programas.png" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div
          className="flex flex-col items-center gap-[10px] rounded-[28px] border px-6 py-[10px] text-center shadow-[0px_4px_4px_0px_rgba(23,45,88,0.1)] sm:px-16"
          style={{
            backgroundColor: "rgba(255,255,255,0.18)",
            borderColor: "rgba(255,255,255,0.42)",
            backdropFilter: "blur(9px)",
            WebkitBackdropFilter: "blur(9px)",
          }}
        >
          {/* Raya roja en línea con el texto (no en su propia fila) —
              gana esa línea de alto para que la sección quede más baja. */}
          <div className="flex items-center gap-3">
            <span className="h-[5px] w-16 shrink-0 rounded-full" style={{ backgroundColor: "#aa181f" }} />
            <p className="font-serif text-base font-semibold uppercase tracking-[0.44px] sm:text-lg lg:text-[22px]" style={{ color: "#0a1730" }}>
              Una formación que crece con ellos
            </p>
          </div>
          <h2
            className="max-w-[840px] font-serif text-2xl font-semibold leading-tight sm:text-3xl lg:text-[44px] lg:leading-[50px]"
            style={{ color: "#0a1730" }}
          >
            Aprendizajes que despiertan su curiosidad y sus capacidades
          </h2>
          <p className="max-w-[780px] text-base leading-relaxed sm:text-lg lg:text-[22px] lg:leading-[30px]" style={{ color: "#494949" }}>
            Cada experiencia está pensada para que aprendan, se expresen y desarrollen sus habilidades de forma
            interesante, divertida y acorde a su edad.
          </p>
        </div>
      </div>

      <div className="relative mt-32 lg:mt-36">
        <CircularCarousel />
      </div>
    </section>
  );
}
