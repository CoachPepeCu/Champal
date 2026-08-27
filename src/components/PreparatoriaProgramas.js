"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";

// "04_Programas" de Preparatoria (node 477:1036, canvas 1440x837) — MISMO
// node-id que usa SecundariaProgramas.js, pero el diseñador lo rediseñó por
// completo para Preparatoria: contenido distinto (11 tarjetas en vez de 9),
// posiciones distintas. Son dos secciones hermanas con la MISMA técnica
// (bento neumórfico px->%/cqw sobre canvas fijo, con la misma fórmula de
// sombras RAISED/BEVEL y el mismo sistema de animación) pero cada una vive
// en su propio archivo con sus propios números — NO tocar
// SecundariaProgramas.js al mantener este archivo, son independientes.
//
// El FONDO es el degradado vertical real de ESTE nodo en Figma: gris sólido
// hasta 89.7% de la altura, empieza a virar a azul marino #0a1a3c y termina
// de virar en 98.695%, sólido de ahí al borde inferior. A diferencia de
// Secundaria (que cierra en azul #0f76d7 para empalmar con su siguiente
// sección), aquí la página de Preparatoria todavía tiene secciones blancas
// justo debajo (05-08, PreparatoriaAccesosEspecializados) — el remate en
// navy queda tal cual lo define Figma; si al insertar la sección se ve un
// salto duro contra el blanco de abajo, revisar con diseño si falta una
// transición intermedia en Figma.
//
// IMPORTANTE — `top` de elementos ANIDADOS dentro de una tarjeta usa
// `cqw()`, NUNCA `pctY()`: `pctY()` es un porcentaje que se resuelve contra
// el ALTO real de su ancestro posicionado más cercano (la tarjeta, no el
// canvas completo), así que usarlo ahí da la fracción equivocada. `cqw()`
// en cambio siempre se resuelve contra el ANCHO del contenedor que definió
// `containerType: inline-size` (el frame de escritorio completo), sin
// importar cuántos niveles de anidamiento haya. `pctY()`/`pctX()` solo se
// usan para la posición de cada una de las 11 tarjetas sobre el frame
// exterior (ahí sí su ancestro posicionado real es el frame completo).
//
// ANIMACIÓN (mismo criterio que Secundaria, solo en las 11 tarjetas del
// bento de escritorio — la grilla simple de móvil queda sin animar):
// - Entrada única al entrar la sección en pantalla (useInView once):
//   opacidad+transform (translateY+scale), escalonada en orden de lectura
//   (arriba->abajo, izquierda->derecha), ~700-900ms totales.
// - Hover: la tarjeta se eleva (translateY -7px), su sombra se acentúa
//   respetando su propio estilo (RAISED vs BEVEL — ver `raisedShadow`/
//   `bevelInsetShadow`/`glowOnlyShadow`), su ilustración da un micro-pulso
//   de escala, aparece un halo azul cielo en el borde, las demás 10 bajan a
//   opacidad 0.82, y un globo de diálogo (portal a document.body, para no
//   quedar recortado por el overflow-hidden de la sección) muestra el
//   texto descriptivo (a pedido del usuario, uno por tarjeta — tipografía
//   Patrick Hand, centrado horizontal Y vertical dentro del globo).
//   Transiciones cortas (220-280ms), easing suave
//   (`cubic-bezier(0.22,1,0.36,1)`, sin rebotes).
const CANVAS_W = 1440;
const CANVAS_H = 837;
function pctX(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}%`;
}
function pctY(px) {
  return `${((px / CANVAS_H) * 100).toFixed(3)}%`;
}
function cqw(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;
}

// Easing único para toda la interacción (entrada + hover) — curva suave de
// salida, sin overshoot/rebote.
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Halo "azul cielo" del hover — mismo tono que ya usa el logo del Header en
// su glow de hover (rgba(56,189,248,*), Tailwind sky-400), reutilizado aquí
// por consistencia de marca. Se define SIEMPRE con 2 capas (anillo +
// resplandor difuso), en reposo con alpha 0 — así el `box-shadow` de reposo
// y el de hover tienen el MISMO número de capas en el MISMO orden,
// requisito para que el navegador interpole la transición suavemente en
// vez de saltar de golpe.
const GLOW_OFF = "0 0 0 2px rgba(56,189,248,0), 0 0 22px 4px rgba(56,189,248,0)";
const GLOW_ON = "0 0 0 2px rgba(56,189,248,0.5), 0 0 22px 4px rgba(56,189,248,0.38)";

// Sombra "elevada" de las tarjetas RAISED — vive en el envoltorio exterior
// (nunca junto a `overflow-hidden`, que la recortaría — ver nota en
// BentoCardShell) y ya incluye el halo (mismo criterio de capas fijas).
function raisedShadow(hover) {
  const outer = hover
    ? "14px 17px 26px 2px rgba(97,105,117,0.24), -11px -11px 20px 1px rgba(255,255,255,0.97)"
    : "11px 13px 22px 1px rgba(97,105,117,0.18), -10px -10px 20px 1px rgba(255,255,255,0.94)";
  return `${outer}, ${hover ? GLOW_ON : GLOW_OFF}`;
}
// Envoltorio de las tarjetas BEVEL: no llevan sombra propia hacia afuera
// (su "elevación" ya es el bisel hundido — ver `bevelInsetShadow`, que vive
// en el div INTERIOR), así que su envoltorio solo aporta el halo del hover.
function glowOnlyShadow(hover) {
  return hover ? GLOW_ON : GLOW_OFF;
}
// Bisel hundido (BEVEL) — SIEMPRE en un elemento con fondo propio (nunca en
// el envoltorio vacío): un `inset` box-shadow pinta por encima del fondo
// pero por debajo del contenido/hijos de ESE MISMO elemento; puesto en el
// envoltorio (sin fondo propio, solo con el div interior como "contenido")
// quedaría tapado por el fondo opaco del interior. Se usa tanto para el
// fondo de las tarjetas BEVEL como para el panel "Borde_Hundido" anidado de
// las tarjetas Materias Preuniversitarias, Clases Extracurriculares y
// Laboratorio CRAFT.
function bevelInsetShadow(hover) {
  return hover
    ? "inset -12px -12px 20px 0px rgba(255,255,255,0.95), inset 12px 13px 20px 0px rgba(97,105,117,0.26)"
    : "inset -10px -10px 18px 0px rgba(255,255,255,0.9), inset 10px 11px 18px 0px rgba(97,105,117,0.2)";
}
// Sombra estática de las tarjetas de la grilla simple de móvil (sin hover).
const MOBILE_CARD_SHADOW = raisedShadow(false);

const TITLE_STYLE = {
  fontFamily: "var(--font-serif)",
  color: "#003750",
  textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
  lineHeight: cqw(26.88),
};

// Título de la sección (nodo 477:1067 "Titulo_Porgramas") — barra roja de
// acento + encabezado, estático (no forma parte de las 11 tarjetas
// animadas). Posición idéntica a la de Secundaria: es el mismo nodo de
// título reutilizado tal cual al redisañar el resto de la sección.
const SECTION_TITLE_ACCENT_COLOR = "#da2028";

const ICONS = {
  orientacion: "/images/preparatoria/programas/ill-orientacion.png",
  tutoria: "/images/preparatoria/programas/ill-tutoria.png",
  preuni: "/images/preparatoria/programas/ill-preuni.png",
  serviciosocial: "/images/preparatoria/programas/ill-serviciosocial.png",
  mun: "/images/preparatoria/programas/ill-mun.png",
  equipos: "/images/preparatoria/programas/ill-equipos.png",
  clases: "/images/preparatoria/programas/ill-clases.png",
  propedeutica: "/images/preparatoria/programas/ill-propedeutica.png",
  craft: "/images/preparatoria/programas/ill-craft.png",
  liderazgo: "/images/preparatoria/programas/ill-liderazgo.png",
  formacion: "/images/preparatoria/programas/ill-formacion.png",
};

// Textos del globo de diálogo — copy provista por el usuario, uno por
// tarjeta, tipografía Patrick Hand (`font-hand`), centrada horizontal Y
// vertical dentro del globo (ver <Globo>).
const BLURBS = {
  orientacion: "Acompañamiento personalizado para conocerse, explorar opciones y elegir con mayor claridad el camino profesional.",
  tutoria: "Un espacio de confianza que acompaña el desarrollo socioemocional, la toma responsable de decisiones y la solución de conflictos.",
  preuni: "Fortalecen las competencias académicas que los alumnos necesitan para enfrentar con mayor preparación los procesos de admisión universitaria.",
  serviciosocial: "Los alumnos dedican tiempo y talento a causas que benefician a otros, viviendo una experiencia de compromiso, empatía y responsabilidad social.",
  mun: "Una experiencia para investigar, argumentar, negociar y dialogar sobre los retos del mundo con respeto, liderazgo y visión global.",
  equipos: "El deporte fortalece el trabajo en equipo, la disciplina, la perseverancia y la capacidad de competir con respeto.",
  clases: "Espacios para reforzar habilidades matemáticas y lectoras, desarrollando pensamiento lógico, comprensión y gusto por aprender.",
  propedeutica: "En los últimos semestres, cada alumno elige un área de conocimiento acorde con su interés vocacional para prepararse rumbo a la Universidad.",
  craft: "Un laboratorio donde la creatividad se une a la tecnología para imaginar, experimentar y construir nuevas soluciones.",
  liderazgo: "Desarrollan iniciativa, capacidad para organizar, motivar, tomar decisiones y generar cambios positivos en su entorno.",
  formacion: "Desde tercer semestre, las materias del área de Administración complementan su formación con conocimientos útiles para la vida y el mundo profesional.",
};

// Globo de diálogo — mismo asset real que Secundaria (Nube Naranja.webp,
// 1076x954, cola apuntando hacia abajo con muesca en "V"), copiado a la
// carpeta de assets propia de Preparatoria — nunca redibujado a mano. Mismo
// tamaño FIJO (`GLOBO_W`) para las 11 tarjetas (no proporcional al ancho de
// cada una). El texto se centra VERTICAL y HORIZONTALMENTE dentro de la
// zona segura (`items-center justify-center` + `text-center`, a pedido
// explícito del usuario) — así cualquier aire sobrante entre el texto y el
// borde del globo queda repartido parejo en las 4 direcciones. Insets de la
// zona segura (deja fuera el borde y la muesca de la cola): 9% arriba, 24%
// abajo cuando NO está volteado; intercambiados cuando sí (`flip`, cuando
// no cabe arriba de la tarjeta y se voltea para aparecer abajo con la cola
// hacia arriba).
const GLOBO_IMG = "/images/preparatoria/programas/globo-naranja.webp";
const GLOBO_ASPECT = 1076 / 954;
const GLOBO_TEXT_INSET_TOP = 9;
const GLOBO_TEXT_INSET_BOTTOM = 24;
const GLOBO_W = 230;
const GLOBO_FONT_SIZE = 15;
// Empalme: el globo se mete un poco sobre el borde de su tarjeta en vez de
// flotar separado, tanto arriba como (si se voltea) abajo.
const GLOBO_OVERLAP = 14;

// Contexto: le dice a cada <CardIcon>/<SunkenPanel> si SU tarjeta está en
// hover — evita tener que pasar `isHovered` a mano por cada JSX particular
// de las 11 tarjetas (cada una tiene una composición de ícono/texto/panel
// distinta, no hay un solo "children" uniforme al que envolver con props).
const CardHoverContext = createContext(false);

// Ilustración de una tarjeta — micro-pulso de escala en hover (nunca un
// "rebote"/loop, un único realce suave) + sombra propia opcional
// (drop-shadow, sigue la silueta real del PNG, nunca box-shadow — ver
// memoria de proyecto "champal-niveles-pages-pattern" sobre por qué
// box-shadow en un PNG con margen transparente se ve como un "fantasma"
// cuadrado en vez de seguir el dibujo).
function CardIcon({ src, alt = "", left, top, size, width, height, dropShadow, sizes = "200px" }) {
  const isHovered = useContext(CardHoverContext);
  const w = size ?? width;
  const h = size ?? height;
  return (
    <div
      className="absolute"
      style={{
        left: cqw(left),
        top: cqw(top),
        width: cqw(w),
        height: cqw(h),
        filter: dropShadow ? `drop-shadow(${dropShadow})` : undefined,
        transform: `scale(${isHovered ? 1.06 : 1})`,
        transformOrigin: "center",
        transition: `transform 250ms ${EASE}`,
      }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

// Panel "Borde_Hundido" anidado (tarjetas Materias Preuniversitarias,
// Clases Extracurriculares y Laboratorio CRAFT) — mismo bisel que las
// tarjetas BEVEL, pero a su propia escala local (deja de ser el fondo de
// toda la tarjeta, es un recuadro adentro), acentuado en el mismo hover de
// la tarjeta vía CardHoverContext.
function SunkenPanel({ left, top, width, height, radius }) {
  const isHovered = useContext(CardHoverContext);
  return (
    <div
      className="absolute overflow-hidden border bg-[#e3e3e3]"
      style={{
        left: cqw(left),
        top: cqw(top),
        width: cqw(width),
        height: cqw(height),
        borderRadius: cqw(radius),
        borderColor: "rgba(194,196,201,0.55)",
        boxShadow: bevelInsetShadow(isHovered),
        transition: `box-shadow 250ms ${EASE}`,
      }}
    />
  );
}

// Envoltorio común a las 11 tarjetas del bento — posición/tamaño/radio
// IDÉNTICOS al layout de Figma (nunca tocados por la animación), más la
// mecánica de entrada + hover. Dos capas:
// - Exterior (`absolute`, sin overflow): posición real sobre el canvas,
//   sombra "hacia afuera" (RAISED o solo el halo del hover — ver arriba),
//   transform de entrada/hover, opacidad (propia + atenuación cuando OTRA
//   tarjeta está en hover). Nunca lleva `overflow-hidden` junto a un
//   box-shadow hacia afuera: lo recortaría (ver memoria de proyecto).
// - Interior (`absolute inset-0`, `overflow-hidden`): el fondo real, el
//   bisel BEVEL (si aplica — un `inset` shadow SÍ tiene que vivir en el
//   elemento que tiene el fondo, no en el exterior vacío, o quedaría tapado
//   por ese fondo) y todo el contenido (íconos/texto), envuelto en
//   CardHoverContext para que los hijos sepan si están en hover.
function BentoCardShell({
  id,
  left,
  top,
  width,
  height,
  radius,
  bg,
  shadowKind,
  started,
  entranceDelayMs,
  hoveredId,
  setHoveredId,
  registerRef,
  children,
}) {
  const [landed, setLanded] = useState(false);
  const isHovered = hoveredId === id;
  const dimmed = hoveredId !== null && !isHovered;

  const duration = landed ? 250 : 380;
  const delay = landed ? 0 : entranceDelayMs;

  return (
    <div
      ref={(node) => registerRef(id, node)}
      className="absolute"
      style={{
        left: pctX(left),
        top: pctY(top),
        width: cqw(width),
        height: cqw(height),
        borderRadius: cqw(radius),
        boxShadow: shadowKind === "raised" ? raisedShadow(isHovered) : glowOnlyShadow(isHovered),
        opacity: !started ? 0 : dimmed ? 0.82 : 1,
        transform: !started ? "translateY(14px) scale(0.965)" : isHovered ? "translateY(-7px)" : "translateY(0)",
        transitionProperty: "opacity, transform, box-shadow",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: EASE,
      }}
      onTransitionEnd={(e) => {
        if (e.target !== e.currentTarget) return;
        if (!landed) setLanded(true);
      }}
      onMouseEnter={() => landed && setHoveredId(id)}
      onMouseLeave={() => setHoveredId((cur) => (cur === id ? null : cur))}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: "inherit",
          backgroundColor: bg,
          boxShadow: shadowKind === "bevel" ? bevelInsetShadow(isHovered) : undefined,
          transition: shadowKind === "bevel" ? `box-shadow 250ms ${EASE}` : undefined,
        }}
      >
        <CardHoverContext.Provider value={isHovered}>{children}</CardHoverContext.Provider>
      </div>
    </div>
  );
}

// Globo de diálogo compartido — UNA sola instancia (no una por tarjeta),
// controlada por `hoveredId`; mide la tarjeta en hover vía su ref real
// (`getBoundingClientRect`) y se renderiza por PORTAL a document.body en
// coordenadas de pantalla (`position: fixed`) para escapar el
// `overflow-hidden` de la sección — mismo criterio que el globo de
// SecundariaProgramas.js / PrimariaProgramas.js.
function Globo({ hoveredId, cardRefs }) {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    if (!hoveredId) {
      setLayout(null);
      return;
    }
    const el = cardRefs.current[hoveredId];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = GLOBO_W;
    const height = width / GLOBO_ASPECT;
    let left = r.left + r.width / 2 - width / 2;
    left = Math.min(Math.max(left, 8), window.innerWidth - width - 8);
    // Empalme ligero con la tarjeta (en vez de flotar separado): el globo
    // se mete GLOBO_OVERLAP px sobre el borde de la tarjeta.
    const topIfAbove = r.top + GLOBO_OVERLAP - height;
    // Si no cabe arriba (contando el header fijo, ~88px), se voltea
    // verticalmente y aparece abajo de la tarjeta con la cola hacia arriba.
    const flip = topIfAbove < 96;
    const top = flip ? r.bottom - GLOBO_OVERLAP : topIfAbove;
    setLayout({ left, top, width, height, flip });
  }, [hoveredId, cardRefs]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {hoveredId && layout && (
        <motion.div
          className="pointer-events-none fixed"
          style={{ left: layout.left, top: layout.top, width: layout.width, height: layout.height, zIndex: 9999 }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-full w-full">
            <Image
              src={GLOBO_IMG}
              alt=""
              fill
              sizes={`${GLOBO_W}px`}
              style={{ transform: layout.flip ? "scaleY(-1)" : undefined }}
            />
            {/* Texto centrado VERTICAL y HORIZONTALMENTE dentro de la zona
                segura (a pedido del usuario) — así cualquier aire sobrante
                entre el texto y el borde del globo queda repartido parejo,
                sin importar cuánto texto traiga cada tarjeta. */}
            <div
              className="absolute inset-x-[11%] flex items-center justify-center overflow-hidden"
              style={
                layout.flip
                  ? { top: `${GLOBO_TEXT_INSET_BOTTOM}%`, bottom: `${GLOBO_TEXT_INSET_TOP}%` }
                  : { top: `${GLOBO_TEXT_INSET_TOP}%`, bottom: `${GLOBO_TEXT_INSET_BOTTOM}%` }
              }
            >
              <p
                className="font-hand text-pretty text-center leading-[1.28]"
                style={{ textWrap: "pretty", fontSize: `${GLOBO_FONT_SIZE}px`, color: "#5a3a12" }}
              >
                {BLURBS[hoveredId]}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// Versión simple para el flujo de móvil/tablet (< lg): mismo contenido,
// tarjetas parejas en vez de replicar el bento absoluto (que no flexiona a
// pantallas angostas) — mismo criterio que Secundaria/Primaria. Sin
// animación (la entrada/hover son solo para las 11 tarjetas del bento de
// escritorio).
const MOBILE_ITEMS = [
  { key: "orientacion", title: "Orientación Vocacional", icon: ICONS.orientacion },
  { key: "tutoria", title: "Programa de Tutoría", icon: ICONS.tutoria },
  { key: "preuni", title: "Materias Preuniversitarias", icon: ICONS.preuni },
  { key: "serviciosocial", title: "Servicio Social · Champal en Acción", icon: ICONS.serviciosocial },
  { key: "mun", title: "Modelo de Naciones Unidas", icon: ICONS.mun },
  { key: "equipos", title: "Equipos Deportivos", icon: ICONS.equipos },
  { key: "clases", title: "Clases Extracurriculares", icon: ICONS.clases },
  { key: "formacion", title: "Formación Profesional", icon: ICONS.formacion },
  { key: "propedeutica", title: "Formación Propedéutica", icon: ICONS.propedeutica },
  { key: "craft", title: "Laboratorio CRAFT", icon: ICONS.craft },
  { key: "liderazgo", title: "Programa de Liderazgo", icon: ICONS.liderazgo },
];

// Desfase de entrada en orden de lectura (arriba->abajo, izquierda->derecha
// sobre el bento) — irregular a propósito para que la secuencia se sienta
// como módulos activándose uno a uno, no una grilla animando en bloque.
// Suma ~880ms totales (último desfase 500ms + 380ms de duración propia).
const ENTRANCE_DELAY = {
  orientacion: 0,
  tutoria: 50,
  preuni: 100,
  serviciosocial: 150,
  mun: 200,
  equipos: 250,
  clases: 300,
  formacion: 350,
  propedeutica: 400,
  craft: 450,
  liderazgo: 500,
};

export default function PreparatoriaProgramas() {
  const frameRef = useRef(null);
  const started = useInView(frameRef, { once: true, amount: 0.3 });
  const [hoveredId, setHoveredId] = useState(null);
  const cardRefs = useRef({});
  const registerCardRef = useCallback((id, node) => {
    cardRefs.current[id] = node;
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: "linear-gradient(to bottom, #e3e3e3 0%, #e3e3e3 89.7%, #0a1a3c 98.695%, #0a1a3c 100%)" }}
    >
      {/* Mobile/tablet (< lg): grilla simple pareja, sin el bento absoluto ni animación */}
      <div className="grid grid-cols-2 gap-4 px-6 py-14 sm:grid-cols-3 lg:hidden">
        {MOBILE_ITEMS.map((item) => (
          <div
            key={item.key}
            className="flex flex-col items-center gap-3 rounded-[24px] bg-[#e8e8e8] px-3 py-6 text-center"
            style={{ boxShadow: MOBILE_CARD_SHADOW }}
          >
            <div className="relative size-14 shrink-0 sm:size-16">
              <Image src={item.icon} alt="" fill sizes="64px" className="object-cover" />
            </div>
            <h3 className="text-sm font-semibold leading-snug sm:text-base" style={TITLE_STYLE}>
              {item.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Desktop (lg+): bento 1440x837 tal cual Figma */}
      <div ref={frameRef} className="relative hidden aspect-[1440/837] w-full lg:block" style={{ containerType: "inline-size" }}>
        {/* Título de la sección (477:1067) — estático, fuera de las 11 tarjetas animadas */}
        <div className="absolute" style={{ left: pctX(301), top: pctY(55), width: cqw(56), height: cqw(6), borderRadius: cqw(3), backgroundColor: SECTION_TITLE_ACCENT_COLOR }} />
        <p
          className="absolute font-semibold"
          style={{ left: pctX(375), top: pctY(28), width: cqw(765), fontSize: cqw(36), fontFamily: "var(--font-serif)", color: "#000000", lineHeight: "normal" }}
        >
          Aprenden para la vida, descubren su potencial
        </p>

        {/* 01 — Orientación Vocacional (477:1037): RAISED, bg #e8e8e8, horizontal grande */}
        <BentoCardShell
          id="orientacion"
          left={30} top={120} width={424} height={176} radius={31.68}
          bg="#e8e8e8" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.orientacion}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <CardIcon src={ICONS.orientacion} left={25} top={5} width={113} height={146} sizes="113px" />
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(276.5), top: cqw(67), width: cqw(277), fontSize: cqw(20), ...TITLE_STYLE }}
          >
            ORIENTACIÓN VOCACIONAL
          </p>
        </BentoCardShell>

        {/* 02 — Programa de Tutoría (477:1040): BEVEL, bg #e3e3e3, horizontal grande */}
        <BentoCardShell
          id="tutoria"
          left={476} top={120} width={300} height={176} radius={31.68}
          bg="#e3e3e3" shadowKind="bevel"
          started={started} entranceDelayMs={ENTRANCE_DELAY.tutoria}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <CardIcon src={ICONS.tutoria} left={105} top={-1} width={170} height={170} sizes="170px" />
          <p className="absolute font-semibold" style={{ left: cqw(25), top: cqw(25), width: cqw(178), fontSize: cqw(20), ...TITLE_STYLE }}>
            PROGRAMA DE TUTORÍA
          </p>
        </BentoCardShell>

        {/* 03 — Materias Preuniversitarias (512:1438): RAISED, panel Borde_Hundido anidado */}
        <BentoCardShell
          id="preuni"
          left={798} top={120} width={300} height={193} radius={31.68}
          bg="#e3e3e3" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.preuni}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <SunkenPanel left={12} top={16} width={277} height={168} radius={22} />
          <CardIcon src={ICONS.preuni} left={31} top={16} width={135} height={112} sizes="135px" />
          <p
            className="absolute text-right font-semibold"
            style={{ left: cqw(46), top: cqw(107), width: cqw(227), fontSize: cqw(20), letterSpacing: "0.6px", ...TITLE_STYLE }}
          >
            MATERIAS PREUNIVERSITARIAS
          </p>
        </BentoCardShell>

        {/* 04 — Servicio Social · Champal en Acción (512:1419): RAISED, bg #e8e8e8, vertical */}
        <BentoCardShell
          id="serviciosocial"
          left={1120} top={120} width={273} height={341} radius={31.68}
          bg="#e8e8e8" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.serviciosocial}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <div className="absolute font-semibold" style={{ left: cqw(12), top: cqw(54), width: cqw(223), ...TITLE_STYLE }}>
            <p className="mb-0" style={{ fontSize: cqw(20) }}>
              SERVICIO SOCIAL
            </p>
            <p className="font-bold" style={{ fontSize: cqw(16) }}>
              CHAMPAL EN ACCIÓN
            </p>
          </div>
          <CardIcon src={ICONS.serviciosocial} left={68} top={126} width={137} height={161} sizes="137px" />
        </BentoCardShell>

        {/* 05 — Modelo de Naciones Unidas (477:1051): RAISED, bg #e8e8e8, radio 42 */}
        <BentoCardShell
          id="mun"
          left={48} top={339} width={295} height={250} radius={42}
          bg="#e8e8e8" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.mun}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <p className="absolute font-semibold" style={{ left: cqw(108), top: cqw(47), width: cqw(167), fontSize: cqw(20), ...TITLE_STYLE }}>
            <span className="block">Modelo de</span>
            <span className="block">Naciones Unidas</span>
          </p>
          {/* Ilustración se sale del borde izquierdo de la tarjeta — tal cual Figma (left negativo) */}
          <CardIcon src={ICONS.mun} left={-23} top={34} width={183} height={183} sizes="183px" />
        </BentoCardShell>

        {/* 06 — Equipos Deportivos (477:1054): BEVEL, bg #e3e3e3 */}
        <BentoCardShell
          id="equipos"
          left={380} top={339} width={323} height={250} radius={31.68}
          bg="#e3e3e3" shadowKind="bevel"
          started={started} entranceDelayMs={ENTRANCE_DELAY.equipos}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <p className="absolute font-semibold" style={{ left: cqw(33), top: cqw(32), width: cqw(229), fontSize: cqw(20), ...TITLE_STYLE }}>
            <span className="block">EQUIPOS</span>
            <span className="block">DEPORTIVOS</span>
          </p>
          <CardIcon src={ICONS.equipos} left={128} top={22} width={195} height={195} sizes="195px" />
        </BentoCardShell>

        {/* 07 — Clases Extracurriculares (477:1043): RAISED, panel Borde_Hundido anidado */}
        <BentoCardShell
          id="clases"
          left={741} top={339} width={346} height={250} radius={31.68}
          bg="#e3e3e3" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.clases}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <SunkenPanel left={12} top={16} width={316} height={220} radius={22} />
          <CardIcon src={ICONS.clases} left={104} top={16} width={137} height={137} dropShadow="0px 7px 3px rgba(0,0,0,0.1)" sizes="137px" />
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(172.5), top: cqw(153), width: cqw(227), fontSize: cqw(20), ...TITLE_STYLE }}
          >
            CLASES EXTRACURRICULARES
          </p>
        </BentoCardShell>

        {/* 11 — Formación Profesional (512:1442): RAISED, bg #e8e8e8, radio 42, vertical.
            (Se dibuja aquí, entre 07 y 08, para que el orden del JSX siga el
            orden de lectura visual arriba->abajo — el nombre "11" es el de
            Figma/ENTRANCE_DELAY, no el de aparición en el archivo.) */}
        <BentoCardShell
          id="formacion"
          left={1126} top={492} width={278} height={326} radius={42}
          bg="#e8e8e8" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.formacion}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <p className="absolute font-semibold" style={{ left: cqw(23), top: cqw(24), width: cqw(167), fontSize: cqw(20), ...TITLE_STYLE }}>
            FORMACIÓN PROFESIONAL
          </p>
          <CardIcon src={ICONS.formacion} left={38} top={109} width={174} height={161} sizes="174px" />
        </BentoCardShell>

        {/* 08 — Formación Propedéutica (477:1060): BEVEL, bg #e3e3e3, horizontal grande */}
        <BentoCardShell
          id="propedeutica"
          left={30} top={625} width={394} height={176} radius={31.68}
          bg="#e3e3e3" shadowKind="bevel"
          started={started} entranceDelayMs={ENTRANCE_DELAY.propedeutica}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <CardIcon src={ICONS.propedeutica} left={18} top={13} width={179} height={150} sizes="179px" />
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(262), top: cqw(97), width: cqw(164), fontSize: cqw(20), ...TITLE_STYLE }}
          >
            FORMACIÓN PROPEDÉUTICA
          </p>
        </BentoCardShell>

        {/* 09 — Laboratorio CRAFT (477:1063): RAISED, panel Borde_Hundido anidado, radio 42 */}
        <BentoCardShell
          id="craft"
          left={472} top={625} width={304} height={176} radius={42}
          bg="#e3e3e3" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.craft}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <SunkenPanel left={18} top={18} width={270} height={137} radius={32} />
          <CardIcon src={ICONS.craft} left={167} top={16} width={139} height={139} sizes="139px" />
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(121.5), top: cqw(42), width: cqw(185), fontSize: cqw(20), ...TITLE_STYLE }}
          >
            <span className="block">Laboratorio</span>
            <span className="block">CRAFT</span>
          </p>
        </BentoCardShell>

        {/* 10 — Programa de Liderazgo (514:1445): RAISED, bg #e8e8e8 */}
        <BentoCardShell
          id="liderazgo"
          left={814} top={625} width={273} height={176} radius={31.68}
          bg="#e8e8e8" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.liderazgo}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <p className="absolute font-semibold" style={{ left: cqw(12), top: cqw(9), width: cqw(223), fontSize: cqw(20), ...TITLE_STYLE }}>
            PROGRAMA DE LIDERAZGO
          </p>
          <CardIcon src={ICONS.liderazgo} left={74} top={0} width={161} height={157} sizes="161px" />
        </BentoCardShell>
      </div>

      <Globo hoveredId={hoveredId} cardRefs={cardRefs} />
    </section>
  );
}
