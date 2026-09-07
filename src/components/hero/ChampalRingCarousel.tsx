"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
  figmaFallback: string
}

const CAROUSEL_IMAGES: RoundCarouselImage[] = Array.from(
  { length: 10 },
  (_, i) => ({
    src: `/images/hero-ring/${String(i + 1).padStart(2, "0")}.webp`,
    alt: `Vida Champal ${i + 1}`,
  }),
)

const LEFT_VALUES: ValueItem[] = [
  {
    label: "CIUDADANÍA GLOBAL",
    src: "/images/hero/Prin Ciudadania.webp",
    figmaFallback:
      "https://www.figma.com/api/mcp/asset/1fe4a9a0-a339-4000-9d5a-8d46b17d158f.png",
  },
  {
    label: "COMPASIÓN",
    src: "/images/hero/Prin Compasion.webp",
    figmaFallback:
      "https://www.figma.com/api/mcp/asset/46412f3d-ac43-41b6-a884-c0c4583f4b36.png",
  },
  {
    label: "COMPROMISO",
    src: "/images/hero/Prin Compromiso.webp",
    figmaFallback:
      "https://www.figma.com/api/mcp/asset/e5756e54-be01-48fd-8922-4ca98d821fc7.png",
  },
]

const RIGHT_VALUES: ValueItem[] = [
  {
    label: "EXCELENCIA ACADÉMICA",
    src: "/images/hero/Prin Excelencia.webp",
    figmaFallback:
      "https://www.figma.com/api/mcp/asset/6ac86405-9ee5-460f-bcfd-1ff21e11baf7.png",
  },
  {
    label: "INTEGRIDAD",
    src: "/images/hero/Prin Integridad.webp",
    figmaFallback:
      "https://www.figma.com/api/mcp/asset/1884682a-2f38-48c5-bc21-16fef6c4271f.png",
  },
  {
    label: "HERMANDAD",
    src: "/images/hero/Prin Hermandad.webp",
    figmaFallback:
      "https://www.figma.com/api/mcp/asset/1bf8d09a-731d-4713-a235-d655da3f5f74.png",
  },
]

function ValueCard({
  item,
  side,
  row,
}: {
  item: ValueItem
  side: "left" | "right"
  row: number
}) {
  const [fallbackUsed, setFallbackUsed] = useState(false)

  return (
    <div
      className={`champal-value-card champal-value-${side}`}
      data-row={row}
      style={{
        width: "198px",
        transformStyle: "preserve-3d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "9px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100px",
          height: "100px",
          border: "2px solid rgba(255,255,255,0.96)",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 5px rgba(0,0,0,0.30)",
        }}
      >
        <img
          src={fallbackUsed ? item.figmaFallback : item.src}
          alt=""
          onError={() => {
            if (!fallbackUsed) setFallbackUsed(true)
          }}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "28px",
          padding: "2px 10px 3px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow:
            "inset 0 4px 4px rgba(0,0,0,0.25), 0 5px 16px rgba(0,0,0,0.08)",
        }}
      >
        <span
          style={{
            width: "100%",
            color: "rgba(255,255,255,0.92)",
            fontFamily: "'Fredoka One', Fredoka, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "22px",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {item.label}
        </span>
      </div>
    </div>
  )
}

