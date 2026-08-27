import { pctX, pctY, cqw } from "./heroMath";

// Marca de agua de texto gigante y translúcido (p.ej. "PRE-KINDER",
// "KINDER" centradas sobre la banda azul; "PRIMARIA" anclada a la
// izquierda sobre la foto, con su propio color). Recibe las
// posiciones/tamaño en px RAW de Figma (canvas 1440x720) — nada de %/cqw a
// mano. `center=true` (default, back-compat Pre-Kinder/Kinder) ancla por
// punto medio con `widthPx`; `center=false` (Primaria) ancla el borde
// izquierdo directo, sin `widthPx`, igual que la capa de Figma original.
export default function HeroWatermark({
  text,
  leftPx,
  topPx,
  widthPx,
  fontSizePx,
  center = true,
  color = "rgba(247,247,247,0.08)",
}) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute font-serif font-bold leading-none whitespace-nowrap"
      style={{
        left: pctX(leftPx),
        top: pctY(topPx),
        width: center ? pctX(widthPx) : undefined,
        transform: center ? "translateX(-50%)" : undefined,
        textAlign: center ? "center" : undefined,
        fontSize: cqw(fontSizePx),
        color,
      }}
    >
      {text}
    </span>
  );
}
