"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 760;
const x = (value) => `${((value / CANVAS_WIDTH) * 100).toFixed(4)}%`;
const y = (value) => `${((value / CANVAS_HEIGHT) * 100).toFixed(4)}%`;
const unit = (value) => `${((value / CANVAS_WIDTH) * 100).toFixed(4)}cqw`;
const SKY = "linear-gradient(180deg, #024c9e 0%, #0c4e9e 100%)";
const EASE_OUT = [0.22, 1, 0.36, 1];

const BADGES = [
  { key: "cuenta", src: "/images/comunidad/circulo-cuenta.png", alt: "Cada alumno cuenta", label: "CADA ALUMNO CUENTA", left: 763, top: 148, delay: 2.72, float: 4 },
  { key: "comunidad", src: "/images/comunidad/circulo-comunidad.png", alt: "Crecemos en comunidad", label: "CRECEMOS EN COMUNIDAD", left: 569, top: 326, delay: 3.08, float: 5 },
  { key: "mente", src: "/images/comunidad/circulo-mente.png", alt: "Desarrollamos mente, cuerpo y carácter", label: "DESARROLLAMOS MENTE, CUERPO Y CARÁCTER", left: 820, top: 471, delay: 2.88, float: 4.5 },
  { key: "haciendo", src: "/images/comunidad/circulo-haciendo.png", alt: "Aprendemos haciendo", label: "APRENDEMOS HACIENDO", left: 1090, top: 438, delay: 3.24, float: 5.5 },
];

const BADGE_GLOW = "radial-gradient(circle, rgba(149, 200, 255, 0.38) 0%, rgba(108, 172, 238, 0.2) 47%, rgba(108, 172, 238, 0) 72%)";

function CurvedLabel({ id, label }) {
  return (
    <svg viewBox="0 0 263 263" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <path id={id} d="M 131.5 255.5 A 119 119 0 1 1 131.5 17.5 A 119 119 0 1 1 131.5 255.5" />
      </defs>
      <text fill="#fff" fontFamily="var(--font-sans)" fontSize="15" fontWeight="700" letterSpacing="1.35">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">{label}</textPath>
      </text>
    </svg>
  );
}

