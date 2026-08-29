"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

// Réplica 1:1 del layout absoluto de Figma para el HERO de Home — "parte
// superior" del diseño completo (node 700:918 "HERO", canvas 1440x780,
// sacado con get_design_context — no a ojo desde el screenshot). La parte
// inferior ("¡Bienvenidos!" / G19) es la siguiente sección a construir.
//
// Técnica: aspect-[1440/780] + containerType:inline-size en desktop (>=lg),
// cada elemento posicionado en % (relativo al canvas) vía pctX/pctY y
// tipografía/tamaños en cqw (1cqw = 1% del ancho del contenedor) — misma
// receta que src/components/hero/heroMath.js usa para los Hero de nivel,
// con un canvas propio (1440x780) porque este Hero es contenido único de
// Home, no una plantilla compartida entre varias páginas. Pegar los valores
// RAW en px que devuelve get_design_context evita el paso manual de
// "px/1440*100" — ver memoria "champal-figma-sites-pixel-accuracy".
const CANVAS_W = 1440;
const CANVAS_H = 780;
const pctX = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}%`;
const pctY = (px) => `${((px / CANVAS_H) * 100).toFixed(3)}%`;
const cqw = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;

const CIELO_GRADIENT =
  "linear-gradient(86.273deg, rgb(10, 23, 48) 2.9386%, rgb(3, 81, 170) 46.937%, rgb(22, 74, 146) 98.593%)";

// Carrusel de fondo heredado de la versión anterior del Hero: hasta 4 fotos
// reales de vida escolar que se muestran con fade-in, una por una, SOLO en
// la capa de fondo del "cielo" — nunca se ve sobre la superficie blanca de
// abajo, esa la tapa la ola (Pleca_Soft3D) que va encima. El resto del
// contenido (encabezado, planetas, insignias, astronauta, "35 años") se
// queda fijo siempre arriba, igual que en la versión anterior el texto se
// quedaba fijo sobre las fotos.
//
// Un slot sin foto todavía (`src: null`) no rompe nada: el carrusel no
// dibuja nada en su turno (se ve el fondo espacial de siempre) y sigue
// avanzando igual — mismo comportamiento "sigue corriendo sin mostrar algo
// en pantalla" que tenía la versión anterior con los slots placeholder.
// Al terminar la vuelta NO vuelve a la primera foto: se queda fija en el
// fondo espacial (estrellas + planetas), que actúa como cuadro final.
//
// Apagado por pedido explícito del usuario mientras no haya fotos
// definitivas — cambiar a `true` para activarlo.
const CAROUSEL_ENABLED = false;
const SLIDE_DURATION_MS = 6000;
const HERO_PHOTOS = [
  { src: "/images/hero-1.jpg", alt: "Alumnos de Champal en el campus" },
  { src: "/images/hero-2.jpg", alt: "Vida en el campus de Champal" },
  { src: "/images/hero-3.jpg", alt: "Vida en el campus de Champal" },
  { src: null, alt: "" }, // aún no hay 4ª foto — cae en el fondo espacial y el carrusel sigue su curso
];

// Figma trae estas sombras como box-shadow sobre un div cuadrado, pero las
// imágenes son recortes con fondo transparente (planetas circulares,
// astronauta, íconos de insignia) — un box-shadow dibujaría un cuadro visible
// detrás del recorte, así que se convierten a filter:drop-shadow (sigue el
// alfa real de la imagen) con los mismos valores.
const PLANET_GLOW =
  "drop-shadow(0px 0px 22px rgba(64,224,184,0.18)) drop-shadow(0px 12px 20px rgba(3,10,28,0.46))";
const BADGE_ICON_SHADOW = "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))";
const ASTRONAUT_SHADOW = "drop-shadow(0px 12px 16px rgba(0,0,0,0.25))";
const EASE_OUT = [0.16, 1, 0.3, 1];
const ORBIT_ENTRY_DELAY = 1.76;
const INTRO = {
  sky: 0,
  curve: 0.08,
  line1: 0.16,
  line2: 0.3,
  brush: 0.44,
  brushText: 0.62,
  astronaut: 0.68,
  planets: [0.82, 0.94, 1.06, 1.18],
  badges: [1.34, 1.42, 1.5, 1.58],
};

const PLANETS = [
  {
    key: "cambridge",
    src: "/images/hero/planeta-cambridge.png",
    alt: "Certificación Cambridge",
    left: 690,
    top: 115,
    w: 128,
    h: 127,
    label: "CAMBRIDGE",
    labelLeft: 693,
    labelTop: 166,
    labelSize: 20,
    labelTracking: 2,
    orbitDuration: 12.5,
    orbitRadius: 77,
    orbitRadiusY: 17,
    orbitArc: 2,
    orbitInitialPhase: -0.08,
    floatAmount: 4,
    floatDuration: 5.8,
    floatPhase: 0.7,
  },
  {
    key: "ihs",
    src: "/images/hero/planeta-ihs.png",
    alt: "",
    left: 904,
    top: 200,
    w: 142,
    h: 143,
    label: "INTERNATIONAL HIGH SCHOOL",
    labelLeft: 809,
    labelTop: 250,
    labelSize: 20,
    labelTracking: 2,
    orbitDuration: 15,
    orbitRadius: 121,
    orbitRadiusY: 20,
    orbitArc: 2.6,
    orbitInitialPhase: 0.06,
    orbitFontSize: 16,
    orbitFadeStart: 0.45,
    orbitFadeEnd: 0.2,
    floatAmount: 3,
    floatDuration: 6.6,
    floatPhase: 2.1,
  },
  {
    key: "rayados",
    src: "/images/hero/planeta-rayados.png",
    alt: "Alianza Rayados",
    left: 1132,
    top: 95,
    w: 147,
    h: 147,
    label: "RAYADOS",
    labelLeft: 1147,
    labelTop: 154,
    labelSize: 24,
    labelTracking: 2.4,
    orbitDuration: 13.5,
    orbitRadius: 88,
    orbitRadiusY: 18,
    orbitArc: 1.5,
    orbitInitialPhase: 0.12,
    floatAmount: 5,
    floatDuration: 6.2,
    floatPhase: 3.6,
  },
  {
    key: "craft",
    src: "/images/hero/planeta-craft.png",
    alt: "Programa CRAFT",
    left: 1115,
    top: 307,
    w: 145,
    h: 145,
    label: "CRAFT",
    labelLeft: 1147,
    labelTop: 360,
    labelSize: 24,
    labelTracking: 2.4,
    orbitDuration: 14,
    orbitRadius: 87,
    orbitRadiusY: 18,
    orbitArc: 1.05,
    orbitInitialPhase: -0.04,
    floatAmount: 4,
    floatDuration: 7.1,
    floatPhase: 5.1,
  },
];

const BADGE_W = 236;
const BADGE_H = 51;

const BADGES = [
  {
    key: "excelencia",
    icon: "/images/hero/insignia-diez.png",
    iconLeft: 153,
    iconTop: 566,
    iconSize: 60,
    plecaLeft: 156,
    plecaTop: 571,
    label: "EXCELENCIA",
    labelLeft: 208,
    labelTop: 579,
    accent: "académica",
    accentLeft: 208,
    accentTop: 598,
  },
  {
    key: "vision",
    icon: "/images/hero/insignia-vision.png",
    iconLeft: 436,
    iconTop: 566,
    iconSize: 60,
    plecaLeft: 436,
    plecaTop: 571,
    label: "VISIÓN",
    labelLeft: 492,
    labelTop: 579,
    accent: "internacional",
    accentLeft: 492,
    accentTop: 598,
  },
  {
    key: "acompanamiento",
    icon: "/images/hero/insignia-acompana.png",
    iconLeft: 156,
    iconTop: 647,
    iconSize: 50,
    plecaLeft: 156,
    plecaTop: 652,
    label: "ACOMPAÑAMIENTO",
    labelLeft: 208,
    labelTop: 660,
    accent: "cercano",
    accentLeft: 208,
    accentTop: 679,
  },
  {
    key: "formacion",
    icon: "/images/hero/insignia-valor.png",
    iconLeft: 428,
    iconTop: 651,
    iconSize: 60,
    plecaLeft: 436,
    plecaTop: 652,
    label: "FORMACIÓN HUMANA",
    labelLeft: 488,
    labelTop: 660,
    accent: "con valores",
    accentLeft: 488,
    accentTop: 679,
  },
];

// Índice de foto activa (0..HERO_PHOTOS.length-1), o `null` en reposo (sin
// foto — fondo espacial fijo). Arranca en reposo si el carrusel está
// apagado, para que el resultado visual sea idéntico al fondo estático de
// siempre mientras `CAROUSEL_ENABLED` sea `false`.
function useHeroCarouselSlide() {
  const [slide, setSlide] = useState(CAROUSEL_ENABLED ? 0 : null);

  useEffect(() => {
    if (!CAROUSEL_ENABLED) return undefined;
    const id = setInterval(() => {
      setSlide((current) => {
        if (current === null) return current; // ya llegó al reposo — no reinicia el ciclo
        const next = current + 1;
        return next >= HERO_PHOTOS.length ? null : next;
      });
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  return slide;
}

// Fondo del "cielo": degradado fijo + foto del carrusel encima (si hay) con
// fade-in, más un velo del mismo degradado sobre la foto para que el
// encabezado siga legible — misma idea que la máscara editorial de la
// versión anterior del Hero.
function HeroSkyBackground({ photo, slideKey }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ backgroundImage: CIELO_GRADIENT }} />
      <AnimatePresence>
        {photo?.src && (
          <motion.div
            key={slideKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 opacity-70" style={{ backgroundImage: CIELO_GRADIENT }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnimationClock({ clock }) {
  useAnimationFrame((_, delta) => {
    clock.set(clock.get() + Math.min(delta, 50) / 1000);
  });
  return null;
}

function OrbitClock({ phase, blend, wait, speed }) {
  useAnimationFrame((_, delta) => {
    let seconds = Math.min(delta, 50) / 1000;
    const remainingWait = Math.max(0, ORBIT_ENTRY_DELAY - wait.get());

    if (remainingWait > 0) {
      const consumed = Math.min(seconds, remainingWait);
      wait.set(wait.get() + consumed);
      seconds -= consumed;
    }

    if (seconds <= 0) return;
    if (blend.get() < 1) blend.set(Math.min(1, blend.get() + seconds / 0.5));
    phase.set(phase.get() + seconds * speed.get() * blend.get());
  });
  return null;
}

function AmbientFloat({ clock, amount, duration, phase = 0, children }) {
  const y = useTransform(clock, (time) => {
    const ramp = Math.min(1, time / 0.55);
    return ramp * amount * Math.sin((time / duration) * Math.PI * 2 + phase);
  });

  return <motion.div className="size-full" style={{ y }}>{children}</motion.div>;
}

function orbitalFrontOpacity(depth, planet) {
  const fadeStart = planet.orbitFadeStart ?? 0.35;
  const fadeEnd = planet.orbitFadeEnd ?? 0.1;
  const progress = Math.max(0, Math.min(1, (depth - fadeEnd) / (fadeStart - fadeEnd)));
  return progress * progress * (3 - 2 * progress);
}

function OrbitalCharacter({ planet, phase, blend, character, index, count, cx, cy }) {
  const centeredIndex = index - (count - 1) / 2;
  const characterStep = count > 1 ? planet.orbitArc / (count - 1) : 0;
  const initialAngle = planet.orbitInitialPhase + centeredIndex * characterStep;
  const characterRef = useRef(null);
  const angle = useTransform(
    phase,
    (elapsed) => planet.orbitInitialPhase - (elapsed / planet.orbitDuration) * Math.PI * 2 + centeredIndex * characterStep,
  );
  const depth = useTransform(angle, (value) => Math.cos(value));
  const x = useTransform(angle, (value) => planet.orbitRadius * Math.sin(value));
  const y = useTransform(depth, (value) => planet.orbitRadiusY * value);
  const opacity = useTransform([depth, blend], ([value, mix]) => {
    const orbitalOpacity = orbitalFrontOpacity(value, planet);
    return 1 + (orbitalOpacity - 1) * mix;
  });
  const filter = useTransform(depth, (value) => {
    const brightness = 0.84 + ((value + 1) / 2) * 0.16;
    return `brightness(${brightness}) drop-shadow(0 0 5px rgba(61,214,249,0.72))`;
  });

  useMotionValueEvent(x, "change", (value) => {
    characterRef.current?.setAttribute("x", String(cx + value));
  });
  useMotionValueEvent(y, "change", (value) => {
    characterRef.current?.setAttribute("y", String(cy + value));
  });

  return (
    <motion.text
      ref={characterRef}
      x={cx + planet.orbitRadius * Math.sin(initialAngle)}
      y={cy + planet.orbitRadiusY * Math.cos(initialAngle)}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="var(--font-outfit), Outfit, sans-serif"
      fontSize={planet.orbitFontSize ?? planet.labelSize}
      fontWeight="600"
      style={{ opacity, filter }}
    >
      {character}
    </motion.text>
  );
}

function OrbitalCharacterLayer({ planet, phase, blend }) {
  const fontSize = planet.orbitFontSize ?? planet.labelSize;
  const marginX = fontSize + 8;
  const marginY = fontSize + 7;
  const width = (planet.orbitRadius + marginX) * 2;
  const height = (planet.orbitRadiusY + marginY) * 2;
  const cx = width / 2;
  const cy = height / 2;
  const characters = Array.from(planet.label);

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 overflow-visible"
      width={cqw(width)}
      height={cqw(height)}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible", zIndex: 3 }}
    >
      <g>
        {characters.map((character, index) => (
          <OrbitalCharacter
            key={`${index}-${character}`}
            planet={planet}
            phase={phase}
            blend={blend}
            character={character}
            index={index}
            count={characters.length}
            cx={cx}
            cy={cy}
          />
        ))}
      </g>
    </svg>
  );
}

function OrbitLabel({ planet, active, hovered, children }) {
  const phase = useMotionValue(0);
  const blend = useMotionValue(0);
  const wait = useMotionValue(0);
  const speedTarget = useMotionValue(hovered ? 0.28 : 1);
  const speed = useSpring(speedTarget, { stiffness: 75, damping: 20, mass: 0.7 });

  useEffect(() => {
    speedTarget.set(hovered ? 0.28 : 1);
  }, [hovered, speedTarget]);

  return (
    <div className="relative size-full">
      {active && <OrbitClock phase={phase} blend={blend} wait={wait} speed={speed} />}
      {children}
      <OrbitalCharacterLayer planet={planet} phase={phase} blend={blend} />
      <span className="sr-only">{planet.label}</span>
    </div>
  );
}

function DesktopPlanet({ planet, index, entered, active, orbitActive, clock, reduceMotion }) {
  const [hovered, setHovered] = useState(false);
  const entryDelay = INTRO.planets[index];

  return (
    <>
      <div
        className="absolute"
        style={{ left: pctX(planet.left), top: pctY(planet.top), width: cqw(planet.w), height: cqw(planet.h) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div
          className="size-full"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.75, filter: "blur(5px)" }}
          animate={entered ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
          transition={reduceMotion
            ? { delay: 0.04, duration: 0.16 }
            : { delay: entryDelay, duration: 0.48, ease: [0.2, 0.9, 0.25, 1.08] }}
        >
          <AmbientFloat
            clock={clock}
            amount={active ? planet.floatAmount : 0}
            duration={planet.floatDuration}
            phase={planet.floatPhase}
          >
            <OrbitLabel planet={planet} active={orbitActive} hovered={hovered}>
              <motion.div
                className="relative z-[2] size-full"
                animate={{ scale: hovered && !reduceMotion ? 1.04 : 1 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <Image
                  src={planet.src}
                  alt={planet.alt}
                  fill
                  preload
                  sizes="10vw"
                  className="object-contain"
                  style={{
                    filter: hovered && !reduceMotion
                      ? `${PLANET_GLOW} drop-shadow(0 0 14px rgba(92, 218, 255, 0.72))`
                      : PLANET_GLOW,
                    transition: "filter 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </motion.div>
            </OrbitLabel>
          </AmbientFloat>
        </motion.div>
      </div>
    </>
  );
}

function DesktopBadge({ badge, index, entered, active, clock, reduceMotion }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={entered ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: reduceMotion ? 0.04 : INTRO.badges[index], duration: reduceMotion ? 0.16 : 0.34, ease: EASE_OUT }}
      >
        <AmbientFloat clock={clock} amount={active ? 2 : 0} duration={5.7 + index * 0.55} phase={index * 1.35}>
          <div className="absolute" style={{ left: pctX(badge.plecaLeft), top: pctY(badge.plecaTop), width: cqw(BADGE_W), height: cqw(BADGE_H) }}>
            <div className="absolute inset-[-9.8%_-3.81%_-25.49%_-3.81%]">
              <Image src="/images/hero/pleca-insignia.svg" alt="" fill preload sizes="17vw" className="object-contain" />
            </div>
          </div>
          <p className="absolute font-sans font-semibold whitespace-nowrap text-black" style={{ left: pctX(badge.labelLeft), top: pctY(badge.labelTop), fontSize: cqw(14), letterSpacing: cqw(1.4) }}>
            {badge.label}
          </p>
          <p className="absolute font-sans font-bold whitespace-nowrap" style={{ left: pctX(badge.accentLeft), top: pctY(badge.accentTop), fontSize: cqw(14), letterSpacing: cqw(1.4), color: "#000c96" }}>
            {badge.accent}
          </p>
          <div className="absolute" style={{ left: pctX(badge.iconLeft), top: pctY(badge.iconTop), width: cqw(badge.iconSize), height: cqw(badge.iconSize) }}>
            <Image src={badge.icon} alt="" fill preload sizes="5vw" className="object-contain" style={{ filter: BADGE_ICON_SHADOW }} />
          </div>
        </AmbientFloat>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const slide = useHeroCarouselSlide();
  const photo = slide !== null ? HERO_PHOTOS[slide] : null;
  const heroRef = useRef(null);
  const isVisible = useInView(heroRef, { amount: 0.08 });
  const entered = useInView(heroRef, { amount: 0.08, once: true });
  const reduceMotion = useReducedMotion();
  const [ambientReady, setAmbientReady] = useState(false);
  const clock = useMotionValue(0);

  const active = Boolean(isVisible && ambientReady && !reduceMotion);
  const orbitActive = Boolean(entered && isVisible && !reduceMotion);

  return (
    <section ref={heroRef} id="top" data-nav-theme="dark" className="relative overflow-hidden bg-[#f7f5f0]">
      {active && <AnimationClock clock={clock} />}
      {/* ---------- Desktop (>=lg): réplica exacta del canvas 1440x780 ---------- */}
      <div className="relative hidden aspect-[1440/780] w-full lg:block" style={{ containerType: "inline-size" }}>
        {/* Cielo (+ carrusel de fondo, ver HeroSkyBackground) */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, filter: "brightness(0.94)" }}
          animate={entered ? { opacity: 1, filter: "brightness(1)" } : undefined}
          transition={{ delay: reduceMotion ? 0 : INTRO.sky, duration: reduceMotion ? 0.16 : 0.55, ease: "easeOut" }}
        >
          <HeroSkyBackground photo={photo} slideKey={slide} />
        </motion.div>

        {/* Plano 01 · Estrellas y atmósfera */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : undefined}
          transition={{ delay: reduceMotion ? 0.02 : 0.1, duration: reduceMotion ? 0.16 : 0.62, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0"
            animate={active ? { opacity: [0.94, 1, 0.96, 1] } : { opacity: 1 }}
            transition={active ? { duration: 11, repeat: Infinity, ease: "easeInOut", times: [0, 0.32, 0.68, 1] } : { duration: 0.2 }}
          >
            <Image src="/images/hero/estrellas-atmosfera.svg" alt="" fill preload sizes="100vw" className="object-cover" />
          </motion.div>
        </motion.div>

        {/* Pleca_Soft3D — ola blanca que separa el cielo del primer plano */}
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 9 }}
          animate={entered ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: reduceMotion ? 0.02 : INTRO.curve, duration: reduceMotion ? 0.16 : 0.58, ease: EASE_OUT }}
        >
        <div className="absolute" style={{ left: 0, top: pctY(419), width: "100%", height: cqw(342.673) }}>
          <div className="absolute inset-[-14.88%_-2.5%_-7.88%_-2.5%]">
            <Image src="/images/hero/bisel-fondo.svg" alt="" fill preload sizes="100vw" className="object-contain" />
          </div>
        </div>
        <div className="absolute" style={{ left: 0, top: pctY(447), width: "100%", height: cqw(342.673) }}>
          <div className="absolute inset-[-0.29%_0]">
            <Image src="/images/hero/superficie-blanca.svg" alt="" fill preload sizes="100vw" className="object-contain" />
          </div>
        </div>
        <div className="absolute" style={{ left: pctX(269), top: pctY(383), width: cqw(116), height: cqw(111) }}>
          <Image src="/images/hero/planeta-mini.png" alt="" fill preload sizes="8vw" className="object-contain" />
        </div>
        </motion.div>

        {/* Papel rasgado + encabezado */}
        <div className="absolute" style={{ left: pctX(172), top: pctY(248), width: cqw(553), height: cqw(79) }}>
          <motion.div
            className="size-full origin-left overflow-hidden"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : undefined}
            transition={{ delay: reduceMotion ? 0.03 : INTRO.brush, duration: reduceMotion ? 0.16 : 0.42, ease: EASE_OUT }}
          >
            <Image
              src="/images/hero/papel-rasgado.png"
              alt=""
              fill
              preload
              sizes="38vw"
              className="object-cover pointer-events-none"
            />
          </motion.div>
        </div>

        <motion.p
          className="absolute font-serif font-bold leading-none whitespace-nowrap text-white"
          style={{ left: pctX(104), top: pctY(127), fontSize: cqw(36) }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={entered ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: reduceMotion ? 0.03 : INTRO.line1, duration: reduceMotion ? 0.16 : 0.35, ease: EASE_OUT }}
        >
          Formamos seres humanos
        </motion.p>
        <motion.p
          className="absolute font-serif font-bold leading-none whitespace-nowrap"
          style={{ left: pctX(140), top: pctY(173), fontSize: cqw(48), color: "#fdcb2e" }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={entered ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: reduceMotion ? 0.03 : INTRO.line2, duration: reduceMotion ? 0.16 : 0.36, ease: EASE_OUT }}
        >
          felices<span className="text-white">,</span> exitosos
        </motion.p>
        <motion.p
          className="absolute font-serif font-bold leading-none whitespace-nowrap text-white"
          style={{ left: pctX(523), top: pctY(186), fontSize: cqw(36) }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={entered ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: reduceMotion ? 0.03 : INTRO.line2, duration: reduceMotion ? 0.16 : 0.36, ease: EASE_OUT }}
        >
          y con
        </motion.p>
        <motion.p
          className="absolute font-serif font-bold leading-none whitespace-nowrap"
          style={{ left: pctX(201), top: pctY(258), fontSize: cqw(48), color: "#0a1730" }}
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : undefined}
          transition={{ delay: reduceMotion ? 0.03 : INTRO.brushText, duration: reduceMotion ? 0.16 : 0.3, ease: "easeOut" }}
        >
          gran calidad humana.
        </motion.p>

        {/* Plano 02 · Planetas + labels */}
        {[PLANETS[1], PLANETS[0], PLANETS[2], PLANETS[3]].map((planet, index) => (
          <DesktopPlanet
            key={planet.key}
            planet={planet}
            index={index}
            entered={entered}
            active={active}
            orbitActive={orbitActive}
            clock={clock}
            reduceMotion={reduceMotion}
          />
        ))}

        {/* Plano 03 · Primer plano — astronauta */}
        <div className="absolute" style={{ left: pctX(682), top: pctY(337), width: cqw(327), height: cqw(440) }}>
          <motion.div
            className="size-full"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={entered ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ delay: reduceMotion ? 0.04 : INTRO.astronaut, duration: reduceMotion ? 0.16 : 0.62, ease: EASE_OUT }}
          >
            <AmbientFloat clock={clock} amount={active ? 2.5 : 0} duration={5} phase={0.25}>
              <div className="relative size-full">
                <Image
                  src="/images/hero/nina-astronauta.png"
                  alt="Alumna de Champal vestida de astronauta"
                  fill
                  preload
                  sizes="23vw"
                  className="object-contain"
                  style={{ filter: ASTRONAUT_SHADOW }}
                />
                {!reduceMotion && (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute rounded-full"
                    style={{
                      left: "26%",
                      top: "7%",
                      width: "52%",
                      height: "25%",
                      background: "linear-gradient(112deg, transparent 32%, rgba(255,255,255,0.34) 48%, transparent 62%)",
                      mixBlendMode: "screen",
                    }}
                    initial={{ opacity: 0, x: "-28%" }}
                    animate={entered ? { opacity: [0, 0.52, 0], x: ["-28%", "18%", "34%"] } : undefined}
                    transition={{ delay: 1.12, duration: 0.48, times: [0, 0.48, 1], ease: "easeInOut" }}
                  />
                )}
              </div>
            </AmbientFloat>
          </motion.div>
        </div>

        {/* Insignia "35 años" + círculo punteado + flecha */}
        <div className="absolute opacity-45" style={{ left: pctX(1116), top: pctY(532), width: cqw(235), height: cqw(235) }}>
          <Image src="/images/hero/circulo-subraya.png" alt="" fill preload sizes="16vw" className="object-contain" />
        </div>
        {/* El export plano de Figma para este logo venía con fondo sólido
            opaco (mismo tono que el bg de la página), así que tapaba casi
            todo el círculo punteado de atrás — se usa el SVG real (mismo
            logo, con transparencia de verdad) que ya vive en el Footer.
            Tamaño reducido (145 en vez de los 231 "de caja" de Figma) y
            centrado sobre el mismo círculo (centro 1233.5,649.5): a ese
            tamaño de caja el logo casi tocaba el aro punteado — el usuario
            pidió que quede claramente contenido adentro, con aire alrededor. */}
        <div className="absolute" style={{ left: pctX(1161), top: pctY(577), width: cqw(145), height: cqw(145) }}>
          <Image src="/images/footer-champal-35.svg" alt="35 años de Colegio Champal" fill preload sizes="10vw" className="object-contain" />
        </div>
        {/* Flecha punteada, dibujada a mano en SVG (ver nota más abajo).
            Nace del borde superior-derecho del "techo" azul del camión —
            medido en vivo con getBoundingClientRect, no a ojo — y viaja en
            línea recta con la MISMA pendiente que el propio camión
            (rotate(23deg) en su capa) hasta tocar el aro punteado. Mismo
            azul y misma composición de opacidad que el aro (wrapper
            opacity-45 + rgb(11,49,255), color tomado con sharp del propio
            circulo-subraya.png) para que ambos se vean del mismo tono. */}
        <div className="absolute opacity-45" style={{ left: pctX(1310), top: pctY(680), width: cqw(90), height: cqw(60) }}>
          <svg className="absolute inset-0" viewBox="0 0 90 60" fill="none">
            <path d="M69.6 47.5 L32 31.6" stroke="rgb(11,49,255)" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
            <path d="M32.5 27.4 L25.4 28.75 L29.4 34.8" stroke="rgb(11,49,255)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Insignias de valor */}
        {BADGES.map((badge, index) => (
          <DesktopBadge
            key={badge.key}
            badge={badge}
            index={index}
            entered={entered}
            active={active}
            clock={clock}
            reduceMotion={reduceMotion}
          />
        ))}
        <motion.div
          aria-hidden="true"
          className="absolute size-px"
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : undefined}
          transition={{ delay: reduceMotion ? 0 : 1.76, duration: 0.01 }}
          onAnimationComplete={() => setAmbientReady(true)}
        />
      </div>

      {/* ---------- Mobile / tablet (<lg): reinterpretación apilada ----------
          Figma no trae un frame mobile para este Hero — se reconstruye el
          mismo contenido (encabezado, planetas, astronauta, insignias, "35
          años") en un layout de flujo normal en vez de intentar forzar el
          canvas absoluto 1440x780 a una pantalla angosta. */}
      <div className="relative lg:hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : undefined}
          transition={{ duration: reduceMotion ? 0.16 : 0.5 }}
        >
          <HeroSkyBackground photo={photo} slideKey={slide} />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: active ? [0.96, 1, 0.97, 1] : 1 } : undefined}
          transition={active
            ? { opacity: { duration: 11, repeat: Infinity, ease: "easeInOut" } }
            : { duration: reduceMotion ? 0.16 : 0.55 }}
        >
          <Image src="/images/hero/estrellas-atmosfera.svg" alt="" fill preload sizes="100vw" className="object-cover" />
        </motion.div>

        <div className="relative px-6 pt-24 pb-14 sm:px-10">
          <motion.h1
            className="font-serif font-bold leading-tight text-3xl sm:text-4xl text-white"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={entered ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: reduceMotion ? 0.02 : INTRO.line1, duration: reduceMotion ? 0.16 : 0.42, ease: EASE_OUT }}
          >
            Formamos seres humanos{" "}
            <span style={{ color: "#fdcb2e" }}>
              felices<span className="text-white">,</span> exitosos
            </span>{" "}
            y con
          </motion.h1>
          <motion.span
            className="mt-3 inline-block origin-left rounded-sm px-3 py-1.5 font-serif font-bold text-2xl sm:text-3xl"
            style={{ backgroundColor: "#fdcb2e", color: "#0a1730" }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : undefined}
            transition={{ delay: reduceMotion ? 0.02 : INTRO.brush, duration: reduceMotion ? 0.16 : 0.45, ease: EASE_OUT }}
          >
            gran calidad humana.
          </motion.span>

          <div className="mt-8 flex items-center justify-center gap-4">
            {[PLANETS[1], PLANETS[0], PLANETS[2], PLANETS[3]].map((p, index) => (
              <motion.div
                key={p.key}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.75 }}
                animate={entered ? { opacity: 1, scale: 1 } : undefined}
                transition={{ delay: reduceMotion ? 0.03 : INTRO.planets[index], duration: reduceMotion ? 0.16 : 0.42, ease: EASE_OUT }}
              >
                <AmbientFloat clock={clock} amount={active ? Math.min(3, p.floatAmount) : 0} duration={p.floatDuration} phase={p.floatPhase}>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={64}
                    height={64}
                    className="h-10 w-10 sm:h-14 sm:w-14 object-contain"
                    style={{ filter: PLANET_GLOW }}
                  />
                </AmbientFloat>
              </motion.div>
            ))}
          </div>

          <div className="relative mt-2 flex justify-center">
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
              animate={entered ? { opacity: 1, y: 0, scale: 1 } : undefined}
              transition={{ delay: reduceMotion ? 0.03 : INTRO.astronaut, duration: reduceMotion ? 0.16 : 0.58, ease: EASE_OUT }}
            >
              <AmbientFloat clock={clock} amount={active ? 2 : 0} duration={5} phase={0.25}>
                <Image
                  src="/images/hero/nina-astronauta.png"
                  alt="Alumna de Champal vestida de astronauta"
                  width={327}
                  height={440}
                  preload
                  sizes="60vw"
                  className="h-[280px] w-auto sm:h-[340px]"
                  style={{ filter: ASTRONAUT_SHADOW }}
                />
              </AmbientFloat>
            </motion.div>
            <div className="absolute -bottom-4 -right-3 h-24 w-24 sm:h-28 sm:w-28">
              <Image src="/images/hero/circulo-subraya.png" alt="" fill className="object-contain opacity-80" />
              <Image
                src="/images/footer-champal-35.svg"
                alt="35 años de Colegio Champal"
                fill
                className="object-contain p-6"
              />
              <div className="absolute -bottom-3 -left-9 h-6 w-[72px]">
                <Image
                  src="/images/hero/arrow.png"
                  alt=""
                  fill
                  className="object-contain opacity-80"
                  style={{ transform: "rotate(-155.93deg)" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {BADGES.map((b, index) => (
              <motion.div
                key={b.key}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 7 }}
                animate={entered ? { opacity: 1, y: 0 } : undefined}
                transition={{ delay: reduceMotion ? 0.03 : INTRO.badges[index], duration: reduceMotion ? 0.16 : 0.34, ease: EASE_OUT }}
              >
                <AmbientFloat clock={clock} amount={active ? 1.5 : 0} duration={5.7 + index * 0.55} phase={index * 1.35}>
                  <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.18)]">
                    <Image src={b.icon} alt="" width={60} height={60} className="h-8 w-8 shrink-0 object-contain" />
                    <div className="leading-tight">
                      <p className="text-[10px] font-semibold tracking-wide text-black">{b.label}</p>
                      <p className="text-[10px] font-bold" style={{ color: "#000c96" }}>
                        {b.accent}
                      </p>
                    </div>
                  </div>
                </AmbientFloat>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
