"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

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

// Tarjetas que suben desde la base de la sección y desaparecen al llegar a
// la posición de T1 (la primera tarjeta del export marca hasta dónde debe
// subir el resto), ciclo infinito escalonado. Geometría de la tarjeta
// (288×58, radius 12, gradiente, ícono 23px) y carril (left 13 / top 70 /
// gap 35) tomados del export exacto de Figma sobre "MarcoBandera", el
// bloque derecho que mide 846×480 (594 de MarcoTexto + 846 = 1440, el
// lienzo completo). Ritmo: duration + stagger + pausa escalados juntos
// para conservar el espacio entre tarjetas (pitch 93px = 58 alto + 35 gap).
const RISING_CARDS = [
  "Experiencia Internacional",
  "Oportunidades Ilimitadas",
  "Doble certificado",
];
const CARD_RISE_DISTANCE = 280; // px: nace por debajo de la base de la sección
const CARD_RISE_DURATION = 3.6; // s — 20% más lento (3 → 3.6)
const CARD_RISE_PAUSE = 2; // s de espera antes de reiniciar el ciclo (pedido explícito: 2s)
const CARD_STAGGER = 1; // s entre el disparo de cada tarjeta (sin cambio: 3.6/1=77.8px de gap, sigue > 58px de alto de tarjeta)

export default function GlobalReach() {
  const dots = useMemo(() => generateWorldDots(), []);
  const reduceMotion = useReducedMotion();

  return (
    <section data-nav-theme="dark" className="relative overflow-hidden bg-primary py-10 lg:py-14">
      <div
        className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-info)" }}
      />

      {/* Bandera México/EUA — a nivel de <section>, no del bloque h-80/h-96:
          ese bloque tiene padding vertical (py-10/lg:py-14) y está inset del
          borde real por el max-w-7xl + px-6/lg:px-8, así que anclada ahí
          nunca llegaba a los bordes verdaderos de la sección. inset-y-0
          right-0 la pega a los tres bordes (arriba, abajo, derecha) tal
          como en el export de Figma (MarcoBandera ocupa el alto completo
          del frame, sin padding propio). Pintada antes del contenido para
          quedar al fondo (bandera → globo → tarjetas). */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[38%] lg:w-[32%] pointer-events-none select-none"
      >
        <Image
          src="/images/bandera-mexico-eua.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 40vw, 30vw"
          className="object-cover opacity-90"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-sans text-base lg:text-[20px] font-bold uppercase tracking-[0.02em] text-[#f2c94c]">
            Visión Internacional
          </h2>
          <p
            className="mt-3 font-display text-3xl sm:text-4xl lg:text-[40px] font-semibold text-white leading-tight"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            International High School
          </p>
          <p className="mt-4 font-sans text-base lg:text-[20px] font-medium text-white leading-[1.55]">
            Somos la única institución educativa en Tabasco en ofrecer esta
            modalidad.
          </p>
          <p className="mt-4 font-sans text-base lg:text-[20px] font-medium text-white leading-[1.55]">
            Nuestros estudiantes tienen la oportunidad de graduarse con{" "}
            <span className="font-bold">dos certificados de preparatoria</span>,
            uno de <span className="font-bold">México</span> y otro de{" "}
            <span className="font-bold">Estados Unidos</span>. Abriéndoles las
            puertas a ilimitadas oportunidades académicas y profesionales.
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
          className="relative h-80 sm:h-96 overflow-hidden"
        >
          {/* Globo — animación y estilo sin tocar; solo tamaño/posición del
              círculo de referencia del export: left 143/846=16.9%,
              top 63/480=13.1%, diámetro 353/480=73.5% de la altura del
              bloque (escalado a h-80/h-96 para mantenerlo circular). */}
          <div className="absolute left-[16.9%] top-[13.1%] h-[235px] w-[235px] sm:h-[282px] sm:w-[282px] rounded-full overflow-hidden shadow-2xl shadow-black/40">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, var(--color-info) 0%, var(--color-primary) 55%, #0a1730 100%)",
              }}
            />

            <div
              className={`absolute inset-y-0 left-0 ${reduceMotion ? "" : "animate-globe-scroll"}`}
              style={{ width: "200%" }}
            >
              <svg viewBox="0 0 200 48" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
                {dots.map((d, i) => (
                  <circle key={`a-${i}`} cx={d.x} cy={d.y} r="0.85" className="fill-white/55" />
                ))}
                {dots.map((d, i) => (
                  <circle key={`b-${i}`} cx={d.x + 100} cy={d.y} r="0.85" className="fill-white/55" />
                ))}
              </svg>
            </div>

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
          </div>

          {/* Tarjetas: nacen debajo de la sección y suben en línea recta;
              al llegar a la posición de T1 (left 13/846=1.5%, top 70/480=
              14.6%, del export) se desvanecen y el ciclo reinicia,
              escalonado. Carril fijo w-288 (del export). */}
          <div className="absolute left-[1.5%] top-[14.6%] w-[260px] sm:w-[288px] pointer-events-none">
            {RISING_CARDS.map((label, i) =>
              reduceMotion ? (
                i === 0 && (
                  <div
                    key={label}
                    className="flex h-[58px] items-center gap-2.5 rounded-xl border border-[rgba(243,244,246,0.8)] bg-gradient-to-b from-[rgba(243,244,246,0.8)] to-[rgba(142,143,144,0.1)] px-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                  >
                    <span className="h-[23px] w-[23px] shrink-0 rounded-full bg-accent" />
                    <span className="font-sans text-[20px] font-medium text-black">{label}</span>
                  </div>
                )
              ) : (
                <motion.div
                  key={label}
                  initial={{ y: CARD_RISE_DISTANCE, opacity: 0 }}
                  animate={{
                    y: [CARD_RISE_DISTANCE, 0],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    y: {
                      duration: CARD_RISE_DURATION,
                      repeat: Infinity,
                      repeatDelay: CARD_RISE_PAUSE,
                      delay: i * CARD_STAGGER,
                      ease: "linear",
                    },
                    opacity: {
                      duration: CARD_RISE_DURATION,
                      repeat: Infinity,
                      repeatDelay: CARD_RISE_PAUSE,
                      delay: i * CARD_STAGGER,
                      ease: "linear",
                      times: [0, 0.1, 0.82, 1],
                    },
                  }}
                  className="absolute inset-x-0 top-0 flex h-[58px] items-center gap-2.5 rounded-xl border border-[rgba(243,244,246,0.8)] bg-gradient-to-b from-[rgba(243,244,246,0.8)] to-[rgba(142,143,144,0.1)] px-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                >
                  <span className="h-[23px] w-[23px] shrink-0 rounded-full bg-accent" />
                  <span className="font-sans text-[20px] font-medium text-black">{label}</span>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
