"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type ChampalMosaicScreenProps = {
  integrated?: boolean
}

export default function ChampalMosaicScreen({
  integrated = false,
}: ChampalMosaicScreenProps) {
  const base = "/images/HeroMosaico"
  const wrapperRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const root = wrapperRef.current!
      const row1 = Array.from(root.querySelectorAll<HTMLElement>(".mosaic-row-1"))
      const row2 = Array.from(root.querySelectorAll<HTMLElement>(".mosaic-row-2"))
      const row3 = Array.from(root.querySelectorAll<HTMLElement>(".mosaic-row-3"))

      const title1 = root.querySelector<HTMLElement>(".mosaic-title-1")
      const title2 = root.querySelector<HTMLElement>(".mosaic-title-2")
      const title3 = root.querySelector<HTMLElement>(".mosaic-title-3")

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: integrated ? "top bottom" : "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      const setCurvedRow = (row: HTMLElement[], depth = 170, maxAngle = 34) => {
        const count = row.length
        const center = (count - 1) / 2

        row.forEach((el, index) => {
          const offset = index - center
          const normalized = center === 0 ? 0 : offset / center
          const abs = Math.abs(normalized)

          // Curva cilíndrica: los extremos giran hacia el centro y retroceden en Z.
          const rotationY = -normalized * maxAngle
          const z = -(abs ** 1.55) * depth

          // Compensación horizontal para mantener la fila visualmente unida.
          const x = -normalized * abs * 42

          gsap.set(el, {
            y: window.innerHeight,
            x,
            z,
            rotationY,
            opacity: 0,
            transformPerspective: 1100,
            transformOrigin: normalized < 0 ? "100% 50%" : normalized > 0 ? "0% 50%" : "50% 50%",
            force3D: true,
          })
        })
      }

      const animateCurvedRow = (row: HTMLElement[]) => {
        tl.to(row, {
          y: 0,
          x: 0,
          z: 0,
          rotationY: 0,
          opacity: 1,
          duration: 1,
          ease: "none",
          force3D: true,
        })
      }

      const bounceTitleVertical = (title: HTMLElement | null) => {
        if (!title) return

        // Rebote únicamente de las letras: arriba -> abajo -> arriba -> reposo.
        // El bloque de color permanece completamente fijo.
        tl.to(title, {
          y: -28,
          duration: 0.10,
          ease: "power3.out",
        })
          .to(title, {
            y: 18,
            duration: 0.11,
            ease: "power2.in",
          })
          .to(title, {
            y: -12,
            duration: 0.09,
            ease: "power2.out",
          })
          .to(title, {
            y: 7,
            duration: 0.075,
            ease: "power2.inOut",
          })
          .to(title, {
            y: -4,
            duration: 0.065,
            ease: "power2.out",
          })
          .to(title, {
            y: 0,
            duration: 0.06,
            ease: "power2.out",
          })
      }

      if (integrated) {
        // En integración, la FILA 1 ya pertenece al mosaico real.
        // Empieza sin el desplazamiento extra de 100vh porque el propio
        // contenedor entra desde la parte inferior del viewport.
        setCurvedRow(row1)
        row1.forEach((el) => {
          gsap.set(el, { y: 0 })
        })
      } else {
        setCurvedRow(row1)
      }

      setCurvedRow(row2)
      setCurvedRow(row3)

      // Se conserva exactamente la entrada cilíndrica que ya teníamos.
      // Al terminar de acomodarse cada fila, rebota sólo su texto.
      animateCurvedRow(row1)
      bounceTitleVertical(title1)

      animateCurvedRow(row2)
      bounceTitleVertical(title2)

      animateCurvedRow(row3)
      bounceTitleVertical(title3)

      ScrollTrigger.refresh()
    }, wrapperRef)

    return () => ctx.revert()
  }, [integrated])

  return (
    <section ref={wrapperRef} className="mosaic-scroll-wrapper">
      <div className="mosaic-section" id="screen-02">
      <div className="mosaic-stage">
        {/* FILA SUPERIOR */}
        <div className="block edge-bleed top-yellow mosaic-row-1" />

        <div className="media-block video-01 mosaic-row-1">
          <video
            src={`${base}/Video01.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>

        <div className="text-block text-potential mosaic-row-1">
          <h2 className="mosaic-title mosaic-title-1">
            Descubrimos
            <br />
            nuestro potencial
          </h2>
        </div>

        <div className="media-block video-02 mosaic-row-1">
          <video
            src={`${base}/Video02.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>

        <div className="icon-block butterfly-block mosaic-row-1">
          <img
            src={`${base}/Mariposa.svg`}
            alt=""
            className="icon butterfly"
          />
        </div>

        {/* FILA CENTRAL */}
        <div className="icon-block airplane-block mosaic-row-2">
          <img
            src={`${base}/Avion.svg`}
            alt=""
            className="icon airplane"
          />
        </div>

        <div className="media-block video-03 mosaic-row-2">
          <video
            src={`${base}/Video03.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>

        <div className="text-block text-purpose mosaic-row-2">
          <h2 className="mosaic-title mosaic-title-2">
            Crecemos con
            <br />
            propósito
          </h2>
        </div>

        <div className="media-block video-04 mosaic-row-2">
          <video
            src={`${base}/Video04.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>

        <div className="block edge-bleed orange-side mosaic-row-2" />

        {/* FILA INFERIOR */}
        <div className="block edge-bleed green-side mosaic-row-3" />

        <div className="media-block video-05 mosaic-row-3">
          <video
            src={`${base}/Video05.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>

        <div className="text-block text-experiences mosaic-row-3">
          <h2 className="mosaic-title mosaic-title-3">
            Vivimos nuevas
            <br />
            experiencias
          </h2>
        </div>

        <div className="media-block video-06 mosaic-row-3">
          <video
            src={`${base}/Video06.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>

        <div className="icon-block star-block mosaic-row-3">
          <img
            src={`${base}/Estrella.svg`}
            alt=""
            className="icon star"
          />
        </div>
      </div>
      </div>

      <style jsx>{`
        .mosaic-scroll-wrapper {
          --blue: #124bea;
          --light-blue: #4894ee;
          --yellow: #ffc700;
          --red: #ff151c;
          --green: #2db927;
          --orange: #ff6800;

          position: relative;
          width: 100%;
          height: 400vh;
          background: #012A69;
        }

        .mosaic-section {
          position: sticky;
          top: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-image: url("/images/Fondo Azul Cuadrícula.webp");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }


        .mosaic-row-1,
        .mosaic-row-2,
        .mosaic-row-3 {
          opacity: 0;
          transform: translate3d(0, 100vh, 0);
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform, opacity;
        }

        .mosaic-title {
          will-change: transform;
        }

        .mosaic-stage {
          position: relative;
          perspective: 1100px;
          transform-style: preserve-3d;
          width: min(100vw, calc(100vh * 1440 / 760));
          height: min(100vh, calc(100vw * 760 / 1440));
          flex-shrink: 0;
          overflow: visible;
          background: transparent;
        }

        .block,
        .media-block,
        .text-block,
        .icon-block {
          position: absolute;
        }

        .media-block {
          overflow: hidden;
        }

        .media-block video {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        /* FILA 01 */
        .top-yellow {
          left: calc(0% - 50vw);
          top: 1.3158%;
          width: calc(7.7083% + 50vw);
          height: 31.5789%;
          background: var(--yellow);
        }

        .video-01 {
          left: 7.7083%;
          top: 1.3158%;
          width: 16.6667%;
          height: 31.5789%;
        }

        .text-potential {
          left: 24.375%;
          top: 1.1842%;
          width: 33.3333%;
          height: 31.5789%;
          background: var(--blue);
          border-radius: 0 16px 16px 0;
          padding: 0 20px;
        }

        .video-02 {
          left: 59.3056%;
          top: 0.7895%;
          width: 16.6667%;
          height: 31.5789%;
        }

        .butterfly-block {
          left: 75.9028%;
          top: 0.9211%;
          width: 15.9722%;
          height: 31.5789%;
          background: var(--red);
        }

        /* FILA 02 */
        .airplane-block {
          left: 7.7083%;
          top: 33.5526%;
          width: 15.4861%;
          height: 31.5789%;
          background: var(--red);
        }

        .video-03 {
          left: 23.1944%;
          top: 33.5526%;
          width: 16.6667%;
          height: 31.5789%;
        }

        .text-purpose {
          left: 39.7917%;
          top: 33.5526%;
          width: 34.7222%;
          height: 31.5789%;
          background: var(--yellow);
          border-radius: 0 16px 16px 0;
          padding: 0 20px;
        }

        .video-04 {
          left: 75.2778%;
          top: 33.5526%;
          width: 16.6667%;
          height: 31.5789%;
        }

        .orange-side {
          left: 91.875%;
          top: 33.5526%;
          width: calc(8.125% + 50vw);
          height: 31.5789%;
          background: var(--orange);
        }

        /* FILA 03 */
        .green-side {
          left: calc(0% - 50vw);
          top: 67.1053%;
          width: calc(7.2222% + 50vw);
          height: 31.5789%;
          background: var(--green);
        }

        .video-05 {
          left: 7.2222%;
          top: 67.1053%;
          width: 16.6667%;
          height: 31.5789%;
        }

        .text-experiences {
          left: 23.8889%;
          top: 67.1053%;
          width: 34.7222%;
          height: 31.5789%;
          background: var(--light-blue);
          border-radius: 0 16px 16px 0;
          padding: 0 30px;
        }

        .video-06 {
          left: 60%;
          top: 67.1053%;
          width: 16.6667%;
          height: 31.5789%;
        }

        .star-block {
          left: 76.6667%;
          top: 67.1053%;
          width: 15.9722%;
          height: 31.5789%;
          background: var(--red);
        }

        /* TEXTOS */
        .text-block {
          display: grid;
          align-items: center;
          overflow: hidden;
        }

        .text-block h2 {
          width: 100%;
          margin: 0;
          font-family: "Fredoka", sans-serif;
          font-weight: 600;
          font-size: clamp(22px, 3.3vw, 52px);
          line-height: 1.12;
          color: #ffffff;
          text-shadow:
            0 4px 7px rgba(0, 0, 0, 0.3),
            0 2px 2px rgba(0, 0, 0, 0.2);
        }

        .text-potential h2 {
          text-align: left;
        }

        .text-purpose h2 {
          text-align: right;
        }

        .text-experiences h2 {
          text-align: left;
        }

        /* SVG */
        .icon-block {
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .icon {
          display: block;
          object-fit: contain;
        }

        .butterfly {
          width: 90%;
          height: 85%;
        }

        .airplane {
          width: 90%;
          height: 75%;
        }

        .star {
          width: 88%;
          height: 88%;
        }

        @media (max-width: 900px) {
          .text-block h2 {
            font-size: clamp(16px, 3.3vw, 36px);
          }
        }
      `}</style>
    </section>
  )
}
