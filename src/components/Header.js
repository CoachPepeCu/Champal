"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// Este componente es el navbar del sitio: se reutiliza tal cual en las
// páginas interiores. Todos los hrefs son absolutos ("/#seccion") para que
// funcionen igual desde la home (scroll en la misma página) y desde
// cualquier página interior (navega a home y luego hace scroll). Los
// niveles que ya tienen su propia página (ej. Pre-Kinder) enlazan
// directamente a esa ruta en vez de al ancla de la home.

const SUBMENU_NIVELES = [
  { label: "Pre-Kinder", href: "/niveles/pre-kinder" },
  { label: "Kinder", href: "/niveles/kinder" },
  { label: "Primaria", href: "/niveles/primaria" },
  { label: "Secundaria", href: "/niveles/secundaria" },
  { label: "Preparatoria", href: "/niveles/preparatoria", dividerAfter: "navy" },
  { label: "International High School", href: "/#international-high-school" },
];

const NAV_LINKS = [
  { label: "Niveles", href: "/#niveles-educativos", submenu: SUBMENU_NIVELES },
  { label: "Explora Champal", href: "/#vida-estudiantil" },
  { label: "Admisiones", href: "/#admisiones" },
  { label: "Contacto", href: "/#contacto" },
];

// Header height, en px — usado para el offset del IntersectionObserver y
// para que quede documentado junto a los estilos que dependen de él.
const HEADER_HEIGHT = 88;

// Tono claro (sobre el Hero) y tono azul marino (al salir del Hero) — misma
// receta de degradado, solo cambia el canal de color, per client request.
const BAR_GRADIENT_LIGHT =
  "linear-gradient(90deg, #fff 4.89%, rgba(255,255,255,0.10) 53.88%, rgba(255,255,255,0.03) 92%)";
const BAR_GRADIENT_NAVY =
  "linear-gradient(90deg, #102c54 4.89%, rgba(16,44,84,0.10) 53.88%, rgba(16,44,84,0.03) 92%)";

const PLATAFORMA_HREF = "/#nosotros";

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

// Línea "profunda" del submenú: un borde tenue seguido de un filo más claro
// justo debajo, para dar sensación de grabado/relieve en vez de una línea plana.
const DIVIDER_WHITE = {
  borderBottom: "1px solid rgba(255,255,255,0.20)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.4)",
};
const DIVIDER_NAVY = {
  borderBottom: "2px solid var(--color-primary)",
  boxShadow: "0 1px 6px rgba(16,44,84,0.45)",
};

