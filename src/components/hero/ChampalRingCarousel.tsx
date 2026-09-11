"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"

interface RoundCarouselImage {
  src: string
  alt?: string
}

interface RoundCarouselProps {
  images?: RoundCarouselImage[]
  imageWidth?: number
  imageHeight?: number
  spacing?: number
  speed?: number
  direction?: "right" | "left"
  drag?: boolean
  sensitivity?: number
  tilt?: number
  perspective?: number
  cornerRadius?: number
  innerDim?: number
  background?: string
  style?: React.CSSProperties
  onImageClick?: (index: number) => void
  running?: boolean
}

type ValueItem = {
  label: string
  src: string
}

const CAROUSEL_IMAGES: RoundCarouselImage[] = Array.from(
  { length: 10 },
  (_, i) => ({
    src: `/images/hero-ring/${String(i + 1).padStart(2, "0")}.webp`,
    alt: `Vida Champal ${i + 1}`,
  }),
)

const VALUES: ValueItem[] = [
  {
    label: "Integridad",
    src: "/images/Valores/Azul 3D Integridad.webp",
  },
  {
    label: "Hermandad",
    src: "/images/Valores/Azul 3D Hermandad.webp",
  },
  {
    label: "Excelencia académica",
    src: "/images/Valores/Azul 3D Excelencia.webp",
  },
  {
    label: "Compromiso",
    src: "/images/Valores/Azul 3D Compromiso.webp",
  },
  {
    label: "Compasión",
    src: "/images/Valores/Azul 3D Compasion.webp",
  },
  {
    label: "Ciudadanía global",
    src: "/images/Valores/Azul 3D Ciudadanía.webp",
  },
]

function ValueCard({ item }: { item: ValueItem }) {
  return (
    <div
      className="champal-value-card"
      style={{
        position: "relative",
        width: 150,
        height: 150,
        transformStyle: "preserve-3d",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.9)",
        borderRadius: 11,
        boxShadow: "0 8px 18px rgba(0,0,0,0.28)",
        opacity: 0,
        transform: "translateY(190px) scale(0.96)",
        transformOrigin: "50% 100%",
        willChange: "transform, opacity",
      }}
      >
        <Image
          src={item.src}
          alt={item.label}
          draggable={false}
          fill
          sizes="150px"
          style={{ objectFit: "cover" }}
        />
    </div>
  )
}

