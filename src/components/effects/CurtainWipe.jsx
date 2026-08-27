"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

/**
 * CurtainWipe
 * -----------
 * Cortina sólida (un solo color) que cubre `children` por completo y se
 * retira en un barrido horizontal ("Curtains: Clip wipe") animando
 * `clip-path` — se dispara UNA vez cuando el bloque entra en el viewport
 * por scroll, a diferencia de `PixelCurtain` (dispara al MONTAR — pensado
 * para el Hero, que ya está en pantalla desde el primer render; ver
 * `src/components/effects/PixelCurtain.jsx`). Este está pensado para
 * secciones/tarjetas que van apareciendo más abajo en la página conforme
 * el usuario hace scroll — cada una "se presenta" detrás de su propia
 * cortina.
 *
 * `from` decide en qué borde empieza a revelarse el contenido (la cortina
 * se retrae hacia el borde OPUESTO): "left" (default) revela de izquierda
 * a derecha — la cortina se encoge hacia la derecha hasta desaparecer;
 * "right" revela de derecha a izquierda.
 *
 * Color: mismo azul que ya usa PixelCurtain en los 5 Heros del sitio
 * (#6B92C9) — pásalo explícito si la sección que envuelve necesita otro
 * tono, pero por defecto reutiliza el de la transición del Hero para que
 * ambos efectos se sientan como el mismo lenguaje de marca.
 *
 * `useInView` imperativo (booleano de React) en vez del prop declarativo
 * `whileInView` — mismo patrón ya probado en PreparatoriaProgramas.js
 * (`useInView(frameRef, {once:true, amount:0.3})`). Ambas formas son
 * funcionalmente equivalentes (las dos dependen de IntersectionObserver
 * por debajo); se eligió esta por consistencia con el resto del código y
 * porque es más fácil de depurar con un valor de React explícito. Un
 * primer diagnóstico de "la cortina se queda trabada a medio abrir" en
 * esta sesión resultó ser el tab de automatización del navegador en
 * estado `document.hidden` (que detiene IntersectionObserver/rAF por
 * completo — ver memoria de proyecto "champal-niveles-pages-pattern",
 * nota sobre el "Browser pane" atascado), no un bug real de ninguna de
 * las dos formas — no asumir que el problema vuelve a ser esto sin
 * confirmar `document.hidden` primero.
 */
const CLOSED = "inset(0% 0% 0% 0%)"; // cubre el 100% del bloque

function openClip(from) {
  // El inset del borde donde EMPIEZA la revelación crece hasta 100%,
  // "comiéndose" el rectángulo de ese lado — la cortina visible que queda
  // se encoge hacia el borde contrario hasta desaparecer del todo ahí.
  return from === "right" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
}

export default function CurtainWipe({
  children,
  color = "#6B92C9",
  from = "left",
  duration = 0.9,
  amount = 0.3,
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });

  return (
    <div ref={ref} className={`relative isolate ${className}`}>
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{ backgroundColor: color }}
        initial={{ clipPath: CLOSED }}
        animate={{ clipPath: inView ? openClip(from) : CLOSED }}
        transition={{ duration, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}
