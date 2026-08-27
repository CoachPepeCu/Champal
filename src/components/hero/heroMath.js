// Conversión px de Figma -> %/cqw para el layout absoluto de los Hero de
// nivel (Pre-Kinder, Kinder, Primaria...). Todos comparten el mismo canvas
// de Figma (1440x720) y la misma técnica: aspect-[1440/720] + containerType:
// inline-size en desktop, con cada elemento posicionado en % (relativo al
// canvas) y tipografía en cqw (1cqw = 1% del ancho del contenedor).
//
// Pegar aquí los valores RAW en px que devuelve get_design_context (left,
// top, width, fontSize, letterSpacing) evita el paso manual de "px/1440*100"
// que ya nos causó desajustes por transcripción — ver memoria
// "champal-figma-sites-pixel-accuracy" / "champal-niveles-pages-pattern".
export const HERO_CANVAS = { w: 1440, h: 720 };

export function pctX(px) {
  return `${((px / HERO_CANVAS.w) * 100).toFixed(3)}%`;
}

export function pctY(px) {
  return `${((px / HERO_CANVAS.h) * 100).toFixed(3)}%`;
}

// cqw siempre se calcula sobre el ANCHO del contenedor (aunque se use para
// alto/letter-spacing) — así es como funciona la unidad "container query
// width", y es lo que hace que el cuadro cuadrado de la foto de Kinder
// escale igual en X y Y aunque el canvas no sea 1:1.
export function cqw(px) {
  return `${((px / HERO_CANVAS.w) * 100).toFixed(3)}cqw`;
}
