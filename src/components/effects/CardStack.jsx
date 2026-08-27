"use client";

import { Children, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * CardStack
 * ---------
 * Apila `children` con scroll: cada tarjeta se fija (`position: sticky`) en
 * el mismo `topPx`, así la siguiente tarjeta la va cubriendo — el clásico
 * efecto "stacking cards". El z-index crece con el índice (1, 2, 3…) para
 * que el orden de apilado en pantalla coincida con el orden del DOM: la
 * última tarjeta siempre queda arriba, tapando a las anteriores.
 *
 * DOS INTENTOS previos, dos bugs distintos — documentados porque el ajuste
 * fino de este componente no es obvio y es fácil reintroducirlos:
 *
 * 1) Slots `min-h-screen` CONTIGUOS, sin solape: la tarjeta i+1 solo asoma
 *    en el instante exacto en que i termina de soltarse, y de ahí en
 *    adelante ambas se mueven a la misma velocidad de scroll — su borde
 *    superior queda siempre TOCANDO el borde inferior de i sin pisarla
 *    nunca (gap medido en vivo: 0px, nunca negativo). Se ven una debajo de
 *    la otra, nunca una ENCIMA de la otra.
 *
 * 2) Se agregó solape real vía `margin-top` negativo — eso sí produce
 *    cobertura real (confirmado: el borde superior de i+1 pasa por ENCIMA
 *    del borde inferior de i) — pero el solape arrancaba desde el
 *    PRINCIPIO del scroll de cada tarjeta (offset ["start start","end
 *    start"], que cubre TODO el slot), así que la tarjeta 2 empezaba a
 *    treparse y tapar el contenido de la 1 casi de inmediato, antes de que
 *    se pudiera terminar de leer — el bug que reportó el usuario.
 *
 * LA CORRECCIÓN (aquí): separar "tiempo de lectura" de "tiempo de
 * transición". Cada slot mide 100vh (una pantalla, para el anclaje sticky)
 * + `DWELL_VH` de puro reposo (la tarjeta queda pegada arriba, inmóvil,
 * opacidad/escala SIN CAMBIOS — tiempo real de lectura). El fundido/
 * encogido usa offset ["end end", "end start"] en vez de
 * ["start start","end start"]: ese offset mide un tramo de exactamente UNA
 * altura de viewport pegado al FINAL del slot (0 cuando el borde inferior
 * del slot toca el borde inferior del viewport, 1 cuando toca el borde
 * superior) — así el valor queda clavado en 0 (opacidad/escala intactas)
 * durante todo `DWELL_VH`, y solo empieza a moverse en el tramo final,
 * justo cuando el solape (`OVERLAP_VH`, alineado a esa misma ventana final)
 * hace que la tarjeta siguiente empiece a asomar. El empalme queda
 * pospuesto hasta después de la lectura, no repartido a lo largo de ella.
 *
 * `scaleDown` (default true) interpola una reducción de escala leve
 * (1 -> 0.92) en esa misma ventana final. En false, la escala queda fija en
 * 1 — ninguna transformación de tamaño, solo cambia la opacidad.
 *
 * Agnóstico del contenido: no le importa si el hijo trae su propio wrapper
 * con bordes/sombra (p. ej. las tarjetas de Kinder/Secundaria/Preparatoria,
 * cada una ya con su propio rounded+shadow) o si es una sección full-bleed
 * sin wrapper propio (como el bloque largo de Primaria) — CardStack solo
 * controla posición/z-index/opacidad/escala del CONTENEDOR que envuelve a
 * cada hijo, nunca toca ni asume nada del markup interno.
 */
const OPACITY_RANGE = [1, 0.6];
const SCALE_RANGE = [1, 0.92];

// Reposo puro por tarjeta, en vh de scroll, ADEMÁS de la pantalla base
// (100vh) que ya usa el propio anclaje sticky — este es el tiempo real de
// lectura, sin que la tarjeta siguiente asome ni cambie nada la opacidad/
// escala. El default (90) está afinado contra el contenido real de Kinder
// (párrafo + tarjetas de ventaja, harto texto) — para tarjetas con MENOS
// texto (ej. Preparatoria: título + 1 párrafo corto) 90vh de reposo
// "puro" sin ningún cambio visual se siente como que la página se traba,
// porque en una rueda de mouse típica (~80-100px por "click") equivale a
// 7-8 giros consecutivos sin ninguna señal de que el scroll esté
// funcionando — reportado por el usuario ("debo usar exactamente 8 veces
// la rueda"). Por eso ahora es un PROP (`dwellVh`), no una constante fija
// — cada sitio de uso elige su propio valor según cuánto texto tenga que
// leerse antes de pasar a la siguiente tarjeta, en vez de heredar el
// afinado de Kinder por defecto en todos lados.
const DWELL_VH_DEFAULT = 90;

// Cuánto adelanta cada slot (excepto el primero) al anterior — determina
// cuándo empieza a asomar la tarjeta siguiente. Independiente de
// `dwellVh`: el solape arranca EXACTAMENTE cuando termina el reposo (sea
// cual sea su duración), alineado con la ventana de fundido de abajo
// (["end end","end start"], que siempre mide un tramo de 100vh pegado al
// final del slot, sin importar cuánto mida el slot completo) — así ambas
// cosas (la tarjeta 1 empezando a desvanecerse y la tarjeta 2 empezando a
// asomar) ocurren juntas, después de la lectura, no antes.
const OVERLAP_VH = 12;

export default function CardStack({ children, scaleDown = true, topPx = 0, dwellVh = DWELL_VH_DEFAULT, className = "" }) {
  const items = Children.toArray(children);

  return (
    // `data-card-stack`: marcador leído por CardStackAnchorFix.jsx (montado
    // una vez en layout.js) — sin esto no puede distinguir "un link ancla
    // apunta a una tarjeta apilada" de cualquier otro link ancla del sitio.
    // Ver ese archivo para el porqué (salto instantáneo al entrar directo
    // por ancla + apagar scroll-behavior:smooth durante scroll con rueda,
    // ambos fixes a bugs reportados por el usuario en el CardStack de
    // Preparatoria — el bug es de este componente, no de esa página en
    // particular, así que el fix vive centralizado y beneficia también a
    // Kinder/Secundaria).
    <div data-card-stack="true" className={`relative ${className}`}>
      {items.map((child, index) => (
        <StackSlot key={child.key ?? index} index={index} topPx={topPx} scaleDown={scaleDown} dwellVh={dwellVh}>
          {child}
        </StackSlot>
      ))}
    </div>
  );
}

function StackSlot({ children, index, topPx, scaleDown, dwellVh }) {
  const slotRef = useRef(null);

  // Progreso de la VENTANA FINAL de este slot (una altura de viewport,
  // pegada al final) — no de todo el slot. 0 mientras dura el reposo
  // (dwellVh), 1 al terminar el slot. Ver nota principal.
  const { scrollYProgress } = useScroll({
    target: slotRef,
    offset: ["end end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], OPACITY_RANGE);
  const scale = useTransform(scrollYProgress, [0, 1], SCALE_RANGE);

  return (
    <div
      ref={slotRef}
      className="relative"
      style={{
        minHeight: `calc(100vh + ${dwellVh}vh)`,
        marginTop: index > 0 ? `-${OVERLAP_VH}vh` : undefined,
      }}
    >
      <div className="sticky" style={{ top: topPx, zIndex: index + 1 }}>
        <motion.div style={{ opacity, scale: scaleDown ? scale : 1 }}>{children}</motion.div>
      </div>
    </div>
  );
}
