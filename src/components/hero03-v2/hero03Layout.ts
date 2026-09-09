export const HERO03_STAGE = {
  width: 1440,
  height: 760,
} as const

export type Hero03Transform = {
  x: number
  y: number
  z: number
  rotateX: number
  rotateY: number
  rotateZ: number
  scale: number
  opacity: number
  startOffset: number
  duration: number
}

export type Hero03Piece = Hero03Transform & {
  id: string
  src: string
  alt: string
  xFinal: number
  yFinal: number
  width: number
  height: number
}

// Coordenadas finales: frame Figma 1558:1158, relativas a su segunda
// superficie de 1440 x 760. Los valores de entrada son deliberadamente
// explícitos para permitir dirección artística pieza por pieza.
export const HERO03_PIECES: readonly Hero03Piece[] = [
  { id: "collage-5", src: "/images/Collage/5.webp", alt: "Vida escolar Champal", xFinal: 6, yFinal: 25, width: 200, height: 200, x: -760, y: -310, z: -1120, rotateX: 34, rotateY: -46, rotateZ: -14, scale: 0.42, opacity: 0, startOffset: 0.08, duration: 0.58 },
  { id: "collage-4", src: "/images/Collage/4.webp", alt: "Vida escolar Champal", xFinal: 209, yFinal: 25, width: 200, height: 250, x: -410, y: -510, z: -410, rotateX: -42, rotateY: 25, rotateZ: 11, scale: 0.76, opacity: 0, startOffset: 0.19, duration: 0.47 },
  { id: "collage-3", src: "/images/Collage/3.webp", alt: "Vida escolar Champal", xFinal: 412, yFinal: 25, width: 200, height: 200, x: -150, y: -650, z: -1200, rotateX: 52, rotateY: -19, rotateZ: -9, scale: 0.34, opacity: 0, startOffset: 0.31, duration: 0.61 },
  { id: "valor-ciudadania", src: "/images/Valores/Ciudadania.webp", alt: "Ciudadanía global", xFinal: 615, yFinal: 25, width: 200, height: 202, x: 65, y: -580, z: 350, rotateX: -28, rotateY: 14, rotateZ: 7, scale: 1.28, opacity: 0, startOffset: 0.12, duration: 0.42 },
  { id: "collage-2", src: "/images/Collage/2.webp", alt: "Vida escolar Champal", xFinal: 818, yFinal: 25, width: 200, height: 250, x: 280, y: -570, z: -760, rotateX: 23, rotateY: 37, rotateZ: 13, scale: 0.55, opacity: 0, startOffset: 0.27, duration: 0.54 },
  { id: "collage-6", src: "/images/Collage/6.webp", alt: "Vida escolar Champal", xFinal: 1021, yFinal: 25, width: 200, height: 200, x: 520, y: -390, z: -180, rotateX: -31, rotateY: -39, rotateZ: -10, scale: 0.88, opacity: 0, startOffset: 0.38, duration: 0.39 },
  { id: "collage-10", src: "/images/Collage/10.webp", alt: "Vida escolar Champal", xFinal: 1230, yFinal: 25, width: 200, height: 250, x: 810, y: -260, z: -980, rotateX: 39, rotateY: 48, rotateZ: 16, scale: 0.46, opacity: 0, startOffset: 0.16, duration: 0.66 },
  { id: "collage-9", src: "/images/Collage/9.webp", alt: "Vida escolar Champal", xFinal: 6, yFinal: 247, width: 200, height: 250, x: -860, y: -40, z: -270, rotateX: -19, rotateY: -51, rotateZ: 12, scale: 0.82, opacity: 0, startOffset: 0.34, duration: 0.45 },
  { id: "valor-integridad", src: "/images/Valores/Integridad.webp", alt: "Integridad", xFinal: 210, yFinal: 283, width: 200, height: 198, x: -530, y: 110, z: 320, rotateX: 27, rotateY: 31, rotateZ: -12, scale: 1.24, opacity: 0, startOffset: 0.43, duration: 0.35 },
  { id: "collage-16", src: "/images/Collage/16.webp", alt: "Vida escolar Champal", xFinal: 414, yFinal: 247, width: 200, height: 250, x: -310, y: -10, z: -1160, rotateX: -47, rotateY: 22, rotateZ: 10, scale: 0.37, opacity: 0, startOffset: 0.23, duration: 0.69 },
  { id: "collage-12", src: "/images/Collage/12.webp", alt: "Vida escolar Champal", xFinal: 618, yFinal: 247, width: 200, height: 200, x: -55, y: -160, z: -610, rotateX: 25, rotateY: -33, rotateZ: -8, scale: 0.63, opacity: 0, startOffset: 0.48, duration: 0.40 },
  { id: "collage-1", src: "/images/Collage/1.webp", alt: "Vida escolar Champal", xFinal: 822, yFinal: 283, width: 200, height: 250, x: 250, y: 75, z: -1040, rotateX: -36, rotateY: 43, rotateZ: 9, scale: 0.41, opacity: 0, startOffset: 0.36, duration: 0.57 },
  { id: "valor-hermandad", src: "/images/Valores/Hermandad.webp", alt: "Hermandad", xFinal: 1026, yFinal: 256, width: 200, height: 200, x: 500, y: -80, z: 270, rotateX: 21, rotateY: -29, rotateZ: 12, scale: 1.19, opacity: 0, startOffset: 0.25, duration: 0.38 },
  { id: "collage-7", src: "/images/Collage/7.webp", alt: "Vida escolar Champal", xFinal: 1230, yFinal: 283, width: 200, height: 200, x: 840, y: 120, z: -520, rotateX: -24, rotateY: 52, rotateZ: -14, scale: 0.67, opacity: 0, startOffset: 0.45, duration: 0.44 },
  { id: "valor-compromiso", src: "/images/Valores/Compromiso.webp", alt: "Compromiso", xFinal: 6, yFinal: 515, width: 200, height: 204, x: -790, y: 470, z: 210, rotateX: -32, rotateY: -38, rotateZ: -15, scale: 1.16, opacity: 0, startOffset: 0.51, duration: 0.34 },
  { id: "collage-8", src: "/images/Collage/8.webp", alt: "Vida escolar Champal", xFinal: 214, yFinal: 502, width: 200, height: 200, x: -480, y: 530, z: -780, rotateX: 41, rotateY: 27, rotateZ: 11, scale: 0.51, opacity: 0, startOffset: 0.32, duration: 0.63 },
  { id: "collage-15", src: "/images/Collage/15.webp", alt: "Vida escolar Champal", xFinal: 414, yFinal: 519, width: 200, height: 200, x: -260, y: 590, z: -90, rotateX: -26, rotateY: -23, rotateZ: -9, scale: 0.91, opacity: 0, startOffset: 0.56, duration: 0.33 },
  { id: "valor-compasion", src: "/images/Valores/Compasion.webp", alt: "Compasión", xFinal: 618, yFinal: 474, width: 200, height: 208, x: 35, y: 620, z: 340, rotateX: 33, rotateY: 18, rotateZ: 8, scale: 1.26, opacity: 0, startOffset: 0.29, duration: 0.46 },
  { id: "collage-14", src: "/images/Collage/14.webp", alt: "Vida escolar Champal", xFinal: 822, yFinal: 519, width: 200, height: 200, x: 290, y: 570, z: -1190, rotateX: -51, rotateY: 29, rotateZ: -11, scale: 0.35, opacity: 0, startOffset: 0.54, duration: 0.48 },
  { id: "collage-13", src: "/images/Collage/13.webp", alt: "Vida escolar Champal", xFinal: 1026, yFinal: 486, width: 200, height: 200, x: 560, y: 510, z: -390, rotateX: 29, rotateY: -44, rotateZ: 13, scale: 0.74, opacity: 0, startOffset: 0.41, duration: 0.55 },
  { id: "valor-excelencia", src: "/images/Valores/Excelencia.webp", alt: "Excelencia académica", xFinal: 1230, yFinal: 519, width: 200, height: 200, x: 810, y: 430, z: 300, rotateX: -30, rotateY: 41, rotateZ: 15, scale: 1.22, opacity: 0, startOffset: 0.49, duration: 0.41 },
] as const
