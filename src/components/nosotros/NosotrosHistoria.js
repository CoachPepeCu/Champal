"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NuestraHistoria from "@/components/nuestra-historia/NuestraHistoria";
import CircularCurtainOverlay from "@/components/effects/CircularCurtainOverlay";

// ============================================================================
// NosotrosHistoria — banner "Conoce Nuestra Historia / Nuestro Futuro" del
// módulo Nosotros.
//
// Réplica del frame de Figma "Nuestra_Historia" (node-id 972:1387, archivo
// Champ): https://www.figma.com/design/UBACmzTCtVZqRDiTHDYi98/Champ?node-id=972-1387
//
// Es una franja full-bleed (fondo de relieve maya en azul) con dos líneas de
// título superpuestas y un acento rojo bajo la primera línea.
//
// Técnica de escalado: la misma que ya usan src/components/hero/* y
// src/components/comunidad-recursos/ComunidadRecursos.js — un lienzo fijo
// (CANVAS_WIDTH x CANVAS_HEIGHT, las dimensiones reales del frame de Figma)
// convertido a %/cqw mediante los helpers x()/y()/unit(), dentro de un
// contenedor con containerType:"inline-size" y aspect-ratio fijo, para que
// el desktop escale de forma proporcional y pixel-accurate en cualquier
// ancho >= lg. Debajo de lg se usa una versión apilada en flujo normal
// (MobileFrame) con tipografía fluida (clamp) — a ese ancho una réplica
// literal del canvas 1440x350 quedaría demasiado baja y el texto ilegible.
// ============================================================================

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 350;
const x = (value) => `${((value / CANVAS_WIDTH) * 100).toFixed(4)}%`;
const y = (value) => `${((value / CANVAS_HEIGHT) * 100).toFixed(4)}%`;
const unit = (value) => `${((value / CANVAS_WIDTH) * 100).toFixed(4)}cqw`;

const FONDO = "/images/nosotros/fondo-nuestra-historia.png";
const ACENTO_ROJO = "#DA2028"; // color real del trazo (Vector 29), no la paleta general de marca
const TEXT_SHADOW = "0px 4px 4px rgba(0,0,0,0.25)";

function DesktopFrame() {
  return (
    <div
      data-history-frame
      className="relative hidden aspect-[1440/350] w-full overflow-hidden lg:block"
      style={{ containerType: "inline-size" }}
    >
      <div data-history-bg className="pointer-events-none absolute -inset-y-[14%] inset-x-0">
        <Image src={FONDO} alt="" fill preload sizes="100vw" className="object-cover" />
      </div>

      {/* Centrado por flex en vez de apilar top/left absolutos (como en
          Figma): el "leading-[20px]" que trae el nodo para un texto de
          64px es solo la caja invisible que usa Figma para posicionar, no
          la métrica real de la fuente — copiar sus top literales dejaba la
          línea roja prácticamente pegada a las letras. Este layout separa
          título/línea/subtítulo con márgenes explícitos que sí controlan
          el espacio visual real. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h2
          data-history-title
          className="font-serif font-bold uppercase leading-none whitespace-nowrap text-white transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_8px_rgba(255,255,255,1))_drop-shadow(0_0_22px_rgba(56,189,248,0.95))] motion-reduce:transition-none"
          style={{
            fontSize: unit(64),
            letterSpacing: unit(7.68),
            textShadow: TEXT_SHADOW,
            marginBottom: unit(28),
          }}
        >
          Conoce Nuestra Historia
        </h2>

        {/* Acento — línea roja bajo el título (Vector 29 en Figma) */}
        <div
          data-history-accent
          style={{
            width: unit(1011),
            height: unit(8),
            marginBottom: unit(34),
            backgroundColor: ACENTO_ROJO,
          }}
        />

        <p
          data-history-subtitle
          className="font-serif font-medium uppercase leading-none whitespace-nowrap text-white"
          style={{
            fontSize: unit(64),
            letterSpacing: unit(7.68),
            textShadow: TEXT_SHADOW,
          }}
        >
          Nuestro Futuro
        </p>
      </div>
    </div>
  );
}

function MobileFrame() {
  return (
    <div data-history-frame-mobile className="relative overflow-hidden lg:hidden">
      <div data-history-bg-mobile className="pointer-events-none absolute -inset-y-[10%] inset-x-0">
        <Image src={FONDO} alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <div className="relative flex flex-col items-center gap-4 px-6 py-14 text-center sm:gap-5 sm:py-20">
        <h2
          data-history-title-mobile
          className="font-serif font-bold uppercase leading-tight text-white transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_8px_rgba(255,255,255,1))_drop-shadow(0_0_22px_rgba(56,189,248,0.95))] motion-reduce:transition-none"
          style={{
            fontSize: "clamp(24px, 7vw, 40px)",
            letterSpacing: "0.12em",
            textShadow: TEXT_SHADOW,
          }}
        >
          Conoce Nuestra Historia
        </h2>

        <span data-history-accent-mobile className="h-[4px] w-[68%] max-w-[300px] shrink-0" style={{ backgroundColor: ACENTO_ROJO }} />

        <p
          data-history-subtitle-mobile
          className="font-serif font-medium uppercase leading-tight text-white"
          style={{
            fontSize: "clamp(20px, 6vw, 36px)",
            letterSpacing: "0.12em",
            textShadow: TEXT_SHADOW,
          }}
        >
          Nuestro Futuro
        </p>
      </div>
    </div>
  );
}

