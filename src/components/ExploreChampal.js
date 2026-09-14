"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ActividadesExtracurriculares from "@/components/ActividadesExtracurriculares";
import CampusInteractivo from "@/components/CampusInteractivo";
import CertificacionesColaboraciones from "@/components/CertificacionesColaboraciones";
import ConexionUniversitariaGlobos from "@/components/ConexionUniversitariaGlobos";
import VidaEstudiantil from "@/components/VidaEstudiantil";
import Rayados from "@/components/rayados/Rayados";
import CircularCurtainOverlay from "@/components/effects/CircularCurtainOverlay";

const CANVAS_W = 1440;
const CANVAS_H = 760;
const pctX = (px) => `${((px / CANVAS_W) * 100).toFixed(4)}%`;
const pctY = (px) => `${((px / CANVAS_H) * 100).toFixed(4)}%`;
const cqw = (px) => `${((px / CANVAS_W) * 100).toFixed(4)}cqw`;

const IMAGE_ROOT = "/images/conoce-champal";

const ISLANDS = [
  { id: "campus", name: "Campus", alt: "Campus de Colegio Champal", src: `${IMAGE_ROOT}/campus-exterior.webp`, left: 96, top: 17, width: 300, height: 300, enabled: true, component: CampusInteractivo, ariaLabel: "Campus Champal", hoverLabel: { text: "Nuestro Cole", left: -6, top: 283 }, float: { x: 1, y: 5, duration: 5.1, delay: 0 } },
  { id: "vida-champal", name: "Vida Champal", alt: "Vida estudiantil en Colegio Champal", src: `${IMAGE_ROOT}/vida-champal.webp`, left: 96, top: 336, width: 300, height: 300, enabled: true, component: VidaEstudiantil, ariaLabel: "Vida estudiantil", hoverLabel: { text: "Comunidad Champal", left: -6, top: 307 }, float: { x: -1.5, y: 7, duration: 5.8, delay: 0.8 } },
  { id: "convenios", name: "Convenios", alt: "Convenios universitarios", src: `${IMAGE_ROOT}/convenios.webp`, left: 1025, top: 36, width: 300, height: 300, enabled: true, component: ConexionUniversitariaGlobos, ariaLabel: "Conexión Universitaria", hoverLabel: { text: "Conexión Universitaria", left: -3, top: 284 }, float: { x: -1, y: 6, duration: 4.7, delay: 0.35 } },
  { id: "certificaciones", name: "Certificaciones", alt: "Certificaciones y colaboraciones", src: `${IMAGE_ROOT}/certificaciones.webp`, left: 1025, top: 396, width: 300, height: 300, enabled: true, component: CertificacionesColaboraciones, ariaLabel: "Certificaciones y colaboraciones", hoverLabel: { text: "Certificaciones y Convenios", left: 7, top: 267 }, float: { x: 1.5, y: 4, duration: 5.4, delay: 1.2 } },
  {
    id: "actividades-extracurriculares",
    name: "Actividades extracurriculares",
    alt: "Actividades extracurriculares de Colegio Champal",
    src: `${IMAGE_ROOT}/actividades-extracurriculares.webp`,
    left: 571,
    top: 472,
    width: 300,
    height: 300,
    enabled: true,
    component: ActividadesExtracurriculares,
    ariaLabel: "Actividades extracurriculares",
    hoverLabel: { text: "Clases extracurriculares", left: -7, top: -33 },
    float: { x: -2, y: 6, duration: 6, delay: 0.55 },
  },
];

const ROUTES = [
  {
    src: `${IMAGE_ROOT}/ruta-campus.svg`,
    left: 315.57,
    top: 228.41,
    boxWidth: 264.968,
    boxHeight: 92.04,
    width: 259.491,
    height: 62.742,
    transform: "rotate(-173.43deg)",
    revealFrom: "right",
  },
  {
    src: `${IMAGE_ROOT}/ruta-convenios.svg`,
    left: 846.32,
    top: 235.31,
    boxWidth: 313.683,
    boxHeight: 107.778,
    width: 307.338,
    height: 73.07,
    transform: "rotate(-173.43deg)",
    revealFrom: "left",
  },
  {
    src: `${IMAGE_ROOT}/ruta-vida-champal.svg`,
    left: 362.62,
    top: 369,
    boxWidth: 259.254,
    boxHeight: 123,
    width: 250.021,
    height: 94.998,
    transform: "rotate(173.43deg) scaleY(-1)",
    revealFrom: "right",
  },
  {
    src: `${IMAGE_ROOT}/ruta-certificaciones.svg`,
    left: 777,
    top: 333.62,
    boxWidth: 296.91,
    boxHeight: 170.912,
    width: 282.803,
    height: 139.449,
    transform: "rotate(173.43deg) scaleY(-1)",
    revealFrom: "left",
  },
  {
    src: `${IMAGE_ROOT}/ruta-actividades-extracurriculares.svg`,
    left: 502.99,
    top: 348.58,
    boxWidth: 191.495,
    boxHeight: 251.719,
    width: 165.761,
    height: 234.28,
    transform: "rotate(-173.43deg)",
    revealFrom: "top",
  },
];

