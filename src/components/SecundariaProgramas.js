"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";

// "04_Programas" de Secundaria (node 477:1036, canvas 1440x837 — re-sacado
// el 2026-08-20 después de que el usuario agregó el título de la sección,
// lo que subió el alto del canvas de 760 a 837 y corrió las 9 tarjetas
// hacia abajo) — layout "bento" de 9 tarjetas neumórficas de tamaños
// distintos, un diseño de una sola vez (no es la grilla repetible de
// Kinder/Primaria Accesos) así que se replica con la misma técnica
// px->%/cqw sobre un canvas fijo que PrimariaFormacion.js/
// PrimariaProgramas.js, con helpers locales (no exportados) en vez de los
// del kit de Hero — ver README de src/components/hero para el origen de la
// técnica.
//
// El FONDO es un degradado vertical gris->azul (gris sólido hasta 69.355%
// de la altura, empieza a virar a azul #0f76d7 y termina de virar en
// 93.309%, azul sólido de ahí al borde inferior) — costura visual con la
// sección de abajo (debe seguir en ese mismo azul).
//
// IMPORTANTE — `top` de elementos ANIDADOS dentro de una tarjeta usa
// `cqw()`, NUNCA `pctY()`: `pctY()` es un porcentaje que se resuelve contra
// el ALTO real de su ancestro posicionado más cercano (la tarjeta, no el
// canvas completo), así que usarlo ahí da la fracción equivocada. `cqw()`
// en cambio siempre se resuelve contra el ANCHO del contenedor que definió
// `containerType: inline-size` (el frame de escritorio completo), sin
// importar cuántos niveles de anidamiento haya. `pctY()`/`pctX()` solo se
// usan para la posición de cada una de las 9 tarjetas sobre el frame
// exterior (ahí sí su ancestro posicionado real es el frame completo).
//
// ANIMACIÓN (a pedido del usuario, solo en las 9 tarjetas del bento de
// escritorio — la grilla simple de móvil queda sin animar):
// - Entrada única al entrar la sección en pantalla (useInView once):
//   opacidad+transform (translateY+scale), escalonada por grupo de forma
//   (horizontales grandes -> cuadradas -> verticales), ~700-900ms totales.
// - Hover: la tarjeta se eleva (translateY -7px), su sombra se acentúa
//   respetando su propio estilo (RAISED vs BEVEL — ver `raisedShadow`/
//   `bevelInsetShadow`/`glowOnlyShadow`), su ilustración da un micro-pulso
//   de escala, aparece un halo azul cielo en el borde, las demás 8 bajan a
//   opacidad 0.82, y un globo de diálogo (portal a document.body, para no
//   quedar recortado por el overflow-hidden de la sección) muestra el
//   texto descriptivo. Transiciones cortas (220-280ms), easing suave
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
// salida, sin overshoot/rebote, a pedido del usuario.
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Halo "azul cielo" del hover — mismo tono que ya usa el logo del Header en
// su glow de hover (rgba(56,189,248,*), Tailwind sky-400), reutilizado aquí
// por consistencia de marca en vez de inventar un azul nuevo. Se define
// SIEMPRE con 2 capas (anillo + resplandor difuso), en reposo con alpha 0 —
// así el `box-shadow` de reposo y el de hover tienen el MISMO número de
// capas en el MISMO orden, requisito para que el navegador interpole la
// transición suavemente en vez de saltar de golpe.
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
// fondo de las 3 tarjetas BEVEL como para el panel "Borde_Hundido" anidado
// de las tarjetas 3 y 9.
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

// Título de la sección (nodo 477:1067 "Titulo_Programas", agregado por el
// usuario directo en Figma) — barra roja de acento + encabezado, estático
// (no forma parte de las 9 tarjetas animadas).
const SECTION_TITLE_ACCENT_COLOR = "#da2028";

