import {
  HeroSection,
  HeroDesktopFrame,
  HeroMobileStack,
  HeroBlueBand,
  HeroWatermark,
  HeroTitle,
  HeroSubhead,
  HeroPhotoFloating,
  pctX,
  pctY,
  cqw,
} from "@/components/hero";
import PixelCurtain from "@/components/effects/PixelCurtain";

// Réplica 1:1 del layout absoluto de Figma (node 267:560 "Hero_Secundaria",
// canvas 1440x720), re-sacado con get_design_context el 2026-08-20 después
// de que el usuario actualizó el archivo para bajar el título por debajo de
// la barra de navegación. Construido con el kit de src/components/hero —
// ver su README para la receta general.
//
// El asset (/images/secundaria/hero-chicos-secundaria.png) es el fill
// ORIGINAL que referencia get_design_context (no el "export" de
// download_assets) — ver memoria de proyecto
// "champal-niveles-pages-pattern". La capa no trae ningún transform en el
// código devuelto, así que no lleva `flip`; sí trae `object-contain` (no
// `object-cover` como Kinder/Primaria) — ver `fit="contain"` abajo.
//
// El nodo 469:830 ("Rectangle 20", gris #d9d9d9, x:0 y:5 w:1440 h:80) es un
// PLACEHOLDER de la barra de navegación real del sitio — el propio Header.js
// ya la implementa como componente `fixed` aparte, así que este rectángulo
// NO se replica aquí (haría un bloque gris duplicado sobre el header real).
// Es justamente la referencia que explica por qué el título (267:561) ahora
// arranca en top:85 — inmediatamente debajo de esa barra de 80px.
//
// El mensaje (nodo 267:563 + 322:7396) va en DOS líneas con estilos
// distintos — la primera en azul petróleo (#003750) sobre blanco, la
// segunda en blanco sobre un bloque rectangular navy (#00055c, nodo
// 445:1145) — así que se arma con dos <HeroSubhead> independientes (mismo
// punto de anclaje horizontal) más un rectángulo de fondo hecho a mano con
// los helpers pctX/pctY/cqw del kit (mismo patrón usado para elementos "un
// solo uso" fuera de los componentes estándar, ver memoria
// "champal-niveles-pages-pattern").
//
// La marca de agua "SECUNDARIA" (267:565) va AL FRENTE de la foto en Figma
// (es la última capa antes del placeholder de nav en el código devuelto por
// get_design_context, por encima de la foto 442:1143) — por eso se coloca
// al final, después de <HeroPhotoFloating>, en vez de antes como en
// Pre-Kinder/Kinder/Primaria (donde no se solapaba con ninguna foto).
const CHICOS_PHOTO = "/images/secundaria/hero-chicos-secundaria.png";
const CHICOS_ALT = "Alumnos de Secundaria de Colegio Champal";

export default function SecundariaHero() {
  return (
    <PixelCurtain>
      <HeroSection>
        <HeroMobileStack
          imageSrc={CHICOS_PHOTO}
          imageAlt={CHICOS_ALT}
          title="Secundaria"
          watermarkText="SECUNDARIA"
          subheadText="Fomentamos el valor de tomar buenas decisiones con libertad y responsabilidad"
        />

        <HeroDesktopFrame>
          <HeroBlueBand />

          {/* node 267:561 — top:85, justo debajo del placeholder de nav (0-80) */}
          <HeroTitle text="Secundaria" leftPx={1016} topPx={85} fontSizePx={128} />

          {/* node 445:1145 — bloque navy detrás de la 2a línea del mensaje */}
          <div
            className="absolute"
            style={{
              left: pctX(832.41),
              top: pctY(358.68),
              width: cqw(570.585),
              height: cqw(134.316),
              backgroundColor: "#00055c",
            }}
          />

          {/* node 267:563 — 1a línea, azul petróleo sobre blanco */}
          <HeroSubhead
            text="Fomentamos el valor de tomar buenas decisiones"
            leftPx={1117.1}
            topPx={261}
            widthPx={574.204}
            fontSizePx={36}
            letterSpacingPx={1.44}
            center
            color="#003750"
          />

          {/* node 322:7396 — 2a línea, blanco sobre el bloque navy de arriba */}
          <HeroSubhead
            text="con libertad y responsabilidad"
            leftPx={1117.1}
            topPx={352.02}
            widthPx={574.204}
            fontSizePx={48}
            letterSpacingPx={1.92}
            center
            color="#ffffff"
          />

          {/* node 442:1143 — foto 791x631, object-contain (no cover) */}
          <HeroPhotoFloating
            src={CHICOS_PHOTO}
            alt={CHICOS_ALT}
            leftPx={0}
            topPx={89}
            widthPx={791}
            heightPx={631}
            fit="contain"
            sizes="55vw"
          />

          {/* node 267:565 — al frente de la foto, anclada a la izquierda,
              gris translúcido, no centrada */}
          <HeroWatermark
            text="SECUNDARIA"
            leftPx={476}
            topPx={462}
            fontSizePx={156}
            center={false}
            color="rgba(139,139,139,0.35)"
          />
        </HeroDesktopFrame>
      </HeroSection>
    </PixelCurtain>
  );
}
