"use client";

import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import RayadosDesktopFrame from "./RayadosDesktopFrame";
import RayadosMobileStack from "./RayadosMobileStack";
import RayadosCards from "./RayadosCards";

function findScrollContainer(element) {
  let current = element?.parentElement;
  while (current && current !== document.body) {
    const { overflowY } = window.getComputedStyle(current);
    if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
      return current;
    }
    current = current.parentElement;
  }
  return window;
}

function facetOrder(svg) {
  const viewBox = svg.viewBox.baseVal;
  const centerX = viewBox.x + viewBox.width / 2;
  const centerY = viewBox.y + viewBox.height * 0.34;

  return [...svg.querySelectorAll("path, polygon, polyline")]
    .map((facet, index) => {
      const box = facet.getBBox();
      const x = box.x + box.width / 2;
      const y = box.y + box.height / 2;
      const normalizedX = (x - centerX) / Math.max(1, viewBox.width / 2);
      const normalizedY = (y - centerY) / Math.max(1, viewBox.height / 2);
      return {
        facet,
        index,
        normalizedX,
        normalizedY,
        distance: Math.hypot(normalizedX, normalizedY),
      };
    })
    .sort((a, b) => a.distance - b.distance || a.index - b.index);
}

// Frame "Rayados" (Figma node 1240:1190, canvas ~1440x1365) — SOLO el
// contenido visual/responsivo: encabezado con cancha/portería/portero,
// jugador ilustrado, bloque "SE PARTE DE / HALCONES CHAMPAL-RAYADOS /
// ESCUELA OFICIAL DE FÚTBOL" + halcón geométrico, franja de pasto y las
// cuatro tarjetas con hover/foco/toque. Deliberadamente SIN Header, Footer,
// botón Halcón, controles de cierre/regreso, navegación ni overlay — ver
// README.md de esta carpeta para el alcance completo y por qué.
export default function Rayados() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || reduceMotion) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const scroller = findScrollContainer(section);
    const scrollConfig = scroller === window ? {} : { scroller };
    const media = gsap.matchMedia();

    const setup = (query, mobile) => {
      media.add(query, () => {
        const frame = section.querySelector(mobile ? "[data-rayados-mobile]" : "[data-rayados-desktop]");
        if (!frame) return undefined;

        const hero = frame.querySelector("[data-rayados-hero]");
        const background = frame.querySelector("[data-rayados-hero-bg]");
        const player = frame.querySelector("[data-rayados-player]");
        const heroTitle = frame.querySelector("[data-rayados-hero-title]");
        const titles = frame.querySelectorAll("[data-rayados-central-title]");
        const lines = frame.querySelectorAll("[data-rayados-line]");
        const hawkObject = frame.querySelector("[data-rayados-hawk]");

        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top 88%",
            toggleActions: "play none none reverse",
            ...scrollConfig,
          },
        });
        heroTimeline
          .fromTo(player, { x: mobile ? -20 : -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0)
          .fromTo(heroTitle, { yPercent: 100, opacity: 0, clipPath: "inset(0 0 100% 0)" }, { yPercent: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.78, ease: "power3.out" }, 0.12);

        gsap.fromTo(background, { yPercent: -4, scale: 1.03 }, {
          yPercent: 4,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
            ...scrollConfig,
          },
        });

        let centralTimeline;
        const buildCentralTimeline = () => {
          const svg = hawkObject?.contentDocument?.querySelector("svg");
          if (!svg || centralTimeline) return;
          const orderedFacets = facetOrder(svg);
          const maxX = mobile ? 15 : 30;
          const maxY = mobile ? 12 : 25;
          const maxRotation = mobile ? 3 : 6;

          centralTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top-=1",
              toggleActions: "play none none reverse",
              ...scrollConfig,
            },
          });

          centralTimeline
            .fromTo(titles[0], { y: mobile ? 8 : 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.34, ease: "power2.out" }, 0)
            .fromTo(titles[1], { y: mobile ? 28 : 42, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.2)
            .fromTo(titles[2], { scale: 1.16, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.24, ease: "power2.out" }, 0.58);

          lines.forEach((line, index) => {
            centralTimeline.fromTo(
              line,
              { yPercent: 110, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.32, ease: "power2.out" },
              0.82 + index * 0.14,
            );
          });

          const hawkStart = 0.82 + Math.max(0, lines.length - 1) * 0.14 + 0.3;
          orderedFacets.forEach(({ facet, index, normalizedX, normalizedY }, orderIndex) => {
            const rank = orderedFacets.length > 1 ? orderIndex / (orderedFacets.length - 1) : 0;
            const jitterX = Math.sin((index + 1) * 2.17) * maxX * 0.35;
            const jitterY = Math.cos((index + 1) * 1.63) * maxY * 0.35;
            centralTimeline.fromTo(
              facet,
              {
                x: normalizedX * maxX + jitterX,
                y: normalizedY * maxY + jitterY,
                scale: 0.85 + ((index * 7) % 10) / 100,
                rotation: Math.sin((index + 1) * 1.31) * maxRotation,
                opacity: 0,
                transformOrigin: "center center",
              },
              {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: mobile ? 0.2 : 0.26,
                ease: "power2.out",
              },
              hawkStart + rank * (mobile ? 0.72 : 0.9),
            );
          });
          centralTimeline.scrollTrigger?.refresh();
        };

        hawkObject?.addEventListener("load", buildCentralTimeline);
        buildCentralTimeline();

        return () => {
          hawkObject?.removeEventListener("load", buildCentralTimeline);
          heroTimeline.kill();
          centralTimeline?.kill();
        };
      });
    };

    setup("(min-width: 768px)", false);
    setup("(max-width: 767px)", true);

    const teamPhoto = section.querySelector("[data-rayados-team-photo]");
    const cards = [...section.querySelectorAll("[data-rayados-card]")];
    const photoTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: teamPhoto,
        start: "top 84%",
        toggleActions: "play none none reverse",
        ...scrollConfig,
      },
    });
    photoTimeline.fromTo(
      teamPhoto,
      { y: 64, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.68, ease: "power3.out" },
    );

    const cardsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section.querySelector("[data-rayados-cards]"),
        start: "top 84%",
        toggleActions: "play none none reverse",
        ...scrollConfig,
      },
    });
    cards.forEach((card, index) => {
      const heading = card.querySelector("[data-rayados-card-heading]");
      const line = card.querySelector("[data-rayados-card-rule]");
      const image = card.querySelector("[data-rayados-card-image]");
      const at = index * 0.18;
      cardsTimeline
        .fromTo(image, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58, ease: "power3.out" }, at)
        .fromTo([heading, line], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: "power2.out" }, at + 0.08);
    });

    return () => {
      photoTimeline.scrollTrigger?.kill();
      photoTimeline.kill();
      cardsTimeline.scrollTrigger?.kill();
      cardsTimeline.kill();
      media.revert();
    };
  }, [reduceMotion]);

  return (
    <section ref={sectionRef} aria-label="Escuela Oficial Rayados de Monterrey" className="w-full bg-white">
      <RayadosMobileStack />
      <RayadosDesktopFrame />
      <div data-rayados-team-stack className="bg-white">
        <div data-rayados-team-photo className="aspect-[1344/752] w-full">
          <Image
            src="/images/rayados/rayados-equipo.webp"
            alt="Equipo de la Escuela Oficial Rayados de Monterrey en Champal"
            width={1344}
            height={752}
            sizes="100vw"
            className="block h-full w-full object-cover"
          />
        </div>
        <div data-rayados-cards className="py-10 md:py-12 lg:py-14">
          <RayadosCards />
        </div>
      </div>
    </section>
  );
}
