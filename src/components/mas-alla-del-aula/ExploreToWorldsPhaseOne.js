"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Cambridge from "@/components/Cambridge";
import CraftSection from "@/components/CRAFT/CraftSection";
import FeelHero from "@/components/FEEL/FeelHero";
import ExploreChampal from "@/components/ExploreChampal";
import CircularCurtainOverlay from "@/components/effects/CircularCurtainOverlay";
import PlanetaOrbital from "@/components/hero/PlanetaOrbital";
import Rayados from "@/components/rayados/Rayados";
import { EXPLORE_TO_WORLDS as CONFIG } from "./exploreToWorlds.config";
import { ORBITAL_CANVAS, ORBITAL_PLANETS } from "./orbitalPlanets.config";
import styles from "./ExploreToWorldsPhaseOne.module.css";

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const phase = (progress, start, end) => clamp01((progress - start) / (end - start));
const smooth = (value) => value * value * (3 - 2 * value);
const mix = (from, to, progress) => from + (to - from) * progress;
const PLANET_DESTINATIONS = {
  cambridge: { type: "overlay", ariaLabel: "Explorar Cambridge" },
  ihs: {
    type: "link",
    href: "/niveles/preparatoria?origen=planetas#international-high-school",
    ariaLabel: "Explorar International High School",
  },
  rayados: { type: "overlay", ariaLabel: "Explorar Rayados" },
  craft: { type: "overlay", ariaLabel: "Explorar CRAFT" },
  feel: { type: "overlay", ariaLabel: "Explorar FEEL" },
};

function balloonYAtProgress(balloonProgress) {
  if (balloonProgress <= 0.72) {
    return mix(CONFIG.balloonStartY, CONFIG.canvasHeight * 0.3, smooth(phase(balloonProgress, 0, 0.72)));
  }

  if (balloonProgress <= 0.88) {
    return mix(CONFIG.canvasHeight * 0.3, 0, smooth(phase(balloonProgress, 0.72, 0.88)));
  }

  return mix(0, CONFIG.balloonEndY, smooth(phase(balloonProgress, 0.88, 1)));
}

function membranePath({ anchorX, curtainAnchorY, progress }) {
  const { canvasWidth, curtainRestY, curtainFinalY } = CONFIG;
  const shoulders = smooth(phase(progress, 0.43, 0.9));
  const edges = smooth(phase(progress, 0.55, 1));
  const finish = phase(progress, CONFIG.balloonExitProgress + 0.02, CONFIG.curtainFinishProgress);

  const tensionY = mix(curtainAnchorY, curtainFinalY, finish);
  const liftedNearY = mix(curtainRestY + 10, tensionY + 92, shoulders);
  const nearY = mix(liftedNearY, curtainFinalY, finish);
  const farY = mix(curtainRestY + 18, curtainFinalY, edges);
  const shapeOffset = 1 - finish;

  const leftShoulderX = Math.max(90, anchorX - 310);
  const rightShoulderX = Math.min(canvasWidth - 90, anchorX + 365);

  return [
    `M 0 ${farY}`,
    `C ${leftShoulderX * 0.36} ${farY - 4 * shapeOffset}, ${leftShoulderX * 0.7} ${nearY + 28 * shapeOffset}, ${leftShoulderX} ${nearY}`,
    `C ${anchorX - 190} ${nearY - 30 * shapeOffset}, ${anchorX - 82} ${tensionY + 8 * shapeOffset}, ${anchorX} ${tensionY}`,
    `C ${anchorX + 74} ${tensionY + 12 * shapeOffset}, ${rightShoulderX - 170} ${nearY - 18 * shapeOffset}, ${rightShoulderX} ${nearY}`,
    `C ${rightShoulderX + 126} ${nearY + 34 * shapeOffset}, ${canvasWidth - 150} ${farY + 8 * shapeOffset}, ${canvasWidth} ${farY}`,
    `L ${canvasWidth} ${CONFIG.canvasHeight}`,
    `L 0 ${CONFIG.canvasHeight}`,
    "Z",
  ].join(" ");
}

