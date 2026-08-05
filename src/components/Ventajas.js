"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

// Copy, iconografía y video reproducidos fielmente desde Figma
// (frames "Ventajas" — desktop/tablet/mobile, ver docs/Champal_Design_System.md).
const CARDS = [
  {
    icon: "/images/ventajas/excelencia-academica.png",
    title: "Excelencia Académica",
    text: "Aprendizajes sólidos que desarrollan el pensamiento propio y preparan a cada alumno para nuevos retos.",
  },
  {
    icon: "/images/ventajas/atencion-personalizada.png",
    title: "Atención Personalizada",
    text: "Acompañamiento cercano para reconocer las capacidades, necesidades y ritmo de cada alumno.",
  },
  {
    icon: "/images/ventajas/vision-internacional.png",
    title: "Visión Internacional",
    text: "Experiencias y herramientas para comprender el mundo y desenvolverse con confianza en él.",
  },
  {
    icon: "/images/ventajas/comunidad-y-valores.png",
    title: "Comunidad y Valores",
    text: "Un entorno que forma el carácter, fortalece los vínculos y promueve la responsabilidad.",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const cardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Ventajas() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-surface-warm-50">
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.3 }}
        variants={reduceMotion ? undefined : sectionVariants}
        className="mx-auto max-w-[1232px] px-6 sm:px-10 py-16 lg:py-20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
          <div className="flex flex-col gap-3 lg:w-1/2">
            <p className="font-display font-semibold text-[15px] uppercase tracking-[0.3px] text-red-500">
              Formación Integral
            </p>
            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[46px] leading-[1.15] text-primary">
              Una formación completa para un mundo que exige mucho más.
            </h2>
            <p className="text-base sm:text-lg lg:text-[22px] tracking-[0.44px] text-gris-oscuro">
              En Champal, el conocimiento académico convive con los valores, la
              atención personal y una visión abierta al mundo.
            </p>
          </div>

          <video
            className="w-full lg:w-1/2 aspect-[644/480] rounded-[10px] object-cover"
            src="/videos/ventajas-video.mp4"
            autoPlay
            muted
            playsInline
            preload="metadata"
            controls={false}
          />
        </div>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          variants={reduceMotion ? undefined : cardContainer}
          className="mt-10 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {CARDS.map(({ icon, title, text }) => (
            <motion.div
              key={title}
              variants={reduceMotion ? undefined : cardItem}
              className="flex flex-col gap-4 rounded-[10px] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.07)]"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={icon}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0"
                />
                <h3 className="font-display font-semibold text-lg text-primary">
                  {title}
                </h3>
              </div>
              <p className="text-base tracking-[0.32px] text-gris-oscuro">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