const SECTION_BACKGROUND =
  "radial-gradient(ellipse at 50.5% 50%, #49adff 7.3653%, #3c90dd 30.524%, #2f74bb 53.683%, #225799 76.841%, #153a77 100%)";

function EducationalBackground() {
  return (
    <div
      data-explore-parallax-bg
      aria-hidden="true"
      className="pointer-events-none absolute -inset-y-[8%] inset-x-0 z-[1]"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 calc(100% - 145px), rgba(0,0,0,0.72) calc(100% - 92px), transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 calc(100% - 145px), rgba(0,0,0,0.72) calc(100% - 92px), transparent 100%)",
      }}
    >
      <Image
        src={`${IMAGE_ROOT}/fondo-educativo.webp`}
        alt=""
        fill
        sizes="100vw"
        className="hidden object-cover object-center opacity-10 lg:block"
      />
      <div
        className="absolute inset-0 bg-[length:100%_auto] bg-top bg-repeat-y opacity-10 lg:hidden"
        style={{ backgroundImage: `url(${IMAGE_ROOT}/fondo-educativo.webp)` }}
      />
    </div>
  );
}

function Island({ island, desktop = false, instanceId, isSectionVisible, reduceMotion, hidden, onActivate }) {
  const visualRef = useRef(null);
  const style = desktop
    ? {
        left: pctX(island.left),
        top: pctY(island.top),
        width: cqw(island.width),
        height: cqw(island.height),
      }
    : undefined;

  const Outer = island.enabled ? "button" : "div";

  return (
    <Outer
      {...(island.enabled
        ? {
            type: "button",
            "aria-label": island.name,
            onClick: (event) => onActivate(island, event.currentTarget, visualRef.current, instanceId),
          }
        : {})}
      className={
        desktop
          ? `group absolute appearance-none border-0 bg-transparent p-0 ${island.enabled ? "cursor-pointer focus:outline-none" : ""}`
          : `group relative aspect-square w-full appearance-none border-0 bg-transparent p-0 ${island.enabled ? "cursor-pointer focus:outline-none" : ""}`
      }
      style={style}
      data-explore-island={desktop ? "desktop" : "mobile"}
    >
      <motion.div
        ref={visualRef}
        className="relative h-full w-full"
        animate={
          isSectionVisible && !reduceMotion && !hidden
            ? { x: [0, island.float.x, 0, -island.float.x, 0], y: [0, -island.float.y, 0, island.float.y, 0] }
            : { x: 0, y: 0 }
        }
        transition={
          isSectionVisible && !reduceMotion && !hidden
            ? { duration: island.float.duration, delay: island.float.delay, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.25 }
        }
      >
        <motion.div
          className="relative h-full w-full"
          animate={{
            opacity: hidden ? 0 : 1,
            filter: "drop-shadow(0 0 0 rgba(0, 0, 0, 0))",
          }}
          whileHover={
            reduceMotion
              ? {
                  filter: "drop-shadow(0 10px 18px rgba(94, 200, 255, 0.85))",
                  transition: { filter: { duration: 0.2, ease: "easeOut" } },
                }
              : {
                  scale: 1.04,
                  filter: [
                    "drop-shadow(0 8px 16px rgba(77, 196, 255, 0.82))",
                    "drop-shadow(0 11px 22px rgba(151, 91, 255, 0.96))",
                    "drop-shadow(0 8px 18px rgba(65, 207, 255, 0.9))",
                  ],
                  transition: {
                    scale: { duration: 0.275, ease: "easeOut" },
                    filter: { duration: 1.35, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                  },
                }
          }
          transition={{
            scale: { duration: 0.275, ease: "easeOut" },
            filter: { duration: 0.2, ease: "easeOut" },
            opacity: { duration: 0.275, ease: "easeOut" },
          }}
        >
          <Image
            src={island.src}
            alt={island.alt}
            fill
            sizes={desktop ? "21vw" : "46vw"}
            className="pointer-events-none object-contain"
          />
        </motion.div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute z-10 flex items-center justify-center whitespace-nowrap border-2 border-white bg-white/20 px-3 text-center font-semibold text-white opacity-0 shadow-[0_4px_4px_rgba(0,0,0,0.25)] group-hover:opacity-100 group-focus-visible:opacity-100 ${reduceMotion ? "" : "transition-opacity duration-200"}`}
          style={desktop
            ? {
                left: cqw(island.hoverLabel.left),
                top: cqw(island.hoverLabel.top),
                width: cqw(312),
                height: cqw(40),
                borderRadius: cqw(18),
                fontSize: cqw(22),
                lineHeight: "normal",
              }
            : {
                left: "50%",
                bottom: 0,
                width: "calc(100% + 12px)",
                minHeight: 32,
                borderRadius: 16,
                fontSize: "clamp(12px, 3.4vw, 16px)",
                lineHeight: 1.1,
                transform: "translateX(-50%)",
              }}
        >
          {island.hoverLabel.text}
        </div>
      </motion.div>
    </Outer>
  );
}

function DesktopRoute({ route }) {
  return (
    <div
      className="absolute flex items-center justify-center"
      data-explore-route
      data-reveal-from={route.revealFrom}
      style={{
        left: pctX(route.left),
        top: pctY(route.top),
        width: cqw(route.boxWidth),
        height: cqw(route.boxHeight),
      }}
    >
      <div
        className="relative flex-none"
        style={{
          width: cqw(route.width),
          height: cqw(route.height),
          transform: route.transform,
        }}
      >
        <Image src={route.src} alt="" fill sizes="22vw" className="pointer-events-none object-fill" />
      </div>
    </div>
  );
}

export default function ExploreChampal() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const geometryRef = useRef(null);
  const bodyLockRef = useRef(null);
  const [phase, setPhase] = useState("idle");
  const [flight, setFlight] = useState(null);
  const [activeWorld, setActiveWorld] = useState(null);
  const [activeInstance, setActiveInstance] = useState(null);
  const [activeDetail, setActiveDetail] = useState(null);
  const isSectionVisible = useInView(sectionRef, { amount: 0.05 });
  const reduceMotion = useReducedMotion();
  const activeWorldConfig = ISLANDS.find((island) => island.id === activeWorld);
  const ActiveWorldContent = activeWorldConfig?.component;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        const background = section.querySelector("[data-explore-parallax-bg]");
        const stage = section.querySelector("[data-explore-stage]");
        const center = section.querySelector("[data-explore-center]");
        const islands = gsap.utils.toArray("[data-explore-island='desktop']", section);
        const routes = gsap.utils.toArray("[data-explore-route]", section);

        if (reduceMotion) {
          gsap.set([center, ...islands, ...routes], {
            clearProps: "all",
            autoAlpha: 1,
          });
          return;
        }

        routes.forEach((route) => {
          const from = route.dataset.revealFrom;
          const clipPath =
            from === "right"
              ? "inset(0 0 0 100%)"
              : from === "left"
                ? "inset(0 100% 0 0)"
                : "inset(0 0 100% 0)";

          gsap.set(route, {
            autoAlpha: 0,
            clipPath,
          });
        });

        gsap.set(center, {
          y: 115,
          scale: 0.93,
          autoAlpha: 0,
          transformOrigin: "50% 100%",
        });

        gsap.set(islands, {
          y: 175,
          scale: 0.88,
          autoAlpha: 0,
          transformOrigin: "50% 100%",
        });

        const entrance = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        });

        entrance
          .to(center, {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.82,
            ease: "back.out(1.7)",
          })
          .to(
            islands,
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.11,
              ease: "back.out(1.75)",
            },
            "-=0.48",
          )
          .to(
            routes,
            {
              autoAlpha: 1,
              clipPath: "inset(0 0 0 0)",
              duration: 0.58,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.18",
          );

        if (background) {
          gsap.fromTo(
            background,
            { yPercent: -5 },
            {
              yPercent: 7,
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

        if (stage) {
          gsap.fromTo(
            stage,
            { yPercent: 2.2 },
            {
              yPercent: -2.2,
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

    mm.add("(max-width: 1023px)", () => {
      const ctx = gsap.context(() => {
        if (reduceMotion) return;

        const center = section.querySelector("[data-explore-center-mobile]");
        const islands = gsap.utils.toArray("[data-explore-island='mobile']", section);

        gsap.from([center, ...islands], {
          y: 70,
          autoAlpha: 0,
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 84%",
            once: true,
          },
        });
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

  const openIsland = useCallback((island, trigger, visual, instanceId) => {
    if (!island.enabled || phase !== "idle" || !visual?.isConnected) return;
    const visualImage = visual.querySelector("img");
    if (!visualImage?.complete || visualImage.naturalWidth === 0) return;

    const rect = visual.getBoundingClientRect();
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

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;

    triggerRef.current = trigger;
    geometryRef.current = visual;
    setActiveWorld(island.id);
    setActiveInstance(instanceId);
    setFlight({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      src: island.src,
      origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    });
    setPhase("flying");
  }, [phase]);

  const closeOverlay = useCallback(() => {
    if (activeDetail) {
      setActiveDetail(null);
      return;
    }

    setPhase((current) => {
      if (current === "idle" || current === "closing") return current;

      const visual = geometryRef.current;
      if (visual?.isConnected) {
        const rect = visual.getBoundingClientRect();
        setFlight((currentFlight) => currentFlight && ({
          ...currentFlight,
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        }));
      }

      return "closing";
    });
  }, [activeDetail]);

  const finishClose = useCallback(() => {
    restoreBody();
    setPhase("idle");
    setFlight(null);
    setActiveWorld(null);
    setActiveInstance(null);
    setActiveDetail(null);
    geometryRef.current = null;
    requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true });
      triggerRef.current = null;
    });
  }, [restoreBody]);

  return (
    <section
      ref={sectionRef}
      id="vida-estudiantil"
      data-section="conoce-champal"
      className="relative overflow-hidden"
      style={{
        marginTop: "-150px",
        paddingTop: "150px",
        zIndex: 1,
        backgroundColor: "#0A2540",
      }}
    >
      {/* Fondo propio de Explore. Sube debajo del final de Niveles y se
          desvanece al final para entregar limpiamente a Historia. */}
      <div
        data-explore-base-bg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: SECTION_BACKGROUND,
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 calc(100% - 125px), rgba(0,0,0,0.86) calc(100% - 102px), rgba(0,0,0,0.42) calc(100% - 54px), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 calc(100% - 125px), rgba(0,0,0,0.86) calc(100% - 102px), rgba(0,0,0,0.42) calc(100% - 54px), transparent 100%)",
        }}
      />

      <EducationalBackground />

      {/* Desktop: canvas exacto de Figma, limitado a 1440 × 760. */}
      <div
        data-explore-stage
        className="relative z-10 mx-auto hidden aspect-[1440/760] w-full max-w-[1440px] lg:block"
        style={{ containerType: "inline-size" }}
      >
        <div className="absolute inset-0 z-10">
          {ROUTES.map((route) => (
            <DesktopRoute key={route.src} route={route} />
          ))}
        </div>

        <div
          data-explore-center
          className="absolute z-20"
          style={{ left: pctX(524), top: pctY(116), width: cqw(393), height: cqw(322) }}
        >
          <Image
            src={`${IMAGE_ROOT}/campus-central.webp`}
            alt="Campus central de Colegio Champal"
            fill
            sizes="27.3vw"
            className="object-contain"
          />
        </div>

        <div className="absolute inset-0 z-20">
          {ISLANDS.map((island) => (
            <Island
              key={island.name}
              island={island}
              desktop
              instanceId={`desktop-${island.name}`}
              isSectionVisible={isSectionVisible}
              reduceMotion={reduceMotion}
              hidden={activeInstance === `desktop-${island.name}`}
              onActivate={openIsland}
            />
          ))}
        </div>
      </div>

      {/* Mobile/tablet: adaptación básica, legible y sin superposiciones. */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-8 lg:hidden sm:px-8 sm:py-10">
        <div data-explore-center-mobile className="relative z-20 mx-auto aspect-[393/322] w-[82%] max-w-[393px]">
          <Image
            src={`${IMAGE_ROOT}/campus-central.webp`}
            alt="Campus central de Colegio Champal"
            fill
            sizes="82vw"
            className="object-contain"
          />
        </div>

        <div className="relative z-20 mt-4 grid grid-cols-2 gap-2 sm:gap-5">
          {ISLANDS.map((island) => (
            <Island
              key={island.name}
              island={island}
              instanceId={`mobile-${island.name}`}
              isSectionVisible={isSectionVisible}
              reduceMotion={reduceMotion}
              hidden={activeInstance === `mobile-${island.name}`}
              onActivate={openIsland}
            />
          ))}
        </div>
      </div>

      {phase !== "idle" && flight && activeWorldConfig && ActiveWorldContent && (
        <CircularCurtainOverlay
          phase={phase}
          origin={flight.origin}
          flight={flight}
          reduceMotion={reduceMotion}
          ariaLabel={activeDetail === "rayados" ? "Escuela Oficial Rayados de Monterrey" : activeWorldConfig.ariaLabel}
          closeAriaLabel={activeDetail === "rayados" ? "Volver a Actividades extracurriculares" : "Volver a Conoce Champal"}
          onClose={closeOverlay}
          onFlightComplete={() => setPhase((current) => (current === "flying" ? "revealing" : current))}
          onOpened={() => setPhase((current) => (current === "revealing" ? "open" : current))}
          onClosed={finishClose}
        >
          {activeDetail === "rayados" ? (
            <Rayados />
          ) : activeWorld === "actividades-extracurriculares" ? (
            <ActiveWorldContent onOpenRayados={() => setActiveDetail("rayados")} />
          ) : (
            <ActiveWorldContent />
          )}
        </CircularCurtainOverlay>
      )}
    </section>
  );
}
