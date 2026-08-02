"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Niveles", href: "#niveles-educativos" },
  { label: "Explora Champal", href: "#vida-estudiantil" },
  { label: "Admisiones", href: "#admisiones" },
];

// Per Figma "Draft" menu design (2026-08) — Plataforma is now a standalone
// button, not a plain nav link. Target section unconfirmed with the user yet.
const PLATAFORMA_HREF = "#nosotros";

// Old CTA, toggled off per earlier client request — keep the markup, just don't render it.
const SHOW_CTA_BUTTON = false;

// Glossy/"4D" bevel used on the Plataforma button — lifted from the Figma export's
// inset shadow stack (light edges top/left/right, dark edge bottom).
const GLOSSY_BEVEL =
  "inset -2px 0px 0px 0px rgba(255,255,255,0.25), inset 2px 0px 0px 0px rgba(255,255,255,0.25), inset 0px 3px 0px -1px rgba(255,255,255,0.35), inset 0px -2px 0px 1px rgba(0,0,0,0.25), inset 0px 0px 0px 0.5px rgba(0,0,0,0.15)";

// Grano/ruido sutil que Figma aplica sobre el cristal (feTurbulence), no el
// lienzo vacío como se pensó al inicio — ver node 5:26 export.
const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const NAV_TEXT_SHADOW = "0 1px 3px rgba(0,0,0,0.25)";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        className="relative"
        style={{
          // Degradado exacto de Figma (node 5:26): blanco bajo el logo,
          // desvaneciendo a casi transparente hacia el borde derecho.
          backgroundImage:
            "linear-gradient(90deg, #fff 4.89%, rgba(255,255,255,0.10) 53.88%, rgba(255,255,255,0.03) 92%)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          boxShadow: "0 10px 34px rgba(0,0,0,0.38)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.35,
            mixBlendMode: "overlay",
            backgroundImage: NOISE_BG,
            backgroundRepeat: "repeat",
            backgroundSize: "140px 140px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-[88px] items-center justify-between">
            <a href="#top" className="flex items-center shrink-0">
              <Image
                src="/logo-champal-3d.png"
                alt="Colegio Champal"
                width={182}
                height={74}
                priority
                className="h-[74px] w-auto"
              />
            </a>

            <nav className="hidden lg:flex items-center gap-[27px] h-[74px]">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center h-full text-2xl font-semibold text-white hover:text-white/80 transition-colors duration-200 whitespace-nowrap"
                  style={{ textShadow: NAV_TEXT_SHADOW }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <a
                href={PLATAFORMA_HREF}
                className="inline-flex items-center rounded-xl px-5 py-2.5 text-base font-semibold text-white transition-colors duration-200"
                style={{
                  backgroundColor: "var(--color-plataforma)",
                  boxShadow: `0 2px 8px rgba(169,79,79,0.35), ${GLOSSY_BEVEL}`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-plataforma-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-plataforma)")}
              >
                Plataforma
              </a>

              {SHOW_CTA_BUTTON && (
                <a
                  href="#admisiones"
                  className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-light transition-colors duration-200"
                >
                  Agenda una visita
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-primary"
              aria-label="Abrir menú"
              aria-expanded={isOpen}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {isOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative lg:hidden overflow-hidden border-t border-white/40 rounded-b-3xl"
              style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(18px)" }}
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-md px-2 py-2.5 text-sm font-medium text-primary hover:bg-primary/5"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={PLATAFORMA_HREF}
                  onClick={() => setIsOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-base font-semibold text-white"
                  style={{
                    backgroundColor: "var(--color-plataforma)",
                    boxShadow: `0 2px 8px rgba(169,79,79,0.35), ${GLOSSY_BEVEL}`,
                  }}
                >
                  Plataforma
                </a>
                {SHOW_CTA_BUTTON && (
                  <a
                    href="#admisiones"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Agenda una visita
                  </a>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
