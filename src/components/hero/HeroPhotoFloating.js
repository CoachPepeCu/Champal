import Image from "next/image";
import { pctX, pctY, cqw } from "./heroMath";

// Foto tipo "cuadro flotante" que se sobrepone a ambas zonas (patrón de
// Kinder: cutout cuadrado con object-cover; patrón de Primaria: rectángulo
// ancho, pasando widthPx/heightPx en vez de sizePx). Usa siempre el asset
// FILL original que referencia get_design_context (no el "export" de
// download_assets, que puede venir recortado distinto) — ver memoria
// "champal-niveles-pages-pattern". Si la capa trae "-scale-y-100 rotate-180"
// (u otro transform) en Figma, pasa `flip` (o `style` con el transform que
// corresponda) — aplícalo con `style`, NO con una clase Tailwind
// "-scale-x-100": esa utilidad no funciona en este proyecto (Tailwind v4),
// ver memoria "champal-tailwind-v4-negative-utilities".
//
// cqw se calcula siempre sobre el ANCHO del contenedor (ver heroMath.js),
// pero como HeroDesktopFrame fija aspect-[1440/720], una altura en cqw
// termina siendo matemáticamente idéntica a su pctY equivalente — por eso
// widthPx/heightPx (rectángulo) pueden usar cqw igual que sizePx (cuadrado).
//
// `fit` ("cover" default, o "contain") — Secundaria trae la foto con
// object-contain en el código de Figma (a diferencia de Kinder/Primaria,
// que usan cover); pásalo tal cual venga en get_design_context en vez de
// asumir cover siempre.
export default function HeroPhotoFloating({
  src,
  alt,
  leftPx,
  topPx,
  sizePx,
  widthPx,
  heightPx,
  flip = false,
  sizes = "52vw",
  preload = true,
  fit = "cover",
}) {
  const w = sizePx ?? widthPx;
  const h = sizePx ?? heightPx;
  return (
    <div
      className="absolute"
      style={{ left: pctX(leftPx), top: pctY(topPx), width: cqw(w), height: cqw(h) }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        preload={preload}
        sizes={sizes}
        className={fit === "contain" ? "object-contain" : "object-cover"}
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      />
    </div>
  );
}
