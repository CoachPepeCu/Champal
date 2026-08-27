import { pctX, pctY, cqw } from "./heroMath";

// Párrafo/mensaje del hero, sobre la zona azul. Dos variantes vistas hasta
// ahora: centrado bajo el título (Pre-Kinder: `center=true`, ancla por punto
// medio) o alineado a la izquierda en su propio bloque (Kinder:
// `center=false`, sin translate).
export default function HeroSubhead({
  text,
  leftPx,
  topPx,
  widthPx,
  fontSizePx,
  letterSpacingPx = 0,
  center = false,
  color = "#ffffff",
}) {
  return (
    <p
      className={`absolute font-serif font-semibold leading-tight${center ? " text-center" : ""}`}
      style={{
        left: pctX(leftPx),
        top: pctY(topPx),
        width: pctX(widthPx),
        transform: center ? "translateX(-50%)" : undefined,
        fontSize: cqw(fontSizePx),
        letterSpacing: cqw(letterSpacingPx),
        color,
      }}
    >
      {text}
    </p>
  );
}
