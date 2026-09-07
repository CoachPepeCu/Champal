"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ChampalWaveGridIntro from "@/components/hero/ChampalWaveGridIntro"
import ChampalRingCarousel from "@/components/hero/ChampalRingCarousel"
import ChampalMosaicScreen from "@/components/hero/ChampalMosaicScreen"

export default function ChampalHeroSequence() {
  const [ringRevealed, setRingRevealed] = useState(false)
  const introTransitionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!introTransitionRef.current || !ringRevealed) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const root = introTransitionRef.current!
      const ringLayer = root.querySelector<HTMLElement>(".single-ring-layer")

      if (!ringLayer) return

      gsap.set(ringLayer, {
        y: 0,
        scale: 1,
        rotationX: 0,
        opacity: 1,
        transformOrigin: "50% 50%",
        transformPerspective: 1400,
        force3D: true,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      // Fade out continuo durante TODO el pequeño tramo de transición.
      // No hay salto ni segundo escenario simulado.
      tl.to(ringLayer, {
        y: 110,
        scale: 0.93,
        rotationX: -7,
        opacity: 0,
        duration: 1,
        ease: "none",
        force3D: true,
      })
    }, introTransitionRef)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [ringRevealed])

  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        overflowX: "clip",
        background: "#012A69",
      }}
    >
      {/*
        01 + 02 + transición:
        UN SOLO anillo vive en este stage sticky.
        WaveGrid lo cubre al inicio y lo revela con la explosión.
      */}
      <section
        ref={introTransitionRef}
        aria-label="Introducción y comunidad Champal"
        style={{
          position: "relative",
          width: "100%",
          height: ringRevealed ? "calc(100svh + 260px)" : "100vh",
          background: "#012A69",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            backgroundImage: 'url("/images/Fondo Azul Cuadrícula.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          {/* ÚNICO anillo */}
          <div
            className="single-ring-layer"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              willChange: "transform, opacity",
            }}
          >
            {ringRevealed ? <ChampalRingCarousel /> : null}
          </div>

          {/* WaveGrid encima del anillo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              pointerEvents: ringRevealed ? "none" : "auto",
            }}
          >
            <ChampalWaveGridIntro
              onExplode={() => {
                setRingRevealed(true)
              }}
            />
          </div>

        </div>
      </section>

      {/* 03 — Mosaico real */}
      <section
        aria-label="Experiencia Champal"
        style={{
          position: "relative",
          width: "100%",
          // El solape de 64 px sólo existe DESPUÉS de la explosión.
          // Antes, el HERO WaveGrid debe ocupar el viewport completo sin que
          // el mosaico invada visualmente su borde inferior.
          marginTop: ringRevealed ? "-64px" : "0px",
          zIndex: 3,
        }}
      >
        <ChampalMosaicScreen integrated />
      </section>
    </main>
  )
}
