# Rayados — frame aislado

Réplica visual/responsiva del frame **Rayados** de Figma
(node `1240:1190`, canvas ~1440×1365) — sección "Escuela Oficial de los
Rayados de Monterrey". Construido como pieza aislada para revisión en
`/dev/frame-rayados`; **no** está enlazado desde ninguna página real, no
tiene Header/Footer/botón Halcón/overlay/navegación, y no se modificó nada
fuera de esta carpeta + `src/app/dev/frame-rayados/` + `public/images/rayados/`.

## Archivos

- `Rayados.js` — raíz: compone el stack móvil, el frame de escritorio/tablet
  y las tarjetas.
- `rayadosMath.js` — conversión px de Figma → `%`/`cqw` (misma técnica que
  `src/components/hero/heroMath.js`).
- `RayadosDesktopFrame.js` — encabezado + bloque central + pasto, visible
  desde `md` (768px): un solo canvas `aspect-[1440/895]` con
  `containerType: inline-size`, todo posicionado en `%`/`cqw` a partir de los
  valores RAW de `get_design_context`. La tipografía usa `cqwText()` (un
  `clamp()` con piso legible) en vez de `cqw()` puro, porque este frame
  también cubre tablet (a diferencia del Hero, que solo vive en desktop).
- `RayadosMobileStack.js` — versión para `< md`: columna real (no el mismo
  canvas achicado), sin superposiciones de texto. El jugador se monta sobre
  el borde del encabezado a propósito (mismo motivo que en Figma).
- `RayadosCards.js` / `RayadosCard.js` — las cuatro tarjetas
  ("Ser escuela oficial", "Maestros certificados", "Instalaciones
  profesionales", "Objetivos"). Grilla Tailwind normal
  (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) — no depende del canvas
  escalado, así que un solo componente cubre los tres breakpoints pedidos
  por el brief (1/2/4 columnas).

## Por qué el hover/foco/toque se resuelve así

Un solo `activeId` en `RayadosCards.js` garantiza que solo una tarjeta
muestre su panel a la vez. El detalle no obvio es el conflicto entre foco y
click en la MISMA interacción:

- En un toque en pantalla táctil, el navegador dispara `focus` y luego
  `click` para el mismo gesto. Si el foco auto-abre la tarjeta, el `click`
  que sigue de inmediato la volvería a cerrar en el mismo toque (el usuario
  vería un parpadeo, no una apertura).
- Por eso el foco solo auto-abre cuando `hasHover` es `true` (detectado con
  `matchMedia("(hover: hover) and (pointer: fine)")` — dispositivo con mouse
  real). En táctil (`hasHover: false`) el único disparador es el `click`
  del `<button>`, que alterna directo: primer toque abre, tocar la misma
  cierra, tocar otra cierra esa y abre la nueva.
- En desktop con teclado, `Enter`/`Espacio` deben poder alternar el panel
  que el foco ya abrió. Se distingue ese click "de teclado" de un click de
  mouse real vía `event.detail === 0` (los clicks sintéticos por tecla
  siempre traen `detail 0`) — así el primer `Enter` cierra el panel en vez
  de que quede atrapado en "ya está abierto, no hago nada".

No se usa Motion/framer-motion para el hover (no hace falta para un
fade+desplazamiento simple): son clases Tailwind con `transition-[opacity,transform]`
+ `motion-reduce:transition-none`, que ya cubre `prefers-reduced-motion`.
No se usa la tecla ESC en ningún punto de este componente.

## Assets

`public/images/rayados/` — descargados 1:1 desde Figma
(`get_design_context` + `download_assets` sobre el node `1240:1190`), sin
URLs temporales de Figma en el código. Mismo patrón que
`public/images/primaria/...` (ver memoria de proyecto
"champal-niveles-pages-pattern"): referenciados por ruta pública, no por
`import`.

`HALCONES CHAMPAL-RAYADOS` usa Fredoka (peso 700) en vez de la fuente
"Varsity" del diseño: Varsity no está instalada en el proyecto (solo
Fredoka/Outfit/Patrick Hand en `src/app/layout.js`) y el encargo pide no
instalar fuentes nuevas.
