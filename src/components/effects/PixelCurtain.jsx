"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

/**
 * PixelCurtain
 * ------------
 * Cortina de píxeles: overlay absoluto compuesto por una grilla rows x cols
 * de rectángulos sólidos que, al montar el componente, se desvanecen/encogen
 * en un barrido diagonal — arranca en la esquina inferior izquierda y
 * termina en la superior derecha, como una cortina que se abre en diagonal —
 * revelando lo que hay debajo. Pensado para envolver un Hero sin tocar su
 * layout.
 *
 * No se aplica a ningún Hero real todavía; es un componente aislado.
 *
 * Color: plano, un solo tono (#6B92C9 por default) — pasa `color` para
 * usar otro.
 */
export default function PixelCurtain({
  children,
  rows = 8,
  cols = 12,
  color = "#6B92C9",
  duration = 1, // segundos, total de la animación (0.8–1.2 recomendado)
  onComplete,
  className = "",
}) {
  const [phase, setPhase] = useState("animating"); // "animating" -> "closing" -> "done"

  const cellCount = rows * cols;

  // Duración propia de cada rectángulo dentro del total: el resto del
  // presupuesto de tiempo se reparte como stagger entre celdas.
  const cellDuration = Math.min(duration * 0.45, 0.6);
  const staggerChildren =
    cellCount > 1 ? (duration - cellDuration) / (cellCount - 1) : 0;

  // Orden de aparición = barrido diagonal. Cada celda recibe una métrica de
  // distancia a la esquina inferior izquierda (row = rows-1, col = 0): la
  // esquina inferior izquierda tiene distancia 0 (se anima primero) y la
  // esquina superior derecha tiene la distancia máxima (se anima al final).
  // Ordenamos las celdas por esa métrica y dejamos que staggerChildren haga
  // el resto (delay = índice-en-el-orden * stagger) — así el barrido queda
  // expresado puramente como orden de montaje, sin delays manuales.
  const cells = useMemo(() => {
    const base = Array.from({ length: cellCount }, (_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      return { row, col, distance: (rows - 1 - row) + col };
    });
    return base.sort((a, b) => a.distance - b.distance);
  }, [cellCount, cols, rows]);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const totalMs = reduceMotion
      ? 0
      : (staggerChildren * (cellCount - 1) + cellDuration) * 1000;

    const closeTimer = setTimeout(() => {
      // 1) deja de bloquear clicks sobre el Hero ya revelado…
      setPhase("closing");
      // 2) …y en el siguiente frame lo desmontamos del árbol.
      requestAnimationFrame(() => {
        setPhase("done");
        onComplete?.();
      });
    }, totalMs);

    return () => clearTimeout(closeTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellCount, staggerChildren, cellDuration]);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren, delayChildren: 0 },
    },
  };

  const cell = {
    hidden: { opacity: 1, scale: 1 },
    show: {
      opacity: 0,
      scale: 0,
      transition: { duration: cellDuration, ease: "easeInOut" },
    },
  };

  return (
    <div className={`relative isolate ${className}`}>
      {children}

      {phase !== "done" && (
        <motion.div
          aria-hidden="true"
          variants={container}
          initial="hidden"
          animate="show"
          className="absolute inset-0 z-20 grid overflow-hidden"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            pointerEvents: phase === "closing" ? "none" : "auto",
          }}
        >
          {cells.map(({ row, col }) => (
            <motion.div
              key={`${row}-${col}`}
              variants={cell}
              style={{
                gridRowStart: row + 1,
                gridColumnStart: col + 1,
                backgroundColor: color,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
