import Image from "next/image";

// ============================================================================
// NosotrosHistoria — banner "Conoce Nuestra Historia / Nuestro Futuro" del
// módulo Nosotros.
//
// Réplica del frame de Figma "Nuestra_Historia" (node-id 972:1387, archivo
// Champ): https://www.figma.com/design/UBACmzTCtVZqRDiTHDYi98/Champ?node-id=972-1387
//
// Es una franja full-bleed (fondo de relieve maya en azul) con dos líneas de
// título superpuestas y un acento rojo bajo la primera línea.
//
// Técnica de escalado: la misma que ya usan src/components/hero/* y
// src/components/comunidad-recursos/ComunidadRecursos.js — un lienzo fijo
// (CANVAS_WIDTH x CANVAS_HEIGHT, las dimensiones reales del frame de Figma)
// convertido a %/cqw mediante los helpers x()/y()/unit(), dentro de un
// contenedor con containerType:"inline-size" y aspect-ratio fijo, para que
// el desktop escale de forma proporcional y pixel-accurate en cualquier
// ancho >= lg. Debajo de lg se usa una versión apilada en flujo normal
// (MobileFrame) con tipografía fluida (clamp) — a ese ancho una réplica
// literal del canvas 1440x350 quedaría demasiado baja y el texto ilegible.
// ============================================================================

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 350;
const x = (value) => `${((value / CANVAS_WIDTH) * 100).toFixed(4)}%`;
const y = (value) => `${((value / CANVAS_HEIGHT) * 100).toFixed(4)}%`;
const unit = (value) => `${((value / CANVAS_WIDTH) * 100).toFixed(4)}cqw`;

const FONDO = "/images/nosotros/fondo-nuestra-historia.png";
const ACENTO_ROJO = "#DA2028"; // color real del trazo (Vector 29), no la paleta general de marca
const TEXT_SHADOW = "0px 4px 4px rgba(0,0,0,0.25)";

function DesktopFrame() {
  return (
    <div
      className="relative hidden aspect-[1440/350] w-full overflow-hidden lg:block"
      style={{ containerType: "inline-size" }}
    >
      <Image src={FONDO} alt="" fill preload sizes="100vw" className="object-cover" />

      {/* Centrado por flex en vez de apilar top/left absolutos (como en
          Figma): el "leading-[20px]" que trae el nodo para un texto de
          64px es solo la caja invisible que usa Figma para posicionar, no
          la métrica real de la fuente — copiar sus top literales dejaba la
          línea roja prácticamente pegada a las letras. Este layout separa
          título/línea/subtítulo con márgenes explícitos que sí controlan
          el espacio visual real. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h2
          className="font-serif font-bold uppercase leading-none whitespace-nowrap text-white"
          style={{
            fontSize: unit(64),
            letterSpacing: unit(7.68),
            textShadow: TEXT_SHADOW,
            marginBottom: unit(28),
          }}
        >
          Conoce Nuestra Historia
        </h2>

        {/* Acento — línea roja bajo el título (Vector 29 en Figma) */}
        <div
          style={{
            width: unit(1011),
            height: unit(8),
            marginBottom: unit(34),
            backgroundColor: ACENTO_ROJO,
          }}
        />

        <p
          className="font-serif font-medium uppercase leading-none whitespace-nowrap text-white"
          style={{
            fontSize: unit(64),
            letterSpacing: unit(7.68),
            textShadow: TEXT_SHADOW,
          }}
        >
          Nuestro Futuro
        </p>
      </div>
    </div>
  );
}

function MobileFrame() {
  return (
    <div className="relative overflow-hidden lg:hidden">
      <Image src={FONDO} alt="" fill sizes="100vw" className="object-cover" />

      <div className="relative flex flex-col items-center gap-4 px-6 py-14 text-center sm:gap-5 sm:py-20">
        <h2
          className="font-serif font-bold uppercase leading-tight text-white"
          style={{
            fontSize: "clamp(24px, 7vw, 40px)",
            letterSpacing: "0.12em",
            textShadow: TEXT_SHADOW,
          }}
        >
          Conoce Nuestra Historia
        </h2>

        <span className="h-[4px] w-[68%] max-w-[300px] shrink-0" style={{ backgroundColor: ACENTO_ROJO }} />

        <p
          className="font-serif font-medium uppercase leading-tight text-white"
          style={{
            fontSize: "clamp(20px, 6vw, 36px)",
            letterSpacing: "0.12em",
            textShadow: TEXT_SHADOW,
          }}
        >
          Nuestro Futuro
        </p>
      </div>
    </div>
  );
}

export default function NosotrosHistoria() {
  return (
    <section id="nuestra-historia" className="relative bg-[#0a2540]" aria-label="Conoce nuestra historia">
      <DesktopFrame />
      <MobileFrame />
    </section>
  );
}
