"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const MILESTONES = [
  {
    year: "1993",
    title: "Fundación",
    text: "Champal abre sus puertas con la visión de formar una comunidad educativa sólida.",
  },
  {
    year: "2005",
    title: "Expansión Académica",
    text: "Se incorporan nuevos niveles educativos y se amplía el campus.",
  },
  {
    year: "2012",
    title: "Visión Internacional",
    text: "Iniciamos convenios que abren la puerta a una educación sin fronteras.",
  },
  {
    year: "2018",
    title: "Bachillerato Internacional",
    text: "Champal se convierte en sede oficial del programa de BI.",
  },
  {
    year: "Hoy",
    title: "Ciudadanos globales",
    text: "Seguimos evolucionando para el mundo de mañana.",
  },
];

export default function HistoryTimeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="bg-neutral-50 py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-center font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary"
        >
          Nuestra Historia
        </motion.h2>
        <p className="mt-2 text-center font-serif text-xl sm:text-2xl text-primary">
          Nuestra historia, nuestro futuro.
        </p>

        <div ref={containerRef} className="relative mt-14 overflow-x-auto sm:overflow-visible pb-2">
          <div className="relative min-w-[640px] sm:min-w-0 grid grid-cols-5 gap-4 px-2">
            <div className="absolute left-0 right-0 top-5 h-px bg-neutral-200" />
            <motion.div
              style={{ scaleX: lineScale }}
              className="absolute left-0 right-0 top-5 h-px bg-accent origin-left"
            />

            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
                className="relative flex flex-col items-center text-center"
              >
                <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-neutral-50" />
                <span className="mt-4 font-serif text-2xl text-primary">{m.year}</span>
                <h3 className="mt-1 font-serif text-sm text-primary">{m.title}</h3>
                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed max-w-[140px]">
                  {m.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
