"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { IconGlobe } from "./icons";

const CONTINENTS = [
  // North America
  { cx: 15, cy: 12, rx: 8.5, ry: 6.5 },
  { cx: 10, cy: 19, rx: 4.5, ry: 4.5 },
  { cx: 20, cy: 8, rx: 4, ry: 3 },
  // South America
  { cx: 24, cy: 30, rx: 4.5, ry: 9 },
  // Europe
  { cx: 48, cy: 10, rx: 4.5, ry: 3.8 },
  // Africa
  { cx: 49, cy: 25, rx: 6.5, ry: 10.5 },
  // Asia
  { cx: 64, cy: 12, rx: 12, ry: 7 },
  { cx: 76, cy: 18, rx: 8, ry: 6 },
  { cx: 70, cy: 22, rx: 6, ry: 5 },
  // Australia
  { cx: 83, cy: 37, rx: 5.5, ry: 3.5 },
];

function isLand(x, y) {
  return CONTINENTS.some(
    (c) => ((x - c.cx) / c.rx) ** 2 + ((y - c.cy) / c.ry) ** 2 <= 1
  );
}

function generateWorldDots() {
  const dots = [];
  for (let x = 1; x < 100; x += 2.4) {
    for (let y = 2; y < 46; y += 2.4) {
      if (isLand(x, y)) dots.push({ x, y });
    }
  }
  return dots;
}

const BADGES = [
  { label: "Bachillerato Internacional", pos: "top-2 -left-4 sm:-left-10" },
  { label: "Intercambios · Francia", pos: "top-10 -right-4 sm:-right-14" },
  { label: "Convenios · EUA", pos: "bottom-16 -left-6 sm:-left-16" },
  { label: "Modelo ONU · ChampalMUN", pos: "bottom-2 -right-2 sm:-right-10" },
];

const float = (delay) => ({
  animate: { y: [0, -8, 0] },
  transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay },
});

export default function GlobalReach() {
  const dots = useMemo(() => generateWorldDots(), []);

  return (
    <section className="relative overflow-hidden bg-primary py-10 lg:py-14">
      <div
        className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-info)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">
            Visión Internacional
          </h2>
          <p className="mt-3 font-serif text-2xl sm:text-3xl text-white leading-snug">
            Una educación que conecta a nuestros alumnos con el mundo.
          </p>
          <p className="mt-4 text-white/75 leading-relaxed max-w-md">
            A través del Bachillerato Internacional, convenios académicos,
            intercambios y programas como el International High School,
            preparamos a nuestros estudiantes para pensar, colaborar y
            liderar sin fronteras.
          </p>
          <a
            href="#admisiones"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors duration-200"
          >
            Descubre el programa <span>→</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex items-center justify-center h-80 sm:h-96"
        >
          <div className="relative h-56 w-56 sm:h-64 sm:w-64 rounded-full overflow-hidden shadow-2xl shadow-black/40">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, var(--color-info) 0%, var(--color-primary) 55%, #0a1730 100%)",
              }}
            />

            <motion.div
              className="absolute inset-y-0 left-0"
              style={{ width: "200%" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 200 48" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
                {dots.map((d, i) => (
                  <circle key={`a-${i}`} cx={d.x} cy={d.y} r="0.85" className="fill-white/55" />
                ))}
                {dots.map((d, i) => (
                  <circle key={`b-${i}`} cx={d.x + 100} cy={d.y} r="0.85" className="fill-white/55" />
                ))}
              </svg>
            </motion.div>

            {[30, 50, 70].map((top) => (
              <div
                key={top}
                className="absolute left-0 right-0 border-t border-white/10"
                style={{ top: `${top}%` }}
              />
            ))}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, transparent 40%, rgba(10,23,48,0.55) 100%)",
              }}
            />
            <div className="absolute inset-0 rounded-full ring-1 ring-white/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <IconGlobe className="h-9 w-9 text-white/40" />
            </div>
          </div>

          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.label}
              {...float(i * 0.4)}
              className={`absolute ${badge.pos} rounded-full bg-white/95 px-3.5 py-2 shadow-lg flex items-center gap-2`}
            >
              <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
              <span className="text-xs font-semibold text-primary whitespace-nowrap">
                {badge.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