const ICONS = {
  computacion: "/images/secundaria/programas/ill-computacion.png",
  tutoria: "/images/secundaria/programas/ill-tutoria.png",
  clases: "/images/secundaria/programas/ill-clases.png",
  artistica: "/images/secundaria/programas/ill-artistica.png",
  mun: "/images/secundaria/programas/ill-mun.png",
  equipos: "/images/secundaria/programas/ill-equipos.png",
  aulas: "/images/secundaria/programas/ill-aulas.png",
  actividad: "/images/secundaria/programas/ill-actividad.png",
  craft: "/images/secundaria/programas/ill-craft.png",
};
const BORDE_HUNDIDO_ARTISTICA = "/images/secundaria/programas/borde-hundido-artistica.svg";

// Textos del globo de diálogo (a pedido del usuario, uno por tarjeta).
const BLURBS = {
  computacion: "Utilizan la tecnología como una verdadera herramienta de trabajo y se preparan para certificaciones Microsoft.",
  tutoria: "Acompañamos su desarrollo socioemocional para que se conozcan, tomen buenas decisiones y actúen con responsabilidad.",
  clases: "Fortalecen el pensamiento lógico-matemático y la comprensión lectora, despertando su interés por aprender más.",
  artistica: "Encuentran espacios para expresar sus intereses, descubrir talentos y potenciar sus capacidades.",
  mun: "Investigan, argumentan, negocian y dialogan para comprender los retos de un mundo diverso.",
  equipos: "Forman carácter, disciplina, liderazgo y compañerismo a través del trabajo en equipo.",
  aulas: "Aprenden en espacios equipados con herramientas digitales que enriquecen cada materia.",
  actividad: "Exploran nuevas habilidades con opciones como yoga, Tae Kwon Do, ajedrez y robótica.",
  craft: "Transforman ideas en proyectos, desarrollando creatividad, curiosidad y soluciones a través de la tecnología.",
};

// Globo de diálogo — asset real (Nube Naranja.webp, 1076x954, cola
// apuntando hacia abajo con muesca en "V"), nunca redibujado a mano. Un
// primer intento escalaba el ancho en proporción al de cada tarjeta
// (220-300px, luego 175-235px) — el usuario confirmó que el tamaño/tipo de
// letra/interlineado que le tocó a las 4 tarjetas horizontales grandes
// (Computación, Tutoría, CRAFT, Actividades — las que caían cerca del tope
// de ese rango, ~218-236px) se veía muy bien, y pidió ESE mismo tamaño para
// las 9 tarjetas — así que ahora es un tamaño FIJO (`GLOBO_W`), no
// proporcional al ancho de la tarjeta; deja de haber tarjetas con globo más
// chico/apretado. El texto se centra VERTICAL y HORIZONTALMENTE dentro de
// la zona segura (`items-center justify-center` + `text-center`) — así
// cualquier aire sobrante entre el texto y el borde del globo queda
// repartido parejo en las 4 direcciones, sin importar cuánto texto traiga
// cada tarjeta. Insets de la zona segura (deja fuera el borde y la muesca
// de la cola): 9% arriba, 24% abajo cuando NO está volteado; intercambiados
// cuando sí (`flip`, cuando no cabe arriba de la tarjeta y se voltea para
// aparecer abajo con la cola hacia arriba).
//
// La proporción del asset (1076x954 ≈ 1.13:1, casi cuadrado) sigue siendo
// más ALTA de lo ideal para 1-2 líneas de texto corto. Si se reemplaza esta
// imagen, una nube más ANCHA que alta (≈1.7:1 a 1.8:1, ej. 1200x700px u
// 1280x720px, mismo estilo de borde/cola) haría que el recuadro de texto
// quede más ajustado al contenido real.
const GLOBO_IMG = "/images/secundaria/programas/globo-naranja.webp";
const GLOBO_ASPECT = 1076 / 954;
const GLOBO_TEXT_INSET_TOP = 9;
const GLOBO_TEXT_INSET_BOTTOM = 24;
const GLOBO_W = 230; // tamaño fijo para las 9 tarjetas — ver nota arriba
const GLOBO_FONT_SIZE = 15;
// Empalme: el globo se mete un poco sobre el borde de su tarjeta en vez de
// flotar separado (a pedido del usuario), tanto arriba como (si se voltea) abajo.
const GLOBO_OVERLAP = 14;