function Chevron({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function NavLabel({ label, showChevron, open, textColor }) {
  return (
    <>
      {/* Glow suave detrás de la etiqueta, aparece en hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 scale-75 rounded-full opacity-0 blur-xl transition-all duration-300 ease-out group-hover:scale-150 group-hover:opacity-100"
        style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.85), rgba(255,255,255,0) 70%)" }}
      />
      {/* `color` (no `text-white` fijo) — en Home sigue el fondo real que
          pasa detrás del header (ver `overDark` en Header()); en páginas
          interiores `textColor` siempre llega en blanco, sin cambios. El
          hover a `--color-primary` se mantiene igual en ambos casos. */}
      <span
        className="relative flex items-center gap-1 text-2xl font-semibold transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:text-[var(--color-primary)]"
        style={{ textShadow: NAV_TEXT_SHADOW, color: textColor }}
      >
        {label}
        {showChevron && <Chevron open={open} />}
      </span>
    </>
  );
}

function NivelesSubmenu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute left-0 top-full w-72 overflow-hidden rounded-b-2xl"
      style={{
        // Cristal en tono gris (no blanco puro) para que se lea como panel
        // propio, con el borde claro que le da el "volumen" pedido.
        background: "linear-gradient(180deg, rgba(206,213,222,0.42) 0%, rgba(180,188,199,0.18) 100%)",
        backdropFilter: "blur(22px) saturate(1.4)",
        WebkitBackdropFilter: "blur(22px) saturate(1.4)",
        borderLeft: "1px solid rgba(255,255,255,0.4)",
        borderRight: "1px solid rgba(255,255,255,0.4)",
        borderBottom: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 24px 48px rgba(2,10,30,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.3,
          mixBlendMode: "overlay",
          backgroundImage: NOISE_BG,
          backgroundRepeat: "repeat",
          backgroundSize: "140px 140px",
        }}
      />
      <ul className="relative py-2">
        {SUBMENU_NIVELES.map((sub, i) => (
          <li
            key={sub.href}
            style={i === SUBMENU_NIVELES.length - 1 ? undefined : sub.dividerAfter === "navy" ? DIVIDER_NAVY : DIVIDER_WHITE}
          >
            <a
              href={sub.href}
              className="block px-5 py-3 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-primary)]"
              style={{ textShadow: NAV_TEXT_SHADOW }}
            >
              {sub.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function DesktopNavItem({ link, textColor }) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef(null);

  const handleEnter = () => {
    if (!link.submenu) return;
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };
  const handleLeave = () => {
    if (!link.submenu) return;
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative h-full" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <a
        href={link.href}
        className="group relative flex h-full items-center whitespace-nowrap"
      >
        <NavLabel label={link.label} showChevron={!!link.submenu} open={open} textColor={textColor} />
      </a>
      <AnimatePresence>{open && link.submenu && <NivelesSubmenu />}</AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const heroEl = document.getElementById("top");
    if (!heroEl) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolledPastHero(!entry.isIntersecting),
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px`, threshold: 0 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  // Color del texto del menú (SOLO Home): la mayoría de las secciones de
  // Home son claras (blanco/gris casi blanco) — solo Hero/GlobalReach/
  // FinalCTA son oscuras (etiquetadas `data-nav-theme="dark"`). El truco de
  // arriba (`scrolledPastHero`, binario Hero-sí/Hero-no vía
  // IntersectionObserver + rootMargin) sirve para el TINTE del cristal,
  // pero no alcanza para el TEXTO: necesitamos saber, en cualquier punto
  // del scroll, si la franja EXACTA del header (0 a 88px) se topa con
  // alguna sección oscura — no "sigue habiendo algo oscuro más abajo en la
  // pantalla", que es lo que ese rootMargin realmente mide. Por eso acá se
  // usa un chequeo directo por scroll (rAF-throttled) contra
  // getBoundingClientRect() de cada sección oscura, en vez de otro
  // IntersectionObserver. Arranca en `true` (Hero, lo primero visible, es
  // oscuro) para no parpadear en azul antes de que el efecto corra.
  //
  // En páginas interiores esto NO corre — el texto se queda blanco fijo,
  // igual que hasta ahora (a pedido explícito del usuario, "puede quedar
  // igual"; no hay secciones etiquetadas fuera de Home todavía).
  const [overDark, setOverDark] = useState(true);

  useEffect(() => {
    if (!isHome) return undefined;
    const darkEls = Array.from(document.querySelectorAll('[data-nav-theme="dark"]'));
    if (darkEls.length === 0) return undefined;

    let raf = null;
    function check() {
      raf = null;
      const dark = darkEls.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < HEADER_HEIGHT && r.bottom > 0;
      });
      setOverDark(dark);
    }
    function onScrollOrResize() {
      if (raf) return;
      raf = requestAnimationFrame(check);
    }

    check();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome]);

  const navTextColor = !isHome || overDark ? "#ffffff" : "var(--color-primary)";

  // Ocultar al bajar / reaparecer al subir (SOLO páginas interiores — en
  // Home el header se queda siempre visible, "sticky", como hasta ahora).
  // Umbral de 6px para no parpadear con micro-scrolls de trackpad/rueda, y
  // no oculta mientras falten menos de HEADER_HEIGHT px para el tope (para
  // que no se esconda de entrada apenas se empieza a bajar) ni mientras el
  // menú móvil esté abierto.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isHome) return undefined; // Home no usa este mecanismo — se queda siempre visible.
    let lastY = window.scrollY;
    let raf = null;
    function check() {
      raf = null;
      const y = window.scrollY;
      const delta = y - lastY;
      if (isOpen || y < HEADER_HEIGHT) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }
      lastY = y;
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(check);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome, isOpen]);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-transform duration-300 ease-out"
      style={{ transform: !isHome && hidden ? "translateY(-100%)" : "translateY(0)" }}
    >
      <div
        className="relative"
        style={{
          // El blur/sombra son constantes — el cristal se mantiene siempre;
          // lo único que cambia con el scroll es el tono del degradado
          // (ver capas .bg-light / .bg-navy más abajo).
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          // Suavizada respecto a la versión original (0 10px 34px .38): esa
          // se veía bien sobre la foto del Hero de home, pero sobre fondos
          // blancos planos (páginas interiores) se notaba como una franja
          // gris. Este valor mantiene la profundidad del cristal sin crear
          // una línea visible sobre blanco.
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{ backgroundImage: BAR_GRADIENT_LIGHT, opacity: scrolledPastHero ? 0 : 1 }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{ backgroundImage: BAR_GRADIENT_NAVY, opacity: scrolledPastHero ? 1 : 0 }}
        />
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

        <div className="relative w-full px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex h-[88px] items-center justify-between">
            <a href="/#top" className="group flex items-center shrink-0">
              <Image
                src="/logo-champal-3d.png"
                alt="Colegio Champal"
                width={182}
                height={74}
                priority
                className="h-[74px] w-auto transition-transform duration-300 ease-out group-hover:scale-[1.06]"
                style={{ filter: "drop-shadow(0 0 0 rgba(56,189,248,0))" }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 18px rgba(56,189,248,0.75))")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 0 rgba(56,189,248,0))")}
              />
            </a>

            <nav className="hidden lg:flex items-center gap-[27px] h-full">
              {NAV_LINKS.map((link) => (
                <DesktopNavItem key={link.href} link={link} textColor={navTextColor} />
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <a
                href={PLATAFORMA_HREF}
                className="inline-flex items-center rounded-xl px-5 py-2.5 text-base font-semibold text-white transition-colors duration-200"
                style={{
                  backgroundColor: "var(--color-accent)",
                  boxShadow: `0 2px 8px rgba(193,21,31,0.4), ${GLOSSY_BEVEL}`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
              >
                Plataforma
              </a>

              {SHOW_CTA_BUTTON && (
                <a
                  href="/#admisiones"
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
                <span className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary/60">
                  Niveles
                </span>
                {SUBMENU_NIVELES.map((sub) => (
                  <a
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-md px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
                  >
                    {sub.label}
                  </a>
                ))}

                <div className="my-2 border-t border-primary/10" />

                {NAV_LINKS.slice(1).map((link) => (
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
                    backgroundColor: "var(--color-accent)",
                    boxShadow: `0 2px 8px rgba(193,21,31,0.4), ${GLOSSY_BEVEL}`,
                  }}
                >
                  Plataforma
                </a>
                {SHOW_CTA_BUTTON && (
                  <a
                    href="/#admisiones"
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
