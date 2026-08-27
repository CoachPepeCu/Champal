import Image from "next/image";
import Parallax from "@/components/effects/Parallax";

// "07__EducacionFinanciara" (node 257:524) — tercera de las 4 secciones
// del "bloque largo" (ver nota completa en PrimariaIngles.js), responde al
// acceso #educacion-financiera ya enlazado en PrimariaAccesos.js. Se
// coloca inmediatamente después de PrimariaProgrentis.
//
// Este frame SÍ ocupa los 1440 completos (a diferencia de Progrentis, que
// tenía el inset de 46px) — mismo canvas que Ingles, sin offset de X.
//
// Fondo — la parte que el usuario pidió cuidar en este mensaje: el
// rectángulo amarillo compartido (Rectangle 16, el mismo asset que ya usa
// PrimariaProgrentis.js) SOLO cubre la punta final de esta sección, no
// toda. En el bloque completo, Rectangle 16 va de block-Y 669.5 a 1377.5;
// esta sección arranca en block-Y 1248 — la resta (669.5-1248=-578.5) da
// el offset LOCAL donde hay que colocar el mismo asset para que su borde
// diagonal inferior (block-Y 1377.5, local 1377.5-1248=129.5) caiga en el
// lugar correcto: de local Y 0 a ~129.5 se ve el remate diagonal amarillo
// (continuando el de Progrentis), y de ahí para abajo queda blanco —
// exactamente lo que se ve en la captura que compartió el usuario. Mismo
// asset, mismo criterio de overflow-hidden en el marco que ya se usó en
// Ingles/Progrentis, solo que reposicionado para ESTA sección.
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

const BG_RECTANGLE_16 = "/images/primaria/experiencias/fondo-rectangulo-16.svg";
const BADGE_ELLIPSE_1 = "/images/primaria/experiencias/financiera-ellipse1.svg";
const BADGE_ELLIPSE_2 = "/images/primaria/experiencias/financiera-ellipse2.svg";
const BADGE_ICON = "/images/primaria/experiencias/financiera-icono.png";
const FOTO = "/images/primaria/experiencias/financiera-foto.png";
const FOTO_ALT = "Alumnos de Primaria presentando un proyecto de educación financiera en Colegio Champal";

// El aro exterior/interior (ellipse1/ellipse2) SÍ guarda una proporción
// fija entre las 3 insignias construidas hasta ahora (inset 7.8%, son
// gráficos genéricos de aro) — pero el ÍCONO no: cada ícono (planta de
// ahorro, cohete PROGRENTIS, Hi/Hello...) trae su propio tamaño/posición
// relativa al aro en Figma, sin una proporción común. Usar un inset fijo
// para el ícono (como el 20.2% que sí funcionaba para Ingles) lo dejaba
// notablemente desalineado acá — medido en vivo, ~15px de diferencia.
// Por eso el ícono recibe su posición/tamaño LITERAL de Figma (relativos
// al propio leftPx/topPx del aro, no un inset calculado).
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

