// Conversión px de Figma -> %/cqw para el layout absoluto del frame Rayados
// (node 1240:1190, canvas 1440x895 — el tramo de encabezado + bloque
// central + franja de pasto; la sección de tarjetas vive fuera de este
// canvas, ver RayadosCards.js). Misma técnica que src/components/hero/
// heroMath.js: aspect-[1440/895] + containerType: inline-size en el frame
// de escritorio, con cada elemento posicionado en % (relativo al canvas) y
// tipografía en cqw (1cqw = 1% del ancho del contenedor). Ver memoria de
// proyecto "champal-niveles-pages-pattern".
export const RAYADOS_CANVAS = { w: 1440, h: 895 };

export function pctX(px) {
  return `${((px / RAYADOS_CANVAS.w) * 100).toFixed(3)}%`;
}

export function pctY(px) {
  return `${((px / RAYADOS_CANVAS.h) * 100).toFixed(3)}%`;
}

export function cqw(px) {
  return `${((px / RAYADOS_CANVAS.w) * 100).toFixed(3)}cqw`;
}

// Tipografía: igual que cqw() pero con un piso legible en clamp() — a
// diferencia del Hero (que solo vive en desktop/mobile-stack separados),
// este frame escalado también se usa en tablet (md–lg), donde un cqw puro
// dejaría textos con mucho tracking (ej. el párrafo, tracking 4px a 20px)
// demasiado pequeños. clamp() nunca baja del piso ni excede el px original
// de Figma, así que en desktop (>=1440 de contenedor) sigue siendo 1:1.
export function cqwText(px, minPx) {
  return `clamp(${minPx}px, ${cqw(px)}, ${px}px)`;
}
