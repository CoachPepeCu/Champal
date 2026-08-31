"use client";

import Image from "next/image";

// Una tarjeta de "Caracteristicas" (Rayados). Estado normal: título + línea
// verde + foto limpia. Con hover/foco/toque: aparece un panel blanco
// translúcido sobre la parte IZQUIERDA de la foto (76% de su ancho — mismo
// ratio 190/250 que trae Figma) con el texto correspondiente, más un glow
// suave azul marino alrededor de toda la tarjeta; la foto sigue visible
// detrás, sin agrandarse ni deformarse.
//
// Interacción (ver README de la carpeta para el detalle de por qué se
// resuelve así, especialmente el conflicto foco+click en táctil):
// - Mouse real (pointerType "mouse"): pointerenter/pointerleave abren/cierran.
// - Teclado (Tab): foco abre el panel; Enter/Espacio (click nativo del
//   <button>) lo alterna — se distingue de un click de mouse real via
//   `event.detail === 0` (los clicks sintéticos de teclado siempre traen
//   detail 0), para no pelear con el pointerenter que ya lo abrió.
// - Táctil (sin hover fino): el foco NO auto-abre (evita el doble disparo
//   foco+click del mismo toque); el click sí alterna — primer toque abre,
//   volver a tocar la misma tarjeta cierra, tocar otra cierra esa y abre la
//   nueva (lo gobierna el padre, que solo permite un `activeId` a la vez).
export default function RayadosCard({
  title,
  image,
  alt,
  text,
  isOpen,
  hasHover,
  onOpen,
  onClose,
  onToggle,
}) {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      {/* whitespace-nowrap: los 4 títulos van SIEMPRE en una sola línea (ej.
          "Instalaciones profesionales" no debe partirse — al partirse
          empujaba la línea verde y la foto hacia abajo, rompiendo la
          alineación con las demás tarjetas). La grilla de RayadosCards.js
          usa el `grid-cols-N` de Tailwind (minmax(0,1fr)), así que un
          título más ancho que su columna se derrama visualmente sobre el
          gap en vez de agrandar la columna — igual que en Figma, donde el
          nodo de texto del título es más ancho que la foto de abajo. */}
      <h3 className="whitespace-nowrap font-serif text-[13px] font-medium tracking-[0.05em] text-[#141c2a] sm:text-[16px] md:text-[20px]">
        {title}
      </h3>
      <span className="h-[6px] w-full max-w-[250px] shrink-0 bg-[#4e6804] sm:h-[7px] md:h-[8px]" />
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={`${title}: ver detalle`}
        onPointerEnter={(e) => {
          if (hasHover && e.pointerType === "mouse") onOpen();
        }}
        onPointerLeave={(e) => {
          if (hasHover && e.pointerType === "mouse") onClose();
        }}
        onFocus={() => {
          if (hasHover) onOpen();
        }}
        onBlur={() => {
          if (hasHover) onClose();
        }}
        onClick={(e) => onToggle(e)}
        className="group relative aspect-square w-full max-w-[250px] overflow-hidden rounded-xl outline-offset-4 outline-[#4e6804] transition-shadow duration-300 ease-out focus-visible:outline focus-visible:outline-2 motion-reduce:transition-none"
        style={{
          // Glow suave azul marino (#003750, mismo navy del círculo "de los"
          // y de "SE PARTE DE") alrededor de la tarjeta activa. `overflow-
          // hidden` de arriba no recorta este box-shadow: solo recorta el
          // CONTENIDO (foto/panel), la sombra de la propia caja se pinta
          // igual por fuera — por eso puede convivir con las esquinas
          // redondeadas recortando la foto.
          boxShadow: isOpen
            ? "0 0 0 3px rgba(0,55,80,0.35), 0 10px 32px 6px rgba(0,55,80,0.45)"
            : "0 0 0 0 rgba(0,55,80,0)",
        }}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 250px"
          className="object-cover"
        />
        <span
          aria-hidden={!isOpen}
          className="absolute inset-y-0 left-0 flex w-[76%] items-center rounded-xl bg-white/70 p-[7px] opacity-0 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none"
          style={{
            transform: isOpen ? "translateX(0)" : "translateX(-6px)",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <span className="text-left text-[11px] font-medium leading-[1.45] tracking-[0.03em] text-black sm:text-[12px] md:text-[14px]">
            {text}
          </span>
        </span>
      </button>
    </div>
  );
}