export default function PrimariaFinanciera() {
  return (
    <section id="educacion-financiera" className="relative bg-white">
      {/* NADA de overflow-hidden en esta sección — a propósito. El
          margin-top negativo de más abajo (el solape real de 40px que
          tienen los frames de Figma con Progrentis, ver la nota junto al
          marco de escritorio) necesita "colapsar" con el margen de la
          sección anterior para de verdad recorrerla hacia arriba;
          overflow-hidden en el propio elemento con el margen (o en
          cualquier ancestro entre él y el punto de colapso) CANCELA ese
          colapso por spec de CSS — eso fue justo lo que pasó en el primer
          intento (overflow-hidden vivía acá, y el margen se quedó
          atrapado adentro sin mover nada, medido en vivo: 0px de solape
          real). El overflow-hidden que sí hace falta (recortar la
          mascota/fondo que se salen del canvas) vive en el div interior
          del marco de escritorio, que no carga el margen — así el
          colapso llega limpio hasta la sección.
          NOTA APARTE: este comentario se movió de ser el primer hijo
          antes de <section> a ser el primer hijo DENTRO — un comentario
          como hermano de la raíz justo después de `return (` rompe el
          parseo (gotcha ya documentado en este proyecto — ver memoria
          "champal-niveles-pages-pattern": esta vez ni siquiera era un
          comentario JSX de llave-asterisco, alcanzó con uno de doble
          diagonal normal). */}
      {/* Mobile/tablet (< lg): apilado simple — mismo criterio que
          Ingles/Progrentis. Insignia con clases reales de Tailwind (no
          <Insignia>, que depende del containerType del marco de
          escritorio — ver la misma nota en PrimariaProgrentis.js). */}
      <div className="relative flex flex-col gap-6 px-6 py-14 lg:hidden">
        {/* Remate del fondo amarillo, recortado a solo el borde superior
            (mismo criterio que en escritorio, ver nota arriba) para que
            la transición se sienta igual en mobile. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 overflow-hidden">
          <div className="relative h-[600px] w-full">
            <Image src={BG_RECTANGLE_16} alt="" fill sizes="100vw" className="object-cover object-bottom" />
          </div>
        </div>
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
            <p className="text-xs font-semibold tracking-wide text-black">FORMANDO UNA VISIÓN CON PROPÓSITO DESDE LA INFANCIA</p>
          </div>
        </div>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-black sm:text-4xl">
          Pequeñas decisiones que construyen grandes hábitos
        </h2>
        <p className="text-lg leading-relaxed text-black">
          La educación financiera y el espíritu emprendedor en el Colegio Champal enseñan a los estudiantes el valor
          de planear, organizar sus metas y tomar decisiones responsables ante situaciones cotidianas. A través de
          dinámicas adaptadas a su edad, los alumnos aprenden a administrar y proyectar su futuro con total
          confianza.
        </p>
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-full">
          <Image src={FOTO} alt={FOTO_ALT} fill sizes="320px" className="object-cover" />
        </div>
      </div>

      {/* Desktop (lg+): réplica 1:1 del canvas de Figma 1440x650.
          DOS divs anidados, a propósito:
          - El de AFUERA (`hidden lg:block`) carga el margin-top negativo
            y NO tiene overflow — así su colapso de margen SÍ llega hasta
            el <section> (ver nota junto a la etiqueta <section>).
          - El de ADENTRO carga el overflow-hidden/aspect-ratio/
            containerType reales del canvas — su propio overflow-hidden ya
            no bloquea nada porque el margen vive un nivel arriba, fuera
            de su alcance.
          El valor -2.778% = -40/1440: en Figma, el frame de esta sección
          (y=1248) y el de Progrentis (y=704, alto=584 -> termina en 1288)
          se ENCIMAN 40px (1288-1248) — no están pegados borde a borde. Al
          apilar los dos componentes con gap 0 (como el resto de las
          secciones full-bleed) se pierde ese solape y el corte diagonal
          del fondo amarillo compartido queda desalineado ~40px justo en
          la costura — el "recorte" que reportó el usuario. Va en % (no en
          cqw) a propósito: un % en margin-top se calcula sobre el ANCHO
          del contenedor por spec de CSS (no la altura), así que escala
          igual que cqw sin necesitar un ancestro con containerType — y
          por la misma razón de siempre (memoria
          "champal-tailwind-v4-negative-utilities") va por `style` inline,
          no por una clase Tailwind "-mt-[...]". No hace falta un `lg:`
          aparte para el margen: el div de afuera ya es `hidden` bajo lg,
          así que no afecta el apilado mobile. */}
      <div className="hidden lg:block" style={{ marginTop: "-2.778%" }}>
        <div className="relative aspect-[1440/650] w-full overflow-hidden" style={{ containerType: "inline-size" }}>
        <div className="absolute" style={{ left: pctX(-14.5), top: pctY(-578.5), width: cqw(1456.5), height: cqw(708) }}>
          <Image src={BG_RECTANGLE_16} alt="" fill sizes="1457px" className="object-cover" />
        </div>

        <div
          className="absolute"
          style={{ left: pctX(287), top: pctY(124), width: cqw(56), height: cqw(6), backgroundColor: "#e5303d", borderRadius: cqw(3) }}
        />
        <p
          className="absolute font-semibold leading-none text-black"
          style={{ left: pctX(370), top: pctY(118), width: pctX(444), fontSize: cqw(14) }}
        >
          FORMANDO UNA VISIÓN CON PROPÓSITO DESDE LA INFANCIA
        </p>
        <h2
          className="absolute font-serif font-semibold leading-tight text-black"
          style={{ left: pctX(287), top: pctY(141), width: pctX(568), fontSize: cqw(44) }}
        >
          Pequeñas decisiones que construyen grandes hábitos
        </h2>
        <p
          className="absolute text-black"
          style={{ left: pctX(287), top: pctY(258), width: pctX(568), fontSize: cqw(30), lineHeight: cqw(42) }}
        >
          La educación financiera y el espíritu emprendedor en el Colegio Champal enseñan a los estudiantes el valor
          de planear, organizar sus metas y tomar decisiones responsables ante situaciones cotidianas. A través de
          dinámicas adaptadas a su edad, los alumnos aprenden a administrar y proyectar su futuro con total confianza
        </p>

        <Insignia leftPx={40} topPx={84} sizePx={209.77} iconOffsetXPx={28} iconOffsetYPx={27} iconSizePx={154} />

        {/* Parallax sutil — solo la foto (ver memoria de proyecto: el
            fondo compartido y el texto NO llevan parallax). */}
        <Parallax
          className="absolute overflow-hidden rounded-full"
          style={{ left: pctX(840), top: pctY(83), width: cqw(543), height: cqw(543) }}
        >
          <Image src={FOTO} alt={FOTO_ALT} fill sizes="543px" className="object-cover" />
        </Parallax>
        </div>
      </div>
    </section>
  );
}
