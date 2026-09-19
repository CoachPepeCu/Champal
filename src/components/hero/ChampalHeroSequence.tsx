"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ChampalWaveGridIntro from "@/components/hero/ChampalWaveGridIntro"
import ChampalRingCarousel from "@/components/hero/ChampalRingCarousel"
import ChampalMosaicScreen from "@/components/hero/ChampalMosaicScreen"
import ChampalLevelsIntro from "@/components/hero/ChampalLevelsIntro"
import HomeVerticalNav from "@/components/hero/HomeVerticalNav"

export default function ChampalHeroSequence() {
  const [ringRevealed, setRingRevealed] = useState(false)
  const [restoringRing, setRestoringRing] = useState(false)
  const introTransitionRef = useRef<HTMLElement | null>(null)

  // Si regresamos desde una página de nivel cuyo origen fue el anillo,
  // reconstruimos directamente esa escena en vez de mostrar el Grid.
  useLayoutEffect(() => {
    if (window.location.hash !== "#anillo") return

    // Al volver desde una página interior NO debemos reconstruir la transición
    // del Grid. Entramos directamente a la escena ya revelada del anillo.
    setRestoringRing(true)
    setRingRevealed(true)

    const restoreRing = () => {
      const target = document.getElementById("anillo")
      if (target) {
        target.scrollIntoView({ block: "start", behavior: "auto" })
      }
    }

    restoreRing()
    const raf = requestAnimationFrame(restoreRing)
    const timer = window.setTimeout(restoreRing, 120)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!introTransitionRef.current || !ringRevealed) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const root = introTransitionRef.current!
      const ringLayer = root.querySelector<HTMLElement>(".single-ring-layer")
      const valueCards = gsap.utils.toArray<HTMLElement>(
        ".champal-value-card",
        root,
      )

      if (!ringLayer || valueCards.length !== 6) return

      // Estado inicial: escena completa visible; Valores fuera de cuadro.
      gsap.set(ringLayer, {
        y: 0,
        opacity: 1,
        force3D: true,
      })

      gsap.set(valueCards, {
        y: 190,
        opacity: 0,
        scale: 0.96,
        transformOrigin: "50% 100%",
        force3D: true,
      })

      // FASE 1 — damos espacio real a la fila inferior.
      // Toda la escena sube 210 px y el anillo permanece totalmente visible.
      gsap.to(ringLayer, {
        y: -210,
        opacity: 1,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "top+=160 top",
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      })

      // FASE 2 — una tarjeta por tramo de scroll.
      // Cada tarjeta sube, aparece y SE QUEDA visible.
      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top+=160 top",
          end: "top+=460 top",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      })

      valueCards.forEach((card, index) => {
        cardsTl.to(
          card,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "none",
            force3D: true,
          },
          index,
        )
      })

      // De 460 a 560 px dejamos la composición completa:
      // anillo presente + seis Valores acomodados.
      // Después termina el sticky. A partir de ahí el flujo natural de página
      // hace subir TODO el bloque anterior, incluidas las tarjetas, mientras
      // entra la primera fila del mosaico desde abajo.
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
      <section
        id="anillo"
        ref={introTransitionRef}
        aria-label="Introducción y comunidad Champal"
        style={{
          position: "relative",
          width: "100%",
          // Flujo:
          // 160px subir escena + 300px Valores secuenciales + 100px lectura.
          height: ringRevealed ? "calc(100svh + 560px)" : "100vh",
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
          <div
            className="single-ring-layer"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              willChange: "transform",
            }}
          >
            {ringRevealed ? <ChampalRingCarousel /> : null}
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              pointerEvents: ringRevealed ? "none" : "auto",
              // Si llegamos por /#anillo desde una página interior, el Grid no
              // debe quedar visualmente encima del anillo. En la navegación
              // normal se conserva intacta su animación de explosión.
              display: restoringRing ? "none" : "block",
            }}
          >
            <ChampalWaveGridIntro
              onExplode={() => {
                setRingRevealed(true)
              }}
            />
          </div>

          {/* Navegación vertical exclusiva de Home.
              Vive dentro del stage sticky: aparece en WaveGrid + Carrusel
              y desaparece naturalmente al entrar al Mosaico. */}
          {ringRevealed ? (
            <HomeVerticalNav levelOrigin="anillo" />
          ) : (
            <HomeVerticalNav levelOrigin="grid" />
          )}
        </div>
      </section>

      {/* Pantalla de colores:
          sin solape artificial ni fade.
          Entra por scroll natural cuando termina el sticky anterior. */}
      <section
        aria-label="Experiencia Champal"
        style={{
          position: "relative",
          width: "100%",
          marginTop: 0,
          zIndex: 3,
        }}
      >
        <ChampalMosaicScreen integrated />
      </section>

      {/* Niveles + edificio + IHS:
          entra por flujo natural después del mosaico. */}
      <section
        id="niveles-educativos"
        aria-label="Niveles educativos Champal"
        style={{
          position: "relative",
          width: "100%",
          marginTop: 0,
          zIndex: 4,
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 calc(100% - 150px), rgba(0,0,0,0.92) calc(100% - 132px), rgba(0,0,0,0.58) calc(100% - 82px), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 calc(100% - 150px), rgba(0,0,0,0.92) calc(100% - 132px), rgba(0,0,0,0.58) calc(100% - 82px), transparent 100%)",
        }}
      >
        <ChampalLevelsIntro />
      </section>
    </main>
  )
}
