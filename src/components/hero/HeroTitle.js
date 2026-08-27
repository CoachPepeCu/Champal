import { pctX, pctY, cqw } from "./heroMath";

// Título grande del nivel ("Pre-Kinder", "Kinder", ...) sobre la zona
// blanca. `center=true` (default) replica el anclaje por centro que usa
// Figma (left = punto medio + translateX(-50%)); pon `center={false}` si
// algún nivel lo trae alineado a un borde en vez de centrado.
export default function HeroTitle({ text, leftPx, topPx, fontSizePx, color = "#00055c", center = true }) {
  return (
    <h1
      className="absolute font-serif font-bold leading-none whitespace-nowrap"
      style={{
        left: pctX(leftPx),
        top: pctY(topPx),
        transform: center ? "translateX(-50%)" : undefined,
        color,
        fontSize: cqw(fontSizePx),
      }}
    >
      {text}
    </h1>
  );
}
