"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Botón flotante "Halcón" (nodo Figma 357:807) — componente compartido,
// pensado para usarse en cualquier página de nivel (reemplaza al botón
// de WhatsApp mientras la página tenga un hero + una sección de accesos
// a la que regresar). Mismo tamaño/posición que WhatsAppButton,
// transparente. Todo en líneas blancas en reposo (el trazo del halcón
// nunca cambia); en hover la FIGURA del halcón se rellena de azul
// marino oficial (no las líneas). Solo es visible cuando `heroId` queda
// completamente fuera de la pantalla; al hacer click regresa a
// `targetId`.
//
// Props:
// - targetId: id de la sección a la que regresa el click (sin "#").
// - heroId: id del hero/tope de la página que controla la visibilidad.
// - label: aria-label del botón.

function HalconIcon({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(50,50) rotate(13) scale(0.3) translate(-125.99,-76.05)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M111.866 1.87093L250.481 1.5C247.405 12.15 240.304 17.1302 231.246 19.3529L250.305 19.7392C249.666 36.1334 219.462 37.7029 216.862 37.1285C193.1 51.0352 170.369 51.5241 147.843 49.3203L161.329 99.6622L148.915 103.466L243.182 135.949C235.748 146.053 227.692 151.381 218.778 150.112L184.121 143.333C171.73 153.537 164.719 148.332 155.664 144.108C122.955 147.104 96.4301 152.763 66.7419 149.751C38.1778 145.449 21.3918 136.128 13.0363 123.217L6.37793 123.138C4.91563 125.122 4.81673 127.106 4.87735 129.089C-4.97068 111.344 9.85212 105.3 9.85212 105.3C9.85212 105.3 16.0177 92.3276 31.6282 91.207C86.5113 87.2672 9.32051 7.74099 111.866 1.87093Z"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="fill-transparent transition-colors duration-300 group-hover:fill-[#102c54]"
        />
      </g>
    </svg>
  );
}

export default function HalconButton({
  targetId = "accesos",
  heroId = "top",
  label = "Regresar a Accesos",
  ariaLabel,
  onClick,
  className = "",
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (onClick) return undefined;
    const hero = document.getElementById(heroId);
    if (!hero) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId, onClick]);

  const isVisible = onClick ? true : visible;
  const MotionControl = onClick ? motion.button : motion.a;

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionControl
          {...(onClick ? { type: "button", onClick } : { href: `#${targetId}` })}
          aria-label={ariaLabel ?? label}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full ${className}`}
        >
          {/* Anillos concéntricos — mismo tipo de pulso continuo que el
              "ping" del botón de WhatsApp (no una entrada de una sola
              vez): crecen y se desvanecen en bucle, uno detrás del otro. */}
          <motion.span
            className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
            animate={{ opacity: [0.6, 0], scale: [1, 1.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0 }}
          />
          <motion.span
            className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
            animate={{ opacity: [0.6, 0], scale: [1, 1.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.9 }}
          />
          {/* Disco de fondo — degradado azul diagonal exacto de Figma
              (muestreado del nodo 357:807), dentro del anillo blanco
              interior. */}
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
            style={{ background: "linear-gradient(135deg, #6184b8 0%, #3d5476 100%)" }}
          />
          <HalconIcon className="relative h-9 w-9" />
        </MotionControl>
      )}
    </AnimatePresence>
  );
}
