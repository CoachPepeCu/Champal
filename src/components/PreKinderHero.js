import {
  HeroSection,
  HeroDesktopFrame,
  HeroMobileStack,
  HeroBlueBand,
  HeroWatermark,
  HeroTitle,
  HeroSubhead,
  HeroPhotoSplit,
} from "@/components/hero";
import PixelCurtain from "@/components/effects/PixelCurtain";

// Réplica 1:1 del layout absoluto de Figma (canvas 1440x720, node 82:193):
// la banda azul y la marca de agua ocupan TODO el ancho del hero, la foto
// se sobrepone encima (mitad izquierda, alto completo) y los textos van a
// la derecha. Construido con el kit de src/components/hero — ver su README
// para la receta al armar los siguientes niveles.
const GIRL_PHOTO = "/images/prekinder/hero-nina.png";
const GIRL_ALT = "Alumna de Pre-Kinder de Colegio Champal";

export default function PreKinderHero() {
  return (
    <PixelCurtain>
      <HeroSection>
        <HeroMobileStack
          imageSrc={GIRL_PHOTO}
          imageAlt={GIRL_ALT}
          title="Pre-Kinder"
          watermarkText="PRE-KINDER"
          subheadText="Inspiramos su curiosidad a través de los sentidos"
        />

        <HeroDesktopFrame>
          <HeroBlueBand />

          <HeroWatermark text="PRE-KINDER" leftPx={787.536} topPx={454.968} widthPx={1234.944} fontSizePx={220.0032} />

          {/* mitad izquierda, alto completo, se sobrepone a ambas zonas */}
          <HeroPhotoSplit src={GIRL_PHOTO} alt={GIRL_ALT} />

          <HeroTitle text="Pre-Kinder" leftPx={972} topPx={146.016} fontSizePx={128.0016} />

          {/* centrado bajo el título, sobre la zona azul */}
          <HeroSubhead
            text="Inspiramos su curiosidad a través de los sentidos"
            leftPx={976.032}
            topPx={410.168}
            widthPx={720}
            fontSizePx={56.0016}
            letterSpacingPx={2.2464}
            center
          />
        </HeroDesktopFrame>
      </HeroSection>
    </PixelCurtain>
  );
}