function ValueRow() {
  return (
    <div
      style={{
        position: "relative",
        width: 1250,
        height: 150,
        display: "flex",
        justifyContent: "space-between",
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {VALUES.map((item) => (
        <ValueCard key={item.label} item={item} />
      ))}
    </div>
  )
}

function RoundCarousel({
  images = CAROUSEL_IMAGES,
  imageWidth = 340,
  imageHeight = 340,
  spacing = 1.15,
  speed = 2.4,
  direction = "right",
  drag = true,
  sensitivity = 4,
  tilt = 32,
  perspective = 3000,
  cornerRadius = 0,
  innerDim = 3.5,
  background = "transparent",
  style = {},
  onImageClick,
  running = true,
}: RoundCarouselProps) {
  const items = images.length > 0 ? images : CAROUSEL_IMAGES
  const count = items.length

  const ringRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const rotYRef = useRef(0)
  const velRef = useRef(0)
  const lastRef = useRef(0)
  const dragRef = useRef({ active: false, x: 0, moved: false })

  const angle = 360 / count
  const factor = 1 + spacing * 0.15
  const radius =
    (imageWidth * factor) / (2 * Math.tan(Math.PI / count))
  const radiusPx = cornerRadius
  const degPerSec = running
    ? speed * 6 * (direction === "left" ? -1 : 1)
    : 0

  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return

    const apply = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`
    }

    apply()

    const draw = (now: number) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0
      lastRef.current = now
      const frame = Math.min(dt, 0.1)

      if (!dragRef.current.active) {
        if (Math.abs(velRef.current) > 0.01) {
          rotYRef.current += velRef.current * frame
          velRef.current *= 0.94
        } else {
          rotYRef.current += degPerSec * frame
        }
      }

      apply()
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [radius, degPerSec, count])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragRef.current = { active: true, x: e.clientX, moved: false }
    velRef.current = 0
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d.active) return

    const dx = e.clientX - d.x
    if (Math.abs(dx) > 2) d.moved = true
    d.x = e.clientX

    const k = 0.3 * sensitivity
    rotYRef.current += dx * k
    velRef.current = dx * k * 60
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    dragRef.current.active = false
  }

  const faceBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: radiusPx,
    overflow: "hidden",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }

  return (
    <div
      style={{
        ...style,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        background,
        perspective: `${perspective}px`,
        cursor: drag ? "grab" : "default",
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt}deg)`,
        }}
      >
        <div
          ref={ringRef}
          style={{
            position: "relative",
            width: imageWidth,
            height: imageHeight,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((img, i) => {
            const src = img?.src

            return (
              <div
                key={`${src}-${i}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <button
                  type="button"
                  aria-label={img.alt ?? `Abrir imagen ${i + 1}`}
                  onClick={(event) => {
                    if (dragRef.current.moved) {
                      event.preventDefault()
                      return
                    }
                    onImageClick?.(i)
                  }}
                  style={{
                    ...faceBase,
                    padding: 0,
                    border: 0,
                    cursor: "pointer",
                    backgroundColor: src ? "transparent" : "#222",
                    backgroundImage: src ? `url(${src})` : undefined,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.20)",
                  }}
                />

                <div
                  aria-hidden="true"
                  style={{
                    ...faceBase,
                    transform: "rotateY(180deg)",
                    backgroundColor: src ? "transparent" : "#181818",
                    backgroundImage: src ? `url(${src})` : undefined,
                    filter: `brightness(${innerDim / 10})`,
                    pointerEvents: "none",
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DateBracket() {
  return (
    <div
      className="champal-date-bracket"
      aria-label="Desde 1992"
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        transform: "translateX(-50%)",
        width: 258,
        height: 66,
        color: "#fff",
        zIndex: 40,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 38,
          height: 65,
          borderLeft: "3px solid rgba(255,255,255,0.96)",
          borderTop: "3px solid rgba(255,255,255,0.96)",
          borderBottom: "3px solid rgba(255,255,255,0.96)",
        }}
      />

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 38,
          height: 65,
          borderRight: "3px solid rgba(255,255,255,0.96)",
          borderTop: "3px solid rgba(255,255,255,0.96)",
          borderBottom: "3px solid rgba(255,255,255,0.96)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "2px",
          transform: "translateX(-50%)",
          width: 170,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 24,
            fontWeight: 400,
            lineHeight: 1.02,
            textTransform: "uppercase",
          }}
        >
          Desde
        </div>

        <div
          style={{
            marginTop: "4px",
            fontFamily: "Fredoka, sans-serif",
            fontSize: 32,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          1992
        </div>
      </div>
    </div>
  )
}

export default function ChampalRingCarousel() {
  const images = useMemo(() => CAROUSEL_IMAGES, [])
  const [selected, setSelected] = useState<number | null>(null)
  const [carouselRunning] = useState(true)
  const [layoutScale, setLayoutScale] = useState(1)
  const [ringScale, setRingScale] = useState(0.72)

  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth
      setLayoutScale(Math.min(1, width / 1440))
      setRingScale(Math.max(0.58, Math.min(0.72, (width / 1440) * 0.72)))
    }

    updateLayout()
    window.addEventListener("resize", updateLayout)
    return () => window.removeEventListener("resize", updateLayout)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Estado inicial
      gsap.set(".champal-red-bar", { y: -140, opacity: 0 })
      gsap.set(".champal-title-char", { opacity: 0, y: 6 })
      gsap.set(".champal-center-logo", { opacity: 0, scale: 0.88 })
      gsap.set(".champal-date-bracket", {
        opacity: 0,
        letterSpacing: "-0.5em",
        z: -700,
        transformPerspective: 1200,
      })

      // 1) Rectángulo rojo: slide desde arriba
      tl.to(".champal-red-bar", {
        y: 0,
        opacity: 1,
        duration: 0.65,
      })

      // 2) Título: efecto máquina de escribir por caracteres
      tl.to(
        ".champal-title-char",
        {
          opacity: 1,
          y: 0,
          duration: 0.02,
          stagger: 0.028,
          ease: "none",
        },
        "-=0.15",
      )

      // 3) El aro ya está visible y girando desde el primer frame.

      tl.to(
        ".champal-center-logo",
        { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" },
        "-=0.05",
      )

      // 5) Brackets + DESDE 1992
      tl.to(
        ".champal-date-bracket",
        {
          opacity: 1,
          letterSpacing: "0em",
          z: 0,
          duration: 0.85,
          ease: "power2.out",
        },
        "+=0.05",
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const title = "Un entorno seguro donde cada persona encuentra su voz"
  const gridStep = 50
  const ringPresence = 1.1
  const ringEnvelopeScale = 0.97
  const ringStageHeight = Math.round(650 * ringScale * 1.08 * ringPresence)
  const ringReferenceDateTop = 550
  const dateTop = 625
  const dateHeight = 66
  const ringVerticalAdjustment = 55
  const ringTop = Math.round(
    ringReferenceDateTop + dateHeight / 2 - ringStageHeight - gridStep * 2.5 + ringVerticalAdjustment,
  )

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: `max(100vh, ${Math.round(1120 * layoutScale)}px)`,
        overflow: "hidden",
        backgroundImage: 'url("/images/Fondo Azul Cuadrícula.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 1440,
          height: 1120,
          transform: `translateX(-50%) scale(${layoutScale})`,
          transformOrigin: "top center",
          pointerEvents: "none",
          zIndex: 30,
        }}
      >
        <div
          className="champal-red-bar"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 64 - gridStep,
            top: 43,
            width: 15,
            height: 91,
            background: "#DA2028",
            zIndex: 30,
          }}
        />

        <h2
          className="champal-main-title"
          style={{
            position: "absolute",
            left: 96 - gridStep,
            top: 51,
            width: 1257,
            margin: 0,
            color: "#fff",
            fontFamily: "Fredoka, sans-serif",
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1,
            whiteSpace: "nowrap",
            textAlign: "left",
            textShadow: "0 4px 5px rgba(0,0,0,0.40)",
          }}
        >
          {Array.from(title).map((char, index) => (
            <span
              key={`${char}-${index}`}
              className="champal-title-char"
              style={{
                display: "inline-block",
                whiteSpace: char === " " ? "pre" : "normal",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>

      <div
        className="champal-values-viewport"
        style={{
          position: "absolute",
          left: 119,
          top: 740,
          zIndex: 18,
        }}
      >
        <div className="champal-values-row">
          <ValueRow />
        </div>
      </div>

      </div>

      <div
        className="champal-carousel-stage"
        style={{
          position: "absolute",
          left: "50%",
          top: ringTop,
          transform: "translateX(-50%)",
          width: `${Math.round(1040 * ringScale * 1.08 * ringPresence)}px`,
          height: ringStageHeight,
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "auto",
            transform: `scale(${ringEnvelopeScale})`,
            transformOrigin: "center center",
          }}
        >
          <RoundCarousel
            images={images}
            imageWidth={Math.round(340 * ringScale * 1.08 * ringPresence)}
            imageHeight={Math.round(340 * ringScale * 1.08 * ringPresence)}
            spacing={1.15}
            speed={2.4}
            direction="right"
            drag
            sensitivity={4}
            tilt={30}
            perspective={3000}
            cornerRadius={0}
            innerDim={3.5}
            background="transparent"
            onImageClick={setSelected}
            running={carouselRunning}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `calc(50% + ${gridStep * 4}px)`,
            width: Math.round(308 * (ringScale / 0.72) * ringPresence),
            height: Math.round(308 * (ringScale / 0.72) * ringPresence),
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 15,
          }}
        >
          <div
            className="champal-center-logo"
            style={{ position: "relative", width: "100%", height: "100%" }}
          >
            <Image
              src="/images/Logo Champal Borde Blanco.webp"
              alt="Colegio Champal"
              draggable={false}
              fill
              sizes="308px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      <div
        className="champal-date-layer"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: dateTop,
          height: dateHeight,
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <DateBracket />
      </div>

      {selected !== null && images[selected] && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background: "rgba(0,0,0,0.42)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(960px, 88vw)",
              maxHeight: "80vh",
              padding: "14px",
              borderRadius: "28px",
              background: "#fff",
              boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
            }}
          >
            <img
              src={images[selected].src}
              alt={images[selected].alt}
              style={{
                width: "100%",
                maxHeight: "calc(80vh - 28px)",
                objectFit: "contain",
                display: "block",
                borderRadius: "18px",
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
