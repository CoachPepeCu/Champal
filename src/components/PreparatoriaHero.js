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
} from "@/components/hero";
import PixelCurtain from "@/components/effects/PixelCurtain";

// Réplica 1:1 del layout absoluto de Figma (node 437:765 "Hero_Preparatoria",
// canvas 1440x720), sacado con get_design_context el 2026-08-20. Construido
// con el kit de src/components/hero — ver su README para la receta general.
//
// El asset (/images/preparatoria/hero-chicos-preparatoria.png) es el fill
// ORIGINAL que referencia get_design_context (no el "export" de
// download_assets) — ver memoria de proyecto
// "champal-niveles-pages-pattern". La capa no trae ningún transform en el
// código devuelto, así que no lleva `flip`; sí trae `object-cover`, igual
// que Kinder/Primaria (a diferencia de Secundaria que usa `contain`).
//
// El mensaje (nodos 437:768 + 437:769, frame 468:829) va en DOS líneas con
// estilos distintos — la primera en azul petróleo (#003750) sobre blanco, la
// segunda en blanco sobre un bloque rectangular navy (#00055c, nodo
// 445:1144) — mismo patrón exacto que Secundaria: dos <HeroSubhead>
// independientes más un rectángulo de fondo hecho a mano con los helpers
// pctX/pctY del kit.
//
// La marca de agua "PREPARATORIA" (437:771) va AL FRENTE de la foto en
// Figma (es la última capa en el código devuelto por get_design_context,
// por encima de la foto 468:828) — por eso se coloca al final, después de
// <HeroPhotoFloating>, igual que Secundaria. Así se logra el efecto de la
// referencia visual: las letras de la marca de agua se ven "detrás" de las
// personas porque la foto object-cover ya cubre buena parte del ancho, pero
// el texto en sí pinta encima de cualquier zona transparente/borde de la
// foto.
const CHICOS_PHOTO = "/images/preparatoria/hero-chicos-preparatoria.png";
const CHICOS_ALT = "Alumnos de Preparatoria de Colegio Champal";

export default function PreparatoriaHero() {
  return (
    <PixelCurtain>
      <HeroSection>
        <HeroMobileStack
          imageSrc={CHICOS_PHOTO}
          imageAlt={CHICOS_ALT}
          title="Preparatoria"
          watermarkText="PREPARATORIA"
          subheadText="Descubrimos el potencial de cada persona para ayudarlo a trazar su proyecto de vida."
        />

        <HeroDesktopFrame>
          <HeroBlueBand />

          {/* node 437:766 — centrado, top:71 */}
          <HeroTitle text="Preparatoria" leftPx={496.5} topPx={71} fontSizePx={128} />

          {/* node 445:1144 — bloque navy detrás de la 2a línea del mensaje */}
          <div
            className="absolute"
            style={{
              left: pctX(42),
              top: pctY(367),
              width: pctX(473),
              height: pctY(107),
              backgroundColor: "#00055c",
            }}
          />

          {/* node 437:768 — 1a línea, azul petróleo sobre blanco */}
          <HeroSubhead
            text="Descubrimos el potencial de cada persona para"
            leftPx={260}
            topPx={274}
            widthPx={476}
            fontSizePx={36}
            letterSpacingPx={1.44}
            center
            color="#003750"
          />

          {/* node 437:769 — 2a línea, blanco sobre el bloque navy de arriba */}
          <HeroSubhead
            text="ayudarlo a trazar su proyecto de vida."
            leftPx={277}
            topPx={367}
            widthPx={476}
            fontSizePx={36}
            letterSpacingPx={1.44}
            center
            color="#ffffff"
          />

          {/* node 468:828 — foto 928x619, object-cover */}
          <HeroPhotoFloating
            src={CHICOS_PHOTO}
            alt={CHICOS_ALT}
            leftPx={512}
            topPx={102}
            widthPx={928}
            heightPx={619}
            fit="cover"
            sizes="65vw"
          />

          {/* node 437:771 — al frente de la foto, anclada a la izquierda,
              gris translúcido, no centrada */}
          <HeroWatermark
            text="PREPARATORIA"
            leftPx={54}
            topPx={522}
            fontSizePx={156}
            center={false}
            color="rgba(139,139,139,0.35)"
          />
        </HeroDesktopFrame>
      </HeroSection>
    </PixelCurtain>
  );
}
