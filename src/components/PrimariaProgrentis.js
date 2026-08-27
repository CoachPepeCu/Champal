import Image from "next/image";
import Parallax from "@/components/effects/Parallax";

// "06_Primaria_Progrentis" (node 256:511) — segunda de las 4 secciones del
// "bloque largo" (ver nota completa en PrimariaIngles.js), responde al
// acceso #progrentis que ya dejamos enlazado en PrimariaAccesos.js. Se
// coloca INMEDIATAMENTE después de PrimariaIngles (sin padding propio,
// mismo criterio "pegadas" que el resto de las secciones full-bleed de
// este proyecto).
//
// A diferencia de la sección 1 (canvas 1440 completo), el frame de Figma
// de ESTA sección mide 1348 de ancho y arranca en X=46 DENTRO del bloque
// de 1440 (46 + 1348 + 46 = 1440 — inset simétrico de 46px por lado). Para
// que el fondo compartido (Rectangle 16, que SÍ ocupa los 1440 completos)
// y el contenido convivan en el mismo sistema de coordenadas, este archivo
// usa CANVAS_W=1440 para todo y le suma +46 en X a cada posición que
// get_design_context devolvió relativa al sub-frame de 1348 (así quedan
// en el mismo canvas que el fondo, que no lleva ese offset).
//
// Fondo: a diferencia de la sección 1 (donde el amarillo solo asomaba una
// franja), en ESTA sección el amarillo cubre casi toda la altura visible
// — el rectángulo diagonal compartido (Rectangle 16, node 214:684) es
// mucho más alto (708px) que esta sección (584px) y la cruza de lado a
// lado, así que dentro de acá se ve prácticamente sólido. Se posiciona en
// su offset LOCAL real (Y=-34.5 relativo a esta sección, calculado de su
// posición en el bloque completo: y=669.5 del rectángulo menos y=704
// donde arranca esta sección) y se recorta con overflow-hidden en el
// marco — mismo criterio que corrigió el usuario en PrimariaIngles.js
// para la mascota/insignia que se salen un poco del canvas.
const CANVAS_W = 1440;
const CANVAS_H = 584;
function pctX(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}%`;
}
function pctY(px) {
  return `${((px / CANVAS_H) * 100).toFixed(3)}%`;
}
function cqw(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;
}

const BG_RECTANGLE_16 = "/images/primaria/experiencias/fondo-rectangulo-16.svg";
const BADGE_ELLIPSE_1 = "/images/primaria/experiencias/progrentis-ellipse1.svg";
const BADGE_ELLIPSE_2 = "/images/primaria/experiencias/progrentis-ellipse2.svg";
const BADGE_ICON = "/images/primaria/experiencias/progrentis-icono.png";
const MASCOTA = "/images/primaria/experiencias/progrentis-mascota.png";
const MASCOTA_ALT = "Mascota PROGRENTIS: un cerebro sonriente montado en un cohete";

// El ícono usa su offset/tamaño LITERAL de Figma (no un inset % fijo) —
// ver la nota completa en PrimariaFinanciera.js/PrimariaIngles.js: cada
// ícono trae su propia proporción, un inset fijo dejaba este notablemente
// desalineado (~15px, medido en vivo).
function Insignia({ leftPx, topPx, sizePx, iconOffsetXPx, iconOffsetYPx, iconSizePx }) {
  return (
    <div className="absolute" style={{ left: pctX(leftPx), top: pctY(topPx), width: cqw(sizePx), height: cqw(sizePx) }}>
      <Image src={BADGE_ELLIPSE_1} alt="" fill sizes="200px" />
      <div className="absolute inset-[7.8%]">
        <Image src={BADGE_ELLIPSE_2} alt="" fill sizes="180px" />
      </div>
      <div
        className="absolute"
        style={{ left: cqw(iconOffsetXPx), top: cqw(iconOffsetYPx), width: cqw(iconSizePx), height: cqw(iconSizePx) }}
      >
        <Image src={BADGE_ICON} alt="" fill sizes="110px" className="object-contain" />
      </div>
    </div>
  );
}

export default function PrimariaProgrentis() {
  return (
    <section id="progrentis" className="relative overflow-hidden bg-white">
      {/* Mobile/tablet (< lg): apilado simple — mismo criterio que
          PrimariaIngles.js. */}
      <div className="relative flex flex-col gap-6 px-6 py-14 lg:hidden">
        <div className="absolute inset-0 -z-10">
          <Image src={BG_RECTANGLE_16} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[220px]">
          <Image src={MASCOTA} alt={MASCOTA_ALT} fill sizes="220px" className="object-contain" />
        </div>
        <div className="flex items-center gap-3">
          <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: "#e5303d" }} />
          <p className="text-xs font-semibold tracking-wide" style={{ color: "#102c54" }}>
            DESARROLLANDO MÁS DE 100 DESTREZAS COGINITIVAS
          </p>
        </div>
        {/* Insignia mobile: NO reutiliza <Insignia> (esa usa cqw/pctX,
            atados al containerType:inline-size del marco de escritorio —
            en el flujo mobile no hay ese contenedor, así que cqw ahí
            resolvería mal). Mismo patrón manual con clases reales de
            Tailwind que ya usa PrimariaIngles.js. */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <Image src={BADGE_ELLIPSE_1} alt="" fill sizes="64px" />
            <div className="absolute inset-[7.8%]">
              <Image src={BADGE_ELLIPSE_2} alt="" fill sizes="58px" />
            </div>
            <div className="absolute inset-[20.2%]">
              <Image src={BADGE_ICON} alt="" fill sizes="42px" className="object-contain" />
            </div>
          </div>
          <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl" style={{ color: "#0a1730" }}>
            Entrenamiento estudiantil de vanguardia
          </h2>
        </div>
        <p className="text-lg leading-relaxed" style={{ color: "#494949" }}>
          Aprovechamos las mejores soluciones digitales para impulsar la formación de nuestros alumnos. A través de
          desafíos digitales adaptados a su edad, los estudiantes ejercitan destrezas clave como la investigación, la
          agilidad mental y la resolución de problemas de forma autónoma.
        </p>
      </div>

      {/* Desktop (lg+): réplica 1:1 del canvas de Figma (1440x584 — ver
          nota arriba sobre el offset +46). overflow-hidden en el marco
          recorta el fondo y la mascota donde se salen del canvas. */}
      <div className="relative hidden aspect-[1440/584] w-full lg:block" style={{ containerType: "inline-size" }}>
        <div className="absolute" style={{ left: pctX(-14.5), top: pctY(-34.5), width: cqw(1456.5), height: cqw(708) }}>
          <Image src={BG_RECTANGLE_16} alt="" fill sizes="1457px" className="object-cover" />
        </div>

        {/* Mascota — bleed intencional apenas (-17px) por arriba/izquierda
            del canvas, recortado por el overflow-hidden del marco. Tamaño
            reducido de 650 a 595 (el valor literal de Figma, 650, no cabía
            verticalmente: top(-17) + 650 = 633, pero el canvas de esta
            sección mide solo 584 de alto — 49px de la base del cohete
            (las puntas de la flama) quedaban recortados por el propio
            overflow-hidden del marco, el bug que reportó el usuario. 595
            es el tamaño máximo que cabe completo desde top=-17 hasta el
            borde inferior del canvas (584-(-17)=601) con ~6px de margen de
            seguridad — se reduce ancho Y alto por igual, no solo el alto,
            para no deformar el recorte de object-cover sobre la imagen
            (que es prácticamente cuadrada). */}
        {/* Parallax — solo la mascota (ver memoria de proyecto: el fondo
            compartido y el texto NO llevan parallax). offsetPx más bajo que
            el default (40 en vez de 70) a propósito: esta mascota ya vive
            muy justa contra el borde inferior del canvas (ver nota arriba,
            ~6px de margen) — el default completo arriesgaría volver a
            cortar la flama en el pico del desplazamiento. */}
        <Parallax
          className="absolute"
          style={{ left: pctX(16), top: pctY(-17), width: cqw(595), height: cqw(595) }}
          offsetPx={40}
        >
          <Image src={MASCOTA} alt={MASCOTA_ALT} fill sizes="595px" className="object-cover" />
        </Parallax>

        <div
          className="absolute"
          style={{ left: pctX(654), top: pctY(106), width: cqw(56), height: cqw(6), backgroundColor: "#e5303d", borderRadius: cqw(3) }}
        />
        {/* Typo real en Figma ("COGINITIVAS" en vez de "COGNITIVAS") —
            replicado tal cual, mismo criterio que "ARTÍTSTICA" en
            PrimariaProgramas.js: avisar al usuario para corregirlo en
            origen si fue un error de dedo. */}
        <p
          className="absolute font-semibold leading-none"
          style={{ left: pctX(737), top: pctY(100), width: pctX(390), fontSize: cqw(14), color: "#102c54" }}
        >
          DESARROLLANDO MÁS DE 100 DESTREZAS COGINITIVAS
        </p>
        <h2
          className="absolute font-serif font-semibold"
          style={{ left: pctX(654), top: pctY(123), width: pctX(568), fontSize: cqw(44), lineHeight: cqw(50), color: "#0a1730" }}
        >
          Entrenamiento estudiantil de vanguardia
        </h2>
        <p
          className="absolute"
          style={{ left: pctX(654), top: pctY(234), width: pctX(640), fontSize: cqw(30), lineHeight: cqw(42), color: "#494949" }}
        >
          Aprovechamos las mejores soluciones digitales para impulsar la formación de nuestros alumnos. A través de
          desafíos digitales adaptados a su edad, los estudiantes ejercitan destrezas clave como la investigación, la
          agilidad mental y la resolución de problemas de forma autónoma.
        </p>

        <Insignia leftPx={1187} topPx={43} sizePx={209.77} iconOffsetXPx={50} iconOffsetYPx={43} iconSizePx={114} />
      </div>
    </section>
  );
}