export default function ExploreToWorldsPhaseOne() {
  const [activePlanetIds, setActivePlanetIds] = useState(() => new Set());
  const [planetOverlay, setPlanetOverlay] = useState(null);
  const [planetOverlayPhase, setPlanetOverlayPhase] = useState("idle");
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const balloonRef = useRef(null);
  const anchoredVideoRef = useRef(null);
  const turnVideoRef = useRef(null);
  const earthRef = useRef(null);
  const planetRefs = useRef(new Map());
  const activePlanetIdsRef = useRef(new Set());
  const planetTriggerRef = useRef(null);
  const messageHeadlineRef = useRef(null);
  const messagePaperRef = useRef(null);
  const curtainPathRef = useRef(null);

  const openPlanetOverlay = useCallback((planet, trigger) => {
    if (planetOverlayPhase !== "idle") return;

    const rect = trigger.getBoundingClientRect();
    planetTriggerRef.current = trigger;
    setPlanetOverlay({
      id: planet.id,
      origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      flight: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        src: planet.texture,
      },
    });
    setPlanetOverlayPhase("revealing");
  }, [planetOverlayPhase]);

  const closePlanetOverlay = useCallback(() => {
    setPlanetOverlayPhase((current) => (
      current === "idle" || current === "closing" ? current : "closing"
    ));
  }, []);

  const finishPlanetOverlayClose = useCallback(() => {
    setPlanetOverlayPhase("idle");
    setPlanetOverlay(null);
    requestAnimationFrame(() => planetTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    if (!planetOverlay) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [planetOverlay]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const balloon = balloonRef.current;
    const anchoredVideo = anchoredVideoRef.current;
    const turnVideo = turnVideoRef.current;
    const earth = earthRef.current;
    const messageHeadline = messageHeadlineRef.current;
    const messagePaper = messagePaperRef.current;
    const curtainPath = curtainPathRef.current;
    if (
      !root ||
      !viewport ||
      !balloon ||
      !anchoredVideo ||
      !turnVideo ||
      !earth ||
      !messageHeadline ||
      !messagePaper ||
      !curtainPath
    ) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const state = { progress: 0 };
    const setBalloonY = gsap.quickSetter(balloon, "y", "px");
    const setAnchoredOpacity = gsap.quickSetter(anchoredVideo, "opacity");
    const setTurnOpacity = gsap.quickSetter(turnVideo, "opacity");
    const setEarthY = gsap.quickSetter(earth, "y", "px");
    const setEarthScale = gsap.quickSetter(earth, "scale");
    const setEarthOpacity = gsap.quickSetter(earth, "opacity");
    const setMessageHeadlineY = gsap.quickSetter(messageHeadline, "y", "px");
    const setMessageHeadlineOpacity = gsap.quickSetter(messageHeadline, "opacity");
    const setMessagePaperY = gsap.quickSetter(messagePaper, "y", "px");
    const setMessagePaperScaleY = gsap.quickSetter(messagePaper, "scaleY");
    const setMessagePaperOpacity = gsap.quickSetter(messagePaper, "opacity");
    const headlineEase = gsap.parseEase("back.out(1.15)");
    const paperEase = gsap.parseEase("back.out(1.3)");
    const planetSetters = new Map(
      ORBITAL_PLANETS.map((planet) => {
        const element = planetRefs.current.get(planet.id);
        return [
          planet.id,
          element
            ? {
                opacity: gsap.quickSetter(element, "opacity"),
                scale: gsap.quickSetter(element, "scale"),
                y: gsap.quickSetter(element, "y", "px"),
              }
            : null,
        ];
      }),
    );

    const render = () => {
      const progress = state.progress;
      const viewportRect = viewport.getBoundingClientRect();
      const balloonProgress = phase(progress, CONFIG.liftStartProgress, CONFIG.balloonExitProgress);
      const balloonY = balloonYAtProgress(balloonProgress);
      const crossfadeProgress = smooth(
        phase(progress, CONFIG.balloonCrossfadeStart, CONFIG.balloonCrossfadeEnd),
      );
      const earthProgress = smooth(phase(progress, CONFIG.earthStartProgress, CONFIG.earthEndProgress));
      const headlineProgress = phase(progress, CONFIG.messageHeadlineStart, CONFIG.messageHeadlineEnd);
      const paperProgress = phase(progress, CONFIG.messagePaperStart, CONFIG.messagePaperEnd);
      const headlineMotion = headlineEase(headlineProgress);
      const paperMotion = paperEase(paperProgress);
      const paperRiseProgress = smooth(
        phase(paperProgress, 0, CONFIG.messagePaperContactProgress),
      );
      const paperSettleProgress = smooth(
        phase(paperProgress, CONFIG.messagePaperContactProgress, 1),
      );
      const paperY =
        paperProgress <= CONFIG.messagePaperContactProgress
          ? mix(CONFIG.messagePaperEntryY, CONFIG.messagePaperBounceY, paperRiseProgress)
          : mix(CONFIG.messagePaperBounceY, 0, paperSettleProgress);
      setBalloonY(balloonY * (viewportRect.height / CONFIG.canvasHeight));
      setAnchoredOpacity(1 - crossfadeProgress);
      setTurnOpacity(crossfadeProgress);
      setEarthY(mix(CONFIG.earthEntryY, 0, earthProgress) * (viewportRect.height / CONFIG.canvasHeight));
      setEarthScale(mix(CONFIG.earthEntryScale, 1, earthProgress));
      setEarthOpacity(earthProgress);
      setMessageHeadlineY(
        mix(CONFIG.messageHeadlineEntryY, 0, headlineMotion) *
          (viewportRect.height / ORBITAL_CANVAS.height),
      );
      setMessageHeadlineOpacity(smooth(headlineProgress));
      setMessagePaperY(
        paperY * (viewportRect.height / ORBITAL_CANVAS.height),
      );
      setMessagePaperScaleY(mix(CONFIG.messagePaperEntryScaleY, 1, paperMotion));
      setMessagePaperOpacity(smooth(paperProgress));
      anchoredVideo.style.visibility = crossfadeProgress >= 1 ? "hidden" : "visible";

      const nextActivePlanetIds = new Set();
      ORBITAL_PLANETS.forEach((planet) => {
        const timing = CONFIG.planetEntries[planet.id];
        const entryProgress = smooth(phase(progress, timing.start, timing.end));
        const setters = planetSetters.get(planet.id);
        setters?.opacity(entryProgress);
        setters?.scale(mix(CONFIG.planetEntryScale, 1, entryProgress));
        setters?.y(
          mix(CONFIG.planetEntryY, 0, entryProgress) *
            (viewportRect.height / ORBITAL_CANVAS.height),
        );
        if (progress >= timing.end) nextActivePlanetIds.add(planet.id);
      });

      const activePlanetsChanged =
        nextActivePlanetIds.size !== activePlanetIdsRef.current.size ||
        [...nextActivePlanetIds].some((id) => !activePlanetIdsRef.current.has(id));
      if (activePlanetsChanged) {
        activePlanetIdsRef.current = nextActivePlanetIds;
        setActivePlanetIds(new Set(nextActivePlanetIds));
      }

      if (Number.isFinite(turnVideo.duration) && turnVideo.duration > 0) {
        const finalFrameTime = Math.max(0, turnVideo.duration - 1 / 30);
        const targetTime = finalFrameTime * crossfadeProgress;
        if (Math.abs(turnVideo.currentTime - targetTime) > 1 / 60) {
          turnVideo.currentTime = targetTime;
        }
      }

      const anchoredRect = anchoredVideo.getBoundingClientRect();
      const turnRect = turnVideo.getBoundingClientRect();
      const scaleX = CONFIG.canvasWidth / viewportRect.width;
      const scaleY = CONFIG.canvasHeight / viewportRect.height;
      const anchoredAnchorX =
        (anchoredRect.left - viewportRect.left + anchoredRect.width * CONFIG.ropeAnchorOffsetX) * scaleX;
      const anchoredAnchorY =
        (anchoredRect.top - viewportRect.top + anchoredRect.height * CONFIG.ropeAnchorOffsetY) * scaleY;
      const turnAnchorX =
        (turnRect.left - viewportRect.left + turnRect.width * CONFIG.turnRopeAnchorOffsetX) * scaleX;
      const turnAnchorY =
        (turnRect.top - viewportRect.top + turnRect.height * CONFIG.turnRopeAnchorOffsetY) * scaleY;
      const anchorX = mix(anchoredAnchorX, turnAnchorX, crossfadeProgress);
      const anchorY = mix(anchoredAnchorY, turnAnchorY, crossfadeProgress);
      const curtainProgress = clamp01((balloonProgress - CONFIG.curtainLag) / (1 - CONFIG.curtainLag));
      const curtainAnchorY =
        curtainProgress > 0
          ? Math.max(CONFIG.curtainFinalY, anchorY + CONFIG.curtainSafetyGap)
          : CONFIG.curtainRestY;

      curtainPath.setAttribute("d", membranePath({ anchorX, curtainAnchorY, progress }));
    };

    const context = gsap.context(() => {
      gsap.set(balloon, {
        x: 0,
        y: CONFIG.balloonStartY * (viewport.getBoundingClientRect().height / CONFIG.canvasHeight),
        force3D: true,
      });
      gsap.set(earth, {
        y: CONFIG.earthEntryY * (viewport.getBoundingClientRect().height / CONFIG.canvasHeight),
        scale: CONFIG.earthEntryScale,
        opacity: 0,
        force3D: true,
      });
      planetRefs.current.forEach((planet) => {
        gsap.set(planet, {
          y: CONFIG.planetEntryY * (viewport.getBoundingClientRect().height / ORBITAL_CANVAS.height),
          scale: CONFIG.planetEntryScale,
          opacity: 0,
          force3D: true,
        });
      });
      gsap.set(messageHeadline, {
        y: CONFIG.messageHeadlineEntryY * (viewport.getBoundingClientRect().height / ORBITAL_CANVAS.height),
        opacity: 0,
        force3D: true,
      });
      gsap.set(messagePaper, {
        y: CONFIG.messagePaperEntryY * (viewport.getBoundingClientRect().height / ORBITAL_CANVAS.height),
        scaleY: CONFIG.messagePaperEntryScaleY,
        opacity: 0,
        force3D: true,
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${CONFIG.scrollDistance + CONFIG.finalHoldDistance}`,
          pin: viewport,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(state, { progress: 1, duration: CONFIG.scrollDistance, onUpdate: render })
        .to({}, { duration: CONFIG.finalHoldDistance });
      render();
    }, root);

    const handleResize = () => render();
    window.addEventListener("resize", handleResize);
    turnVideo.addEventListener("loadedmetadata", render);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", handleResize);
      turnVideo.removeEventListener("loadedmetadata", render);
      context.revert();
    };
  }, []);

  return (
    <section id="planetas" ref={rootRef} className={styles.root} aria-label="Transición de Explore Champal al universo">
      <div ref={viewportRef} className={styles.viewport}>
        <div className={styles.exploreLayer}>
          <ExploreChampal />
        </div>

        <svg
          className={styles.curtain}
          viewBox={`0 0 ${CONFIG.canvasWidth} ${CONFIG.canvasHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="explore-to-worlds-curtain" clipPathUnits="userSpaceOnUse">
              <path ref={curtainPathRef} />
            </clipPath>
          </defs>
          <foreignObject
            x="0"
            y="0"
            width={CONFIG.canvasWidth}
            height={CONFIG.canvasHeight}
            clipPath="url(#explore-to-worlds-curtain)"
          >
            <video
              className={styles.universeVideo}
              src="/videos/Universo-loop.webm"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </foreignObject>
        </svg>

        <div
          ref={earthRef}
          className={styles.earth}
          style={{
            left: `${(CONFIG.earthLeft / CONFIG.canvasWidth) * 100}%`,
            top: `${(CONFIG.earthTop / CONFIG.canvasHeight) * 100}%`,
            width: `${(CONFIG.earthWidth / CONFIG.canvasWidth) * 100}%`,
          }}
          aria-hidden="true"
        >
          <img src="/images/hero/Tierra Parcial.webp" alt="" />
        </div>

        <div className={styles.planets} aria-label="Mundos de Champal">
          {ORBITAL_PLANETS.map((planet) => {
            const isFeelPlanet =
              typeof planet.label === "string" &&
              planet.label.toLocaleLowerCase("es-MX").includes("feel");
            const destinationId = isFeelPlanet ? "feel" : planet.id;
            const destination = PLANET_DESTINATIONS[destinationId];
            const isPlanetActive = activePlanetIds.has(planet.id);
            const orbital = (
              <PlanetaOrbital
                active={isPlanetActive}
                label={planet.label}
                texture={planet.texture}
                diameter={`${(planet.orbitDiameter / ORBITAL_CANVAS.width) * 100}cqw`}
                orbitRadius={`${(planet.orbitRadius / ORBITAL_CANVAS.width) * 100}cqw`}
                orbitDuration={planet.orbitDuration}
                orbitArc={planet.orbitArc}
                floatDuration={planet.floatDuration}
                floatOffset={`${(planet.floatAmplitude / ORBITAL_CANVAS.width) * 100}cqw`}
                fontSize={`${(planet.fontSize / ORBITAL_CANVAS.width) * 100}cqw`}
                glow={planet.glow}
              />
            );

            return (
              <div
                key={planet.id}
                ref={(node) => {
                  if (node) planetRefs.current.set(planet.id, node);
                  else planetRefs.current.delete(planet.id);
                }}
                className={styles.planetEntry}
                style={{
                  left: `${(planet.left / ORBITAL_CANVAS.width) * 100}%`,
                  top: `${(planet.top / ORBITAL_CANVAS.height) * 100}%`,
                  width: `${(planet.width / ORBITAL_CANVAS.width) * 100}%`,
                  height: `${(planet.height / ORBITAL_CANVAS.height) * 100}%`,
                }}
              >
                {destination?.type === "link" && (
                  <a
                    className={`${styles.planetControl} ${styles.planetControlIhs}`}
                    href={destination.href}
                    aria-label={destination.ariaLabel}
                    tabIndex={isPlanetActive ? 0 : -1}
                    style={{ pointerEvents: isPlanetActive ? "auto" : "none" }}
                    onKeyDown={(event) => {
                      if (event.key === " ") {
                        event.preventDefault();
                        event.currentTarget.click();
                      }
                    }}
                  >
                    {orbital}
                  </a>
                )}
                {destination?.type === "overlay" && (
                  <button
                    type="button"
                    className={styles.planetControl}
                    aria-label={destination.ariaLabel}
                    aria-haspopup="dialog"
                    tabIndex={isPlanetActive ? 0 : -1}
                    style={{ pointerEvents: isPlanetActive ? "auto" : "none" }}
                    onClick={(event) =>
                      openPlanetOverlay(
                        destinationId === planet.id
                          ? planet
                          : { ...planet, id: destinationId },
                        event.currentTarget,
                      )
                    }
                  >
                    {orbital}
                  </button>
                )}
                {!destination && <div className={styles.planetVisual}>{orbital}</div>}
              </div>
            );
          })}
        </div>

        <div className={styles.messageLayer} aria-label="Experiencias que amplían su mundo y dejan huella en su formación">
          <p
            ref={messageHeadlineRef}
            className={styles.messageHeadline}
            style={{
              left: `${(CONFIG.messageHeadlineLeft / ORBITAL_CANVAS.width) * 100}%`,
              top: `${(CONFIG.messageHeadlineTop / ORBITAL_CANVAS.height) * 100}%`,
              fontSize: `${(CONFIG.messageHeadlineFontSize / ORBITAL_CANVAS.width) * 100}cqw`,
            }}
          >
            Experiencias que amplían su mundo y
          </p>
          <div
            ref={messagePaperRef}
            className={styles.messagePaper}
            style={{
              left: `${(CONFIG.messagePaperLeft / ORBITAL_CANVAS.width) * 100}%`,
              top: `${(CONFIG.messagePaperTop / ORBITAL_CANVAS.height) * 100}%`,
              width: `${(CONFIG.messagePaperWidth / ORBITAL_CANVAS.width) * 100}%`,
              height: `${(CONFIG.messagePaperHeight / ORBITAL_CANVAS.height) * 100}%`,
            }}
          >
            <img src="/images/hero/papel-rasgado.png" alt="" />
            <p
              style={{
                left: `${(CONFIG.messagePaperTextLeft / CONFIG.messagePaperWidth) * 100}%`,
                top: `${(CONFIG.messagePaperTextTop / CONFIG.messagePaperHeight) * 100}%`,
                fontSize: `${(CONFIG.messagePaperFontSize / ORBITAL_CANVAS.width) * 100}cqw`,
              }}
            >
              dejan huella en su formación
            </p>
          </div>
        </div>

        <div
          ref={balloonRef}
          className={styles.balloon}
          style={{
            left: `${(CONFIG.balloonStartX / CONFIG.canvasWidth) * 100}%`,
            width: `${(CONFIG.balloonWidth / CONFIG.canvasWidth) * 100}%`,
          }}
        >
          <video
            ref={anchoredVideoRef}
            className={styles.balloonVideo}
            style={{
              transform: `translate(${CONFIG.anchoredOffsetX}px, ${CONFIG.anchoredOffsetY}px) scale(${CONFIG.anchoredScale})`,
            }}
            src="/videos/balloon-anchored-alpha.webm"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Globo aerostático"
          />
          <video
            ref={turnVideoRef}
            className={styles.balloonVideo}
            style={{
              transform: `translate(${CONFIG.turnOffsetX}px, ${CONFIG.turnOffsetY}px) scale(${CONFIG.turnScale})`,
            }}
            src="/videos/balloon-turn-alpha.webm"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>
      </div>

      {planetOverlay && planetOverlayPhase !== "idle" && (
        <CircularCurtainOverlay
          phase={planetOverlayPhase}
          origin={planetOverlay.origin}
          flight={planetOverlay.flight}
          reduceMotion={reduceMotion}
          ariaLabel={
            planetOverlay.id === "cambridge"
              ? "Cambridge English"
              : planetOverlay.id === "craft"
                ? "Taller CRAFT"
                : planetOverlay.id === "feel"
                  ? "Aula FEEL"
                  : "Escuela Oficial Rayados de Monterrey"
          }
          closeAriaLabel={
            planetOverlay.id === "cambridge"
              ? "Cerrar Cambridge English"
              : planetOverlay.id === "craft"
                ? "Cerrar Taller CRAFT"
                : planetOverlay.id === "feel"
                  ? "Cerrar Aula FEEL"
                  : "Cerrar Escuela Oficial Rayados"
          }
          onClose={closePlanetOverlay}
          onFlightComplete={() => {}}
          onOpened={() => setPlanetOverlayPhase((current) => (current === "revealing" ? "open" : current))}
          onClosed={finishPlanetOverlayClose}
          showFlight={false}
        >
          {planetOverlay.id === "cambridge" && <Cambridge />}
          {planetOverlay.id === "rayados" && <Rayados />}
          {planetOverlay.id === "craft" && <CraftSection />}
          {planetOverlay.id === "feel" && (
            <div
              className="feel-overlay-shell"
              style={{
                position: "relative",
                width: "100%",
                height: "100dvh",
                overflow: "hidden",
                background: "#8f66b8",
              }}
            >
              <div
                data-feel-scroll-root
                className="feel-overlay-scroller"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflowY: "auto",
                  overflowX: "clip",
                  overscrollBehavior: "contain",
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  background: "#8f66b8",
                }}
              >
                <FeelHero />
              </div>

              <div
                className="feel-scroll-indicator"
                aria-hidden="true"
              >
                <span className="feel-scroll-chevron" />
              </div>

              <style>{`
                .feel-overlay-scroller::-webkit-scrollbar {
                  width: 0;
                  height: 0;
                  display: none;
                }

                .feel-scroll-indicator {
                  position: absolute;
                  left: 50%;
                  bottom: 18px;
                  z-index: 90;
                  width: 34px;
                  height: 34px;
                  transform: translateX(-50%);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  pointer-events: none;
                  filter: drop-shadow(0 2px 7px rgba(52, 17, 78, 0.38));
                }

                .feel-scroll-chevron {
                  width: 15px;
                  height: 15px;
                  border-right: 3px solid rgba(255, 255, 255, 0.96);
                  border-bottom: 3px solid rgba(255, 255, 255, 0.96);
                  transform: rotate(45deg);
                  animation: feel-scroll-pulse 1.65s ease-in-out infinite;
                }

                @keyframes feel-scroll-pulse {
                  0%, 100% {
                    opacity: 0.34;
                    transform: translateY(-3px) rotate(45deg);
                  }
                  50% {
                    opacity: 1;
                    transform: translateY(5px) rotate(45deg);
                  }
                }

                @media (prefers-reduced-motion: reduce) {
                  .feel-scroll-chevron {
                    animation: none;
                    opacity: 0.9;
                  }
                }
              `}</style>
            </div>
          )}
        </CircularCurtainOverlay>
      )}
    </section>
  );
}