export default function NosotrosHistoria() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const bodyLockRef = useRef(null);
  const [phase, setPhase] = useState("idle");
  const [flight, setFlight] = useState(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        const frame = section.querySelector("[data-history-frame]");
        const bg = section.querySelector("[data-history-bg]");
        const title = section.querySelector("[data-history-title]");
        const accent = section.querySelector("[data-history-accent]");
        const subtitle = section.querySelector("[data-history-subtitle]");

        if (reduceMotion) {
          gsap.set([title, accent, subtitle], { clearProps: "all", autoAlpha: 1 });
          return;
        }

        if (frame) {
          gsap.set(frame, {
            y: 78,
            autoAlpha: 0.82,
            clipPath: "inset(18% 0 0 0)",
          });

          gsap.to(frame, {
            y: 0,
            autoAlpha: 1,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.92,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          });
        }

        gsap.set(title, { y: 62, autoAlpha: 0 });
        gsap.set(accent, { scaleX: 0, transformOrigin: "50% 50%", autoAlpha: 0 });
        gsap.set(subtitle, { y: 52, autoAlpha: 0 });

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        })
          .to(title, {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            ease: "power3.out",
          })
          .to(
            accent,
            {
              scaleX: 1,
              autoAlpha: 1,
              duration: 0.72,
              ease: "power3.inOut",
            },
            "-=0.28",
          )
          .to(
            subtitle,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.72,
              ease: "power3.out",
            },
            "-=0.28",
          );

        if (bg) {
          gsap.fromTo(
            bg,
            { yPercent: -8, scale: 1.05 },
            {
              yPercent: 8,
              scale: 1.01,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.9,
              },
            },
          );
        }
      }, section);

      return () => ctx.revert();
    });

    mm.add("(max-width: 1023px)", () => {
      const ctx = gsap.context(() => {
        if (reduceMotion) return;

        const frame = section.querySelector("[data-history-frame-mobile]");
        const bg = section.querySelector("[data-history-bg-mobile]");
        const title = section.querySelector("[data-history-title-mobile]");
        const accent = section.querySelector("[data-history-accent-mobile]");
        const subtitle = section.querySelector("[data-history-subtitle-mobile]");

        if (frame) {
          gsap.from(frame, {
            y: 46,
            autoAlpha: 0,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
            },
          });
        }

        gsap.from([title, accent, subtitle], {
          y: 42,
          autoAlpha: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 84%",
            once: true,
          },
        });

        if (bg) {
          gsap.fromTo(
            bg,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        }
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reduceMotion]);

  const restoreBody = useCallback(() => {
    const lock = bodyLockRef.current;
    if (!lock) return;

    const body = document.body;
    Object.assign(body.style, lock.styles);
    window.scrollTo({ left: lock.scrollX, top: lock.scrollY, behavior: "instant" });
    bodyLockRef.current = null;
  }, []);

  useEffect(() => () => restoreBody(), [restoreBody]);

  const openOverlay = useCallback((event) => {
    if (phase !== "idle") return;

    const trigger = event.currentTarget;
    const rect = trigger.getBoundingClientRect();
    const body = document.body;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const computedPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    bodyLockRef.current = {
      scrollX,
      scrollY,
      styles: {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        width: body.style.width,
        paddingRight: body.style.paddingRight,
      },
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = `-${scrollX}px`;
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;

    triggerRef.current = trigger;
    setFlight({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      src: FONDO,
      origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    });
    setPhase("revealing");
  }, [phase]);

  const closeOverlay = useCallback(() => {
    setPhase((current) => (current === "idle" || current === "closing" ? current : "closing"));
  }, []);

  const finishClose = useCallback(() => {
    restoreBody();
    setPhase("idle");
    setFlight(null);
    requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true });
      triggerRef.current = null;
    });
  }, [restoreBody]);

  return (
    <>
      <section
        ref={sectionRef}
        id="nuestra-historia"
        className="group relative overflow-hidden bg-[#0a2540]"
        aria-label="Conoce nuestra historia"
        style={{ marginTop: "-125px", paddingTop: "125px", zIndex: 0 }}
      >
        <div
          data-history-content
          className={phase === "idle" ? "" : "opacity-0"}
        >
          <DesktopFrame />
          <MobileFrame />
        </div>

        <button
          type="button"
          aria-haspopup="dialog"
          aria-label="Abrir Nuestra Historia"
          className="absolute inset-0 z-10 cursor-pointer transition-colors duration-200 hover:bg-white/5 active:bg-[#0a2540]/10 focus-visible:bg-white/5 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
          onClick={openOverlay}
        />
      </section>

      {phase !== "idle" && flight && (
        <CircularCurtainOverlay
          phase={phase}
          origin={flight.origin}
          flight={flight}
          reduceMotion={reduceMotion}
          ariaLabel="Nuestra Historia"
          showFlight={false}
          onClose={closeOverlay}
          onFlightComplete={() => setPhase((current) => (current === "flying" ? "revealing" : current))}
          onOpened={() => setPhase((current) => (current === "revealing" ? "open" : current))}
          onClosed={finishClose}
        >
          <NuestraHistoria />
        </CircularCurtainOverlay>
      )}
    </>
  );
}
