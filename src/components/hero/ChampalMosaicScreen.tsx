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
      const stage = root.querySelector<HTMLElement>(".mosaic-stage")
      if (!stage) return

      const row1 = gsap.utils.toArray<HTMLElement>(".mosaic-row-1", root)
      const row2 = gsap.utils.toArray<HTMLElement>(".mosaic-row-2", root)
      const row3 = gsap.utils.toArray<HTMLElement>(".mosaic-row-3", root)

      const rows = [row1, row2, row3]

      /*
       * Entrada 3D inspirada en HERO03:
       * cada pieza nace por debajo del stage, casi acostada,
       * y se levanta hacia el frente conforme avanza el scroll.
       *
       * IMPORTANTE:
       * - no hay fade-out;
       * - lo ya acomodado permanece visible;
       * - las filas se solapan en tiempo;
       * - al terminar la construcción, el sticky se libera
       *   y todo sale por el scroll natural de la página.
       */
      rows.forEach((row, rowIndex) => {
        row.forEach((el, pieceIndex) => {
          // El mosaico ya no nace desde el borde inferior del viewport.
          // Cada pieza comienza aproximadamente DOS CUADROS de la retícula
          // por debajo de su posición final (~100 px), mucho más profunda en Z
          // y prácticamente acostada sobre el plano.
          const startYOffset = 105 + rowIndex * 10

          const rotateVariants = [-89.2, -88.4, -89.6, -87.8, -88.9]
          const zVariants = [-1180, -1040, -1260, -1110, -1210]
          const xVariants = [-14, 10, -8, 12, -6]

          gsap.set(el, {
            y: startYOffset,
            x: xVariants[pieceIndex % xVariants.length],
            z: zVariants[pieceIndex % zVariants.length] - rowIndex * 90,
            rotateX: rotateVariants[pieceIndex % rotateVariants.length],
            rotateY: pieceIndex % 2 === 0 ? -1.6 : 1.6,
            rotateZ: pieceIndex % 3 === 0 ? -0.45 : pieceIndex % 3 === 1 ? 0.4 : 0,
            scale: 0.90,
            opacity: 1,
            transformOrigin: "50% 100%",
            transformPerspective: 850,
            force3D: true,
          })
        })
      })

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: integrated ? "top bottom" : "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      })

      const animateRow = (
        row: HTMLElement[],
        startAt: number,
        rowDuration: number,
        rowIndex: number,
      ) => {
        row.forEach((el, pieceIndex) => {
          const pieceStart = startAt + pieceIndex * 0.025

          timeline.to(
            el,
            {
              keyframes: [
                {
                  y: 82 + rowIndex * 8,
                  z: -760,
                  rotateX: -80,
                  rotateY: pieceIndex % 2 === 0 ? -1.2 : 1.2,
                  rotateZ: 0,
                  scale: 0.93,
                  duration: rowDuration * 0.28,
                  ease: "sine.out",
                },
                {
                  y: 48,
                  z: -390,
                  rotateX: -57,
                  rotateY: pieceIndex % 2 === 0 ? -0.6 : 0.6,
                  rotateZ: 0,
                  scale: 0.96,
                  duration: rowDuration * 0.28,
                  ease: "sine.out",
                },
                {
                  y: 22,
                  z: -135,
                  rotateX: -24,
                  rotateY: 0,
                  rotateZ: 0,
                  scale: 0.985,
                  duration: rowDuration * 0.24,
                  ease: "sine.out",
                },
                {
                  y: 0,
                  x: 0,
                  z: 0,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  scale: 1,
                  duration: rowDuration * 0.20,
                  ease: "power2.out",
                },
              ],
              force3D: true,
            },
            pieceStart,
          )
        })
      }

      // Solape intencional entre filas:
      // fila 2 empieza antes de que termine fila 1,
      // fila 3 empieza antes de que termine fila 2.
      animateRow(row1, 0.00, 0.46, 0)
      animateRow(row2, 0.28, 0.46, 1)
      animateRow(row3, 0.56, 0.46, 2)

      // Pequeño tramo final sin animación para contemplar
      // las tres filas ya acomodadas antes de liberar el sticky.
      timeline.to({}, { duration: 0.16 }, 0.96)

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
          <div className="shape-circle" aria-hidden="true" />
        </div>

        {/* FILA CENTRAL */}
        <div className="icon-block airplane-block mosaic-row-2">
          <div className="shape-arrow" aria-hidden="true" />
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
          <div className="shape-house" aria-hidden="true" />
        </div>
      </div>
      </div>

      <style jsx>{`
        .mosaic-scroll-wrapper {
          --blue-start: #004cff;
          --blue-end: #002e99;
          --light-blue-start: #4b93f0;
          --light-blue-end: #2a58a0;
          --yellow-start: #ffcc00;
          --yellow-end: #997a00;
          --yellow: #ffcc00;
          --red: #ff0008;
          --green: #34af27;
          --orange: #ff7b00;
          --shape: rgba(255, 255, 255, 0.5);

          position: relative;
          width: 100%;
          height: ${integrated ? "220vh" : "320vh"};
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
          opacity: 1;
          transform-style: preserve-3d;
          backface-visibility: visible;
          will-change: transform;
        }

        .mosaic-title {
          will-change: transform;
        }

        .mosaic-stage {
          position: relative;
          perspective: 760px;
          perspective-origin: 50% 68%;
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

        /* =========================================================
           FILA 01 — Figma 1440 × 760
           y ≈ 10 / alto 240
           ========================================================= */

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
          background: linear-gradient(90deg, var(--blue-start), var(--blue-end));
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
          overflow: hidden;
        }

        /* Medio círculo: sólo se ve la mitad izquierda dentro del bloque rojo */
        .shape-circle {
          position: absolute;
          left: 50%;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--shape);
          pointer-events: none;
        }

        /* =========================================================
           FILA 02 — y ≈ 255 / alto 240
           ========================================================= */

        .airplane-block {
          left: 7.7083%;
          top: 33.5526%;
          width: 15.4861%;
          height: 31.5789%;
          background: var(--red);
          overflow: hidden;
        }

        /* Triángulo/flecha rosa apuntando hacia la derecha */
        .shape-arrow {
          position: absolute;
          left: 0;
          top: 0;
          width: 56.05%;
          height: 100%;
          background: var(--shape);
          clip-path: polygon(0 0, 100% 50%, 0 100%);
          pointer-events: none;
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
          background: linear-gradient(90deg, var(--yellow-start), var(--yellow-end));
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

        /* =========================================================
           FILA 03 — y ≈ 510 / alto 240
           ========================================================= */

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
          background: linear-gradient(90deg, var(--light-blue-start), var(--light-blue-end));
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
          overflow: hidden;
        }

        /* Medio octágono 230 × 115, apoyado en el borde inferior
           del cuadro rojo y ocupando aproximadamente la mitad de su altura */
        .shape-house {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 48%;
          background: var(--shape);
          clip-path: polygon(
            50% 0%,
            13.5% 28%,
            0% 100%,
            100% 100%,
            86.5% 28%
          );
          pointer-events: none;
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

        @media (max-width: 900px) {
          .text-block h2 {
            font-size: clamp(16px, 3.3vw, 36px);
          }
        }
      `}</style>
    </section>
  )
}
