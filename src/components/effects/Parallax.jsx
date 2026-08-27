"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * Parallax
 * --------
 * Envoltorio agnóstico: el hijo se desplaza verticalmente (`translateY`,
 * vía `transform` — no toca `top`/`left`) a una velocidad ligeramente
 * distinta a la del scroll normal, mientras el elemento cruza el viewport
 * — el clásico efecto de profundidad ("el fondo/objeto se mueve más lento
 * que el contenido").
 *
 * Pensado para envolver un `<div className="absolute" style={{ left, top,
 * width, height }}>` que ya trae su posicionamiento absoluto (patrón
 * px->%/cqw usado en todo el "bloque largo" de Primaria) — Parallax NO
 * reemplaza esa posición, solo le agrega un `transform: translateY(...)`
 * encima vía motion, así que compone sin conflicto con `left`/`top` ni con
 * cualquier `transform` que ya tenga un hijo interno (p. ej. una rotación).
 * Por eso recibe `className`/`style` y los reenvía tal cual al
 * `motion.div` — es un reemplazo directo del `<div>` que ya estaba ahí.
 *
 * PRIMERA VERSIÓN (offset ["start end","end start"], todo el tránsito del
 * elemento por el viewport): el componente SÍ se movía — confirmado
 * midiendo el `transform` en vivo — pero para una foto de 400-700px de
 * alto, ese tránsito completo son 1200-1500px de scroll, así que el mismo
 * ±40px de desplazamiento quedaba repartido en un tramo tan largo que era
 * imperceptible al ojo durante el scroll normal (~6px de cambio cada
 * 100px scrolleados). El bug real no era que no funcionara, sino que el
 * rango era demasiado sutil para notarse.
 *
 * CORRECCIÓN: offset ["start 0.85", "end 0.15"] — el mismo recorrido de
 * -offsetPx a +offsetPx ahora ocurre en la ventana visible central del
 * elemento (desde que su borde superior ya está bien entrado en pantalla,
 * 85% hacia abajo del viewport, hasta que su borde inferior casi termina
 * de salir, 15% del tope) en vez de en todo su tránsito de borde a borde
 * — mismo desplazamiento máximo (offsetPx, sin más riesgo de recorte que
 * antes), pero concentrado en un tramo de scroll mucho más corto, así que
 * se percibe varias veces más rápido/notorio durante el scroll normal.
 *
 * `offsetPx` (default 70): cuánto se adelanta/atrasa el elemento respecto
 * al scroll normal en cada extremo de esa ventana. Subido de 40 a 70 tras
 * confirmar que con la ventana comprimida seguía sin notarse lo suficiente
 * — verificar visualmente contra cada foto que el pico de desplazamiento
 * no reintroduzca recortes (algunas, como la mascota de Progrentis, tienen
 * poco margen — ver memoria de proyecto).
 */
export default function Parallax({ children, offsetPx = 70, className = "", style = {}, ...rest }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.15"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offsetPx, -offsetPx]);

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y }} {...rest}>
      {children}
    </motion.div>
  );
}
