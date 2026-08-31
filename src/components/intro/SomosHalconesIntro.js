"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { Meow_Script } from "next/font/google";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import styles from "./SomosHalconesIntro.module.css";

const varsity = localFont({ src: "../../fonts/varsity-regular.ttf" });
const meowScript = Meow_Script({ subsets: ["latin"], weight: "400" });

const HALCON_PATH_COUNT = 123;
const INTRO_DURATION = 7150;

// Fisher-Yates con LCG de semilla fija: idéntico en servidor, cliente y replay.
function deterministicOrder(length, seed = 12891303) {
  const order = Array.from({ length }, (_, index) => index);
  let state = seed >>> 0;
  const random = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }
  return order;
}

const PIECE_ORDER = deterministicOrder(HALCON_PATH_COUNT);
const PIECE_RANK = PIECE_ORDER.reduce((ranks, pieceIndex, rank) => {
  ranks[pieceIndex] = rank;
  return ranks;
}, []);

export default function SomosHalconesIntro({
  onComplete,
  onSkip,
  autoPlay = true,
  showReplayControl = true,
}) {
  const reduceMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [stage, setStage] = useState(autoPlay ? "playing" : "complete");
  const falconRef = useRef(null);
  const skipRef = useRef(null);
  const previousFocusRef = useRef(null);
  const timersRef = useRef([]);
  const skippedRef = useRef(false);
  const completionReportedRef = useRef(false);
  const visibleStage = stage === "playing";

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  }, []);

  const finish = useCallback((skipped = false) => {
    skippedRef.current ||= skipped;
    clearTimers();
    setStage(skippedRef.current ? "skipped" : "complete");
  }, [clearTimers]);

  const reportCompletion = useCallback(() => {
    if (completionReportedRef.current) return;
    completionReportedRef.current = true;
    if (skippedRef.current) onSkip?.();
    onComplete?.();
    requestAnimationFrame(() => previousFocusRef.current?.focus?.({ preventScroll: true }));
  }, [onComplete, onSkip]);

  const start = useCallback(() => {
    clearTimers();
    skippedRef.current = false;
    completionReportedRef.current = false;
    setRun((value) => value + 1);
    setStage("playing");
  }, [clearTimers]);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      clearTimers();
      previousFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [clearTimers]);

  useEffect(() => {
    if (stage !== "playing") return undefined;
    if (reduceMotion) {
      const id = window.setTimeout(() => finish(false), 180);
      timersRef.current = [id];
      return clearTimers;
    }

    const completed = window.setTimeout(() => finish(false), INTRO_DURATION);
    timersRef.current = [completed];
    return clearTimers;
  }, [clearTimers, finish, reduceMotion, run, stage]);

  useEffect(() => {
    const object = falconRef.current;
    if (!object) return undefined;

    const prepareSvg = () => {
      const svgDocument = object.contentDocument;
      if (!svgDocument) return;
      const paths = Array.from(svgDocument.querySelectorAll("#Halcon > path"));
      if (paths.length !== HALCON_PATH_COUNT) return;

      let style = svgDocument.getElementById("somos-halcones-motion");
      if (!style) {
        style = svgDocument.createElementNS("http://www.w3.org/2000/svg", "style");
        style.id = "somos-halcones-motion";
        style.textContent = `
          #Halcon > path { transform-box: fill-box; transform-origin: center; }
          #Halcon.intro-assemble > path {
            opacity: 0;
            animation: intro-piece-in 420ms cubic-bezier(.22,1,.36,1) forwards;
            animation-delay: var(--piece-delay);
          }
          @keyframes intro-piece-in {
            from { opacity: 0; transform: translate(var(--piece-x), var(--piece-y)) scale(.75) rotate(var(--piece-r)); }
            to { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            #Halcon.intro-assemble > path { opacity: 1; animation: none; }
          }
        `;
        svgDocument.documentElement.prepend(style);
      }

      paths.forEach((path, index) => {
        const rank = PIECE_RANK[index];
        path.style.setProperty("--piece-delay", `${4900 + rank * 11 + ((rank * 17) % 9)}ms`);
        path.style.setProperty("--piece-x", `${((index * 11) % 9) - 4}px`);
        path.style.setProperty("--piece-y", `${((index * 7) % 11) - 5}px`);
        path.style.setProperty("--piece-r", `${((index * 13) % 7) - 3}deg`);
      });

      const group = svgDocument.getElementById("Halcon");
      group.classList.remove("intro-assemble");
      void group.getBoundingClientRect();
      if (!reduceMotion) group.classList.add("intro-assemble");
      object.dataset.ready = "true";
    };

    object.addEventListener("load", prepareSvg);
    prepareSvg();
    return () => {
      object.removeEventListener("load", prepareSvg);
      delete object.dataset.ready;
    };
  }, [reduceMotion, run]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Escape" && stage !== "complete") {
      event.preventDefault();
      finish(true);
    } else if (event.key === "Tab" && visibleStage) {
      event.preventDefault();
      skipRef.current?.focus({ preventScroll: true });
    }
  }, [finish, stage, visibleStage]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <main className={styles.page} data-stage={stage} data-run={run}>
      <div className={styles.homePlaceholder} aria-hidden="true">
        <span>HOME Champal</span>
      </div>

      <AnimatePresence onExitComplete={reportCompletion}>
        {visibleStage && (
          <motion.section
            key={run}
            className={styles.intro}
            aria-label="Introducción Somos Halcones"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.01 }}
          >
            <motion.div
              className={styles.scene}
              initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.4, duration: reduceMotion ? 0.01 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/intro-somos-halcones/colegio.png"
                alt="Edificio del Colegio Champal"
                fill
                priority
                sizes="100vw"
                className={styles.building}
              />

              <div className={styles.copy}>
                <div className={`${styles.somosMask} ${meowScript.className}`}>
                  <span className={styles.somos}>Somos</span>
                </div>
                <h1 className={`${styles.halcones} ${varsity.className}`} aria-label="HALCONES">
                  {Array.from("HALCONES").map((letter, index) => (
                    <span key={`${letter}-${index}`} className={styles.letter} aria-hidden="true" style={{ "--letter-index": index }}>
                      {letter}
                    </span>
                  ))}
                  <span className={styles.srOnly}>HALCONES</span>
                  <i className={styles.sparkleOne} aria-hidden="true" />
                  <i className={styles.sparkleTwo} aria-hidden="true" />
                </h1>
              </div>

              <div className={styles.falcon} aria-hidden="true">
                <object
                  ref={falconRef}
                  key={run}
                  className={styles.falconObject}
                  data="/images/intro-somos-halcones/halcon.svg"
                  type="image/svg+xml"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>
            </motion.div>

            <button ref={skipRef} type="button" className={styles.skip} onClick={() => finish(true)}>
              Saltar intro
            </button>

            <motion.div
              className={styles.openingCurtain}
              aria-hidden="true"
              initial={{ clipPath: "circle(150vmax at 72% 48%)" }}
              animate={{ clipPath: reduceMotion ? "circle(0 at 72% 48%)" : "circle(0 at 72% 48%)" }}
              transition={{ delay: reduceMotion ? 0 : 0.42, duration: reduceMotion ? 0.01 : 0.76, ease: [0.76, 0, 0.24, 1] }}
            />

          </motion.section>
        )}
      </AnimatePresence>

      {(stage === "complete" || stage === "skipped") && showReplayControl && (
        <button type="button" className={styles.replay} onClick={start}>
          Repetir intro
        </button>
      )}
    </main>
  );
}
