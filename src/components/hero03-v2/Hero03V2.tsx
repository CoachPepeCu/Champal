"use client"

import Image from "next/image"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./Hero03V2.module.css"
import { HERO03_PIECES, HERO03_STAGE } from "./hero03Layout"

const WHEEL_ENTRY_VARIANTS = [
  { x: -38, y: 610, z: -610, rotateX: -88, rotateZ: -1.8, start: 0.06, duration: 0.7 },
  { x: 28, y: 540, z: -520, rotateX: -84, rotateZ: 1.5, start: 0.1, duration: 0.72 },
  { x: -18, y: 470, z: -455, rotateX: -80, rotateZ: -1.1, start: 0.15, duration: 0.68 },
  { x: 35, y: 635, z: -640, rotateX: -87, rotateZ: 1.9, start: 0.2, duration: 0.74 },
  { x: -40, y: 390, z: -360, rotateX: -76, rotateZ: -2, start: 0.24, duration: 0.66 },
  { x: 16, y: 575, z: -565, rotateX: -86, rotateZ: 0.8, start: 0.29, duration: 0.73 },
  { x: 39, y: 445, z: -425, rotateX: -79, rotateZ: 2, start: 0.34, duration: 0.69 },
  { x: -31, y: 650, z: -645, rotateX: -88, rotateZ: -1.7, start: 0.39, duration: 0.76 },
  { x: 36, y: 505, z: -485, rotateX: -83, rotateZ: 1.9, start: 0.43, duration: 0.7 },
  { x: -39, y: 355, z: -315, rotateX: -74, rotateZ: -2, start: 0.48, duration: 0.65 },
  { x: 22, y: 590, z: -590, rotateX: -87, rotateZ: 1.2, start: 0.53, duration: 0.74 },
  { x: -37, y: 425, z: -400, rotateX: -78, rotateZ: -2, start: 0.58, duration: 0.68 },
  { x: 40, y: 625, z: -625, rotateX: -88, rotateZ: 2, start: 0.62, duration: 0.75 },
  { x: -12, y: 485, z: -465, rotateX: -81, rotateZ: -0.7, start: 0.67, duration: 0.71 },
  { x: 37, y: 330, z: -275, rotateX: -72, rotateZ: 1.7, start: 0.72, duration: 0.64 },
  { x: -40, y: 555, z: -545, rotateX: -85, rotateZ: -2, start: 0.77, duration: 0.72 },
  { x: 12, y: 405, z: -380, rotateX: -77, rotateZ: 0.6, start: 0.81, duration: 0.67 },
  { x: 40, y: 615, z: -615, rotateX: -88, rotateZ: 2, start: 0.86, duration: 0.75 },
  { x: -35, y: 520, z: -505, rotateX: -84, rotateZ: -1.5, start: 0.91, duration: 0.71 },
  { x: 38, y: 370, z: -335, rotateX: -75, rotateZ: 2, start: 0.96, duration: 0.66 },
  { x: -40, y: 600, z: -600, rotateX: -87, rotateZ: -2, start: 1.01, duration: 0.74 },
] as const

