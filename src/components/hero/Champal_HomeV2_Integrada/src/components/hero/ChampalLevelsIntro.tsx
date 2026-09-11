"use client"

import Image from "next/image"
import Link from "next/link"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import TierraGiratoria from "@/components/hero/TierraGiratoria"

const STAGE = { width: 1440, height: 1517 } as const
const VIEWPORT_LOGICAL_HEIGHT = 760

const CARD = 250
const pc = (px: number) => `${((px / CARD) * 100).toFixed(3)}%`
const ccqw = (px: number) => `${((px / CARD) * 100).toFixed(3)}cqw`
const cqw = (px: number) => `${((px / 1440) * 100).toFixed(3)}cqw`
const RIBBON_GRADIENT = "linear-gradient(180deg, #0b6bd7 0%, #063871 100%)"
const PANEL_SHIFT = 18

type Box = { left: number; top: number; width: number; height: number }

type Level = {
  slug: string
  href: string
  label: string[]
  labelBox: Box
  labelFontSize: number
  labelTracking: number
  ribbon: Box
  photo: Box & { src: string; alt: string }
}

function VerticalLabel({
  box,
  fontSize,
  tracking,
  lines,
}: {
  box: Box
  fontSize: number
  tracking: number
  lines: string[]
}) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: pc(box.left),
        top: pc(box.top),
        width: pc(box.width),
        height: pc(box.height),
        transform: "translateX(-100%)",
      }}
    >
      <div
        className="flex-none whitespace-nowrap text-right font-display font-semibold text-white"
        style={{
          transform: "rotate(-90deg)",
          fontSize: ccqw(fontSize),
          lineHeight: ccqw(40),
          letterSpacing: ccqw(tracking),
        }}
      >
        {lines.map((line, i) => (
          <p key={i} className="m-0">
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

/*
 * IMPORTANTE:
 * Este bloque viene del Niveles.js funcional recuperado de Git.
 * Solo usa las nuevas fotos y ya no contiene stickers/estrellas/decals.
 */
const LEVELS: Level[] = [
  {
    slug: "prekinder",
    href: "/niveles/pre-kinder",
    label: ["PRE-", "KINDER"],
    labelBox: { left: 239.22, top: 35.56, width: 80, height: 167 },
    labelFontSize: 43.333,
    labelTracking: 2.1667,
    ribbon: { left: 157, top: -3, width: 90, height: 251 },
    photo: {
      src: "/images/niveles/Pre-Kinder.webp",
      alt: "Alumno de Pre-Kinder",
      left: 19,
      top: 2,
      width: 171,
      height: 248,
    },
  },
  {
    slug: "kinder",
    href: "/niveles/kinder",
    label: ["KINDER"],
    labelBox: { left: 235.89, top: 40.56, width: 40, height: 167 },
    labelFontSize: 43.333,
    labelTracking: 2.1667,
    ribbon: { left: 185.33, top: -2.44, width: 61.11, height: 250.56 },
    photo: {
      src: "/images/niveles/Kinder.webp",
      alt: "Alumna de Kinder",
      left: -51,
      top: 19,
      width: 250,
      height: 231,
    },
  },
  {
    slug: "primaria",
    href: "/niveles/primaria",
    label: ["PRIMARIA"],
    labelBox: { left: 227, top: 6.44, width: 40, height: 224 },
    labelFontSize: 43.333,
    labelTracking: 2.1667,
    ribbon: { left: 157, top: -3, width: 90, height: 250.556 },
    photo: {
      src: "/images/niveles/Primaria.webp",
      alt: "Alumna de Primaria",
      left: 0,
      top: 21,
      width: 199,
      height: 229,
    },
  },
  {
    slug: "secundaria",
    href: "/niveles/secundaria",
    label: ["SECUNDARIA"],
    labelBox: { left: 233.11, top: 30.44, width: 40, height: 193 },
    labelFontSize: 28,
    labelTracking: 1.4,
    ribbon: { left: 157, top: -3, width: 90, height: 251 },
    photo: {
      src: "/images/niveles/Secundaria.webp",
      alt: "Alumna de Secundaria",
      left: -11,
      top: 51,
      width: 218,
      height: 201,
    },
  },
  {
    slug: "preparatoria",
    href: "/niveles/preparatoria",
    label: ["PREPARATORIA"],
    labelBox: { left: 234.22, top: 9.22, width: 40, height: 227 },
    labelFontSize: 28,
    labelTracking: 1.4,
    ribbon: { left: 157, top: -3, width: 90, height: 250.556 },
    photo: {
      src: "/images/niveles/Prepartoria.webp",
      alt: "Alumno de Preparatoria",
      left: 2,
      top: 40,
      width: 206,
      height: 211,
    },
  },
]

function LevelCard({ level }: { level: Level }) {
  return (
    <Link
      href={`${level.href}?origen=niveles`}
      aria-label={`Conoce ${level.label.join(" ")}`}
      className="level-card group relative aspect-square shrink-0 rounded-[10px] transition-transform duration-300 ease-out hover:scale-[1.025] focus-visible:scale-[1.025] focus-visible:outline-none"
      style={{
        width: cqw(CARD),
        containerType: "inline-size",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 rounded-[22px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            "radial-gradient(closest-side, rgba(80,200,255,0.98), rgba(38,174,255,0.78) 48%, rgba(0,153,255,0.42) 68%, rgba(0,153,255,0) 84%)",
          filter: "blur(8px)",
        }}
      />

      <div className="relative h-full w-full overflow-hidden rounded-[10px] border-[3px] border-white bg-[#f0f0fa] shadow-[0px_2.222px_2.222px_0px_rgba(0,0,0,0.25)] transition-shadow duration-300 ease-out group-hover:shadow-[0_0_30px_9px_rgba(46,190,255,0.9)] group-focus-visible:shadow-[0_0_30px_9px_rgba(46,190,255,0.9)]">
        <div
          className="absolute"
          style={{
            left: pc(level.ribbon.left),
            top: pc(level.ribbon.top),
            width: pc(level.ribbon.width),
            height: pc(level.ribbon.height),
            backgroundImage: RIBBON_GRADIENT,
          }}
        />

        <VerticalLabel
          box={level.labelBox}
          fontSize={level.labelFontSize}
          tracking={level.labelTracking}
          lines={level.label}
        />

        <div
          className="absolute"
          style={{
            left: pc(level.photo.left),
            top: pc(level.photo.top),
            width: pc(level.photo.width),
            height: pc(level.photo.height),
          }}
        >
          <Image
            src={level.photo.src}
            alt={level.photo.alt}
            fill
            sizes="20vw"
            className="pointer-events-none object-cover"
          />
        </div>
      </div>
    </Link>
  )
}

function IhsBlock() {
  const ihsPctY = (px: number) => `${((px / 430) * 100).toFixed(3)}%`

  return (
    <Link
      href="/niveles/preparatoria?origen=niveles#international-high-school"
      aria-label="Conoce International High School"
      className="group absolute left-0 transition-transform duration-300 ease-out hover:scale-[1.01] focus-visible:scale-[1.01] focus-visible:outline-none"
      style={{
        top: 342,
        width: "100%",
        height: 430,
        transformOrigin: "50% 50%",
      }}
    >
      <div
        className="absolute transition-[filter] duration-300 ease-out group-hover:[filter:drop-shadow(0_0_8px_rgba(255,255,255,0.9))_drop-shadow(0_0_24px_rgba(125,211,252,0.9))] group-focus-visible:[filter:drop-shadow(0_0_8px_rgba(255,255,255,0.9))_drop-shadow(0_0_24px_rgba(125,211,252,0.9))]"
        style={{
          left: cqw(24),
          top: ihsPctY(-8 + PANEL_SHIFT),
          width: cqw(1402.88),
          height: ihsPctY(430.45),
        }}
      >
        <Image
          src="/images/niveles/pleca-inferior-ihs.svg"
          alt=""
          fill
          sizes="98vw"
          className="object-contain transition-opacity duration-300 ease-out group-hover:opacity-0 group-focus-visible:opacity-0"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, #7fa4c7 0%, #5B82A6 52%, #3f6489 100%)",
            WebkitMaskImage: "url(/images/niveles/pleca-inferior-ihs.svg)",
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskImage: "url(/images/niveles/pleca-inferior-ihs.svg)",
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: "contain",
          }}
        />
      </div>

      <div
        className="absolute"
        style={{
          left: cqw(597 - 30),
          top: ihsPctY(-60 - 30),
          width: cqw(320),
          height: cqw(320),
        }}
      >
        <Image
          src="/images/niveles/glow-ellipse.svg"
          alt=""
          fill
          sizes="22vw"
          className="object-contain"
        />
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{
          left: cqw(592),
          top: ihsPctY(-58),
          width: cqw(267),
          height: cqw(265),
        }}
      >
        <TierraGiratoria size={267} duration={18} />
      </div>

      <div
        className="absolute rounded-sm"
        style={{
          left: cqw(99),
          top: ihsPctY(74 + PANEL_SHIFT),
          width: cqw(56),
          height: cqw(6),
          backgroundColor: "#df3035",
        }}
      />

      <p
        className="absolute whitespace-nowrap font-sans font-semibold text-white"
        style={{
          left: cqw(173),
          top: ihsPctY(69 + PANEL_SHIFT),
          fontSize: cqw(13),
          lineHeight: cqw(16.25),
          letterSpacing: cqw(0.5),
        }}
      >
        EDUCACIÓN GLOBAL
      </p>

      <div
        className="absolute font-sans font-semibold text-white"
        style={{
          left: cqw(99),
          top: ihsPctY(99 + PANEL_SHIFT),
          width: cqw(291),
          fontSize: cqw(24),
          lineHeight: cqw(30),
        }}
      >
        <p className="m-0">Doble certificado,</p>
        <p className="m-0">misma formación humana.</p>
      </div>

      <p
        className="absolute font-display font-semibold text-white"
        style={{
          left: cqw(428),
          top: ihsPctY(258 + PANEL_SHIFT),
          width: cqw(700),
          fontSize: cqw(54),
          lineHeight: cqw(67.5),
          textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
          zIndex: 10,
        }}
      >
        International High School
      </p>

      <div
        className="absolute overflow-hidden"
        style={{
          left: cqw(41),
          top: ihsPctY(6 + PANEL_SHIFT - 9),
          width: cqw(1368.88),
          height: ihsPctY(396.45),
          borderRadius: cqw(28),
        }}
      >
        <div
          className="absolute"
          style={{
            left: cqw(1005 - 41),
            top: 0,
            width: cqw(450),
            height: "100%",
          }}
        >
          <Image
            src="/images/niveles/banderas-ihs.png"
            alt="Bandera de México y Estados Unidos"
            fill
            sizes="30vw"
            className="object-contain object-right-bottom"
          />
        </div>
      </div>
    </Link>
  )
}

export default function ChampalLevelsIntro() {
  const rootRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const buildingVideoRef = useRef<HTMLVideoElement>(null)
  const line1Ref = useRef<HTMLParagraphElement>(null)
  const line2Ref = useRef<HTMLParagraphElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const line3Ref = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const viewport = viewportRef.current
    const stage = stageRef.current
    const video = buildingVideoRef.current

    if (!root || !viewport || !stage || !video) return

    gsap.registerPlugin(ScrollTrigger)

    const setStageScale = () => {
      const scale = Math.min(
        viewport.clientWidth / STAGE.width,
        viewport.clientHeight / VIEWPORT_LOGICAL_HEIGHT,
      )

      gsap.set(stage, {
        xPercent: -50,
        scale,
        visibility: "visible",
      })
    }

    setStageScale()

    const playVideo = async () => {
      try {
        if (video.ended || video.currentTime > 0.05) video.currentTime = 0
        await video.play()
      } catch {
        // Si el navegador bloquea autoplay, el primer gesto del usuario lo activa.
      }
    }

    const ctx = gsap.context(() => {
      gsap.set(line1Ref.current, { x: -210, y: -22, opacity: 0 })
      gsap.set(line2Ref.current, { x: 128, y: -48, opacity: 0 })
      gsap.set(paperRef.current, {
        x: -180,
        scaleX: 0.5,
        opacity: 0,
        transformOrigin: "0% 50%",
      })
      gsap.set(line3Ref.current, { x: 156, y: 28, opacity: 0 })

      const copyTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      })

      copyTl
        .to(line1Ref.current, { x: 0, y: 0, opacity: 1, duration: 0.22 }, 0.04)
        .to(line2Ref.current, { x: 0, y: 0, opacity: 1, duration: 0.2 }, 0.16)
        .to(
          paperRef.current,
          { x: 0, scaleX: 1, opacity: 1, duration: 0.24 },
          0.28,
        )
        .to(line3Ref.current, { x: 0, y: 0, opacity: 1, duration: 0.2 }, 0.36)

      const cards = cardsRef.current
        ? Array.from(cardsRef.current.querySelectorAll<HTMLElement>(".level-card"))
        : []

      gsap.set(cards, {
        opacity: 0,
        y: 34,
        rotateX: 12,
        transformOrigin: "50% 100%",
      })

      const cardsTl = gsap.timeline({ paused: true })
      cardsTl.to(cards, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.4,
        stagger: 0.055,
        ease: "power3.out",
      })

      const syncScene = (progress: number) => {
        // 1) Copy: rápido.
        copyTl.progress(gsap.utils.clamp(0, 1, progress / 0.17))

        // 2) El edificio pasa a 60% sin esperar demasiado.
        const fadeProgress = gsap.utils.clamp(0, 1, (progress - 0.12) / 0.17)
        gsap.set(video, {
          opacity: gsap.utils.interpolate(1, 0.6, fadeProgress),
        })

        // 3) La composición completa empieza a subir mientras aparecen los niveles.
        const travelProgress = gsap.utils.clamp(0, 1, (progress - 0.1) / 0.9)
        const logicalTravel = STAGE.height - VIEWPORT_LOGICAL_HEIGHT

        gsap.set(stage, {
          y: -logicalTravel * travelProgress,
        })

        // 4) Entrada breve de tarjetas; no detiene el desplazamiento.
        const cardProgress = gsap.utils.clamp(0, 1, (progress - 0.16) / 0.2)
        cardsTl.progress(cardProgress)
      }

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=1250",
        pin: viewport,
        scrub: 0.28,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => syncScene(self.progress),
      })

      const onLoadedMetadata = () => {
        video.pause()
        video.currentTime = 0
        void playVideo()
        syncScene(st.progress)
      }

      const onEnded = () => video.pause()

      video.addEventListener("loadedmetadata", onLoadedMetadata)
      video.addEventListener("ended", onEnded)

      if (video.readyState >= 1) onLoadedMetadata()

      const handleResize = () => {
        setStageScale()
        ScrollTrigger.refresh()
      }

      window.addEventListener("resize", handleResize)

      return () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata)
        video.removeEventListener("ended", onEnded)
        window.removeEventListener("resize", handleResize)
        st.kill()
        copyTl.kill()
        cardsTl.kill()
      }
    }, root)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="levels-intro-root">
      <div ref={viewportRef} className="levels-intro-viewport">
        <div ref={stageRef} className="levels-intro-stage">
          <video
            ref={buildingVideoRef}
            className="levels-building-video"
            src="/images/Scatter/Edificio_Separado_transparente.webm"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />

          <div
            className="levels-copy"
            aria-label="Cada etapa construye una parte de su futuro"
          >
            <p ref={line1Ref} className="levels-line levels-line-1">
              Cada etapa construye
            </p>
            <p ref={line2Ref} className="levels-line levels-line-2">
              una parte
            </p>
            <div ref={paperRef} className="levels-paper">
              <p ref={line3Ref} className="levels-line levels-line-3">
                de su futuro
              </p>
            </div>
          </div>

          {/*
           * Desde aquí NO hay reconstrucción visual.
           * Es el bloque funcional de Niveles.js colocado en el lienzo nuevo.
           */}
          <div className="levels-existing-block">
            <div
              ref={cardsRef}
              className="levels-existing-cards"
              aria-label="Niveles educativos"
            >
              {LEVELS.map((level) => (
                <LevelCard key={level.slug} level={level} />
              ))}
            </div>

            <IhsBlock />
          </div>
        </div>
      </div>

      <style jsx>{`
        .levels-intro-root {
          position: relative;
          min-height: 100svh;
          background: #012a69;
        }

        .levels-intro-viewport {
          position: relative;
          width: 100%;
          height: 100svh;
          overflow: hidden;
          background-image: url("/images/Fondo Azul Cuadrícula.webp");
          background-size: cover;
          background-position: center;
          background-repeat: repeat-y;
        }

        .levels-intro-stage {
          position: absolute;
          top: 0;
          left: 50%;
          width: ${STAGE.width}px;
          height: ${STAGE.height}px;
          visibility: hidden;
          transform-origin: 50% 0%;
          will-change: transform;
        }

        /* Se conserva exactamente el encuadre que teníamos pendiente de afinar. */
        .levels-building-video {
          position: absolute;
          right: -260px;
          top: 28px;
          width: 2100px;
          height: auto;
          aspect-ratio: 16 / 9;
          display: block;
          object-fit: contain;
          opacity: 1;
          pointer-events: none;
          user-select: none;
          will-change: opacity;
        }

        .levels-copy {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
        }

        .levels-line {
          position: absolute;
          margin: 0;
          font-family: "Fredoka", sans-serif;
          font-weight: 600;
          line-height: 1.02;
          white-space: nowrap;
          letter-spacing: 0.01em;
          text-rendering: geometricPrecision;
          -webkit-font-smoothing: antialiased;
          will-change: transform, opacity;
          text-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
        }

        .levels-line-1 {
          left: 42px;
          top: 101px;
          color: #ffffff;
          font-size: 58px;
        }

        .levels-line-2 {
          left: 42px;
          top: 174px;
          color: #fdcb2e;
          font-size: 52px;
          font-weight: 600;
          letter-spacing: 0.015em;
        }

        .levels-paper {
          position: absolute;
          left: 42px;
          top: 255px;
          width: 477px;
          height: 84px;
          background-image: url("/images/hero/papel-rasgado.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          background-position: center;
          will-change: transform, opacity;
        }

        .levels-line-3 {
          left: 18px;
          top: 12px;
          color: #0a1730;
          font-size: 58px;
          font-weight: 700;
          display: flex;
          align-items: center;
        }

        /*
         * NIVELES + IHS recuperados:
         * mismo canvas 1440×772 del componente que ya funciona.
         * Solo lo posicionamos dentro del lienzo 1440×1517.
         */
        .levels-existing-block {
          position: absolute;
          left: 0;
          top: 642px;
          width: 1440px;
          height: 772px;
          z-index: 8;
          container-type: inline-size;
        }

        .levels-existing-cards {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: ${cqw(33)};
          padding-right: ${cqw(33)};
          gap: ${cqw(20)};
          perspective: 900px;
          transform-style: preserve-3d;
        }

        @media (prefers-reduced-motion: reduce) {
          .levels-line,
          .levels-paper,
          :global(.level-card) {
            transform: none !important;
            opacity: 1 !important;
          }

          .levels-building-video {
            opacity: 0.6 !important;
          }
        }
      `}</style>
    </section>
  )
}