function AnimatedBadge({ badge, play, reduceMotion, children, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={false}
      animate={{ opacity: play ? 1 : 0, scale: play || reduceMotion ? 1 : 0.35 }}
      transition={reduceMotion
        ? { duration: 0.18 }
        : { duration: 0.62, delay: badge.delay, type: "spring", stiffness: 310, damping: 17 }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={play && !reduceMotion ? { y: [0, -badge.float, 0, badge.float * 0.45, 0] } : { y: 0 }}
        transition={play && !reduceMotion
          ? { duration: 5.4 + badge.float * 0.12, delay: badge.delay + 0.62, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function DesktopBadge({ badge, play, reduceMotion }) {
  return (
    <AnimatedBadge badge={badge} play={play} reduceMotion={reduceMotion} className="absolute" style={{ left: x(badge.left), top: y(badge.top), width: unit(263), height: unit(263) }}>
      <div className="pointer-events-none absolute -inset-[24%]" style={{ background: BADGE_GLOW }} />
      <Image src={badge.src} alt={badge.alt} fill sizes="19vw" className="object-contain" />
      <div className="pointer-events-none absolute inset-0">
        <CurvedLabel id={`comunidad-desktop-${badge.key}`} label={badge.label} />
      </div>
    </AnimatedBadge>
  );
}

function ResponsiveBadge({ badge, play, reduceMotion }) {
  return (
    <AnimatedBadge badge={badge} play={play} reduceMotion={reduceMotion} className="relative aspect-square w-full max-w-[220px]">
      <div className="pointer-events-none absolute -inset-[24%]" style={{ background: BADGE_GLOW }} />
      <Image src={badge.src} alt={badge.alt} fill sizes="(max-width: 640px) 42vw, 220px" className="object-contain" />
      <div className="pointer-events-none absolute inset-0">
        <CurvedLabel id={`comunidad-responsive-${badge.key}`} label={badge.label} />
      </div>
    </AnimatedBadge>
  );
}

function DesktopArtwork({ play, reduceMotion }) {
  return (
    <motion.div
      className="relative hidden aspect-[1440/760] w-full lg:block"
      style={{ containerType: "inline-size", background: SKY }}
      initial={false}
      animate={{ opacity: play ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0.18 : 0.76, ease: "easeOut" }}
    >
      <Image src="/images/comunidad/estrellas-figma-790-6490.svg" alt="" fill sizes="100vw" className="object-fill" />

      <motion.div className="absolute inset-0" initial={false} animate={{ x: play || reduceMotion ? 0 : "-100%" }} transition={{ duration: reduceMotion ? 0 : 0.82, delay: reduceMotion ? 0 : 0.62, ease: EASE_OUT }}>
        <div className="absolute" style={{ left: x(-4), top: y(-1), width: unit(651.458), height: unit(772) }}>
          <Image src="/images/comunidad/pleca-izquierda-figma-790-6490.svg" alt="" fill sizes="46vw" className="object-fill" />
        </div>
        <div className="absolute" style={{ left: x(390.116), top: y(2.012), width: unit(264.117), height: unit(759.988) }}>
          <Image src="/images/comunidad/borde-blanco-izquierdo-figma-790-6490.svg" alt="" fill sizes="19vw" className="object-fill" />
        </div>
      </motion.div>

      <motion.div className="absolute inset-0" initial={false} animate={{ x: play || reduceMotion ? 0 : "100%" }} transition={{ duration: reduceMotion ? 0 : 0.82, delay: reduceMotion ? 0 : 0.62, ease: EASE_OUT }}>
        <div className="absolute flex items-center justify-center" style={{ left: x(661), top: y(-7), width: unit(778), height: unit(409.174) }}>
          <div className="relative flex-none" style={{ width: unit(419.174), height: unit(789), transform: "rotate(90deg)" }}>
            <Image src="/images/comunidad/pleca-derecha-figma-790-6490.svg" alt="" fill sizes="55vw" className="object-fill" />
          </div>
        </div>
        <div className="absolute flex items-center justify-center" style={{ left: x(661), top: y(2), width: unit(778), height: unit(409.174) }}>
          <div className="relative flex-none" style={{ width: unit(409.162), height: unit(777.989), transform: "rotate(90deg)" }}>
            <Image src="/images/comunidad/borde-blanco-derecho-figma-790-6490.svg" alt="" fill sizes="55vw" className="object-fill" />
          </div>
        </div>
      </motion.div>

      {/* El efecto visual del Pico debe invadir el final de 01_Bienvenida.
          Al mostrarlo desde y=-34, su borde superior recto queda oculto y
          la curva azul es la que cruza la unión entre ambas secciones. */}
      <div className="absolute z-10" style={{ left: x(502.5), top: y(-34), width: unit(175.582), height: unit(230.5) }}>
        <Image src="/images/comunidad/pico-agua-figma-790-6490.svg" alt="" fill sizes="13vw" className="object-fill" />
      </div>
      <motion.div className="absolute" style={{ left: x(226), top: y(326), width: unit(359), height: unit(434) }} initial={false} animate={{ opacity: play ? 1 : 0 }} transition={{ duration: reduceMotion ? 0.18 : 0.62, delay: reduceMotion ? 0 : 2.28 }}>
        <Image src="/images/comunidad/kid-construccion.png" alt="Alumno de Champal caracterizado como constructor" fill sizes="25vw" className="object-fill" />
      </motion.div>

      {BADGES.map((badge) => <DesktopBadge key={badge.key} badge={badge} play={play} reduceMotion={reduceMotion} />)}

      <motion.div className="absolute flex items-center" style={{ left: x(101), top: y(68), gap: unit(5) }} initial={false} animate={{ opacity: play ? 1 : 0, x: play || reduceMotion ? 0 : unit(-75) }} transition={{ duration: reduceMotion ? 0.18 : 0.6, delay: reduceMotion ? 0 : 1.42, ease: EASE_OUT }}>
        <div className="rounded-full bg-[#df3035]" style={{ width: unit(51), height: unit(6) }} />
        <p className="whitespace-nowrap font-sans font-normal" style={{ fontSize: unit(20), lineHeight: unit(20), color: "#003850" }}>ASÍ VIVIMOS CHAMPAL</p>
      </motion.div>
      <motion.div className="absolute overflow-hidden" style={{ left: x(101), top: y(107), width: unit(407) }} initial={false} animate={{ clipPath: play ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }} transition={{ duration: reduceMotion ? 0.18 : 0.76, delay: reduceMotion ? 0 : 1.82, ease: EASE_OUT }}>
        <h2 className="font-serif font-normal" style={{ fontSize: unit(40), lineHeight: unit(52), color: "#003850" }}>Una comunidad comprometida con el desarrollo integral de sus alumnos</h2>
      </motion.div>
    </motion.div>
  );
}

function ResponsiveArtwork({ play, reduceMotion }) {
  return (
    <motion.div className="relative isolate overflow-hidden lg:hidden" style={{ background: SKY }} initial={false} animate={{ opacity: play ? 1 : 0 }} transition={{ duration: reduceMotion ? 0.18 : 0.76, ease: "easeOut" }}>
      <Image src="/images/comunidad/estrellas-figma-790-6490.svg" alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
      <motion.div className="absolute inset-0 -z-10" initial={false} animate={{ x: play || reduceMotion ? 0 : "-100%" }} transition={{ duration: reduceMotion ? 0 : 0.82, delay: reduceMotion ? 0 : 0.62, ease: EASE_OUT }}>
        <div className="absolute -left-[28%] -top-3 h-[58%] w-[112%] sm:-left-[18%] sm:w-[84%]">
          <Image src="/images/comunidad/pleca-izquierda-figma-790-6490.svg" alt="" fill sizes="90vw" className="object-fill" />
        </div>
        <div className="absolute -left-[3%] top-0 h-[62%] w-[58%] opacity-90 sm:w-[46%]">
          <Image src="/images/comunidad/borde-blanco-izquierdo-figma-790-6490.svg" alt="" fill sizes="55vw" className="object-fill" />
        </div>
      </motion.div>
      <motion.div className="absolute inset-0 -z-10" initial={false} animate={{ x: play || reduceMotion ? 0 : "100%" }} transition={{ duration: reduceMotion ? 0 : 0.82, delay: reduceMotion ? 0 : 0.62, ease: EASE_OUT }}>
        <div className="absolute -right-[40%] top-[32%] h-[38%] w-[130%] rotate-90 sm:-right-[28%] sm:w-[90%]">
          <Image src="/images/comunidad/pleca-derecha-figma-790-6490.svg" alt="" fill sizes="100vw" className="object-fill" />
        </div>
        <div className="absolute -right-[23%] top-[39%] h-[34%] w-[72%] rotate-90 opacity-90">
          <Image src="/images/comunidad/borde-blanco-derecho-figma-790-6490.svg" alt="" fill sizes="70vw" className="object-fill" />
        </div>
      </motion.div>
      <div className="absolute right-[4%] top-0 -z-[5] h-36 w-28 sm:h-48 sm:w-36">
        <Image src="/images/comunidad/pico-agua-figma-790-6490.svg" alt="" fill sizes="140px" className="object-fill" />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-16 pt-12 sm:px-10 sm:pb-20 sm:pt-16">
        <div className="max-w-[31rem]">
          <motion.div className="flex items-center gap-3" initial={false} animate={{ opacity: play ? 1 : 0, x: play || reduceMotion ? 0 : -64 }} transition={{ duration: reduceMotion ? 0.18 : 0.6, delay: reduceMotion ? 0 : 1.42, ease: EASE_OUT }}>
            <div className="h-1.5 w-10 shrink-0 rounded-full bg-[#df3035]" />
            <p className="font-sans text-sm font-normal tracking-[0.04em] text-[#003850] sm:text-base">ASÍ VIVIMOS CHAMPAL</p>
          </motion.div>
          <motion.div className="mt-4 overflow-hidden" initial={false} animate={{ clipPath: play ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }} transition={{ duration: reduceMotion ? 0.18 : 0.76, delay: reduceMotion ? 0 : 1.82, ease: EASE_OUT }}>
            <h2 className="font-serif text-[2rem] font-normal leading-[1.18] text-[#003850] sm:text-[2.55rem]">Una comunidad comprometida con el desarrollo integral de sus alumnos</h2>
          </motion.div>
        </div>
        <motion.div className="relative -mt-1 flex justify-center sm:-mt-5 sm:justify-start sm:pl-12" initial={false} animate={{ opacity: play ? 1 : 0 }} transition={{ duration: reduceMotion ? 0.18 : 0.62, delay: reduceMotion ? 0 : 2.28 }}>
          <Image src="/images/comunidad/kid-construccion.png" alt="Alumno de Champal caracterizado como constructor" width={359} height={434} sizes="(max-width: 640px) 72vw, 330px" className="h-auto w-[72vw] max-w-[330px]" />
        </motion.div>
        <div className="relative z-10 -mt-5 grid grid-cols-2 place-items-center gap-x-3 gap-y-5 sm:-mt-10 sm:gap-x-8 sm:gap-y-8">
          {BADGES.map((badge) => <ResponsiveBadge key={badge.key} badge={badge} play={play} reduceMotion={reduceMotion} />)}
        </div>
      </div>
    </motion.div>
  );
}

export default function Comunidad() {
  const sectionRef = useRef(null);
  const play = useInView(sectionRef, { amount: 0.22, once: true });
  const reduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className="relative -mt-px bg-[#fafaf7]">
      <DesktopArtwork play={play} reduceMotion={reduceMotion} />
      <ResponsiveArtwork play={play} reduceMotion={reduceMotion} />
    </section>
  );
}
