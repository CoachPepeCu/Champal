import Image from "next/image";
import Parallax from "@/components/effects/Parallax";

// "08_EducacionEmocional" (node 258:532) — cuarta y última de las 4
// secciones del "bloque largo" (ver nota completa en PrimariaIngles.js),
// responde al acceso #educacion-socioemocional ya enlazado en
// PrimariaAccesos.js. Se coloca inmediatamente después de
// PrimariaFinanciera. Canvas 1440x650, sin offset de X — mismo criterio que
// Ingles/Financiera.
//
// Fondo: esta sección usa DOS piezas de fondo, no solo el verde:
// - "Rectangle Verde" (node 388:862, #0ab5b0, block-Y 2280-2504) — el
//   cuadro que el usuario describió como enlace con la siguiente sección.
//   Su rango vertical cae DENTRO de esta misma sección (1901-2551, local
//   379-603 de los 650px de esta sección), no es un elemento aparte
//   después del bloque.
// - "Rectangle 17" (node 214:685, degradado amarillo, mismo family que
//   Rectangle 16) — ESTE es el que el usuario señaló: sin él, el verde se
//   veía como una franja rectangular plana; con él, una cuña amarilla
//   diagonal tapa buena parte de arriba del verde y solo deja un triángulo
//   visible, que es el efecto real de Figma. Se encontró tarde porque
//   get_metadata (que solo reporta geometría cruda) lo listaba en
//   block-Y 2494.5 — casi fuera del bloque — pero get_design_context (que
//   sí resuelve transforms) lo renderiza con un volteo vertical
//   (-scale-y-100) que lo reposiciona realmente en block-Y 1804-2494.5:
//   un tramo que arranca DENTRO de Financiera (94px antes de que termine
//   Financiera) y cruza toda la parte alta/media de esta sección hasta
//   solaparse con Rectangle Verde. Confirmado con una captura de
//   Sección_Primaria completa a resolución nativa (1440x2495) y muestreo
//   de píxeles: el amarillo SÍ se ve detrás de la insignia y el párrafo de
//   esta sección, no solo detrás de Financiera. Path real del SVG:
//   "M0 213.5L1440 0V690.5L0 530.5V213.5Z" — el borde derecho ocupa el
//   alto completo (0 a 690.5) y el izquierdo solo el tramo medio (213.5 a
//   530.5); al voltearlo verticalmente esa asimetría es lo que produce el
//   triángulo verde que sobrevive abajo-izquierda.
//
// Dos desbordamientos intencionales que el usuario pidió respetar (mensaje:
// "tenemos dos desbordamientos, el corazón del lado izquierdo, está bien
// que se empalme con el marco anterior y el Círculo de la sección anterior
// también mete ligeramente su parte inferior"):
// 1) El corazón decorativo (Ellipse 4) trae posición negativa en Figma
//    (left:-42, top:-93.8) — se sale por arriba hacia PrimariaFinanciera.
//    Por eso el marco de escritorio de ESTA sección, a diferencia de todas
//    las anteriores, NO lleva overflow-hidden: si lo llevara, cortaría el
//    corazón justo donde se supone que debe asomar. Como esta sección va
//    despues de Financiera en el DOM, pinta encima de ella de forma
//    natural en la franja de solape — es el efecto que se busca.
// 2) La foto circular de Financiera (Ellipse 3, termina en block-Y 1874)
//    queda muy cerca del borde de esta sección (que arranca en 1901, ~27px
//    de separación real en Figma) — según el usuario, en el diseño su
//    borde inferior se asoma levemente. Como Financiera ya se apila
//    "pegada" (gap 0) justo antes de esta sección, ese margen mínimo ya
//    queda respetado sin necesitar ningún ajuste adicional aquí.
const CANVAS_W = 1440;
const CANVAS_H = 650;
function pctX(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}%`;
}
function pctY(px) {
  return `${((px / CANVAS_H) * 100).toFixed(3)}%`;
}
function cqw(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;
}

const BADGE_ELLIPSE_1 = "/images/primaria/experiencias/emocional-ellipse1.svg";
const BADGE_ELLIPSE_2 = "/images/primaria/experiencias/emocional-ellipse2.svg";
const BADGE_ICON = "/images/primaria/experiencias/emocional-icono.png";
const CORAZON = "/images/primaria/experiencias/emocional-corazon.svg";
const FONDO_17 = "/images/primaria/experiencias/fondo-rectangulo-17.svg";
const FOTO = "/images/primaria/experiencias/emocional-foto.png";
const FOTO_ALT = "Alumnas de Primaria del Colegio Champal saludándose con alegría";
const VERDE = "#0ab5b0";

// Insignia — mismo patrón que Ingles/Progrentis/Financiera: aros con
// proporción fija (7.8%), ícono con offset/tamaño LITERAL de Figma (17,16,
// 177 acá) porque cada ícono trae su propia relación con el aro.
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
        <Image src={BADGE_ICON} alt="" fill sizes="150px" className="object-contain" />
      </div>
    </div>
  );
}

export default function PrimariaEmocional() {
  return (
    <section id="educacion-socioemocional" className="relative bg-white">
      {/* Mobile/tablet (< lg): apilado simple — mismo criterio que
          Ingles/Progrentis/Financiera. La franja verde (Rectangle Verde) se
          recorta a un remate al final, mismo criterio que el remate
          amarillo de Financiera, para anunciar la transición hacia la
          siguiente sección de la página. */}
      <div className="relative flex flex-col gap-6 px-6 py-14 lg:hidden">
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
          <div className="flex items-center gap-3">
            <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: "#e5303d" }} />
            <p className="text-xs font-semibold tracking-wide text-black">CONOCERSE PARA CONVIVIR MEJOR</p>
          </div>
        </div>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-black sm:text-4xl">
          Sus emociones también les enseñan a crecer
        </h2>
        <p className="text-lg leading-relaxed text-black">
          Acompañamos a los estudiantes a reconocer, expresar y regular sus emociones, desarrollando la empatía para
          relacionarse desde el respeto y la confianza. A través de este programa, impulsamos su identidad personal y
          autonomía, brindando herramientas prácticas para afrontar con seguridad los retos cotidianos.
        </p>
        <div className="relative mx-auto w-full max-w-xs">
          <div className="pointer-events-none absolute -left-6 -top-10 h-56 w-56 rounded-full opacity-70" style={{ backgroundColor: "#f6a8ab" }} />
          <div className="relative overflow-hidden rounded-xl border-[6px] border-white shadow-lg" style={{ transform: "rotate(-4deg)" }}>
            <div className="relative aspect-[495/318] w-full">
              <Image src={FOTO} alt={FOTO_ALT} fill sizes="320px" className="object-cover" />
            </div>
          </div>
        </div>
        <div className="pointer-events-none relative -mx-6 -mb-14 mt-4 h-16 overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: VERDE }} />
        </div>
      </div>

      {/* Desktop (lg+): réplica 1:1 del canvas de Figma 1440x650, PERO el
          bloque contenedor "Sección_Primaria" completo mide 2495px de alto
          y esta sección arranca en block-Y 1901 — es decir, su alto
          "útil" real es 2495-1901=594px, no los 650 nominales del frame.
          Los últimos ~56px del frame (650-594) quedan FUERA del bloque, no
          se ven en el diseño real: confirmado tomando una captura nativa
          1:1 de todo el bloque y muestreando píxeles en su borde inferior
          (y=2494) — es VERDE SÓLIDO en todo el ancho, no blanco. Si se
          renderiza el frame completo de 650px, esos ~56px sobrantes son un
          remate blanco que cae justo debajo de donde termina Rectangle
          Verde (local Y 603) y antes de Cambridge — el usuario lo reportó
          como "queda separada de la sección anterior y deja un espacio
          blanco vacío".
          Solución (SIN overflow-hidden, a propósito — el corazón necesita
          seguir asomándose hacia arriba sin recortarse, y un solo
          overflow-hidden recortaría ambos lados): DOS divs. El de AFUERA
          usa aspect-[1440/594] — su altura real (594) es la que de verdad
          cuenta para el flujo de la página, así que Cambridge empieza
          justo ahí. El de ADENTRO conserva el canvas completo de 650 (para
          que las conversiones pctX/pctY/cqw sean válidas sin tocar ningún
          número) posicionado con `position:absolute` — como los hijos
          absolutamente posicionados NO expanden la altura de su
          contenedor, el de afuera se queda en 594 aunque el de adentro
          "sea" más alto. El remate blanco (local Y 594-650) sigue
          renderizándose sin recortar, pero como Cambridge viene después en
          el DOM, su propio fondo opaco lo tapa por completo — mismo
          resultado visual que recortarlo, sin arriesgar el bleed del
          corazón. */}
      <div className="relative hidden aspect-[1440/594] w-full lg:block" style={{ containerType: "inline-size" }}>
        <div className="absolute left-0 top-0 aspect-[1440/650] w-full">
        {/* Rectangle Verde — fondo, pintado primero. */}
        <div className="absolute" style={{ left: pctX(-5), top: pctY(379), width: cqw(1446), height: cqw(224), backgroundColor: VERDE }} />

        {/* Rectangle 17 — cuña amarilla diagonal (volteada verticalmente,
            ver nota principal) que tapa buena parte de arriba de Rectangle
            Verde, dejando solo un triángulo de verde visible. Se pinta
            DESPUÉS del verde y ANTES del resto del contenido — mismo orden
            que en Figma. Se sale por arriba del canvas de esta sección
            (top negativo) hacia Financiera, sin recortar, igual que el
            corazón. */}
        <div
          className="absolute"
          style={{ left: pctX(0), top: pctY(-97), width: cqw(1440), height: cqw(690.5), transform: "scaleY(-1)" }}
        >
          <Image src={FONDO_17} alt="" fill sizes="1440px" className="pointer-events-none select-none" />
        </div>

        {/* Corazón decorativo — bleed intencional arriba/izquierda, sin
            recortar (ver nota principal). */}
        <div className="absolute" style={{ left: pctX(-42.028), top: pctY(-93.796), width: cqw(768.548), height: cqw(618.919) }}>
          <Image src={CORAZON} alt="" fill sizes="769px" className="pointer-events-none select-none" />
        </div>

        {/* Foto — tarjeta blanca rotada, mismo criterio que la insignia:
            wrapper centrador sin rotar + hijo rotado vía inline style
            (memoria "champal-tailwind-v4-negative-utilities": -rotate-9 de
            Tailwind puede no aplicarse, así que va por transform inline). */}
        {/* Parallax sutil — solo la foto (ver memoria de proyecto: el
            fondo compartido y el texto NO llevan parallax). El translateY
            de Parallax va en este contenedor exterior; la rotación de
            -9deg queda intacta en el div interior, sin conflicto (son dos
            nodos DOM distintos, cada uno con su propio transform). */}
        <Parallax
          className="absolute flex items-center justify-center"
          style={{ left: pctX(74.719), top: pctY(30.1), width: cqw(538.596), height: cqw(391.285) }}
        >
          <div style={{ transform: "rotate(-9deg)" }}>
            <div
              className="relative overflow-hidden rounded-xl border-[8px] border-white"
              style={{ width: cqw(494.981), height: cqw(317.765) }}
            >
              <Image src={FOTO} alt={FOTO_ALT} fill sizes="495px" className="object-cover" />
            </div>
          </div>
        </Parallax>

        <div
          className="absolute"
          style={{ left: pctX(634), top: pctY(58), width: cqw(56), height: cqw(6), backgroundColor: "#e5303d", borderRadius: cqw(3) }}
        />
        <p
          className="absolute font-semibold leading-none text-black"
          style={{ left: pctX(717), top: pctY(52), width: pctX(444), fontSize: cqw(14) }}
        >
          CONOCERSE PARA CONVIVIR MEJOR
        </p>
        <h2
          className="absolute font-serif font-semibold leading-tight text-black"
          style={{ left: pctX(634), top: pctY(80), width: pctX(568), fontSize: cqw(44) }}
        >
          Sus emociones también les enseñan a crecer
        </h2>
        <p
          className="absolute text-black"
          style={{ left: pctX(634), top: pctY(186), width: pctX(642), fontSize: cqw(30), lineHeight: cqw(42) }}
        >
          Acompañamos a los estudiantes a reconocer, expresar y regular sus emociones, desarrollando la empatía para
          relacionarse desde el respeto y la confianza. A través de este programa, impulsamos su identidad personal y
          autonomía, brindando herramientas prácticas para afrontar con seguridad los retos cotidianos.
        </p>

        <Insignia leftPx={1189} topPx={0} sizePx={209.772} iconOffsetXPx={17} iconOffsetYPx={16} iconSizePx={177} />
        </div>
      </div>
    </section>
  );
}
