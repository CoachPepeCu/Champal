# Champal — Design System v2

> **Reemplaza por completo la v1 (paleta "Luna").** No es una actualización incremental: cambia paleta de color, tipografía y, por consecuencia, el sistema de fondos. Ver sección de migración al final.

**Estado:** en construcción — hay un punto abierto bloqueante marcado en rojo abajo.
**Fecha de este documento:** 2026-08-05

---

## 1. Decisión de dirección

- Se abandona el aesthetic oscuro con blobs orgánicos, grain y specular highlights (paleta Luna: `#011C40` → `#A7EBF2`).
- Se adopta el sistema de color y tipografía definido en la colección **"Champal"** de Figma, orientado a UI clara.
- Cambio de tipografía: **Sora/Inter → Fredoka/Outfit.** Esto es un cambio de personalidad de marca (de moderno/editorial a cercano/amigable), no un ajuste cosmético — debe reflejarse también en el tono de las animaciones, iconografía y espaciado, no solo en el font-family.

---

## 2. Color

### 2.1 Navy (marca institucional)

| Token | Hex | Uso |
|---|---|---|
| `navy.900` | `#102C54` | Títulos, fondos oscuros puntuales |
| `navy.800` | `#163B6B` | Botones, superficies oscuras |
| `navy.700` | `#214A80` | Hover / acentos azules |
| `navy.600` | `#2B5B98` | Elementos secundarios, información |
| `navy.100` | `#E8EEF6` | Fondos azul claro |

### 2.2 Red (CTA)

| Token | Hex | Uso |
|---|---|---|
| `red.700` | `#AA181F` | Botón presionado (pressed state) |
| `red.600` | `#C1151F` | **Rojo institucional principal — CTA** |
| `red.500` | `#D83B42` | Hover / acentos rojos |
| `red.100` | `#F7DCDD` | Fondos rojos suaves |

Se mantiene la regla ya establecida: **rojo exclusivo para CTAs**, no se usa decorativamente.

### 2.3 Neutrales / texto

| Token | Hex | Uso |
|---|---|---|
| `ink.900` | `#141C2A` | Texto principal |
| `ink.700` | `#535C6D` | Texto secundario |
| `ink.500` | `#8B95A4` | Datos auxiliares, placeholders |
| `line.300` | `#D8DDE4` | Bordes, divisores |
| `surface.100` | `#F3F5F7` | Fondos de componentes |
| `warm.50` | `#E9E9E9` | Fondo gris claro principal |
| `GrisObscuro` | `#494949` | Texto/elementos secundarios sobre fondo claro |
| `white` | `#FFFFFF` | Superficies, texto sobre fondo oscuro |

### 2.4 Estado

| Token | Hex | Uso |
|---|---|---|
| `state.success` | `#258E52` | Confirmación |
| `state.warning` | `#C98119` | Advertencia |
| `state.error` | `→ red.600` | Error (referencia al rojo institucional) |
| `state.info` | `→ navy.600` | Información (referencia al azul secundario) |

### 2.5 🔴 PENDIENTE — Acento secundario (glow / hover no-CTA)

En la v1 este rol lo cubrían `gold #C9A227` y `amber #FFB800`. **No existen en la colección "Champal" exportada.** No se documenta ningún valor aquí hasta confirmar en Figma si:
- (a) el acento fue eliminado intencionalmente y todo hover/glow se resuelve con `navy.700` / `red.500`, o
- (b) falta exportar una colección o variable adicional.

**No usar ningún color de acento hasta cerrar este punto** — evita que se cuele un valor inventado en componentes ya construidos.

---

## 3. Tipografía

| Rol | Fuente | Notas |
|---|---|---|
| Títulos / display | **Fredoka** | Redondeada, cercana — define el tono "amigable" del rediseño |
| Cuerpo / menú / botones / etiquetas | **Outfit** | |

| Peso | Valor |
|---|---|
| Regular | 400 |
| Medium | 500 |
| Semibold | 600 |
| Bold | 700 |

**Nota de implementación:** Fredoka sobre fondos claros con esquinas duras puede leerse inconsistente — al construir componentes, revisar que el radius/border de botones y cards acompañe el carácter redondeado de la tipografía (no dejar el radius sharp heredado del sistema Luna anterior).

---

## 4. Sistema de fondo — POR DEFINIR

El fondo de 4 capas de la v1 (base sólida oscura → blob orgánico borroso → grain → specular highlight) **no se traslada** a este sistema: fue diseñado para navegar sobre navy oscuro (`#011C40`), no sobre `navy.100` / `surface.100` / `warm.50`. Aplicar la misma receta sobre esta paleta clara probablemente resulte en un fondo plano sin la profundidad que tenía Luna.

**Siguiente paso, antes de tocar componentes:** definir un nuevo lenguaje de fondo para el sistema claro (puede ser flat con acentos de color en bloques, puede seguir usando blobs pero en tonos claros con opacity baja, etc.) y pasarlo por el mismo proceso de aprobación iterativa que se usó para Luna — 2-3 variantes de prueba antes de construir sobre él.

---

## 5. Estado del prototipo existente

El prototipo funcional ya construido en Claude Code fue hecho sobre el sistema Luna (v1). Con este cambio de dirección, **no está alineado** con la paleta ni tipografía actuales. Decisión pendiente: reconstruir desde cero vs. conservar como referencia de estructura/interacciones y re-skinear.

---

## 6. Migración desde v1 (Luna) — registro de qué se elimina

| Rol en v1 | Valor v1 | Reemplazo v2 |
|---|---|---|
| Navy deep | `#011C40` | `navy.900` `#102C54` |
| Navy mid | `#023859` | `navy.800` `#163B6B` |
| Blue mid | `#26658C` | `navy.700` `#214A80` |
| Blue soft | `#54ACBF` | `navy.600` `#2B5B98` |
| Blue light | `#A7EBF2` | `navy.100` `#E8EEF6` (nota: mucho más claro, no es un análogo directo) |
| Navy brand | `#172E57` | sin equivalente directo — evaluar si `navy.800`/`900` lo cubre |
| Red CTA | `#DA1F26` | `red.600` `#C1151F` |
| Gold | `#C9A227` | ⚠️ sin reemplazo — ver §2.5 |
| Amber-yellow | `#FFB800` | ⚠️ sin reemplazo — ver §2.5 |
| Display font | Sora | Fredoka |
| Body font | Inter | Outfit |
| Fondo | Sistema de 4 capas dark | ⚠️ sin definir — ver §4 |

