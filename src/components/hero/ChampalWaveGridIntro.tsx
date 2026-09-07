"use client"

import { useEffect, useRef, useState } from "react"
import WaveGrid from "@/components/WaveGrid"

type ChampalWaveGridIntroProps = {
  onExplode?: () => void
}

export default function ChampalWaveGridIntro({
  onExplode,
}: ChampalWaveGridIntroProps) {
  const [logoHover, setLogoHover] = useState(false)
  const [explodeSignal, setExplodeSignal] = useState(0)
  const [exploded, setExploded] = useState(false)
  const explodedRef = useRef(false)

  const triggerExplosion = () => {
    if (explodedRef.current) return
    explodedRef.current = true
    setLogoHover(false)
    setExploded(true)
    onExplode?.()
    setExplodeSignal((value) => value + 1)
  }

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      // Solo el gesto natural de "scroll down" dispara la transición.
      if (event.deltaY <= 0 || explodedRef.current) return

      // Mientras este HERO está activo, consumimos el primer scroll hacia abajo
      // para convertirlo en la transición de explosión.
      event.preventDefault()
      triggerExplosion()
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [])

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <style>{`
        @keyframes champalRadioWave {
          0% {
            transform: translate(-50%, -50%) scale(0.34);
            opacity: 0;
          }
          10% {
            opacity: 0.96;
          }
          48% {
            opacity: 0.62;
          }
          72% {
            opacity: 0.16;
          }
          88% {
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.35);
            opacity: 0;
          }
        }

        .champal-logo-wave {
          position: absolute;
          /* Centro visual ligeramente a la izquierda del centro geométrico,
             aproximadamente entre la "a" y la "m" de CHAMPAL. */
          left: 50%;
          top: 51%;
          width: 190px;
          height: 190px;
          box-sizing: border-box;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.34);
          animation: champalRadioWave 2.35s cubic-bezier(0.2, 0.72, 0.22, 1) infinite;
          animation-play-state: paused;
          transition: opacity 120ms ease;
        }

        .champal-logo-wave.wave-1 {
          border: 10px solid rgba(255, 255, 255, 0.98);
          animation-delay: 0ms;
        }

        .champal-logo-wave.wave-2 {
          border: 8px solid rgba(255, 255, 255, 0.94);
          animation-delay: 420ms;
        }

        .champal-logo-wave.wave-3 {
          border: 6px solid rgba(255, 255, 255, 0.90);
          animation-delay: 840ms;
        }

        .champal-logo-button[data-hover="true"] .champal-logo-wave {
          animation-play-state: running;
          opacity: 1;
        }

        .champal-logo-button[data-hover="false"] .champal-logo-wave {
          animation: none;
          opacity: 0;
        }

        @keyframes champalScrollArrowPulse {
          0%, 100% {
            transform: translateX(-50%) translateY(-3px);
            opacity: 0.35;
          }
          50% {
            transform: translateX(-50%) translateY(7px);
            opacity: 1;
          }
        }

        .champal-scroll-down {
          position: absolute;
          left: 50%;
          bottom: 28px;
          z-index: 6;
          width: 42px;
          height: 42px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #000061;
          cursor: pointer;
          transform: translateX(-50%);
          transition: opacity 220ms ease;
          animation: champalScrollArrowPulse 1.55s ease-in-out infinite;
        }

        .champal-scroll-down:hover {
          opacity: 1;
        }

        .champal-scroll-down-arrow {
          position: absolute;
          left: 50%;
          top: 46%;
          width: 18px;
          height: 18px;
          border-right: 2.5px solid #000061;
          border-bottom: 2.5px solid #000061;
          transform: translate(-50%, -50%) rotate(45deg);
          transform-origin: center;
          pointer-events: none;
        }
      `}</style>

      {/* Fondo blanco del HERO.
          Mantiene la pantalla inicial completamente blanca.
          Durante la explosión se desvanece para revelar el anillo que está debajo. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "#ffffff",
          opacity: exploded ? 0 : 1,
          transition: exploded
            ? "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)"
            : "none",
          pointerEvents: "none",
        }}
      />

      {/* Wave Grid */}
      <WaveGrid
        explodeSignal={explodeSignal}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      />

      {/*
        Referencia Figma 1440 × 760:
        x = 467, y = 303, width = 466, height = 194.
      */}
      <button
        type="button"
        className="champal-logo-button"
        data-hover={logoHover && !exploded ? "true" : "false"}
        onMouseEnter={() => {
          if (!exploded) setLogoHover(true)
        }}
        onMouseLeave={() => setLogoHover(false)}
        onFocus={() => {
          if (!exploded) setLogoHover(true)
        }}
        onBlur={() => setLogoHover(false)}
        onClick={triggerExplosion}
        aria-label="Abrir experiencia Champal"
        style={{
          position: "absolute",
          zIndex: 5,
          left: "50%",
          top: "39.87%",
          width: "clamp(280px, 32.36vw, 466px)",
          padding: 0,
          border: 0,
          background: "transparent",
          cursor: "pointer",
          transform: `translateX(-50%) scale(${logoHover && !exploded ? 1.035 : 1})`,
          opacity: exploded ? 0 : 1,
          pointerEvents: exploded ? "none" : "auto",
          transition:
            "transform 300ms cubic-bezier(0.22,1,0.36,1), opacity 420ms ease",
          overflow: "visible",
        }}
      >
        {/* Ondas concéntricas detrás del logo */}
        <span className="champal-logo-wave wave-1" aria-hidden="true" />
        <span className="champal-logo-wave wave-2" aria-hidden="true" />
        <span className="champal-logo-wave wave-3" aria-hidden="true" />

        <img
          src="/Logo Champal Original.svg"
          alt="Colegio Champal"
          draggable={false}
          style={{
            position: "relative",
            zIndex: 2,
            display: "block",
            width: "100%",
            height: "auto",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </button>

      {/* Invitación secundaria: click o rueda hacia abajo disparan la misma transición. */}
      <button
        type="button"
        className="champal-scroll-down"
        onClick={triggerExplosion}
        aria-label="Scroll down"
        style={{
          opacity: exploded ? 0 : 1,
          pointerEvents: exploded ? "none" : "auto",
        }}
      >
        <span className="champal-scroll-down-arrow" aria-hidden="true" />
      </button>
    </main>
  )
}
