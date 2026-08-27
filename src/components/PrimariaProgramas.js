"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, animate as fmAnimate, motion, useInView, useMotionValue } from "framer-motion";

// "04_Programas" de Primaria (basado en el node de Figma 196:532, pero ya
// no es una réplica 1:1 de su layout absoluto — ver nota de reacomodo más
// abajo). Sigue la misma técnica px->%/cqw sobre un canvas fijo que
// PrimariaFormacion.js. Va pegada a PrimariaFormacion.js (sin padding
// vertical propio arriba) — ver README de src/components/hero para el
// origen de la técnica.
//
// REACOMODO A PEDIDO DEL USUARIO (dejó de ser el layout disperso original
// de Figma): las 10 tarjetas forman un "marco" rectangular — 4 arriba en
// línea, 1 a la izquierda, 1 a la derecha, 4 abajo en línea — con el
// encabezado centrado en el hueco que queda en medio. (Primer intento: 3
// arriba/3 abajo/2+2 apiladas a los lados — el usuario lo corrigió porque
// apilar 2 tarjetas por lado obliga a un alto mínimo de ~2×alto de tarjeta
// y el marco terminó más alto de lo esperado; con solo 1 tarjeta por lado
// ese problema desaparece.) Las tarjetas se mantienen achicadas ~20%
// respecto al tamaño original de Figma (170x210 -> 136x168, misma
// proporción, sin deformarlas) — ver SLOT_W/SLOT_H. CANVAS_H (584) es el
// alto exacto que necesita este arreglo con márgenes/huecos de 20px; no
// queda espacio sobrante ni nada se recorta.
//
// Cada una de las 10 "estampas" comparte la misma estructura de 3 capas:
// una insignia cuadrada de fondo (170x170, ya trae "horneado" el marco de
// color y el recuadro navy vacío para la etiqueta), una ilustración que se
// monta encima y sobresale por arriba del marco, y el texto de la etiqueta
// como capa aparte alineada sobre el recuadro navy horneado en la
// insignia. Esa estructura vive en <ProgramaCard>, con su propio sistema
// de coordenadas LOCAL fijo en 170x210 (el tamaño ORIGINAL de cada tarjeta
// en Figma — ver CARD_W/CARD_H) usando `containerType: inline-size`. Ese
// sistema local es independiente del tamaño real al que se renderiza cada
// tarjeta: como <ProgramaCard> es `aspect-[170/210] w-full`, con solo achicar
// el ancho del cajón exterior (SLOT_W, en vez de CARD_W) toda la tarjeta
// escala proporcionalmente sin tocar un solo número de illLeft/illTop/label
// — así la misma tarjeta sirve posicionada de forma absoluta en el canvas
// de escritorio (más chica, en SLOT_W) o fluyendo en la grilla de móvil (a
// su ancho natural), sin duplicar los números de cada ilustración/etiqueta.
const CANVAS_W = 1440;
const CANVAS_H = 584;
function pctX(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}%`;
}
function pctY(px) {
  return `${((px / CANVAS_H) * 100).toFixed(3)}%`;
}
function cqw(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;
}

// Sistema de coordenadas LOCAL de cada tarjeta (tamaño original de Figma,
// 170x210) — usado SOLO dentro de <ProgramaCard> para posicionar su
// ilustración/etiqueta. No confundir con SLOT_W/SLOT_H (el tamaño real al
// que se renderiza cada tarjeta en el canvas de escritorio).
const CARD_W = 170;
const CARD_H = 210;
function localX(px) {
  return `${((px / CARD_W) * 100).toFixed(3)}%`;
}
function localY(px) {
  return `${((px / CARD_H) * 100).toFixed(3)}%`;
}
function localCqw(px) {
  return `${((px / CARD_W) * 100).toFixed(3)}cqw`;
}

// Tamaño real de cada tarjeta en el canvas de escritorio: 80% de 170x210
// (misma proporción 170:210, sin deformar) para que el marco rectangular
// quede en un alto razonable — ver nota de reacomodo arriba.
const SLOT_W = 136;
const SLOT_H = 168;

// Columnas/filas del marco rectangular (canvas 1440x584). Las filas de
// arriba/abajo usan 4 columnas parejas entre COL_1 y COL_4 (mismo x que
// las tarjetas laterales, para que las 4 esquinas + los 2 laterales
// formen un marco parejo); todo simétrico respecto al centro del canvas
// (720): COL_1 + SLOT_W/2 = 180, COL_4 + SLOT_W/2 = 1260 — equidistantes.
const COL_1 = 112;
const COL_2 = 472;
const COL_3 = 832;
const COL_4 = 1192;
const TOP_Y = 20;
const MIDDLE_Y = 208;
const BOTTOM_Y = 396;
const FRAME_CENTER_X = 720; // CANVAS_W / 2
const FRAME_CENTER_Y = CANVAS_H / 2;

// Secuencia de entrada (a pedido del usuario), en segundos — todo arranca
// cuando la sección entra en pantalla (ver `useInView` más abajo), nunca
// al cargar la página (estaría fuera de vista y el usuario se la perdería).
// 1) Fondo: fade in.
// 2) Título: se "despliega" en su misma posición vía clip-path (revela de
//    arriba hacia abajo, no se mueve de lugar).
// 3) Párrafo: fade in.
// 4) Antetítulo "APRENDER DE MUCHAS MANERAS": entra en escala desde el
//    fondo (chico), pasa por 160% (efecto "se acerca a la pantalla") y
//    rebota a su tamaño final — keyframes de scale, no un spring normal.
// 5) Las 10 tarjetas (invisibles, escala 0, centradas en el marco) salen
//    disparadas hacia su lugar, escalonadas.
// 6) Una vez en su lugar, las 10 se mueven TODAS JUNTAS en carrusel
//    alrededor del marco — en LÍNEAS RECTAS siguiendo el perímetro del
//    rectángulo (los mismos 10 huecos que ya usa el layout, en sentido
//    horario), NO en círculo. Primer intento: cada tarjeta orbitaba en
//    círculo alrededor del centro — mal, porque el radio de una tarjeta de
//    esquina (más lejos del centro) es mayor que el medio-alto del marco,
//    así que esas tarjetas se salían por arriba/abajo. Segundo intento:
//    perímetro rectangular, pero cada tarjeta arrancaba SU PROPIO bucle de
//    forma independiente apenas ELLA aterrizaba, y al pausar en hover se
//    congelaba con `controls.stop()` pero al reanudar volvía a arrancar
//    la vuelta COMPLETA desde su casilla original (no desde donde iba) —
//    cada pasada del mouse por las tarjetas las reiniciaba y desincronizaba
//    más, exactamente lo que el usuario reportó como "encimadas"/"en
//    bloques de tres" y una tarjeta "encogiéndose a un punto" en hover.
//    Este es el tercero: UN SOLO reloj compartido (`carouselProgress`,
//    ver PrimariaProgramas) que las 10 tarjetas leen — cada una solo
//    aplica su propio desfase de fase (dónde cae su hueco en el perímetro
//    canónico, ver phaseOfWaypoint) sobre ESE MISMO reloj, así que el
//    espaciado relativo entre tarjetas queda matemáticamente fijo para
//    siempre, sin importar cuántas veces se pause/reanude — pausar
//    congela el reloj único (`.pause()`), reanudar lo continúa exacto
//    donde iba (`.play()`), nunca reinicia nada.
// 7) En hover se detiene el carrusel COMPLETO (las 10 tarjetas, no solo
//    la que tiene el mouse encima — "se detiene el carrusel" en singular)
//    y esa tarjeta puntual crece.
// Además, a pedido del usuario, en cada una de las 4 esquinas el camino
// corta en DIAGONAL en vez de un giro de 90° instantáneo (CORNER_CHAMFER_PX)
// — reduce el "empalme" visual justo en el giro sin dejar de ser, en
// esencia, un recorrido rectangular.
const DUR_BG = 0.8;
const DELAY_TITLE = 0.35;
const DUR_TITLE = 0.9;
const DELAY_SUB = 1.15;
const DUR_SUB = 0.6;
const DELAY_EYEBROW = 1.55;
const DUR_EYEBROW = 0.9;
const DELAY_CARDS_START = 2.35;
const CARD_STAGGER = 0.07;
const ORBIT_DURATION = 32; // segundos por vuelta COMPLETA del perímetro — lento y elegante, no mareante

// Los 10 huecos del marco rectangular, en el ORDEN en que se recorren en
// sentido horario empezando arriba-izquierda — son exactamente las mismas
// posiciones que ya usa PROGRAMAS (COL_1..COL_4 / TOP_Y / MIDDLE_Y /
// BOTTOM_Y), solo reordenadas como un camino cerrado en vez de una grilla.
const WAYPOINTS = [
  { left: COL_1, top: TOP_Y }, // 0 arriba-izquierda
  { left: COL_2, top: TOP_Y }, // 1 arriba
  { left: COL_3, top: TOP_Y }, // 2 arriba
  { left: COL_4, top: TOP_Y }, // 3 arriba-derecha
  { left: COL_4, top: MIDDLE_Y }, // 4 lateral derecho
  { left: COL_4, top: BOTTOM_Y }, // 5 abajo-derecha
  { left: COL_3, top: BOTTOM_Y }, // 6 abajo
  { left: COL_2, top: BOTTOM_Y }, // 7 abajo
  { left: COL_1, top: BOTTOM_Y }, // 8 abajo-izquierda
  { left: COL_1, top: MIDDLE_Y }, // 9 lateral izquierdo
];

// A qué hueco (índice 0-9 en WAYPOINTS) corresponde la posición ya
// asignada a esta tarjeta en PROGRAMAS — así cada tarjeta sabe en qué
// FASE del perímetro le toca vivir.
function waypointIndexOf(program) {
  return WAYPOINTS.findIndex((w) => w.left === program.left && w.top === program.top);
}

// Los 4 huecos de WAYPOINTS que son esquinas reales del rectángulo — ahí
// es donde se corta la diagonal (ver CANONICAL_PATH).
const CORNER_INDEXES = new Set([0, 3, 5, 8]);
const CORNER_CHAMFER_PX = 26; // qué tan "adentro" empieza/termina el corte diagonal

// Camino CANÓNICO que recorre el carrusel: los mismos 10 huecos, pero en
// cada esquina el giro de 90° se reemplaza por un tramo diagonal (2 puntos
// nuevos, uno antes y uno después de la esquina, sobre cada tramo recto
// que la toca) — a pedido del usuario, para que el giro no sea instantáneo
// y se reduzca el "empalme" justo ahí. El hueco de la esquina en sí NO
// queda en este camino (se salta, el corte va directo del punto de
// entrada al de salida) — por eso las tarjetas cuyo hueco de reposo ES una
// esquina usan una fase aproximada (ver phaseOfWaypoint) en vez de una
// exacta: es una pequeñísima corrección de posición, una sola vez, justo
// cuando esa tarjeta entra al carrusel — aceptable frente a la alternativa
// de complicar mucho más el camino para que además pase exacto por ahí.
function buildCanonicalPath() {
  const n = WAYPOINTS.length;
  const path = [];
  for (let i = 0; i < n; i++) {
    const prev = WAYPOINTS[(i - 1 + n) % n];
    const curr = WAYPOINTS[i];
    const next = WAYPOINTS[(i + 1) % n];
    if (CORNER_INDEXES.has(i)) {
      const inDx = Math.sign(curr.left - prev.left);
      const inDy = Math.sign(curr.top - prev.top);
      const outDx = Math.sign(next.left - curr.left);
      const outDy = Math.sign(next.top - curr.top);
      path.push(
        { left: curr.left - inDx * CORNER_CHAMFER_PX, top: curr.top - inDy * CORNER_CHAMFER_PX, cornerIdx: i, chamferEnter: true },
        { left: curr.left + outDx * CORNER_CHAMFER_PX, top: curr.top + outDy * CORNER_CHAMFER_PX, cornerIdx: i, chamferExit: true },
      );
    } else {
      path.push(curr);
    }
  }
  path.push(path[0]); // cierra el loop sin salto
  return path;
}
const CANONICAL_PATH = buildCanonicalPath();

// Distancia real entre dos puntos — Euclidiana (no la suma de |dx|+|dy| que
// bastaba antes) porque ahora sí hay tramos diagonales en las esquinas.
function pointDistance(a, b) {
  return Math.hypot(a.left - b.left, a.top - b.top);
}

const CANONICAL_SEGMENT_DISTANCES = [];
for (let i = 0; i < CANONICAL_PATH.length - 1; i++) {
  CANONICAL_SEGMENT_DISTANCES.push(pointDistance(CANONICAL_PATH[i], CANONICAL_PATH[i + 1]));
}
const CANONICAL_TOTAL_DISTANCE = CANONICAL_SEGMENT_DISTANCES.reduce((sum, d) => sum + d, 0);
// Tiempos (0-1) acumulados PROPORCIONALES a la distancia real de cada
// tramo (no repartidos parejo) — así la velocidad es uniforme en px/seg
// real, sin importar que los tramos verticales (188px, laterales) sean
// más cortos que los horizontales (360px, arriba/abajo) o que los
// diagonales de las esquinas sean más cortos todavía.
const CANONICAL_TIMES = [0];
{
  let cumulative = 0;
  for (const d of CANONICAL_SEGMENT_DISTANCES) {
    cumulative += d;
    CANONICAL_TIMES.push(cumulative / CANONICAL_TOTAL_DISTANCE);
  }
}

// t en [0,1) -> {left, top} interpolado sobre el camino canónico. Es la
// ÚNICA función de posición que usan las 10 tarjetas — cada una solo le
// pasa un `t` distinto (su propio progreso + su propia fase), nunca
// duplica la lógica de recorrido.
function positionAtT(t) {
  const tt = ((t % 1) + 1) % 1;
  let i = 0;
  while (i < CANONICAL_TIMES.length - 2 && CANONICAL_TIMES[i + 1] < tt) i++;
  const t0 = CANONICAL_TIMES[i];
  const t1 = CANONICAL_TIMES[i + 1];
  const localT = t1 > t0 ? (tt - t0) / (t1 - t0) : 0;
  const a = CANONICAL_PATH[i];
  const b = CANONICAL_PATH[i + 1];
  return {
    left: a.left + (b.left - a.left) * localT,
    top: a.top + (b.top - a.top) * localT,
  };
}

// En qué fase (t en [0,1)) del camino canónico cae el hueco `idx`. Para
// huecos que no son esquina es exacto (el hueco sigue literalmente en el
// camino); para los 4 que sí son esquina, usa el punto medio entre su
// corte de entrada y el de salida (ver nota en buildCanonicalPath).
function phaseOfWaypoint(idx) {
  if (CORNER_INDEXES.has(idx)) {
    const enterI = CANONICAL_PATH.findIndex((p) => p.cornerIdx === idx && p.chamferEnter);
    return (CANONICAL_TIMES[enterI] + CANONICAL_TIMES[enterI + 1]) / 2;
  }
  const i = CANONICAL_PATH.indexOf(WAYPOINTS[idx]); // igualdad por referencia: buildCanonicalPath reusa el mismo objeto
  return CANONICAL_TIMES[i];
}

const BG_PHOTO = "/images/primaria/programas/fondo-edificio.png";

// "Globo" (nube de papel tipo diálogo) que aparece en hover con el texto
// descriptivo de cada tarjeta. Asset real (1077x772px, la punta ya viene
// horneada en la imagen, apuntando hacia abajo) — nunca redibujado a mano.
// GLOBO_W/GLOBO_H/GLOBO_GAP están en unidades de canvas (como todo lo
// demás en este archivo) y se convierten a px reales de pantalla en el
// momento del hover — ver la nota sobre el portal en AnimatedProgramaCard.
// GLOBO_W bajó de 300 a 190 (a pedido del usuario: la imagen se entregó a
// tamaño completo, pero el globo debe quedar proporcional a la tarjeta —
// 190 lo deja ~1.4x el ancho de la tarjeta, SLOT_W=136, en vez de ~2.2x).
const GLOBO_IMG = "/images/primaria/programas/nube-papel.webp";
const GLOBO_ASPECT = 1077 / 772;
const GLOBO_W = 190;
const GLOBO_H = GLOBO_W / GLOBO_ASPECT;
const GLOBO_GAP = 6; // separación entre la punta del globo y el borde de la tarjeta
// Zona segura de texto dentro de la imagen (deja fuera el borde grueso y
// la cola) — mismos insets ya probados en el globo de KinderProgramas.js
// para una nube de diálogo equivalente, en vez de inventar unos nuevos a
// ciegas: 10% arriba, 24% abajo (deja la cola libre) cuando el globo va
// SIN voltear; volteado (`flip`), se intercambian.
const GLOBO_TEXT_INSET_TOP = 10;
const GLOBO_TEXT_INSET_BOTTOM = 24;

// `left`/`top` son las posiciones del NUEVO marco rectangular (ver
// constantes arriba), no las originales de Figma. Todo lo demás
// (illLeft/illTop/illSize/label...) sigue siendo el valor RAW de Figma tal
// cual, relativo al sistema de coordenadas LOCAL de la tarjeta (170x210,
// CARD_W/CARD_H) — no cambia con el reacomodo.
const PROGRAMAS = [
  // --- fila de arriba (4, izquierda a derecha) ---
  {
    id: "artistica",
    blurb: "Expresan su creatividad a través de la música, la pintura y el arte.",
    left: COL_1,
    top: TOP_Y,
    badge: "/images/primaria/programas/badge-artistica.png",
    ill: "/images/primaria/programas/ill-artistica.png",
    illLeft: 29,
    illTop: -29,
    illSize: 159,
    // Typo real en el archivo de Figma ("ARTÍTSTICA" en vez de
    // "ARTÍSTICA") — se replica tal cual porque también aparece así en el
    // export publicado de Figma Sites; avisar al usuario para corregirlo
    // en origen si fue un error de dedo y no algo intencional.
    label: "EDUCACIÓN ARTÍTSTICA",
    labelLeft: 21.5,
    labelTop: 181,
    labelSize: 11,
    labelTracking: 0.44,
  },
  {
    id: "calculo",
    blurb: "Fortalecen su agilidad mental al resolver retos numéricos con confianza.",
    left: COL_2,
    top: TOP_Y,
    badge: "/images/primaria/programas/badge-calculo.png",
    ill: "/images/primaria/programas/ill-calculo.png",
    illLeft: 44,
    illTop: -19,
    illSize: 153,
    illWrapSize: 179.383, // bounding-box de un cuadrado de 153px rotado 11°
    illRotateDeg: 11,
    // Figma/el export traían "CALCULO" sin acento — confirmado con el
    // usuario que debe llevar acento ("CÁLCULO MENTAL"), corregido aquí
    // aunque el archivo de origen no lo tenga.
    label: "CÁLCULO MENTAL",
    labelLeft: 25.5,
    labelTop: 180,
    labelSize: 14,
    labelTracking: 0.56,
  },
  {
    id: "computo",
    blurb: "Aprenden a usar la tecnología como una herramienta para crear, investigar y trabajar.",
    left: COL_3,
    top: TOP_Y,
    badge: "/images/primaria/programas/badge-computo.png",
    ill: "/images/primaria/programas/ill-computo.png",
    illLeft: 42,
    illTop: 0,
    illSize: 162,
    label: "CÓMPUTO",
    labelLeft: 52.5,
    labelTop: 183,
    labelSize: 14,
    labelTracking: 0.56,
  },
  {
    id: "aulas",
    blurb: "Aprenden en espacios equipados con recursos digitales que enriquecen cada clase.",
    left: COL_4,
    top: TOP_Y,
    badge: "/images/primaria/programas/badge-aulas.png",
    ill: "/images/primaria/programas/ill-aulas.png",
    illLeft: 22,
    illTop: -18,
    illSize: 187,
    label: "AULAS DIGITALES",
    labelLeft: 26.5,
    labelTop: 178,
    labelSize: 14,
    labelTracking: 0.56,
  },
  // --- laterales (1 a cada lado, misma línea) ---
  {
    id: "valores",
    blurb: "Vivimos valores que forman seres humanos responsables y comprometidos.",
    left: COL_1,
    top: MIDDLE_Y,
    badge: "/images/primaria/programas/badge-valores.png",
    ill: "/images/primaria/programas/ill-valores.png",
    illLeft: -5,
    illTop: -9,
    illSize: 179,
    label: "VALORES",
    labelLeft: 47,
    labelTop: 179,
    labelSize: 14,
    labelTracking: 0.56,
  },
  {
    id: "craft",
    blurb: "Imaginan, diseñan y construyen proyectos donde creatividad y tecnología se encuentran.",
    left: COL_4,
    top: MIDDLE_Y,
    badge: "/images/primaria/programas/badge-craft.png",
    ill: "/images/primaria/programas/ill-craft.png",
    illLeft: 17,
    illTop: -3,
    illSize: 176,
    label: "ÁREA CRAFT",
    labelLeft: 37.5,
    labelTop: 180,
    labelSize: 14,
    labelTracking: 0.56,
  },
  // --- fila de abajo (4, izquierda a derecha) ---
  {
    id: "lectura",
    blurb: "Desarrollamos el gusto por leer, comprender y descubrir nuevas ideas.",
    left: COL_1,
    top: BOTTOM_Y,
    badge: "/images/primaria/programas/badge-lectura.png",
    badgeRadiusPx: 14.167,
    ill: "/images/primaria/programas/ill-lectura.png",
    illLeft: -7.083, // centrado: (170-184.167)/2
    illTop: -13,
    illSize: 184.167,
    label: "LECTURA",
    labelLeft: 45.5,
    labelTop: 176,
    labelSize: 14,
    labelTracking: 0.56,
  },
  {
    id: "equipos",
    blurb: "Fortalecen carácter, disciplina, liderazgo y compañerismo como parte de un equipo.",
    left: COL_2,
    top: BOTTOM_Y,
    badge: "/images/primaria/programas/badge-equipos.png",
    badgeBottom: 23,
    ill: "/images/primaria/programas/ill-equipos.png",
    illLeft: 63,
    illTop: -24,
    illSize: 160,
    label: "EQUIPOS DEPORTIVOS",
    labelLeft: 19.5,
    labelTop: 160,
    labelSize: 12,
    labelTracking: 0.48,
  },
  {
    id: "efisica",
    blurb: "Descubren el movimiento, la colaboración y el bienestar a través del juego y el deporte.",
    left: COL_3,
    top: BOTTOM_Y,
    badge: "/images/primaria/programas/badge-efisica.png",
    ill: "/images/primaria/programas/ill-efisica.png",
    illLeft: 38,
    illTop: -11,
    illSize: 160,
    label: "EDUCACIÓN FÍSICA",
    labelLeft: 19.5,
    labelTop: 180,
    labelSize: 14,
    labelTracking: 0.56,
  },
  {
    id: "ingles",
    blurb: "Desarrollan una comunicación oral y escrita, con camino a certificaciones Cambridge.",
    left: COL_4,
    top: BOTTOM_Y,
    badge: "/images/primaria/programas/badge-ingles.png",
    ill: "/images/primaria/programas/ill-ingles.png",
    illLeft: 14,
    illTop: -3,
    illSize: 156,
    label: "INGLÉS",
    labelLeft: 58.5,
    labelTop: 181,
    labelSize: 14,
    labelTracking: 0.56,
  },
];

function ProgramaCard({
  badge,
  badgeRadiusPx = 20,
  badgeBottom = 0,
  ill,
  illLeft,
  illTop,
  illSize,
  illWrapSize = illSize,
  illRotateDeg = 0,
  label,
  labelLeft,
  labelTop,
  labelSize,
  labelTracking,
}) {
  return (
    <div
      className="relative aspect-[170/210] w-full drop-shadow-[0px_6px_2.5px_rgba(0,0,0,0.25)]"
      style={{ containerType: "inline-size" }}
    >
      {/* Insignia de fondo — ya trae horneados el marco de color y el
          recuadro navy vacío para la etiqueta */}
      <div
        className="absolute inset-x-0 overflow-hidden"
        style={{ bottom: localY(badgeBottom), height: localY(170), borderRadius: localCqw(badgeRadiusPx) }}
      >
        <Image src={badge} alt="" fill sizes="170px" className="object-contain" />
      </div>

      {/* Ilustración — se monta encima y sobresale del marco. La caja
          "wrap" (flex centering) reproduce el cálculo de Figma para el
          único caso rotado (Cálculo Mental, 11°): bounding-box de un
          cuadrado de illSize rotado, centrado con flexbox en vez de a
          mano.
          IMPORTANTE: la sombra de la ilustración usa `drop-shadow` (filter,
          sigue el canal alfa real del PNG), NO `shadow`/box-shadow — el PNG
          de cada ilustración trae su propio margen transparente dentro del
          cuadrado illSize, así que un box-shadow dibuja la sombra del
          RECTÁNGULO completo (visible como un "fantasma" cuadrado separado
          del dibujo real); drop-shadow recorta la sombra a la silueta
          visible, igual que el efecto de sombra de Figma. */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: localCqw(illLeft), top: localY(illTop), width: localCqw(illWrapSize), height: localCqw(illWrapSize) }}
      >
        <div
          className="relative drop-shadow-[0px_5px_5px_rgba(0,0,0,0.25)]"
          style={{
            width: localCqw(illSize),
            height: localCqw(illSize),
            transform: illRotateDeg ? `rotate(${illRotateDeg}deg)` : undefined,
          }}
        >
          <Image src={ill} alt="" fill sizes="170px" className="object-cover" />
        </div>
      </div>

      <p
        className="absolute font-serif font-bold whitespace-nowrap text-white"
        style={{ left: localCqw(labelLeft), top: localY(labelTop), fontSize: localCqw(labelSize), letterSpacing: localCqw(labelTracking) }}
      >
        {label}
      </p>
    </div>
  );
}

// Envoltorio animado de <ProgramaCard> para el marco de escritorio.
// `left`/`top`/`opacity`/`scale` son MotionValues crudos (useMotionValue)
// ligados directo por `style`, no por `animate`/`initial` — a propósito:
// eso evita CUALQUIER ambigüedad sobre "qué valor gana" entre dos fases
// distintas de control (entrada vs. carrusel) porque el DOM siempre
// refleja lo último que se le escribió al MotionValue con `.set()`, sin
// reconciliación de por medio. Dos fases:
//   1) Entrada: `fmAnimate(motionValue, target, spring)` mueve cada
//      MotionValue del centro del marco a su casilla; cuando la de
//      `scale` termina (es "thenable"), se marca `landed` y se avisa al
//      padre (`onLanded`) para que sepa cuándo YA aterrizaron las 10.
//   2) Carrusel: una vez aterrizada, esta tarjeta se SUSCRIBE al reloj
//      compartido `carouselProgress` (viene del padre — ver
//      PrimariaProgramas) y en cada tick escribe su propia posición
//      (positionAtT(progreso + su propia fase)) en left/top. Como las 10
//      leen EL MISMO reloj, el espaciado relativo entre ellas queda fijo
//      para siempre — pausar/reanudar es cosa del padre (pausa/reanuda el
//      reloj único), esta tarjeta ni se entera, simplemente deja de
//      recibir ticks nuevos mientras está pausado.
// El agrandado en hover TAMBIÉN se anima a mano con fmAnimate sobre
// `scaleMV` (ver más abajo), nunca con la prop `whileHover` de
// framer-motion — `whileHover` espera ser dueño exclusivo del ciclo de
// vida de la propiedad que anima; como `scaleMV` ya estaba bajo control
// externo completo (fmAnimate en la entrada), los dos peleando por el
// mismo valor hacía que al terminar el hover framer-motion revirtiera a
// la semilla original de `useMotionValue(0)` en vez de a 1 — la tarjeta
// se encogía hasta desaparecer. Toda propiedad animada de esta tarjeta
// vive SIEMPRE detrás de fmAnimate/`.set()` manual, nunca de una prop
// declarativa de framer-motion — es la regla que evita este tipo de bug.
function AnimatedProgramaCard({ program, index, started, carouselProgress, isHovered, onHoverStart, onHoverEnd, onLanded }) {
  const [landed, setLanded] = useState(false);
  const leftMV = useMotionValue(pctX(FRAME_CENTER_X - SLOT_W / 2));
  const topMV = useMotionValue(pctY(FRAME_CENTER_Y - SLOT_H / 2));
  const opacityMV = useMotionValue(0);
  const scaleMV = useMotionValue(0);
  const phase = phaseOfWaypoint(waypointIndexOf(program));

  useEffect(() => {
    if (!started) return;
    // IMPORTANTE: Next corre en modo dev con React Strict Mode activo, que
    // invoca cada efecto DOS veces a propósito (monta -> limpia -> vuelve a
    // montar) para cazar efectos sin limpieza correcta. La primera versión
    // de este efecto solo apagaba un flag `cancelled` en la limpieza, pero
    // nunca detenía los `fmAnimate(...)` en sí — así que la primera
    // invocación (la que Strict Mode descarta) seguía animando los
    // MotionValues DE FONDO mientras la segunda invocación (la real)
    // arrancaba OTRA animación sobre los mismos valores al mismo tiempo.
    // Eso corrompía en qué posición terminaba aterrizando cada tarjeta —
    // exactamente el "empalme"/agrupamiento fuera de sitio que reportó el
    // usuario. La corrección real es guardar los controles que devuelve
    // cada `fmAnimate(...)` y llamar `.stop()` sobre TODOS en la limpieza,
    // para que la invocación descartada quede genuinamente cancelada.
    let cancelled = false;
    const entranceDelay = DELAY_CARDS_START + index * CARD_STAGGER;
    const spring = { delay: entranceDelay, type: "spring", stiffness: 260, damping: 18, mass: 0.7 };
    const leftAnim = fmAnimate(leftMV, pctX(program.left), spring);
    const topAnim = fmAnimate(topMV, pctY(program.top), spring);
    const opacityAnim = fmAnimate(opacityMV, 1, { delay: entranceDelay, duration: 0.35 });
    const scaleAnim = fmAnimate(scaleMV, 1, spring);
    scaleAnim.then(() => {
      if (cancelled) return;
      setLanded(true);
      onLanded?.();
    });
    return () => {
      cancelled = true;
      leftAnim.stop();
      topAnim.stop();
      opacityAnim.stop();
      scaleAnim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- las MotionValues/program/index son estables por tarjeta
  }, [started]);

  useEffect(() => {
    if (!landed) return;
    const unsubscribe = carouselProgress.on("change", (p) => {
      const pos = positionAtT(p + phase);
      leftMV.set(pctX(pos.left));
      topMV.set(pctY(pos.top));
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landed]);

  // El agrandado en hover se anima a mano sobre `scaleMV` (fmAnimate),
  // NUNCA con `whileHover` — `scaleMV` ya está bajo control externo
  // completo (la entrada la anima directo con fmAnimate más arriba), y
  // `whileHover` espera ser DUEÑO del ciclo de vida de esa propiedad; con
  // los dos tocando el mismo MotionValue, al terminar el hover
  // `whileHover` no tenía un valor de `animate` declarativo al cual
  // volver y revertía a la semilla original de `useMotionValue(0)` — la
  // tarjeta se encogía hasta desaparecer, justo el bug que reportó el
  // usuario. Fuera de la entrada, `scaleMV` SIEMPRE debe valer 1 o 1.16,
  // nunca 0.
  useEffect(() => {
    if (!landed) return;
    fmAnimate(scaleMV, isHovered ? 1.16 : 1, { type: "spring", stiffness: 300, damping: 20 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landed, isHovered]);

  // El globo se renderiza por PORTAL a document.body, en coordenadas
  // REALES de pantalla (position: fixed), no en el sistema %/cqw del
  // canvas — a propósito. La sección tiene `overflow-hidden` (necesario
  // para que las tarjetas nunca se vean "flotando" fuera del marco
  // rectangular), pero eso también recortaría cualquier globo posicionado
  // en coordenadas del canvas: el canvas mide 584px de alto y el globo
  // solo (sin la tarjeta) ya necesita ~215px — ninguna tarjeta, ni las del
  // medio, tiene esos 215px libres por arriba O por abajo DENTRO del
  // canvas. Un portal escapa ese overflow-hidden por completo. Como el
  // carrusel se pausa por completo mientras hay hover, la tarjeta no se
  // mueve durante el hover — así que basta con medir su posición UNA vez
  // al entrar el hover (getBoundingClientRect), no hace falta rastrearla
  // cuadro a cuadro.
  const cardRef = useRef(null);
  const [globoLayout, setGloboLayout] = useState(null);

  useEffect(() => {
    if (!isHovered) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const scale = r.width / SLOT_W; // px reales de pantalla por unidad de canvas
    const globoWpx = GLOBO_W * scale;
    const globoHpx = GLOBO_H * scale;
    const gapPx = GLOBO_GAP * scale;
    let left = r.left + r.width / 2 - globoWpx / 2;
    left = Math.min(Math.max(left, 8), window.innerWidth - globoWpx - 8);
    const roomAbove = r.top - gapPx - globoHpx;
    // Si no cabe arriba (la orientación natural del asset — la punta ya
    // viene apuntando hacia abajo), se voltea verticalmente y aparece
    // abajo con la punta apuntando hacia arriba, en vez de recortarse.
    const flip = roomAbove < 8;
    const top = flip ? r.bottom + gapPx : roomAbove;
    setGloboLayout({ left, top, width: globoWpx, height: globoHpx, flip });
  }, [isHovered]);

  return (
    <>
      <motion.div
        ref={cardRef}
        className="absolute"
        style={{ left: leftMV, top: topMV, opacity: opacityMV, scale: scaleMV, width: cqw(SLOT_W), zIndex: isHovered ? 30 : 1 }}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
      >
        <ProgramaCard {...program} />
      </motion.div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isHovered && globoLayout && (
              <motion.div
                className="pointer-events-none fixed"
                style={{ left: globoLayout.left, top: globoLayout.top, width: globoLayout.width, height: globoLayout.height, zIndex: 9999 }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={GLOBO_IMG}
                    alt=""
                    fill
                    sizes="190px"
                    className="object-contain"
                    style={{ transform: globoLayout.flip ? "scaleY(-1)" : undefined }}
                  />
                  {/* Mismo tratamiento de texto ya probado en el globo de
                      KinderProgramas.js: font-hand (Patrick Hand — ver
                      --font-hand en globals.css) + text-pretty (evita que
                      quede una palabra sola en la última línea) con
                      textWrap inline como respaldo. Insets top/bottom (no
                      top+height) intercambiados cuando el globo está
                      volteado, para que el texto siga cayendo en la mitad
                      "cuerpo" de la nube y nunca sobre la cola.
                      IMPORTANTE: el texto se alinea hacia el extremo REDONDEADO
                      de la nube (el más amplio, lejos de la cola), no al centro
                      del recuadro — con `items-center`, un texto corto (como el
                      de Inglés) quedaba flotando a medio recuadro dejando aire
                      arriba sin usar, que es justo lo que reportó el usuario.
                      Ese extremo "amplio" cambia de lado según `flip`: sin
                      voltear la cola está ABAJO, así que el texto se pega
                      arriba (`items-start`); volteado la cola queda ARRIBA,
                      así que el texto se pega abajo (`items-end`) — no es el
                      mismo lado en los dos casos. */}
                  <div
                    className={`absolute inset-x-[12%] flex justify-center overflow-hidden ${globoLayout.flip ? "items-end" : "items-start"}`}
                    style={
                      globoLayout.flip
                        ? { top: `${GLOBO_TEXT_INSET_BOTTOM}%`, bottom: `${GLOBO_TEXT_INSET_TOP}%` }
                        : { top: `${GLOBO_TEXT_INSET_TOP}%`, bottom: `${GLOBO_TEXT_INSET_BOTTOM}%` }
                    }
                  >
                    <p
                      className="font-hand text-pretty text-center leading-[1.35]"
                      style={{
                        textWrap: "pretty",
                        fontSize: `${(15 * globoLayout.width) / GLOBO_W}px`,
                        color: "#0a1730",
                      }}
                    >
                      {program.blurb}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

export default function PrimariaProgramas() {
  // La secuencia de entrada solo debe dispararse cuando la sección
  // realmente entra en pantalla, no al cargar la página (para entonces el
  // usuario probablemente ni la ha visto todavía).
  const frameRef = useRef(null);
  const started = useInView(frameRef, { once: true, amount: 0.3 });
  // Compartido entre las 10 tarjetas: cuál (si acaso) tiene el mouse
  // encima — así "se detiene el carrusel" (todas) mientras solo esa
  // tarjeta puntual se agranda. Ver AnimatedProgramaCard.
  const [hoveredId, setHoveredId] = useState(null);

  // Reloj COMPARTIDO del carrusel — la pieza que garantiza el espaciado
  // consistente que pidió el usuario. Un solo valor de progreso (0->1, se
  // repite solo) que las 10 tarjetas leen; cada una solo aplica su propio
  // desfase de fase sobre ESTE mismo reloj (ver AnimatedProgramaCard), así
  // que su separación relativa nunca puede desincronizarse con el tiempo.
  const carouselProgress = useMotionValue(0);
  const carouselAnimRef = useRef(null);
  const landedCountRef = useRef(0);
  const [allLanded, setAllLanded] = useState(false);

  const handleCardLanded = useCallback(() => {
    landedCountRef.current += 1;
    if (landedCountRef.current >= PROGRAMAS.length) setAllLanded(true);
  }, []);

  // El reloj arranca recién cuando las 10 tarjetas terminaron de aterrizar
  // (no con un tiempo calculado a mano — un spring no tiene una duración
  // fija, así que esperar la Promise real de cada tarjeta es lo único
  // confiable).
  useEffect(() => {
    if (!allLanded) return;
    carouselAnimRef.current = fmAnimate(carouselProgress, [0, 1], {
      duration: ORBIT_DURATION,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });
    return () => carouselAnimRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLanded]);

  // Pausar/reanudar es SOLO esto: `.pause()`/`.play()` sobre el reloj
  // único — congela/continúa exacto donde iba, nunca reinicia ninguna
  // tarjeta a su casilla original (ese era el bug que reportó el usuario).
  useEffect(() => {
    if (!carouselAnimRef.current) return;
    if (hoveredId !== null) carouselAnimRef.current.pause();
    else carouselAnimRef.current.play();
  }, [hoveredId]);

  return (
    <section className="relative overflow-hidden bg-[#e2e2e2]">
      {/* Mobile/tablet (< lg): grilla simple, sin el foto-fondo del
          edificio (estirarla sobre una sección apilada mucho más alta la
          distorsionaría) — mismo criterio que en PrimariaFormacion.js. */}
      <div className="flex flex-col px-6 py-14 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: "#e5303d" }} />
          <p className="text-xs font-semibold tracking-wide sm:text-sm" style={{ color: "#102c54" }}>
            APRENDER DE MUCHAS MANERAS
          </p>
        </div>
        <h2
          className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl"
          style={{ color: "#00195d", textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
        >
          Experiencias que despiertan sus habilidades
        </h2>
        <p className="mt-4 text-base leading-relaxed" style={{ color: "#003173" }}>
          En un ambiente sano y de valores firmes, cada experiencia de aprendizaje acompaña a nuestros alumnos a
          descubrir sus capacidades y crecer de manera integral
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6">
          {PROGRAMAS.map((p) => (
            <ProgramaCard key={p.id} {...p} />
          ))}
        </div>
      </div>

      {/* Desktop (lg+): marco rectangular de 1440x584 — ver nota de
          reacomodo arriba. `ref` dispara `started` (useInView, once) que
          arranca TODA la secuencia de entrada de abajo — ver el bloque de
          constantes DELAY y DUR al principio del archivo para el
          desglose paso a paso pedido por el usuario. */}
      <div
        ref={frameRef}
        className="relative hidden aspect-[1440/584] w-full lg:block"
        style={{ containerType: "inline-size" }}
      >
        {/* 1) Fondo: fade in */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : undefined}
          transition={{ duration: DUR_BG, ease: "easeOut" }}
        >
          <Image src={BG_PHOTO} alt="" fill sizes="100vw" className="object-cover object-bottom" priority={false} />
        </motion.div>

        {/* Encabezado centrado en el hueco que deja el marco rectangular
            (entre las columnas izquierda/derecha, x: 720 es el centro
            exacto del canvas y también el punto medio entre columnas).
            La banda disponible en Y es 188 (borde inferior de la fila de
            arriba) a 396 (borde superior de la fila de abajo) — 208px.
            El antetítulo se bajó a top=218 (antes 198, muy pegado a la
            fila de arriba) y el título se partió en 2 líneas MANUALES
            ("Experiencias que" / "despiertan sus habilidades", con <br/>
            en vez de dejar que el ancho decida el corte) a pedido del
            usuario. fontSize del título bajado a 36 (era 38) porque a 38
            su segunda línea terminaba pisando el párrafo de abajo por 6px
            — medido en vivo con Range.getClientRects(), no a ojo. */}

        {/* 4) Antetítulo: entra en escala desde "el fondo", pasa por 160%
            (se acerca a la pantalla) y rebota a su tamaño final. Se anima
            x/scale juntos (en vez de className -translate-x-1/2 + scale
            por separado) porque framer-motion escribe su propio
            `transform` inline — si dejamos la clase de Tailwind, el
            `transform` de framer-motion la pisaría y perdería el
            centrado. */}
        <motion.div
          className="absolute flex items-center gap-3"
          style={{ left: pctX(720), top: pctY(218) }}
          initial={{ x: "-50%", opacity: 0, scale: 0.4 }}
          animate={started ? { x: "-50%", opacity: [0, 1, 1], scale: [0.4, 1.6, 1] } : undefined}
          transition={{ delay: DELAY_EYEBROW, duration: DUR_EYEBROW, times: [0, 0.55, 1], ease: "easeInOut" }}
        >
          <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: "#e5303d" }} />
          <p className="whitespace-nowrap font-semibold leading-none" style={{ fontSize: cqw(14), color: "#102c54" }}>
            APRENDER DE MUCHAS MANERAS
          </p>
        </motion.div>

        {/* 2) Título: se "despliega" en su misma posición — revela vía
            clip-path de arriba hacia abajo, sin desplazarse (clip-path no
            toca `transform`, así que la clase -translate-x-1/2 de
            Tailwind convive sin problema). */}
        <motion.h2
          className="absolute -translate-x-1/2 text-center font-serif font-semibold leading-tight"
          style={{
            left: pctX(720),
            top: pctY(246),
            width: pctX(820),
            fontSize: cqw(36),
            color: "#00195d",
            textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
          }}
          initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
          animate={started ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : undefined}
          transition={{ delay: DELAY_TITLE, duration: DUR_TITLE, ease: [0.16, 1, 0.3, 1] }}
        >
          Experiencias que
          <br />
          despiertan sus habilidades
        </motion.h2>

        {/* 3) Párrafo: fade in */}
        <motion.p
          className="absolute -translate-x-1/2 text-center leading-snug"
          style={{ left: pctX(720), top: pctY(344), width: pctX(700), fontSize: cqw(16), color: "#003173" }}
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : undefined}
          transition={{ delay: DELAY_SUB, duration: DUR_SUB, ease: "easeOut" }}
        >
          En un ambiente sano y de valores firmes, cada experiencia de aprendizaje acompaña a nuestros alumnos a
          descubrir sus capacidades y crecer de manera integral
        </motion.p>

        {/* 5-7) Tarjetas: disparadas desde el centro; una vez que TODAS
            aterrizan, arranca el reloj compartido del carrusel
            (carouselProgress) — en hover se pausa el reloj único (todas
            se detienen juntas) y solo esa tarjeta puntual crece — ver
            AnimatedProgramaCard. */}
        {PROGRAMAS.map((p, i) => (
          <AnimatedProgramaCard
            key={p.id}
            program={p}
            index={i}
            started={started}
            carouselProgress={carouselProgress}
            isHovered={hoveredId === p.id}
            onHoverStart={() => setHoveredId(p.id)}
            onHoverEnd={() => setHoveredId((cur) => (cur === p.id ? null : cur))}
            onLanded={handleCardLanded}
          />
        ))}
      </div>
    </section>
  );
}
