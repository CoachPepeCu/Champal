"use client";

import { useEffect, useRef, useState } from "react";
import RayadosCard from "./RayadosCard";

// Assets en public/images/rayados/ (no src/) — mismo patrón que
// PrimariaHero.js / memoria "champal-niveles-pages-pattern": referenciados
// por ruta pública en vez de import, así next/image los sirve/optimiza
// igual que el resto del sitio.
const fotoOficial = "/images/rayados/foto-oficial.png";
const fotoMaestro = "/images/rayados/foto-maestro.png";
const fotoInstalacion = "/images/rayados/foto-instalacion.png";
const fotoObjetivo = "/images/rayados/foto-objetivo.png";

// node 1275:1164 "Caracteristicas" — las cuatro tarjetas. Vive FUERA del
// canvas escalado (rayadosMath/RayadosDesktopFrame): a diferencia del
// encabezado/bloque central, acá el propio brief pide una columna en
// desktop, dos en tablet y una en móvil, así que es más simple/robusto una
// grilla Tailwind normal (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4) que
// forzar 3 layouts distintos dentro de un cqw. Un solo <RayadosCards/> sirve
// para los tres breakpoints — no hace falta duplicarlo en el stack móvil.
const CARDS = [
  {
    id: "oficial",
    title: "Ser escuela oficial",
    image: fotoOficial,
    alt: "Alumnos de la Escuela Oficial Rayados de Monterrey en Champal",
    text: "Otorga múltiples ventajas formativas, deportivas y competitivas avaladas por la estructura profesional del Club de Fútbol Monterrey Rayados",
  },
  {
    id: "maestros",
    title: "Maestros certificados",
    image: fotoMaestro,
    alt: "Maestro certificado dirigiendo un entrenamiento de fútbol",
    text: "Contamos con Maestros capacitados en el área para formar jugadores con alto rendimiento",
  },
  {
    id: "instalaciones",
    title: "Instalaciones profesionales",
    image: fotoInstalacion,
    alt: "Cancha de fútbol de la Escuela Oficial Rayados de Monterrey en Champal",
    text: "Contamos con una cancha de pasto sintético para categorías pequeñas y una cancha de pasto natural con medidas oficiales.",
  },
  {
    id: "objetivos",
    title: "Objetivos",
    image: fotoObjetivo,
    alt: "Jugador de la Escuela Oficial Rayados de Monterrey en un partido",
    text: "Detectar y traer jugadores de calidad a las fuerzas básicas del Club Monterrey.",
  },
];

export default function RayadosCards() {
  const [activeId, setActiveId] = useState(null);
  // Detecta un dispositivo con hover fino real (mouse/trackpad) vs. táctil.
  // Sin esto, un mismo toque dispara foco + click y las dos ramas de
  // interacción se pelean (ver comentario largo en RayadosCard.js). Arranca
  // en `true` (asume desktop) para no invalidar el layout en el primer
  // render del server; se corrige en el efecto apenas monta en el cliente.
  const [hasHover, setHasHover] = useState(true);
  // Recuerda qué tarjeta acaba de auto-abrirse por foco, para que el click
  // que sigue inmediatamente (mouse tras hover, o el propio Enter/Espacio)
  // no la vuelva a alternar por accidente — ver RayadosCard.js.
  const justFocusedRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => {
      setHasHover(query.matches);
      // Evita que un `justFocusedRef` de una modalidad de entrada anterior
      // (ej. cambiar de mouse a táctil en un híbrido) suprima por accidente
      // el primer toggle de la otra modalidad.
      justFocusedRef.current = null;
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function handleToggle(id, event) {
    const isKeyboardActivation = event.detail === 0;
    if (!isKeyboardActivation && justFocusedRef.current === id) {
      // Este click es el mismo gesto que ya abrió la tarjeta por
      // pointerenter/foco (mouse real) — se consume una vez y no se cierra.
      justFocusedRef.current = null;
      return;
    }
    justFocusedRef.current = null;
    setActiveId((current) => (current === id ? null : id));
  }

  return (
    <div className="mx-auto grid w-full max-w-[1232px] grid-cols-1 gap-x-6 gap-y-10 px-6 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-[76px] lg:px-8">
      {CARDS.map((card) => (
        <RayadosCard
          key={card.id}
          title={card.title}
          image={card.image}
          alt={card.alt}
          text={card.text}
          isOpen={activeId === card.id}
          hasHover={hasHover}
          onOpen={() => {
            justFocusedRef.current = card.id;
            setActiveId(card.id);
          }}
          onClose={() =>
            setActiveId((current) => (current === card.id ? null : current))
          }
          onToggle={(event) => handleToggle(card.id, event)}
        />
      ))}
    </div>
  );
}
