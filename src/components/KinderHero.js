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

// Réplica 1:1 del layout absoluto de Figma (node 82:1551 "Hero_Kinder",
// canvas 1440x720), sacado con get_design_context (no a ojo desde el
// screenshot). Construido con el kit de src/components/hero — ver su
// README para la receta al armar los siguientes niveles.
//
// El asset (/images/kinder/hero-kinder-boy.png) es el fill ORIGINAL
// (1280x1280, con margen transparente) referenciado por get_design_context
// — no el "export" compuesto de download_assets, que viene recortado más
// ajustado al niño y hacía que object-cover lo mostrara más grande y
// encimado sobre el texto. Figma aplica "-scale-y-100 rotate-180" a esa
// capa (equivale neto a un espejo horizontal) — por eso `flip` en
// HeroPhotoFloating/HeroMobileStack, aplicado por `style` porque la
// utilidad Tailwind "-scale-x-100" no funciona en este proyecto (Tailwind
// v4) — ver memoria de proyecto "champal-tailwind-v4-negative-utilities".
const BOY_PHOTO = "/images/kinder/hero-kinder-boy.png";
const BOY_ALT = "Alumno de Kinder de Colegio Champal";

export default function KinderHero() {
  return (
    <PixelCurtain>
      <HeroSection>
        <HeroMobileStack
          imageSrc={BOY_PHOTO}
          imageAlt={BOY_ALT}
          title="Kinder"
          watermarkText="KINDER"
          subheadText="Iniciamos el maravilloso viaje por la lectoescritura y la lógica-matemática"
          imageFlip
        />

        <HeroDesktopFrame>
          <HeroBlueBand />

          {/* node 82:1554 */}
          <HeroWatermark text="KINDER" leftPx={532.5} topPx={455} widthPx={965} fontSizePx={220} />

          {/* node 82:1552 */}
          <HeroTitle text="Kinder" leftPx={485} topPx={135} fontSizePx={128} />

          {/* node 82:1556 — alineado a la izquierda, sin centrar */}
          <HeroSubhead
            text="Iniciamos el maravilloso viaje por la lectoescritura y la lógica-matemática"
            leftPx={70}
            topPx={370}
            widthPx={755}
            fontSizePx={56}
            letterSpacingPx={2.24}
          />

          {/* node 181:729 — cuadro flotante 741x741 */}
          <HeroPhotoFloating src={BOY_PHOTO} alt={BOY_ALT} leftPx={690} topPx={-29} sizePx={741} flip />
        </HeroDesktopFrame>
      </HeroSection>
    </PixelCurtain>
  );
}
