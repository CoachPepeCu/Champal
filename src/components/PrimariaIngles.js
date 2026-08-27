import Image from "next/image";
import Parallax from "@/components/effects/Parallax";

// "05_ Primaria_Ingles" (node 213:671) — primera de las 4 secciones del
// "bloque largo" que describió el usuario (Inglés / PROGRENTIS / Educación
// Financiera / Educación Socioemocional), cada una respondiendo a uno de
// los 4 accesos que ya dejamos enlazados en PrimariaAccesos.js
// (#ingles/#progrentis/#educacion-financiera/#educacion-socioemocional).
// Layout absoluto de Figma (canvas 1440x680) — misma técnica px->%/cqw que
// Hero/Formacion/Programas.
//
// El fondo compartido de todo el bloque (rectángulos con degradado
// amarillo cortados en diagonal + el cuadro verde final que liga con la
// siguiente sección) se agrega solo PARCIALMENTE aquí — únicamente
// "Rectangle 15" (214:682), que es la franja que efectivamente entra en el
// rango vertical de ESTA sección (y:0-268.5 de las y:0-2495 del bloque
// completo). El resto ("Rectangle 16/17" y el cuadro verde) se agrega
// cuando se construyan las secciones 2-4, que es donde de verdad quedan
// visibles — en esta primera sección casi todo ese fondo queda tapado por
// el contenido en blanco, tal como se ve en la captura que compartió el
// usuario.
//
// El globo "Cambridge English" (node 240:770) trae POSICIÓN NEGATIVA
// (top:-122) en Figma — el asset ES más alto que el hueco que le
// corresponde arriba del canvas. Primer intento: se dejó la envoltura SIN
// overflow-hidden asumiendo que ese excedente debía "asomar" hacia la
// sección anterior a propósito (como el escalón intencional del Hero) —
// el usuario corrigió que no, que se ve mal invadiendo Programas y debe
// recortarse en el borde de ESTA sección, igual que Hero/Formacion/
// Programas sí hacen. Por eso el marco de escritorio SÍ lleva
// overflow-hidden como todos los demás — el globo se ve "cortado" arriba,
// tal como el diseño real espera.
const CANVAS_W = 1440;
const CANVAS_H = 680;
function pctX(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}%`;
}
function pctY(px) {
  return `${((px / CANVAS_H) * 100).toFixed(3)}%`;
}
function cqw(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;
}

const BG_RECTANGLE_15 = "/images/primaria/experiencias/fondo-rectangulo-15.svg";
const BADGE_ELLIPSE_1 = "/images/primaria/experiencias/ingles-ellipse1.svg";
const BADGE_ELLIPSE_2 = "/images/primaria/experiencias/ingles-ellipse2.svg";
const BADGE_ICON = "/images/primaria/experiencias/ingles-icono.png";
const PHOTO = "/images/primaria/experiencias/ingles-nina.png";
const PHOTO_ALT = "Alumna de Primaria de Colegio Champal lista para ir a la escuela";
const CAMBRIDGE_GLOBO = "/images/primaria/experiencias/ingles-globo-cambridge.svg";

// Insignia circular (2 aros + ícono centrado) — misma proporción exacta que
// la insignia "Hi/Hello" ya resuelta en KinderIngles.js (inset 7.8%/20.2%
// del aro exterior), solo que aquí posicionada en el canvas absoluto de
// Figma en vez de en un contenedor flotante.
// El aro exterior/interior (ellipse1/ellipse2) guarda una proporción fija
// entre las insignias de este bloque (inset 7.8%, aros genéricos) — el
// ÍCONO no: cada ícono trae su propio tamaño/posición relativa al aro en
// Figma. Un inset fijo (20.2%, el que coincidía aquí de casualidad) dejó
// el ícono de PROGRENTIS notablemente desalineado en la sección siguiente
// — medido en vivo, ~15px de diferencia. El ícono recibe su posición/
// tamaño LITERAL de Figma (offset real desde el propio leftPx/topPx del
// aro), no un inset calculado — ver la misma nota en PrimariaFinanciera.js.
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
        <Image src={BADGE_ICON} alt="" fill sizes="130px" className="object-contain" />
      </div>
    </div>
  );
}

const VENTAJAS = [
  { key: "escuchan", text: "Escuchan y comprenden en inglés" },
  { key: "leen", text: "Leen y escriben en inglés" },
  { key: "hablan", text: "Hablan con soltura y confianza" },
  { key: "certificado", text: "Su aprendizaje es certificado por Cambridge" },
];

// A tamaño de letra más grande y con más interlineado (a pedido del
// usuario), el texto más largo de las 4 ("Su aprendizaje es certificado
// por Cambridge") ya NO cabe en 130x130 sin volver a apretar la letra —
// medido en vivo: con aspect-square fijo, esa tarjeta se estiraba a 187px
// mientras sus 3 hermanas quedaban en 130px, viéndose despareja. En vez de
// volver a encoger el texto (ya se pidió lo contrario dos veces), se quitó
// el aspect-square: cada tarjeta crece con su propio contenido (con un
// mínimo de 130x130, igual que el diseño), y el renglón completo (las 2
// tarjetas lado a lado) se estira parejo a la altura de la más alta
// (items-stretch en el contenedor de escritorio, en vez de items-center)
// — así ambas tarjetas de cada renglón siempre miden lo mismo entre sí,
// aunque un renglón termine más alto que el otro.
function TarjetaVentaja({ text }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-[6px] border-2 border-white p-1.5 text-center shadow-[0px_5px_4px_2px_rgba(0,0,0,0.25)]"
      style={{ backgroundImage: "linear-gradient(to bottom, #0a1730, #163e7a)" }}
    >
      <p className="text-base font-semibold leading-snug text-white sm:text-lg">{text}</p>
    </div>
  );
}

export default function PrimariaIngles() {
  return (
    <section id="ingles" className="relative bg-white">
      {/* Mobile/tablet (< lg): apilado simple — mismo criterio que
          Hero/Formacion/Programas: se simplifica el layout absoluto a un
          flujo vertical normal, sin intentar replicar las posiciones
          exactas del canvas de escritorio. */}
      <div className="flex flex-col gap-6 px-6 py-14 lg:hidden">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image src={BADGE_ELLIPSE_1} alt="" fill sizes="80px" />
            <div className="absolute inset-[7.8%]">
              <Image src={BADGE_ELLIPSE_2} alt="" fill sizes="72px" />
            </div>
            <div className="absolute inset-[20.2%]">
              <Image src={BADGE_ICON} alt="" fill sizes="56px" className="object-contain" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: "#e5303d" }} />
            <p className="text-xs font-semibold tracking-wide" style={{ color: "#102c54" }}>
              EL INGLÉS COMO HABILIDAD
            </p>
          </div>
        </div>
        <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl" style={{ color: "#0a1730" }}>
          Cambridge en el Colegio Champal
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: "#494949" }}>
          Preparamos a los niños para comunicarse en inglés de forma natural y con total seguridad.
        </p>
        <p className="text-base leading-relaxed" style={{ color: "#494949" }}>
          Desde la primaria, impulsamos su expresión oral y escrita a través de metas y certificados oficiales de la
          Universidad de Cambridge, asegurando títulos de validez internacional que abrirán las puertas de su futuro
          para toda la vida.
        </p>
        <div className="relative mx-auto aspect-[484/669] w-full max-w-xs">
          <Image src={PHOTO} alt={PHOTO_ALT} fill sizes="320px" className="object-contain" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {VENTAJAS.map((v) => (
            <TarjetaVentaja key={v.key} text={v.text} />
          ))}
        </div>
      </div>

      {/* Desktop (lg+): réplica 1:1 del canvas de Figma 1440x680, recortada
          en el borde (overflow-hidden) igual que Hero/Formacion/Programas —
          ver nota arriba sobre el globo Cambridge. */}
      <div
        className="relative hidden aspect-[1440/680] w-full overflow-hidden lg:block"
        style={{ containerType: "inline-size" }}
      >
        {/* Franja de fondo amarilla (Rectangle 15) — parte del fondo
            compartido de todo el bloque, ver nota arriba. */}
        <div className="absolute" style={{ left: 0, top: 0, width: cqw(CANVAS_W), height: pctY(268.5) }}>
          <Image src={BG_RECTANGLE_15} alt="" fill sizes="100vw" className="object-cover" />
        </div>

        <Insignia leftPx={23} topPx={70} sizePx={202.79} iconOffsetXPx={41.46} iconOffsetYPx={45.06} iconSizePx={120.77} />

        <div
          className="absolute"
          style={{ left: pctX(232), top: pctY(200), width: cqw(56), height: cqw(6), backgroundColor: "#e5303d", borderRadius: cqw(3) }}
        />
        <p
          className="absolute font-semibold leading-none"
          style={{ left: pctX(315), top: pctY(194), width: pctX(390), fontSize: cqw(14), color: "#102c54" }}
        >
          EL INGLÉS COMO HABILIDAD
        </p>
        <h2
          className="absolute font-serif font-semibold"
          style={{ left: pctX(232), top: pctY(212), width: pctX(616), fontSize: cqw(40), lineHeight: cqw(50), color: "#0a1730" }}
        >
          Cambridge en el Colegio Champal
        </h2>
        <p
          className="absolute"
          style={{ left: pctX(214), top: pctY(270), width: pctX(624), fontSize: cqw(28), lineHeight: cqw(42), color: "#494949" }}
        >
          Preparamos a los niños para comunicarse en inglés de forma natural y con total seguridad.
        </p>
        <p
          className="absolute"
          style={{ left: pctX(213), top: pctY(354), width: pctX(483), fontSize: cqw(28), lineHeight: cqw(42), color: "#494949" }}
        >
          Desde la primaria, impulsamos su expresión oral y escrita a través de metas y certificados oficiales de la
          Universidad de Cambridge, asegurando títulos de validez internacional que abrirán las puertas de su futuro
          para toda la vida.
        </p>

        {/* Parallax sutil — solo la foto (ver memoria de proyecto: el
            fondo compartido y el texto NO llevan parallax, para no
            desalinear las costuras entre secciones ni afectar
            legibilidad). */}
        <Parallax className="absolute" style={{ left: pctX(655), top: pctY(107), width: cqw(484), height: cqw(669) }}>
          <Image src={PHOTO} alt={PHOTO_ALT} fill sizes="484px" className="object-cover" />
        </Parallax>

        {/* 2 grupos de "Tarjeta_Ventaja" (2 tarjetas cada uno, 27px de gap).
            items-stretch (no items-center): cada renglón estira ambas
            tarjetas a la altura de la más alta de las dos — ver nota en
            TarjetaVentaja sobre por qué ya no son 130x130 fijas. */}
        <div className="absolute flex items-stretch" style={{ left: pctX(1101), top: pctY(340), gap: cqw(27) }}>
          <div style={{ width: cqw(130), minHeight: cqw(130) }}>
            <TarjetaVentaja text={VENTAJAS[0].text} />
          </div>
          <div style={{ width: cqw(130), minHeight: cqw(130) }}>
            <TarjetaVentaja text={VENTAJAS[1].text} />
          </div>
        </div>
        <div className="absolute flex items-stretch" style={{ left: pctX(1094), top: pctY(499), gap: cqw(27) }}>
          <div style={{ width: cqw(130), minHeight: cqw(130) }}>
            <TarjetaVentaja text={VENTAJAS[2].text} />
          </div>
          <div style={{ width: cqw(130), minHeight: cqw(130) }}>
            <TarjetaVentaja text={VENTAJAS[3].text} />
          </div>
        </div>

        {/* Globo "Cambridge English" — top NEGATIVO (-122), se sale por
            arriba del canvas a propósito (ver nota arriba). */}
        <div className="absolute" style={{ left: pctX(1012), top: pctY(-122), width: cqw(447), height: cqw(409) }}>
          <Image src={CAMBRIDGE_GLOBO} alt="" fill sizes="447px" className="object-contain" />
        </div>
      </div>
    </section>
  );
}
