"use client"

import { useEffect, useRef, useState } from "react"

type HomeVerticalNavProps = {
  exploreHref?: string
  contactHref?: string
  platformHref?: string
  levelOrigin?: "grid" | "anillo"
}

const LEVELS = [
  { label: "Pre-Kinder", href: "/niveles/pre-kinder" },
  { label: "Kinder", href: "/niveles/kinder" },
  { label: "Primaria", href: "/niveles/primaria" },
  { label: "Secundaria", href: "/niveles/secundaria" },
  { label: "Preparatoria", href: "/niveles/preparatoria" },
  {
    label: "International High School",
    href: "/niveles/preparatoria",
    hash: "#international-high-school",
    ihs: true,
  },
]

function levelHref(item: (typeof LEVELS)[number], origin: "grid" | "anillo") {
  return `${item.href}?origen=${origin}${"hash" in item && item.hash ? item.hash : ""}`
}

export default function HomeVerticalNav({
  exploreHref = "#vida-estudiantil",
  contactHref = "#contacto",
  platformHref = "#",
  levelOrigin = "grid",
}: HomeVerticalNavProps) {
  const [levelsOpen, setLevelsOpen] = useState(false)
  const rootRef = useRef<HTMLElement | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      const root = rootRef.current
      if (!root || root.contains(event.target as Node)) return
      setLevelsOpen(false)
    }

    window.addEventListener("pointerdown", closeOutside)
    return () => {
      window.removeEventListener("pointerdown", closeOutside)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  const cancelLevelsClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleLevelsClose = () => {
    cancelLevelsClose()
    closeTimerRef.current = setTimeout(() => {
      setLevelsOpen(false)
      closeTimerRef.current = null
    }, 220)
  }

  const closeLevelsNow = () => {
    cancelLevelsClose()
    setLevelsOpen(false)
  }

  const handlePlatform = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (platformHref === "#") event.preventDefault()
  }

  return (
    <nav
      ref={rootRef}
      className="home-vertical-nav"
      aria-label="Navegación principal de la página de inicio"
    >
      <div className="nav-line" aria-hidden="true">
        <span className="terminal terminal-top" />
        <span className="terminal terminal-bottom" />
      </div>

      <div
        className="nav-item nav-levels"
        onMouseEnter={cancelLevelsClose}
        onMouseLeave={scheduleLevelsClose}
      >
        <button
          type="button"
          className={`nav-trigger ${levelsOpen ? "is-active" : ""}`}
          aria-expanded={levelsOpen}
          aria-controls="home-levels-submenu"
          onClick={() => setLevelsOpen((open) => !open)}
        >
          <span className="nav-label">
            <span>Niveles</span>
          </span>
          <span className="nav-node" aria-hidden="true">
            <span className="nav-node-core" />
          </span>
        </button>

        <div
          id="home-levels-submenu"
          className={`levels-panel ${levelsOpen ? "is-open" : ""}`}
          aria-hidden={!levelsOpen}
          onMouseEnter={cancelLevelsClose}
          onMouseLeave={scheduleLevelsClose}
        >
          {LEVELS.map((item) => (
            <a
              key={item.label}
              href={levelHref(item, levelOrigin)}
              className={`level-link ${item.ihs ? "is-ihs" : ""}`}
              tabIndex={levelsOpen ? 0 : -1}
              onClick={closeLevelsNow}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="nav-item nav-explore">
        <a href={exploreHref} className="nav-trigger" onMouseEnter={closeLevelsNow}>
          <span className="nav-label">
            <span>Explora Champal</span>
          </span>
          <span className="nav-node" aria-hidden="true">
            <span className="nav-node-core" />
          </span>
        </a>
      </div>

      <div className="nav-item nav-contact">
        <a href={contactHref} className="nav-trigger" onMouseEnter={closeLevelsNow}>
          <span className="nav-label">
            <span>Contacto</span>
          </span>
          <span className="nav-node" aria-hidden="true">
            <span className="nav-node-core" />
          </span>
        </a>
      </div>

      <div className="nav-item nav-platform">
        <a
          href={platformHref}
          className="nav-trigger"
          onMouseEnter={closeLevelsNow}
          onClick={handlePlatform}
          target={platformHref !== "#" ? "_blank" : undefined}
          rel={platformHref !== "#" ? "noreferrer" : undefined}
        >
          <span className="nav-label">
            <span>Plataforma</span>
          </span>
          <span className="nav-node" aria-hidden="true">
            <span className="nav-node-core" />
          </span>
        </a>
      </div>

      <style jsx>{`
        .home-vertical-nav {
          position: absolute;
          left: 150px;
          top: 173px;
          width: 430px;
          height: 315px;
          z-index: 70;
          pointer-events: none;
          font-family: "Outfit", sans-serif;
        }

        .nav-line {
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 315px;
          background: #ffffff;
          transform: translateX(-1.5px);
          z-index: 0;
        }

        .terminal {
          position: absolute;
          left: 50%;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        .terminal-top { top: 0; }
        .terminal-bottom { top: 315px; }

        .nav-item {
          position: absolute;
          left: 0;
          width: 410px;
          height: 36px;
          pointer-events: none;
          z-index: 2;
        }

        .nav-levels { top: 30px; }
        .nav-explore { top: 94px; }
        .nav-contact { top: 158px; }
        .nav-platform { top: 222px; }

        .nav-trigger {
          position: relative;
          display: block;
          width: 36px;
          height: 36px;
          pointer-events: auto;
          border: 0;
          padding: 0;
          margin: 0;
          background: transparent;
          color: #ffffff;
          text-decoration: none;
          cursor: pointer;
          text-align: left;
          outline: none;
          overflow: visible;
        }

        /*
         * La cápsula empieza EXACTAMENTE sobre el eje de la línea.
         * El círculo está encima (z-index superior), por lo que visualmente
         * la barra nace detrás del círculo, igual que en el diseño de referencia.
         */
        .nav-label {
          position: absolute;
          left: 0;
          top: 1px;
          display: flex;
          align-items: center;
          height: 34px;
          width: 0;
          overflow: hidden;
          border-radius: 11px;
          border: 2px solid rgba(255, 255, 255, 0);
          background: rgba(232, 232, 232, 0);
          backdrop-filter: blur(15px) saturate(112%);
          -webkit-backdrop-filter: blur(15px) saturate(112%);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0),
            0 6px 16px rgba(0, 22, 64, 0);
          opacity: 0;
          transition:
            width 210ms cubic-bezier(0.2, 0.76, 0.25, 1),
            opacity 120ms ease,
            background 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
          z-index: 2;
          white-space: nowrap;
          pointer-events: auto;
        }

        .nav-label > span {
          padding-left: 46px;
          padding-right: 18px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0.01em;
          text-shadow: 0 2px 6px rgba(0, 20, 58, 0.38);
          opacity: 0;
          transform: translateX(-5px);
          transition:
            opacity 110ms ease 45ms,
            transform 180ms ease 25ms;
        }

        .nav-node {
          position: absolute;
          left: 0;
          top: 50%;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          background: rgba(238, 238, 238, 0.98);
          transform: translate(-50%, -50%);
          box-shadow:
            inset 0 3px 7px rgba(34, 44, 64, 0.28),
            inset 0 -2px 3px rgba(255, 255, 255, 0.82),
            0 3px 8px rgba(0, 16, 48, 0.22);
          transition:
            background 180ms ease,
            box-shadow 180ms ease,
            transform 180ms ease;
          z-index: 5;
        }

        .nav-node-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 9px rgba(255, 255, 255, 0.28);
        }

        .nav-trigger:hover .nav-label,
        .nav-trigger:focus-visible .nav-label,
        .nav-trigger.is-active .nav-label {
          opacity: 1;
          border-color: rgba(255, 255, 255, 0.96);
          background:
            linear-gradient(
              180deg,
              rgba(235, 235, 235, 0.82) 0%,
              rgba(205, 205, 205, 0.72) 100%
            );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.72),
            0 6px 16px rgba(0, 22, 64, 0.18);
        }

        .nav-levels .nav-trigger:hover .nav-label,
        .nav-levels .nav-trigger:focus-visible .nav-label,
        .nav-levels .nav-trigger.is-active .nav-label {
          width: 151px;
        }

        .nav-explore .nav-trigger:hover .nav-label,
        .nav-explore .nav-trigger:focus-visible .nav-label {
          width: 202px;
        }

        .nav-contact .nav-trigger:hover .nav-label,
        .nav-contact .nav-trigger:focus-visible .nav-label {
          width: 151px;
        }

        .nav-platform .nav-trigger:hover .nav-label,
        .nav-platform .nav-trigger:focus-visible .nav-label {
          width: 151px;
          border-color: rgba(255, 255, 255, 0.96);
          background: #e31b23;
        }

        .nav-trigger:hover .nav-label > span,
        .nav-trigger:focus-visible .nav-label > span,
        .nav-trigger.is-active .nav-label > span {
          opacity: 1;
          transform: translateX(0);
        }

        .nav-trigger:hover .nav-node,
        .nav-trigger:focus-visible .nav-node,
        .nav-trigger.is-active .nav-node {
          background: rgba(244, 244, 244, 0.99);
          transform: translate(-50%, -50%) scale(1.02);
          box-shadow:
            inset 0 3px 7px rgba(34, 44, 64, 0.24),
            inset 0 -2px 3px rgba(255, 255, 255, 0.90),
            0 0 12px rgba(255, 255, 255, 0.22),
            0 3px 8px rgba(0, 16, 48, 0.22);
        }

        .nav-platform .nav-trigger:hover .nav-node,
        .nav-platform .nav-trigger:focus-visible .nav-node {
          background: rgba(227, 27, 35, 0.58);
        }

        .levels-panel {
          position: absolute;
          left: 158px;
          top: -1px;
          width: 0;
          height: 360px;
          overflow: hidden;
          border-radius: 17px;
          border: 1px solid rgba(255, 255, 255, 0);
          background:
            linear-gradient(
              145deg,
              rgba(236, 239, 247, 0.38) 0%,
              rgba(196, 207, 229, 0.30) 48%,
              rgba(119, 146, 193, 0.24) 100%
            );
          backdrop-filter: blur(18px) saturate(126%);
          -webkit-backdrop-filter: blur(18px) saturate(126%);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.44),
            0 18px 46px rgba(0, 18, 52, 0.25);
          opacity: 0;
          transform: translateX(-9px);
          pointer-events: none;
          transition:
            width 230ms cubic-bezier(0.2, 0.76, 0.25, 1),
            opacity 140ms ease,
            transform 230ms cubic-bezier(0.2, 0.76, 0.25, 1),
            border-color 150ms ease;
          z-index: 20;
        }

        .levels-panel.is-open {
          width: 360px;
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
          border-color: rgba(255, 255, 255, 0.72);
        }

        .levels-panel::before {
          content: "";
          position: absolute;
          left: -8px;
          top: 15px;
          width: 8px;
          height: 3px;
          background: rgba(255, 255, 255, 0.92);
        }

        .level-link {
          display: flex;
          align-items: center;
          height: 60px;
          padding: 0 24px;
          color: #ffffff;
          font-family: "Outfit", sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          border-bottom: 1px solid rgba(255, 255, 255, 0.72);
          text-shadow: 0 2px 6px rgba(0, 28, 70, 0.28);
          transition:
            background 150ms ease,
            color 150ms ease;
        }

        .level-link:hover,
        .level-link:focus-visible {
          background: #063871;
          outline: none;
        }

        .level-link:first-child {
          border-radius: 16px 16px 0 0;
        }

        .level-link.is-ihs {
          border-radius: 0 0 16px 16px;
        }

        .level-link.is-ihs {
          height: 60px;
          border-top: 2px solid #063871;
          border-bottom: 0;
        }

        @media (max-width: 900px) {
          .home-vertical-nav {
            transform: scale(0.88);
            transform-origin: left top;
          }
        }

        @media (max-width: 680px) {
          .home-vertical-nav {
            left: 34px;
            top: 190px;
            transform: scale(0.78);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-label,
          .nav-label > span,
          .nav-node,
          .levels-panel {
            transition: none !important;
          }
        }
      `}</style>
    </nav>
  )
}
