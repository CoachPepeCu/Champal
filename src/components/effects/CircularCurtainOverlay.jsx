"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "motion/react";

import HalconButton from "@/components/HalconButton";

// Deliberadamente por encima del Header y de los botones flotantes globales.
const OVERLAY_Z_INDEX = 1000;

export default function CircularCurtainOverlay({
  children,
  phase,
  origin,
  flight,
  reduceMotion,
  ariaLabel = "Conexión Universitaria",
  onClose,
  onFlightComplete,
  onOpened,
  onClosed,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // El padre solo lo crea tras una interacción ya hidratada; esta guarda
  // mantiene seguro el componente si su contrato cambia en el futuro.
  if (typeof document === "undefined") return null;

  const closedClip = `circle(0px at ${origin.x}px ${origin.y}px)`;
  const openClip = `circle(150vmax at ${origin.x}px ${origin.y}px)`;
  const isClosing = phase === "closing";
  const isRevealed = phase === "revealing" || phase === "open";
  const curtainDuration = reduceMotion ? 0.18 : 0.7;
  const flightScale = reduceMotion
    ? 1
    : Math.max(window.innerWidth / flight.width, window.innerHeight / flight.height) * 0.78;
  const flightX = window.innerWidth / 2 - (flight.left + flight.width / 2);
  const flightY = window.innerHeight / 2 - (flight.top + flight.height / 2);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      tabIndex={-1}
      className="fixed inset-0 outline-none"
      style={{ zIndex: OVERLAY_Z_INDEX }}
    >
      <motion.div
        className="fixed inset-0 overflow-y-auto bg-[#637e99] outline-none"
        initial={{ clipPath: closedClip }}
        animate={{ clipPath: isRevealed && !isClosing ? openClip : closedClip }}
        transition={{
          duration: curtainDuration,
          ease: [0.76, 0, 0.24, 1],
        }}
        onAnimationComplete={() => {
          if (isClosing) onClosed();
          else if (phase === "revealing") onOpened();
        }}
      >
        <div className="min-h-[100dvh] w-full">
          {children}
        </div>
      </motion.div>

      {isRevealed && !isClosing && (
        <HalconButton
          onClick={onClose}
          ariaLabel="Volver a Conoce Champal"
          className="!z-[1010]"
        />
      )}

      {(phase === "flying" || phase === "revealing") && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed"
          style={{
            left: flight.left,
            top: flight.top,
            width: flight.width,
            height: flight.height,
            zIndex: OVERLAY_Z_INDEX + 2,
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: flightX,
            y: flightY,
            scale: flightScale,
            opacity: phase === "revealing" || reduceMotion ? 0 : 1,
          }}
          transition={{
            duration: reduceMotion ? 0.08 : phase === "revealing" ? 0.36 : 0.66,
            ease: phase === "revealing" ? "easeOut" : [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={() => {
            if (phase === "flying") onFlightComplete();
          }}
        >
          {/* La copia usa el WebP original; no participa en el layout. */}
          <Image src={flight.src} alt="" fill sizes="100vw" className="object-contain" />
        </motion.div>
      )}
    </div>,
    document.body
  );
}
