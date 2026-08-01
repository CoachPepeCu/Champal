"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconQuote } from "./icons";

const TESTIMONIALS = [
  {
    initials: "AV",
    name: "Andrea Villarreal",
    role: "Profesora de Español · Primaria",
    quote:
      "Lo que más disfruto es ver cómo un alumno pasa de temerle a la lectura a pedir “un capítulo más”. Ese cambio es la razón por la que enseño.",
    tag: "12 años en Champal",
    gradient: "linear-gradient(135deg, var(--color-info), var(--color-primary))",
  },
  {
    initials: "RE",
    name: "Ricardo Elizondo",
    role: "Profesor de Matemáticas · Secundaria",
    quote:
      "Mi recurso favorito no es un libro de texto: es cualquier problema que un alumno decide resolver por su cuenta. Ahí empieza el aprendizaje real.",
    tag: "8 años en Champal",
    gradient: "linear-gradient(135deg, var(--color-warm), var(--color-accent))",
  },
  {
    initials: "DC",
    name: "Daniela Cantú",
    role: "Coordinadora · Preparatoria",
    quote:
      "Lo que más valoro de Champal es que a los alumnos se les enseña a tomar decisiones, no solo a seguir instrucciones.",
    tag: "15 años en Champal",
    gradient: "linear-gradient(135deg, var(--color-teal), var(--color-primary))",
  },
  {
    initials: "JS",
    name: "Jorge Salinas",
    role: "Egresado · Ingeniero en Sistemas",
    quote:
      "Champal me enseñó a no rendirme ante un problema difícil. Esa disciplina la sigo usando todos los días en mi trabajo.",
    tag: "Generación 2015",
    gradient: "linear-gradient(135deg, var(--color-accent), #172e56)",
  },
  {
    initials: "VC",
    name: "Valeria Cantú",
    role: "Egresada · Estudiante de Medicina",
    quote:
      "Lo que más recuerdo de Champal no son las calificaciones, es la comunidad. Ahí hice amigos para toda la vida.",
    tag: "Generación 2019",
    gradient: "linear-gradient(135deg, var(--color-primary), var(--color-info))",
  },
];

const AUTO_ADVANCE_MS = 6000;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % TESTIMONIALS.length);
  }, []);

  const prev = () => {
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  const current = TESTIMONIALS[index];

  return (
    <section className="relative overflow-hidden py-10 lg:py-14">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-100" />
      <div
        className="absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-accent)" }}
      />
      <div
        className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-primary)" }}
      />

      <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-center font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary"
        >
          Voces de la Comunidad Champal
        </motion.h2>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative mt-10 rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-xl shadow-neutral-900/10 p-8 sm:p-12 min-h-[320px] flex flex-col justify-center"
        >
          <IconQuote className="h-9 w-9 text-primary/15" />

          <div className="relative mt-2 min-h-[180px] sm:min-h-[140px]">
            <AnimatePresence initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <p className="font-serif text-xl sm:text-2xl leading-relaxed text-primary">
                  “{current.quote}”
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ background: current.gradient }}
                  >
                    {current.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-primary text-sm">{current.name}</p>
                    <p className="text-sm text-neutral-600">{current.role}</p>
                  </div>
                  <span className="ml-auto hidden sm:inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                    {current.tag}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={prev}
            aria-label="Testimonio anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-primary hover:border-accent hover:text-accent transition-colors duration-200"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver testimonio de ${t.name}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-accent" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Siguiente testimonio"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-primary hover:border-accent hover:text-accent transition-colors duration-200"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