export default function Hero03V2() {
  const rootRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const expansionRef = useRef<HTMLDivElement>(null)
  const expansionSmallRef = useRef<HTMLImageElement>(null)
  const expansionLargeRef = useRef<HTMLImageElement>(null)
  const signRef = useRef<HTMLDivElement>(null)
  const signFinalRef = useRef<HTMLImageElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const viewport = viewportRef.current
    const stage = stageRef.current

    if (!root || !viewport || !stage) return

    gsap.registerPlugin(ScrollTrigger)

    const setStageScale = () => {
      const scale = Math.min(
        viewport.clientWidth / HERO03_STAGE.width,
        viewport.clientHeight / HERO03_STAGE.height,
      )

      gsap.set(stage, {
        xPercent: -50,
        yPercent: -50,
        scale,
        visibility: "visible",
      })
    }

    const getViewportCoverBounds = () => {
      const scale = Math.min(
        viewport.clientWidth / HERO03_STAGE.width,
        viewport.clientHeight / HERO03_STAGE.height,
      )
      const width = viewport.clientWidth / scale
      const height = viewport.clientHeight / scale

      return {
        left: (HERO03_STAGE.width - width) / 2,
        top: (HERO03_STAGE.height - height) / 2,
        width,
        height,
      }
    }

    setStageScale()

    const context = gsap.context(() => {
      const pieces = HERO03_PIECES.map(({ id }) =>
        stage.querySelector<HTMLElement>(`[data-piece-id="${id}"]`),
      )
      const featuredPiece = pieces[HERO03_PIECES.findIndex(({ id }) => id === "collage-16")]
      const supportingPieces = pieces.filter(
        (element, index): element is HTMLElement =>
          Boolean(element) && HERO03_PIECES[index].id !== "collage-16",
      )
      const signStrokes = signRef.current?.querySelectorAll<HTMLElement>(
        `.${styles.signStroke}`,
      )

      const signTimeline = gsap.timeline({ paused: true })
      signTimeline
        .to(signStrokes, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.52,
          stagger: 0.055,
          ease: "power2.inOut",
        })
        .set(signFinalRef.current, { opacity: 1 })
        .set(signStrokes, { opacity: 0 })

      HERO03_PIECES.forEach((_, index) => {
        const element = pieces[index]
        if (!element) return

        const entry = WHEEL_ENTRY_VARIANTS[index]

        gsap.set(element, {
          x: entry.x,
          y: entry.y,
          z: entry.z,
          rotateX: entry.rotateX,
          rotateY: index % 3 === 0 ? -3 : index % 3 === 1 ? 2 : 0,
          rotateZ: entry.rotateZ,
          scale: 0.88 + (index % 5) * 0.025,
          opacity: 0,
          transformOrigin: "50% 50%",
        })
      })

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=9300",
          pin: viewport,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      timeline.to(
        logoRef.current,
        {
          opacity: 0,
          scale: 0.94,
          z: -180,
          duration: 0.2,
          ease: "power2.inOut",
        },
        0,
      )

      HERO03_PIECES.forEach((_, index) => {
        const element = pieces[index]
        if (!element) return

        const entry = WHEEL_ENTRY_VARIANTS[index]
        const segment = entry.duration

        timeline.to(
          element,
          {
            keyframes: [
              {
                x: entry.x * 0.86,
                y: entry.y * 0.69,
                z: entry.z * 0.72,
                rotateX: entry.rotateX * 0.78,
                rotateY: index % 2 === 0 ? -2 : 2,
                rotateZ: entry.rotateZ * 0.78,
                scale: 0.92,
                opacity: 0.3,
                duration: segment * 0.15,
                ease: "sine.out",
              },
              {
                x: entry.x * 0.62,
                y: entry.y * 0.4,
                z: entry.z * 0.4,
                rotateX: entry.rotateX * 0.55,
                rotateY: index % 2 === 0 ? -1.2 : 1.2,
                rotateZ: entry.rotateZ * 0.5,
                scale: 0.96,
                opacity: 0.8,
                duration: segment * 0.15,
                ease: "sine.out",
              },
              {
                x: entry.x * 0.38,
                y: entry.y * 0.18,
                z: entry.z * 0.14,
                rotateX: entry.rotateX * 0.32,
                rotateY: 0,
                rotateZ: entry.rotateZ * 0.2,
                scale: 0.99,
                opacity: 1,
                duration: segment * 0.15,
                ease: "sine.out",
              },
              {
                x: entry.x * 0.18,
                y: 43 + (index % 3) * 4,
                z: -30 - (index % 4) * 3,
                rotateX: entry.rotateX * 0.17,
                rotateY: 0,
                rotateZ: entry.rotateZ * 0.16,
                scale: 0.995,
                opacity: 1,
                duration: segment * 0.25,
                ease: "sine.out",
              },
              {
                x: 0,
                y: 0,
                z: 0,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                opacity: 1,
                duration: segment * 0.3,
                ease: "sine.out",
              },
            ],
          },
          entry.start,
        )
      })

      timeline.to(stage, { duration: 0.08 }, 1.82)

      timeline.to(
        supportingPieces,
        {
          opacity: 0,
          z: -90,
          duration: 0.34,
          ease: "power2.inOut",
        },
        1.98,
      )

      timeline.set(
        expansionRef.current,
        { opacity: 1 },
        2.12,
      )
      timeline.set(featuredPiece, { opacity: 0 }, 2.12)

      timeline.to(
        expansionRef.current,
        {
          left: () => getViewportCoverBounds().left,
          top: () => getViewportCoverBounds().top,
          width: () => getViewportCoverBounds().width,
          height: () => getViewportCoverBounds().height,
          duration: 0.95,
          ease: "power2.inOut",
        },
        2.12,
      )

      timeline.to(
        expansionLargeRef.current,
        {
          opacity: 1,
          objectPosition: "50% 50%",
          duration: 0.24,
          ease: "power1.inOut",
        },
        2.62,
      )
      timeline.to(
        expansionSmallRef.current,
        {
          opacity: 0,
          duration: 0.24,
          ease: "power1.inOut",
        },
        2.62,
      )

      timeline.call(
        () => {
          if ((timeline.scrollTrigger?.direction ?? 1) > 0) {
            signTimeline.restart()
          } else {
            signTimeline.reverse()
          }
        },
        [],
        3.19,
      )
      timeline.to(stage, { duration: 0.18 }, 4.02)
    }, root)

    const handleResize = () => {
      setStageScale()
      ScrollTrigger.refresh()
    }

    window.addEventListener("resize", handleResize)
    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener("resize", handleResize)
      context.revert()
    }
  }, [])

  return (
    <main ref={rootRef} className={styles.root}>
      <div ref={viewportRef} className={styles.viewport}>
        <div ref={stageRef} className={styles.stage}>
          <div ref={logoRef} className={styles.logo}>
            <Image
              src="/logo-champal-3d.png"
              alt="Colegio Champal"
              width={1108}
              height={451}
              priority
              className={styles.logoImage}
            />
          </div>

          <div className={styles.collage} aria-label="Collage de la comunidad Champal">
            {HERO03_PIECES.map((piece) => (
              <div
                key={piece.id}
                className={styles.slot}
                style={{
                  left: piece.xFinal,
                  top: piece.yFinal,
                  width: piece.width,
                  height: piece.height,
                }}
              >
                <div className={styles.piece} data-piece-id={piece.id}>
                  <Image
                    src={piece.id === "collage-16" ? `${piece.src}?v=2` : piece.src}
                    alt={piece.alt}
                    fill
                    unoptimized={piece.id === "collage-16"}
                    sizes="200px"
                    className={styles.pieceImage}
                  />
                </div>
              </div>
            ))}
          </div>

          <div ref={expansionRef} className={styles.expansion} aria-hidden="true">
            <Image
              ref={expansionSmallRef}
              src="/images/Collage/16.webp?v=2"
              alt=""
              fill
              unoptimized
              sizes="100vw"
              className={`${styles.expansionImage} ${styles.expansionSmall}`}
            />
            <Image
              ref={expansionLargeRef}
              src="/images/Collage/16G.webp?v=2"
              alt=""
              fill
              unoptimized
              sizes="100vw"
              className={`${styles.expansionImage} ${styles.expansionLarge}`}
            />
          </div>

          <div ref={signRef} className={styles.developmentSign}>
            <Image
              ref={signFinalRef}
              src="/images/Collage/Letrero Desarrollo Integral.webp"
              alt="Una comunidad comprometida con el desarrollo integral"
              width={953}
              height={822}
              className={styles.signFinal}
            />
            {Array.from({ length: 6 }, (_, index) => (
              <span
                key={index}
                className={styles.signStroke}
                style={{
                  top: `${index * (100 / 6)}%`,
                  height: `${100 / 6 + 0.8}%`,
                  backgroundPosition: `0 ${-index * (345 / 6)}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