function ValueColumn({
  values,
  side,
}: {
  values: ValueItem[]
  side: "left" | "right"
}) {
  return (
    <div
      style={{
        width: "198px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "28px",
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {values.map((item, row) => (
        <ValueCard
          key={item.label}
          item={item}
          side={side}
          row={row}
        />
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
        bottom: "18px",
        transform: "translateX(-50%)",
        width: "258px",
        height: "66px",
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
          width: "38px",
          height: "65px",
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
          width: "38px",
          height: "65px",
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
          width: "170px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "24px",
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
            fontSize: "32px",
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
  const [carouselRunning, setCarouselRunning] = useState(true)

  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Estado inicial
      gsap.set(".champal-red-bar", { y: -140, opacity: 0 })
      gsap.set(".champal-title-char", { opacity: 0, y: 6 })
      // Cada tarjeta parte ACOSTADA HACIA ATRÁS:
      // no entra vertical desde abajo. Empieza como una superficie horizontal
      // plegada 90° hacia el fondo y gira sobre su borde superior hasta ponerse de pie.
      gsap.set(".champal-value-card", {
        opacity: 0,
        y: 118,
        z: -135,
        rotationX: -90,
        transformOrigin: "top center",
        transformPerspective: 1200,
        force3D: true,
      })
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

      // 4) Tarjetas: rol/flip real, alternando izquierda y derecha por fila.
      // Secuencia exacta:
      // fila 1 izquierda -> fila 1 derecha ->
      // fila 2 izquierda -> fila 2 derecha ->
      // fila 3 izquierda -> fila 3 derecha.
      const leftCards = gsap.utils.toArray<HTMLElement>(".champal-value-left")
      const rightCards = gsap.utils.toArray<HTMLElement>(".champal-value-right")

      const rollCard = (card: HTMLElement, position: string) => {
        tl.to(
          card,
          {
            opacity: 1,
            y: 0,
            z: 0,
            rotationX: 0,
            duration: 0.58,
            ease: "power2.inOut",
            force3D: true,
          },
          position,
        )
      }

      rollCard(leftCards[0], "+=0.10")
      rollCard(rightCards[0], ">-0.08")
      rollCard(leftCards[1], ">-0.08")
      rollCard(rightCards[1], ">-0.08")
      rollCard(leftCards[2], ">-0.08")
      rollCard(rightCards[2], ">-0.08")

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

  const title = "Una comunidad comprometida con el desarrollo integral"

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: 'url("/images/Fondo Azul Cuadrícula.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 1) TÍTULO PEGADO AL MARGEN IZQUIERDO */}
      <div
        style={{
          position: "absolute",
          top: "43px",
          left: "clamp(46px, 6vw, 87px)",
          right: "46px",
          height: "91px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          zIndex: 30,
        }}
      >
        <div
          className="champal-red-bar"
          aria-hidden="true"
          style={{
            width: "15px",
            height: "91px",
            flex: "0 0 auto",
            background: "#DA2028",
          }}
        />

        <h2
          style={{
            margin: 0,
            color: "#fff",
            fontFamily: "Fredoka, sans-serif",
            fontSize: "clamp(36px, 3.34vw, 48px)",
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
      </div>

      {/* 3) COLUMNAS MÁS HACIA LOS MÁRGENES.
          Ya no comparten una cuadrícula con el aro: el aro queda centrado
          de forma independiente y las columnas tienen aire a ambos lados. */}
      <div
        style={{
          position: "absolute",
          left: "calc(clamp(32px, 3.2vw, 46px) + 152px)",
          top: "208px",
          zIndex: 18,
        }}
      >
        <ValueColumn values={LEFT_VALUES} side="left" />
      </div>

      <div
        style={{
          position: "absolute",
          right: "calc(clamp(32px, 4.3vw, 62px) + 152px)",
          top: "208px",
          zIndex: 18,
        }}
      >
        <ValueColumn values={RIGHT_VALUES} side="right" />
      </div>

      {/* 2) ARO 35 PX MÁS ARRIBA.
          El centro del aro sigue exactamente en el centro del viewport. */}
      <div
        className="champal-carousel-stage"
        style={{
          position: "absolute",
          left: "50%",
          top: "clamp(-52px, calc(13px - (760px - 100vh) * 0.55), 13px)",
          transform: "translateX(-50%)",
          width: "min(1040px, 72vw)",
          height: "650px",
          zIndex: 4,
          pointerEvents: "auto",
        }}
      >
        <RoundCarousel
          images={images}
          imageWidth={340}
          imageHeight={340}
          spacing={1.15}
          speed={2.4}
          direction="right"
          drag
          sensitivity={4}
          tilt={32}
          perspective={3000}
          cornerRadius={0}
          innerDim={3.5}
          background="transparent"
          onImageClick={setSelected}
          running={carouselRunning}
        />
      </div>

      <DateBracket />

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
