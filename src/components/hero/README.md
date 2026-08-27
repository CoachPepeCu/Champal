# Hero de nivel — receta

Piezas reutilizables para el Hero de cada página de nivel (`/niveles/<slug>`).
Ya se usan en `PreKinderHero.js`, `KinderHero.js`, `PrimariaHero.js`,
`SecundariaHero.js` y `PreparatoriaHero.js`; para cualquier nivel nuevo
repite esta receta en vez de escribir el layout absoluto a mano.

## 1. Saca el nodo exacto de Figma

Carga el skill `figma:figma-design-to-code` y llama `get_design_context`
sobre el nodo del Hero (no adivines desde el screenshot). El código que
regresa trae los valores en **px sobre un canvas de 1440x720** — esos son
los que se pegan directo en los props de abajo, sin convertir nada a mano.

Si el Hero trae una foto, **usa la URL de imagen que el propio código de
`get_design_context` referencia** (la constante `img...`), no el "export" de
`download_assets` — puede venir recortado distinto. Si esa capa trae algún
`transform` (rotate/scale) en el código devuelto, hay que reaplicarlo por
`style` (nunca con una utilidad Tailwind `-scale-x-*`/`-rotate-*`: no
funcionan en este proyecto, Tailwind v4 — ver memoria de proyecto
`champal-tailwind-v4-negative-utilities`).

## 2. Arma el componente

```jsx
import Image from "next/image";
import {
  HeroSection, HeroDesktopFrame, HeroMobileStack, HeroBlueBand,
  HeroWatermark, HeroTitle, HeroSubhead, HeroPhotoFloating, HeroPhotoSplit,
} from "@/components/hero";

export default function PrimariaHero() {
  return (
    <HeroSection>
      <HeroMobileStack
        imageSrc="/images/primaria/hero-nino.png"
        imageAlt="Alumno de Primaria de Colegio Champal"
        title="Primaria"
        watermarkText="PRIMARIA"
        subheadText="..."
        imageFlip // solo si la capa de Figma trae el transform de espejo
      />

      <HeroDesktopFrame>
        <HeroBlueBand />
        <HeroWatermark text="PRIMARIA" leftPx={...} topPx={...} widthPx={...} fontSizePx={220} />
        <HeroTitle text="Primaria" leftPx={...} topPx={...} fontSizePx={128} />
        <HeroSubhead text="..." leftPx={...} topPx={...} widthPx={...} fontSizePx={56} letterSpacingPx={2.24} />
        {/* foto tipo cutout flotante (patrón Kinder) */}
        <HeroPhotoFloating src="/images/primaria/hero-nino.png" alt="..." leftPx={...} topPx={...} sizePx={741} flip />
        {/* — o — foto de medio canvas a todo lo alto (patrón Pre-Kinder) */}
        {/* <HeroPhotoSplit src="..." alt="..." /> */}
      </HeroDesktopFrame>
    </HeroSection>
  );
}
```

Todos los `...Px` son los valores RAW de Figma (left/top/width/fontSize en
px); los componentes hacen la conversión a `%`/`cqw` internamente
(`heroMath.js`). No hace falta calcular nada a mano.

## 3. Página + nav

- `src/app/niveles/<slug>/page.js`: mismo patrón que `pre-kinder` y `kinder`
  (`Header` + `<XHero />` + resto de secciones + `Footer` + `HalconButton` +
  `metadata`).
- Actualiza `SUBMENU_NIVELES` en **`Header.js` y `Footer.js`**: cambia
  `href: "/#<slug>"` por `href: "/niveles/<slug>"`. Fácil de olvidar porque
  el ancla vieja "funciona" (hace scroll al home) sin marcar error.

## 4. Verifica

Con el dev server corriendo, mide el DOM real (no lo asumas): compara
`getBoundingClientRect()` de cada elemento contra los px de Figma
(÷1440 o ÷720 ×100) y, si hay algún `transform`, léelo con
`getComputedStyle(el).transform` — no lo simules a mano en una verificación
aparte. Ver memoria `champal-tailwind-v4-negative-utilities` sobre por qué
esto importa.
