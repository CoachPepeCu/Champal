---
workflow: general-video
flow: automation
storyboard: no
message: "Champal es un recorrido de formación de 35 años: los alumnos descubren, aprenden, crecen y se preparan para transformar el mundo — 35 años formando campeones."
destination: website-hero
aspect: 1920x1080
language: es
length: 21s
angle: cinematic-emotional-brand-anthem
---

## Intent

Hero cinematográfico para la página web del Colegio Champal (México), construido
con HyperFrames a partir de material real del colegio. Debe sentirse aspiracional,
humano, premium — nunca un slideshow corporativo. Concepto central: "35 años
formando campeones", donde "campeones" es formación integral (conocimiento,
carácter, valores, confianza), no solo deporte. Arco: DESCUBRIR → APRENDER →
CRECER → TRASCENDER → 35 AÑOS (cierre de marca). Debe funcionar sin sonido
(uso como Hero web).

## Assets

- assets/images/01-descubrir-cheer.png — alumnos de preescolar celebrando con los brazos arriba (real Champal, upscaled desde miniatura de Facebook 206×206 vía Higgsfield bytedance_image_upscale — contenido sin alterar). Escena DESCUBRIR.
- assets/images/05-descubrir-toddler-bow.png — niña pequeña de perfil, uniforme Champal, upscaled. Escena DESCUBRIR.
- assets/images/02-aprender-teacher-laptop.png — maestra frente a laptop en salón, upscaled. Escena APRENDER.
- assets/images/03-aprender-craft-table.png — alumnos en mesa de trabajo con manualidad, sonriendo, upscaled. Escena APRENDER.
- assets/images/04-aprender-mom-laptop.png — adulta y alumno frente a laptop, upscaled. Escena APRENDER.
- assets/images/06-crecer-fists-up.png — dos alumnos uniformados, puños en alto, confianza, upscaled. Escena CRECER.
- assets/images/07-crecer-girl-pointing.png — alumna de camiseta roja, expresiva, upscaled. Escena CRECER.
- assets/images/grad-01-laughing.jpg — dos egresadas riendo en toga y birrete (alta resolución original). Escena TRASCENDER.
- assets/images/grad-02-diploma.jpg — egresada caminando en el escenario con diploma, letrero "Generación 2023-2026" (alta resolución original). Escena TRASCENDER.
- assets/logo/champal-logo.svg — logotipo oficial Champal, sin modificar. Cierre de marca.
- assets/logo/badge-35-2x.png — emblema conmemorativo "35" recortado del asset "Firma Champal.png" entregado, mismos píxeles reales (solo recorte + upscale lanczos, sin regenerar). Escena 35 AÑOS.

## Customizations

- Ninguna narración hablada; solo tipografía cinematográfica (DESCUBRIR / APRENDER / CRECER / TRASCENDER / 35 AÑOS FORMANDO CAMPEONES) + línea secundaria por escena.
- Ken Burns / slow-zoom + parallax en cada fotografía para dar profundidad cinematográfica (no slideshow estático).
- Sin BGM en esta v1: HeyGen no autenticado (`npx hyperframes auth status` → not signed in) y engines locales (Kokoro/MusicGen) no instalados. El brief del usuario permite explícitamente que funcione sin audio ("debe funcionar visualmente incluso sin sonido"). Queda anotado como upgrade de v2.

## Notes

- El MP4 "20 Facebook.mp4" incluido en el ZIP del usuario NO es material de Champal — es un video promocional inmobiliario de "Medland Spain" (playas/desarrollo residencial en España, verificado fotograma a fotograma). Excluido por completo de la v1 tras confirmarlo con el usuario, quien pidió omitirlo y construir solo con las fotografías reales.
- No inventar alumnos, instalaciones, uniformes ni espacios que no estén en los assets provistos.
- Logotipo y emblema 35 años usados exactamente como fueron entregados — solo recorte/upscale técnico, ningún rediseño.
- Colores institucionales tomados del SVG del logo: navy #162F57, rojo #DA2026; acentos del emblema 35 (azul claro, amarillo) para textos/detalles.
