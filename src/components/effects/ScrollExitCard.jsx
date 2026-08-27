"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * ScrollExitCard
 * ---------------
 * Envuelve una tarjeta para que se desplace verticalmente atada al scroll
 * (no a un disparo puntual): mide el progreso de scroll de la propia
 * tarjeta con `offset: ["start end", "end start"]` — 0 cuando recién asoma
 * por el borde inferior del viewport, 1 cuando está a punto de
 * desaparecer por el borde superior — y traduce ese progreso 1:1 a un
 * `translateY` negativo creciente. Como es una función PURA de la posición
 * de scroll (sin animación de tiempo/spring de por medio), el efecto es
 * reversible gratis: al subir, `scrollYProgress` baja y el `translateY`
 * seencoge con él, así que la tarjeta "regresa" exactamente por el mismo
 * camino con el que "salió" — no hace falta ninguna lógica extra de
 * scroll-up-vs-scroll-down.
 *
 * `exitPct` está en % del propio alto de la tarjeta (no px fijos) para que
 * el recorrido escale igual sin importar el tamaño real renderizado.
 *
 * Pensado para usarse JUNTO a `CurtainWipe` (no en su reemplazo): este
 * componente mueve la tarjeta; `CurtainWipe` sigue encargándose de la
 * cortina de entrada. Envolver la tarjeta con `CurtainWipe` por fuera y
 * `ScrollExitCard` por dentro (o viceversa, el orden no importa — son
 * efectos independientes, uno de tiempo/disparo único y otro puramente
 * atado a scroll).
 */
export default function ScrollExitCard({ children, exitPct = 60, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `-${exitPct}%`]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