// Contexto: le dice a cada <CardIcon>/<SunkenPanel> si SU tarjeta está en
// hover — evita tener que pasar `isHovered` a mano por cada JSX particular
// de las 9 tarjetas (cada una tiene una composición de ícono/texto/panel
// distinta, no hay un solo "children" uniforme al que envolver con props).
const CardHoverContext = createContext(false);

// Ilustración de una tarjeta — micro-pulso de escala en hover (nunca un
// "rebote"/loop, un único realce suave) + sombra propia opcional
// (drop-shadow, sigue la silueta real del PNG, nunca box-shadow — ver
// memoria de proyecto "champal-niveles-pages-pattern" sobre por qué
// box-shadow en un PNG con margen transparente se ve como un "fantasma"
// cuadrado en vez de seguir el dibujo).
function CardIcon({ src, alt = "", left, top, size, width, height, dropShadow, flip = false, sizes = "200px" }) {
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
        transform: `${flip ? "scaleX(-1) " : ""}scale(${isHovered ? 1.06 : 1})`,
        transformOrigin: "center",
        transition: `transform 250ms ${EASE}`,
      }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

// Panel "Borde_Hundido" anidado (tarjetas 3 y 9) — mismo bisel que las
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

// Envoltorio común a las 9 tarjetas del bento — posición/tamaño/radio
// IDÉNTICOS al layout original (nunca tocados por la animación), más la
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
// PrimariaProgramas.js.
function Globo({ hoveredId, cardRefs }) {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    if (!hoveredId) return;
    const frame = requestAnimationFrame(() => {
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
      setLayout({ hoveredId, left, top, width, height, flip });
    });
    return () => cancelAnimationFrame(frame);
  }, [hoveredId, cardRefs]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {hoveredId && layout?.hoveredId === hoveredId && (
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
            {/* Texto centrado VERTICALMENTE dentro de la zona segura (no
                pegado arriba/abajo) — así cualquier aire sobrante entre el
                texto y el borde del globo queda repartido parejo arriba y
                abajo, sin importar cuánto texto traiga cada tarjeta. */}
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
// pantallas angostas) — mismo criterio que PrimariaFormacion.js /
// PrimariaProgramas.js. Sin animación (la entrada/hover pedidas por el
// usuario son solo para las 9 tarjetas del bento de escritorio).
const MOBILE_ITEMS = [
  { key: "computacion", title: "Computación", icon: ICONS.computacion },
  { key: "tutoria", title: "Programa de Tutoría", icon: ICONS.tutoria },
  { key: "clases", title: "Clases Extracurriculares", icon: ICONS.clases },
  { key: "artistica", title: "Educación Artística y Clubes Deportivos", icon: ICONS.artistica },
  { key: "mun", title: "Modelo de Naciones Unidas", icon: ICONS.mun },
  { key: "equipos", title: "Equipos Deportivos", icon: ICONS.equipos },
  { key: "aulas", title: "Aulas Especializadas", icon: ICONS.aulas },
  { key: "actividad", title: "Actividades Extracurriculares", icon: ICONS.actividad },
  { key: "craft", title: "Laboratorio CRAFT", icon: ICONS.craft },
];

// Grupos de entrada (a pedido del usuario: horizontales grandes primero,
// después las cuadradas, al final las verticales) con un desfase propio
// (irregular a propósito, no un stagger parejo) para que la secuencia se
// sienta como módulos activándose uno a uno, no una grilla animando en
// bloque. Suma ~700-900ms totales (último desfase 480ms + 380ms de
// duración propia = 860ms).
const ENTRANCE_DELAY = {
  computacion: 0,
  tutoria: 60,
  actividad: 130,
  craft: 170,
  artistica: 260,
  mun: 320,
  equipos: 370,
  clases: 430,
  aulas: 480,
};

export default function SecundariaProgramas() {
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
      style={{ backgroundImage: "linear-gradient(to bottom, #e3e3e3 0%, #e3e3e3 69.355%, #0f76d7 93.309%, #0f76d7 100%)" }}
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
        {/* Título de la sección (477:1067) — estático, fuera de las 9 tarjetas animadas */}
        <div className="absolute" style={{ left: pctX(301), top: pctY(55), width: cqw(56), height: cqw(6), borderRadius: cqw(3), backgroundColor: SECTION_TITLE_ACCENT_COLOR }} />
        <p
          className="absolute font-semibold"
          style={{ left: pctX(375), top: pctY(28), width: cqw(765), fontSize: cqw(36), fontFamily: "var(--font-serif)", color: "#000000", lineHeight: "normal" }}
        >
          Aprenden para la vida, descubren su potencial
        </p>

        {/* 01 — Computación (370:654): RAISED, bg #e8e8e8, horizontal grande */}
        <BentoCardShell
          id="computacion"
          left={47} top={134} width={524} height={176} radius={31.68}
          bg="#e8e8e8" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.computacion}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <CardIcon src={ICONS.computacion} left={28} top={-11} size={195} dropShadow="-3px 7px 3px rgba(0,0,0,0.1)" sizes="195px" />
          <p className="absolute whitespace-nowrap font-semibold" style={{ left: cqw(223), top: cqw(61), fontSize: cqw(30), ...TITLE_STYLE }}>
            COMPUTACIÓN
          </p>
        </BentoCardShell>

        {/* 02 — Programa de Tutoría (370:656): BEVEL, bg #e3e3e3, horizontal grande */}
        <BentoCardShell
          id="tutoria"
          left={587} top={134} width={524} height={176} radius={31.68}
          bg="#e3e3e3" shadowKind="bevel"
          started={started} entranceDelayMs={ENTRANCE_DELAY.tutoria}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <CardIcon src={ICONS.tutoria} left={368} top={-2} size={144} dropShadow="3px 7px 3px rgba(0,0,0,0.1)" sizes="144px" />
          <p className="absolute font-semibold" style={{ left: cqw(21), top: cqw(70), width: cqw(347), fontSize: cqw(30), ...TITLE_STYLE }}>
            PROGRAMA DE TUTORÍA
          </p>
        </BentoCardShell>

        {/* 03 — Clases Extracurriculares (370:658): RAISED, panel Borde_Hundido anidado, vertical */}
        <BentoCardShell
          id="clases"
          left={1127} top={171} width={266} height={348} radius={31.68}
          bg="#e3e3e3" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.clases}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <SunkenPanel left={12} top={16} width={241} height={317} radius={22} />
          <CardIcon src={ICONS.clases} left={64} top={70} size={137} dropShadow="0px 7px 3px rgba(0,0,0,0.1)" sizes="137px" />
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(132.5), top: cqw(207), width: cqw(227), fontSize: cqw(20), ...TITLE_STYLE }}
          >
            CLASES EXTRACURRICULARES
          </p>
        </BentoCardShell>

        {/* 04 — Educación Artística y Clubes Deportivos (370:672): RAISED, cuadrada */}
        <BentoCardShell
          id="artistica"
          left={47} top={383} width={250} height={250} radius={31.68}
          bg="#e3e3e3" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.artistica}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <div className="absolute" style={{ left: cqw(11), top: cqw(15), width: cqw(230), height: cqw(230) }}>
            <Image src={BORDE_HUNDIDO_ARTISTICA} alt="" fill sizes="230px" />
          </div>
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(114), top: cqw(153), width: cqw(212), fontSize: cqw(20), ...TITLE_STYLE }}
          >
            Educación Artística y Clubes Deportivos
          </p>
          <CardIcon src={ICONS.artistica} left={56} top={15} size={140} dropShadow="-3px 7px 3px rgba(0,0,0,0.1)" sizes="140px" />
        </BentoCardShell>

        {/* 05 — Modelo de Naciones Unidas (370:661): RAISED, cuadrada/media */}
        <BentoCardShell
          id="mun"
          left={336} top={344} width={416} height={250} radius={42}
          bg="#e8e8e8" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.mun}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(130.5), top: cqw(65), width: cqw(253), fontSize: cqw(30), ...TITLE_STYLE }}
          >
            Modelo de Naciones Unidas
          </p>
          <CardIcon src={ICONS.mun} left={238} top={25} size={183} sizes="183px" />
        </BentoCardShell>

        {/* 06 — Equipos Deportivos (370:670): BEVEL, cuadrada/media */}
        <BentoCardShell
          id="equipos"
          left={769} top={349} width={334} height={250} radius={31.68}
          bg="#e3e3e3" shadowKind="bevel"
          started={started} entranceDelayMs={ENTRANCE_DELAY.equipos}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(159.5), top: cqw(165), width: cqw(229), fontSize: cqw(30), ...TITLE_STYLE }}
          >
            EQUIPOS DEPORTIVOS
          </p>
          <CardIcon src={ICONS.equipos} left={78} top={0} size={178} sizes="178px" />
        </BentoCardShell>

        {/* 07 — Aulas Especializadas (370:668): RAISED, vertical */}
        <BentoCardShell
          id="aulas"
          left={1126} top={515} width={266} height={294} radius={31.68}
          bg="#e8e8e8" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.aulas}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <CardIcon src={ICONS.aulas} left={52} top={9} size={161} sizes="161px" />
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(132.5), top: cqw(170), width: cqw(243), fontSize: cqw(30), ...TITLE_STYLE }}
          >
            AULAS ESPECIALIZADAS
          </p>
        </BentoCardShell>

        {/* 08 — Actividades Extracurriculares (370:663): BEVEL, horizontal grande.
            El ícono trae "-scale-y-100 rotate-180" en Figma — equivale neto
            a un espejo horizontal (scaleX(-1)), aplicado por `style` (no
            con utilidades Tailwind negativas, no funcionan en este
            proyecto — ver memoria "champal-tailwind-v4-negative-utilities"). */}
        <BentoCardShell
          id="actividad"
          left={56} top={628} width={500} height={176} radius={31.68}
          bg="#e3e3e3" shadowKind="bevel"
          started={started} entranceDelayMs={ENTRANCE_DELAY.actividad}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <CardIcon src={ICONS.actividad} left={0} top={7} size={147} flip sizes="147px" />
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(303), top: cqw(53), width: cqw(346), fontSize: cqw(30), ...TITLE_STYLE }}
          >
            ACTIVIDADES EXTRACURRICULARES
          </p>
        </BentoCardShell>

        {/* 09 — Laboratorio CRAFT (370:665): RAISED, panel Borde_Hundido anidado, horizontal grande */}
        <BentoCardShell
          id="craft"
          left={593} top={625} width={484} height={176} radius={42}
          bg="#e3e3e3" shadowKind="raised"
          started={started} entranceDelayMs={ENTRANCE_DELAY.craft}
          hoveredId={hoveredId} setHoveredId={setHoveredId} registerRef={registerCardRef}
        >
          <SunkenPanel left={18} top={18} width={454} height={150} radius={32} />
          <CardIcon src={ICONS.craft} left={308} top={23} size={139} sizes="139px" />
          <p
            className="absolute -translate-x-1/2 text-center font-semibold"
            style={{ left: cqw(193.5), top: cqw(65), width: cqw(259), fontSize: cqw(30), ...TITLE_STYLE }}
          >
            Laboratorio CRAFT
          </p>
        </BentoCardShell>
      </div>

      <Globo hoveredId={hoveredId} cardRefs={cardRefs} />
    </section>
  );
}
