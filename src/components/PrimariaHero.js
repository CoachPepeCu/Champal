import {
  HeroSection,
  HeroDesktopFrame,
  HeroMobileStack,
  HeroBlueBand,
  HeroWatermark,
  HeroTitle,
  HeroSubhead,
  HeroPhotoFloating,
} from "@/components/hero";
import PixelCurtain from "@/components/effects/PixelCurtain";

// Réplica 1:1 del layout absoluto de Figma (node 181:732 "Hero_Primaria",
// canvas 1440x720), sacado con get_design_context. Construido con el kit de
// src/components/hero — ver su README para la receta general.
//
// Dos diferencias respecto a Pre-Kinder/Kinder que ampliaron el kit en vez
// de escribirse a mano:
// - La foto ("Niños primaria", node 181:1399) es un rectángulo ancho
//   (955x637), no un cuadrado cutout (Kinder) ni medio canvas a toda altura
//   (Pre-Kinder) — HeroPhotoFloating ahora acepta widthPx/heightPx además
//   de sizePx.
// - La marca de agua "PRIMARIA" (node 181:735) NO va centrada sobre la
//   banda azul: va anclada a la izquierda, sobre la foto/banda azul, con un
//   gris translúcido propio (rgba(139,139,139,0.35)) en vez del blanco
//   translúcido default — HeroWatermark ahora acepta `center` y `color`.
//
// El asset (/images/primaria/hero-ninos-primaria.png) es el fill ORIGINAL
// que referencia get_design_context (no el "export" de download_assets) —
// ver memoria de proyecto "champal-niveles-pages-pattern". La capa no trae
// ningún transform en el código devuelto, así que no lleva `flip`.
const NINOS_PHOTO = "/images/primaria/hero-ninos-primaria.png";
const NINOS_ALT = "Alumnos de Primaria de Colegio Champal";

export default function PrimariaHero() {
  return (
    <PixelCurtain>
      <HeroSection>
        <HeroMobileStack
          imageSrc={NINOS_PHOTO}
          imageAlt={NINOS_ALT}
          title="Primaria"
          watermarkText="PRIMARIA"
          subheadText="Preguntamos más, aprendemos mejor"
        />

        <HeroDesktopFrame>
          <HeroBlueBand />

          {/* node 181:735 — anclada a la izquierda, gris translúcido, no centrada */}
          <HeroWatermark
            text="PRIMARIA"
            leftPx={700}
            topPx={530}
            fontSizePx={156}
            center={false}
            color="rgba(139,139,139,0.35)"
          />

          {/* node 181:733 */}
          <HeroTitle text="Primaria" leftPx={1138.5} topPx={61} fontSizePx={128} />

          {/* node 181:736 — alineado a la izquierda (calc(50% + 231px) = 951px), sin centrar */}
          <HeroSubhead
            text="Preguntamos más, aprendemos mejor"
            leftPx={951}
            topPx={396}
            widthPx={476}
            fontSizePx={52}
            letterSpacingPx={2.08}
          />

          {/* node 181:1399 — rectángulo ancho 955x637, llega justo al borde inferior del canvas */}
          <HeroPhotoFloating
            src={NINOS_PHOTO}
            alt={NINOS_ALT}
            leftPx={-15}
            topPx={83}
            widthPx={955}
            heightPx={637}
            sizes="66vw"
          />
        </HeroDesktopFrame>
      </HeroSection>
    </PixelCurtain>
  );
}
