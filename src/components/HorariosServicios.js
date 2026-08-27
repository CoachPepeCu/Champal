"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// "09_Horarios_Servicios" (nodo Figma 82:760) — componente compartido,
// pensado para reutilizarse en cualquier página de nivel. Franja de
// encabezado azul sólido sobre un fondo con degradado diagonal (navy →
// azul claro), y N tarjetas "de vidrio" (degradado blanco → blanco
// transparente) con un ícono 3D y su horario correspondiente.
//
// Animación: el encabezado entra deslizando desde la derecha; las
// tarjetas entran en secuencia con un rebote de escala (0 → 120% →
// asienta en 100%); al terminar de asentarse, cada ícono empieza a
// flotar suavemente; al pasar el mouse, la tarjeta brilla y crece un
// poco.
//
// Props:
// - id: id de la sección (para anclas / botón de regreso).
// - title: título del encabezado.
// - cards: [{ key, icon, lines: string[], nowrap? }] — por defecto, los
//   horarios de Pre-Kinder.

const DEFAULT_CARDS = [
  {
    key: "atencion",
    icon: "/images/prekinder-horarios/icono-horario-atencion.png",
    lines: ["Horario de atención", "6:45 a.m. a 2:00 p.m."],
  },
  {
    key: "pedagogico",
    icon: "/images/prekinder-horarios/icono-horario-pedagogico.png",
    lines: ["Horario pedagógico", "de 8:30 a.m. a 1:00 p.m."],
  },
  {
    key: "servicio",
    icon: "/images/prekinder-horarios/icono-servicio-hasta.png",
    lines: ["Servicio hasta las 2:00 p.m."],
    nowrap: true,
  },
  {
    key: "ampliacion",
    icon: "/images/prekinder-horarios/icono-ampliacion-horario.png",
    lines: ["Ampliación de horario", "conforme a sus necesidades"],
  },
];

const VIEWPORT = { once: true, amount: 0.3 };
const CARD_ENTRANCE_DURATION = 0.9;
const CARD_STAGGER = 0.15;
const GLOW = "0 0 32px 10px rgba(255,255,255,0.45)";
const NO_GLOW = "0 0 0px 0px rgba(255,255,255,0)";

function TarjetaHorario({ card, index }) {
  // Una vez que el rebote de entrada termina, el objetivo de whileInView
  // pasa a ser un valor fijo (no un arreglo de keyframes). Sin esto,
  // Framer Motion vuelve a reproducir TODO el arreglo de keyframes del
  // rebote cada vez que termina el whileHover (porque al soltar el
  // hover, el componente "regresa" al target de whileInView, y si ese
  // target sigue siendo el arreglo [0, 1.2, 0.92, 1.04, 1], lo reproduce
  // de nuevo desde el inicio en vez de solo asentarse en 1).
  const [settled, setSettled] = useState(false);

  const entranceDelay = index * CARD_STAGGER;
  // El flotado del ícono arranca justo cuando la tarjeta termina de
  // asentarse (rebote incluido), para que el rebote y el flotado nunca
  // se encimen.
  const floatDelay = CARD_ENTRANCE_DURATION + entranceDelay;

  return (
    <motion.div
      className="flex flex-col items-center gap-4 rounded-[18px] bg-gradient-to-b from-white to-white/20 px-4 py-5 text-center sm:gap-6"
      initial={{ scale: 0, opacity: 0, boxShadow: NO_GLOW }}
      whileInView={
        settled
          ? { scale: 1, opacity: 1, boxShadow: NO_GLOW }
          : { scale: [0, 1.2, 0.92, 1.04, 1], opacity: 1, boxShadow: NO_GLOW }
      }
      viewport={VIEWPORT}
      onAnimationComplete={() => setSettled(true)}
      transition={
        settled
          ? { duration: 0.3, ease: "easeOut" }
          : {
              scale: { duration: CARD_ENTRANCE_DURATION, times: [0, 0.45, 0.65, 0.82, 1], ease: "easeOut", delay: entranceDelay },
              opacity: { duration: 0.3, delay: entranceDelay },
            }
      }
      whileHover={{ scale: 1.06, boxShadow: GLOW, transition: { duration: 0.35, ease: "easeOut" } }}
    >
      <motion.div
        className="relative aspect-square w-full max-w-[160px]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
      >
        <Image src={card.icon} alt="" fill sizes="(max-width: 640px) 40vw, 200px" className="object-contain" />
      </motion.div>
      <p className={`text-sm font-semibold text-white sm:text-base lg:text-[20px] ${card.nowrap ? "lg:whitespace-nowrap" : ""}`}>
        {card.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </motion.div>
  );
}

export default function HorariosServicios({ id = "horarios-servicios", title = "Horarios y servicios", cards = DEFAULT_CARDS }) {
  return (
    <section
      id={id}
      className="relative overflow-hidden"
      style={{ backgroundImage: "linear-gradient(75deg, #0c2742 0%, #6b92c9 100%)" }}
    >
      {/* Franja de encabezado — el fondo azul es estático, el contenido
          (acento + título) entra deslizando desde la derecha. */}
      <div className="relative overflow-hidden bg-[#6c93ca] px-6 py-6 lg:px-[99px] lg:py-8">
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="h-[14px] w-11 shrink-0 bg-[#d22527] sm:h-[16px] sm:w-14 lg:h-[18px]" />
          <h2 className="font-serif text-[24px] font-semibold uppercase tracking-[3px] text-white sm:text-[32px] lg:text-[48px] lg:tracking-[5.76px]">
            {title}
          </h2>
        </motion.div>
      </div>

      {/* Tarjetas. */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-10 sm:gap-6 lg:grid-cols-4 lg:gap-6 lg:px-8 lg:py-14">
        {cards.map((card, index) => (
          <TarjetaHorario key={card.key} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
