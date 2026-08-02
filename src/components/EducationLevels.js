"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const LEVELS = [
  {
    slug: "prekinder",
    title: "Pre-Kinder",
    tagline: "Jugamos hoy, crecemos felices.",
    reflection: "En los primeros años se siembra la confianza que dura toda la vida.",
    image: "/images/niveles/nivel-prekinder.png",
    imageWidth: 44,
  },
  {
    slug: "kinder",
    title: "Kinder",
    tagline: "Aprendemos hoy, construimos mañana.",
    reflection: "Cada pregunta de un niño es la semilla de un futuro pensador.",
    image: "/images/niveles/nivel-kinder.png",
    imageWidth: 40,
  },
  {
    slug: "primaria",
    title: "Primaria",
    tagline: "Preguntamos más, aprendemos mejor.",
    reflection: "La curiosidad que despertamos hoy será la pasión que los guíe mañana.",
    image: "/images/niveles/nivel-primaria.png",
    imageWidth: 42,
  },
  {
    slug: "secundaria",
    title: "Secundaria",
    tagline: "Pensamos con criterio, avanzamos con confianza.",
    reflection: "Entre la niñez y la juventud formamos el carácter que sostendrá sus decisiones.",
    image: "/images/niveles/nivel-secundaria.png",
    imageWidth: 58,
  },
  {
    slug: "preparatoria",
    title: "Preparatoria",
    tagline: "Elegimos propósito, preparamos el futuro.",
    reflection: "Esta etapa no es el final del camino: es el impulso hacia quienes serán.",
    image: "/images/niveles/nivel-preparatoria.png",
    imageWidth: 58,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 0.8, 0.3, 1] } },
};

function StarTittle() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute left-1/2 -top-[0.66em] h-[0.42em] w-[0.42em] -translate-x-1/2 fill-white"
      style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))" }}
    >
      <path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85L12 3.5z" />
    </svg>
  );
}

function LevelTitle({ text }) {
  const idx = text.toUpperCase().indexOf("I");
  if (idx === -1) return <span className="font-soft3d">{text}</span>;
  return (
    <span className="font-soft3d whitespace-nowrap">
      {text.slice(0, idx)}
      <span className="relative inline-block">
        <StarTittle />I
      </span>
      {text.slice(idx + 1)}
    </span>
  );
}

function BackgroundStars() {
  const dots = [
    { top: "10%", left: "14%", size: 10, opacity: 0.5 },
    { top: "22%", left: "82%", size: 7, opacity: 0.35 },
    { top: "46%", left: "8%", size: 6, opacity: 0.3 },
    { top: "62%", left: "88%", size: 9, opacity: 0.4 },
    { top: "85%", left: "18%", size: 7, opacity: 0.3 },
  ];
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <circle cx="20" cy="30" r="16" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="0.6" />
      <circle cx="85" cy="75" r="20" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="0.6" />
      {dots.map((d, i) => (
        <g key={i} transform={`translate(${d.left.replace("%", "")}, ${d.top.replace("%", "")})`}>
          <path
            d="M0 -3.2L0.9 -0.9L3.2 0L0.9 0.9L0 3.2L-0.9 0.9L-3.2 0L-0.9 -0.9Z"
            fill="white"
            opacity={d.opacity}
            transform={`scale(${d.size / 10})`}
          />
        </g>
      ))}
    </svg>
  );
}

function LevelCard({ level }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      variants={item}
      className="h-[440px] w-full [perspective:1600px] sm:h-[480px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative h-full w-full cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] p-5 shadow-lg [backface-visibility:hidden]"
          style={{
            background:
              "radial-gradient(120% 90% at 25% 0%, #1e3f74 0%, #142c56 45%, #0b1c3d 100%)",
          }}
        >
          <BackgroundStars />
          <div className="relative z-10 text-[2rem] leading-none sm:text-[2.15rem]">
            <LevelTitle text={level.title} />
          </div>
          <p className="relative z-10 mt-3 max-w-[80%] text-sm leading-snug text-white/90">
            {level.tagline}
          </p>
          <div className="relative z-10 mt-auto flex flex-1 items-end justify-center">
            <Image
              src={level.image}
              alt={level.title}
              width={420}
              height={420}
              className="pointer-events-none h-auto max-h-[78%] w-auto object-contain object-bottom drop-shadow-[0_8px_10px_rgba(0,0,0,0.35)]"
              style={{ width: `${level.imageWidth}%` }}
            />
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-[28px] border-[5px] border-white p-[3px] shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ background: "#0f2246" }}
        >
          <div
            className="flex h-full w-full flex-col items-center justify-center rounded-[22px] border border-white/35 px-6 text-center"
            style={{
              background: "radial-gradient(120% 90% at 50% 0%, #21447f 0%, #122a52 55%, #0a1a38 100%)",
            }}
          >
            <p className="font-serif text-lg italic leading-relaxed text-white/95">
              &ldquo;{level.reflection}&rdquo;
            </p>
            <a
              href="#admisiones"
              onClick={(e) => e.stopPropagation()}
              className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(180deg, #f7f8fa 0%, #d9dde4 100%)",
                boxShadow: "0 6px 18px rgba(255,255,255,0.28), 0 3px 8px rgba(0,0,0,0.35)",
              }}
            >
              Conoce más
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function EducationLevels() {
  return (
    <section id="niveles-educativos" className="bg-neutral-50 py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-center font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary"
        >
          Niveles Educativos
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5"
        >
          {LEVELS.map((level) => (
            <LevelCard key={level.slug} level={level} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
