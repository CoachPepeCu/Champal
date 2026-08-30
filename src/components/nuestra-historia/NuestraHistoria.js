import Image from "next/image";
import localFont from "next/font/local";

// ============================================================================
// NuestraHistoria — frame "Nuestra_Historia" (node-id 1240:1191, archivo
// Champ): https://www.figma.com/design/UBACmzTCtVZqRDiTHDYi98/Champ?node-id=1240-1191
//
// Componente AISLADO: no depende de Header/Footer/Home ni de otras
// secciones, y no incorpora controles de navegación propios (cierre,
// "volver", etc.) — solo el contenido del frame. Se monta desde la ruta de
// desarrollo src/app/dev/frame-nuestra-historia/page.js para su revisión.
//
// OJO: no confundir con src/components/nosotros/NosotrosHistoria.js — ese
// componente replica un frame DISTINTO (node 972:1387, el banner corto
// "Conoce Nuestra Historia / Nuestro Futuro"). Este componente es el frame
// completo de 1440x1170 con la línea de tiempo, el escudo y "Nuestros
// principios".
//
// El frame de Figma mide 1440x1170 y se compone de dos bloques apilados
// (no superpuestos): el bloque superior "Fondo + Historia" (1440x760, fondo
// degradado azul con el cohete, la línea de tiempo y el escudo) y el
// bloque "Principios" (1440x410, foto de fachada + 6 insignias). Cada uno
// se implementa como su propio lienzo fijo px->%/cqw (misma técnica que
// src/components/PrimariaFormacion.js / src/components/comunidad-recursos —
// containerType:"inline-size" + aspect-ratio fijo) para escalar de forma
// pixel-accurate en escritorio. Debajo de lg se usa una versión apilada en
// flujo normal (MobileFrame) que reordena el contenido para mantener la
// legibilidad, conservando textos y jerarquías.
//
// Tipografías: se reutilizan las ya configuradas en el proyecto — Outfit
// (font-sans, cuerpo de texto) y la propia Fredoka One, que YA existe en el
// proyecto como archivo local (src/fonts/fredoka-one-regular.ttf, cargada
// vía next/font/local igual que en src/components/CertificacionesColaboraciones.js)
// — no la fuente variable "Fredoka" (font-serif/--font-fredoka), que es una
// familia distinta. Figma pide literalmente "Fredoka_One:Regular" para las
// marcas de agua ("Nuestro futuro"/"Nuestra historia", 100px), el título
// "Nuestros principios" (64px) y las etiquetas de las 6 insignias (14px),
// así que las tres usan `fredokaOne.className`. El nodo pide "Stack Sans
// Notch" solo para los 4 años de la línea de tiempo (2026/2010/2000/1992);
// esa fuente no existe en el proyecto y no se instalan dependencias nuevas,
// así que se sustituye por font-serif (Fredoka variable) semibold, la
// fuente de display ya usada para números/etiquetas destacadas en el resto
// del sitio.
//
// Colores bespoke de este frame (no la paleta general de marca, igual que
// en NosotrosHistoria.js): rojo #DA2028 (acento y punto 2026), naranja
// #FF7300 (punto 2010), amarillo #FFC708 (punto 2000), turquesa #0AB6C7
// (punto 1992), navy #003750 (texto de las etiquetas de "Nuestros
// principios").
// ============================================================================

const fredokaOne = localFont({
  src: "../../fonts/fredoka-one-regular.ttf",
  weight: "400",
  style: "normal",
});

const CANVAS_W = 1440;
const TOP_H = 760;
const PRIN_H = 410;

function pctX(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}%`;
}
function pctYTop(px) {
  return `${((px / TOP_H) * 100).toFixed(3)}%`;
}
function pctYPrin(px) {
  return `${((px / PRIN_H) * 100).toFixed(3)}%`;
}
function cqw(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;
}

const IMG = {
  flama: "/images/nuestra-historia/flama-linea.png",
  cohete: "/images/nuestra-historia/cohete.png",
  nubeDerecha: "/images/nuestra-historia/nube-derecha.png",
  nubeIzquierda: "/images/nuestra-historia/nube-izquierda.png",
  escudo: "/images/nuestra-historia/escudo-tech.png",
  fondoPrincipios: "/images/nuestra-historia/fondo-principios.png",
  prCompromiso: "/images/nuestra-historia/icono-compromiso.png",
  prCiudadania: "/images/nuestra-historia/icono-ciudadania-global.png",
  prExcelencia: "/images/nuestra-historia/icono-excelencia-academica.png",
  prCompasion: "/images/nuestra-historia/icono-compasion.png",
  prIntegridad: "/images/nuestra-historia/icono-integridad.png",
  prHermandad: "/images/nuestra-historia/icono-hermandad.png",
  punto2026: "/images/nuestra-historia/punto-2026.svg",
  punto2010: "/images/nuestra-historia/punto-2010.svg",
  punto2000: "/images/nuestra-historia/punto-2000.svg",
  punto1992: "/images/nuestra-historia/punto-1992.svg",
  raya: "/images/nuestra-historia/linea-conectora.svg",
};

const ESCUDO_ALT =
  "Escudo institucional de Colegio Champal junto a un panel que explica el simbolismo de sus colores: azul (pensamiento, sinceridad y confianza), rojo (vitalidad y amor), azul y blanco (pureza) y blanco (honradez y nobleza)";

// Hitos de la línea de tiempo, de más reciente a más antiguo (igual que en
// Figma). Los textos de Hito 2 e Hito 3 se conservan tal cual aparecen en
// el diseño — no se inventa contenido para ellos.
const HITOS = [
  { year: "2026", label: "Más de 20 generaciones graduadas", dot: IMG.punto2026 },
  { year: "2010", label: "Hito 3", dot: IMG.punto2010 },
  { year: "2000", label: "hito 2", dot: IMG.punto2000 },
  { year: "1992", label: "Despega Champal", dot: IMG.punto1992 },
];

// "Nuestros principios" — fila 1 (arriba) y fila 2 (abajo), en el mismo
// orden que el frame de Figma. iconH/gap replican las medidas reales
// (ligeramente distintas por icono) devueltas por get_design_context.
const PRINCIPIOS_FILA1 = [
  { icon: IMG.prCompromiso, label: "COMPROMISO", iconH: 154, gap: 7 },
  { icon: IMG.prCiudadania, label: "CIUDADANÍA GLOBAL", iconH: 152, gap: 12 },
  { icon: IMG.prExcelencia, label: "EXCELENCIA ACADÉMICA", iconH: 156, gap: 10 },
];
const PRINCIPIOS_FILA2 = [
  { icon: IMG.prCompasion, label: "COMPASIÓN", iconH: 155, gap: 4 },
  { icon: IMG.prIntegridad, label: "INTEGRIDAD", iconH: 151, gap: 6 },
  { icon: IMG.prHermandad, label: "HERMANDAD", iconH: 150, gap: 6 },
];

// Texto introductorio (párrafo izquierdo, sobre el fondo azul) — partido en
// constantes para evitar bugs de espacios en blanco al mezclar <span>s con
// distinto peso (mismo criterio que src/components/PrimariaFormacion.js).
const INTRO_MEDIO =
  ", al cumplir con los requisitos marcados por la Secretaria de Educación para impartir Educación Inicial, abre sus puertas al";
const INTRO_FINAL =
  " distribuidos en los niveles de lactancia, maternal y preescolar. Esta matrícula fue aumentándose considerablemente implicando un crecimiento rápido y organizado tanto en las instalaciones como en el personal.";

function IntroParrafo({ fontSize, capSize, className = "" }) {
  return (
    <p className={`font-sans text-white ${className}`} style={{ fontSize, lineHeight: "1.375" }}>
      <span style={{ fontSize: capSize }}>E</span>n <span className="font-semibold">1992</span>
      {INTRO_MEDIO}
      <span className="font-semibold"> Cendi Champal con 16 alumnos</span>
      {INTRO_FINAL}
    </p>
  );
}

// Párrafos de la columna derecha (junto al escudo). Se conservan tal cual
// aparecen en Figma.
function Historia2Texto({ gap, fontSize, capSize, className = "" }) {
  return (
    <div className={`flex flex-col font-sans text-white ${className}`} style={{ gap, fontSize, lineHeight: "1.375" }}>
      <p>
        <span style={{ fontSize: capSize }}>L</span>a confianza de los padres provocó que se buscara asesoría
        profesional y además se tramitara la clave que da validez oficial a los estudios de educación Primaria.
      </p>
      <p>
        Egresada nuestra primera generación, padres inquietos por poder continuar la misma línea de formación que
        compartimos y nuevamente apoyándonos en una institución de gran trayectoria, decidimos iniciar con gran
        responsabilidad y compromiso la Educación Secundaria, la cual actualmente está respaldada por la clave que
        otorga la Secretaría de Educación.
      </p>
      <p>
        A la fecha, se cuenta con instalaciones exprofeso que cumplen con todos los requisitos que facilitan el
        proceso formativo de nuestros alumnos que ahora suman ya más de 800.
      </p>
      <p>De la misma forma, al egresar la primera generación de Secundaria, el colegio acepta un nuevo reto: la Prepa Champal.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop (lg+) — réplica pixel-accurate de los dos lienzos de Figma.
// ---------------------------------------------------------------------------

function Milestone({ year, label, dot }) {
  return (
    <div className="relative w-full shrink-0" style={{ height: cqw(60) }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- punto SVG decorativo, no una foto de contenido */}
      <img alt="" src={dot} className="absolute left-0 top-0" style={{ width: cqw(60), height: cqw(60) }} />
      {/* eslint-disable-next-line @next/next/no-img-element -- trazo SVG decorativo (conector de la línea de tiempo), no una foto de contenido */}
      <img
        aria-hidden
        alt=""
        src={IMG.raya}
        className="absolute"
        style={{ left: cqw(22), top: cqw(22), width: cqw(168), height: cqw(16) }}
      />
      <p
        className="absolute whitespace-nowrap font-serif font-semibold leading-none text-white"
        style={{ left: cqw(196), top: cqw(16), fontSize: cqw(24) }}
      >
        {year}
      </p>
      <p
        className="absolute whitespace-nowrap font-sans leading-none text-white"
        style={{ left: cqw(196), top: cqw(38), fontSize: cqw(16) }}
      >
        {label}
      </p>
    </div>
  );
}

function PrincipioBadge({ icon, label, iconH, gap }) {
  return (
    <div className="flex flex-col items-center" style={{ width: cqw(198), gap: cqw(gap) }}>
      <div className="relative shrink-0" style={{ width: cqw(150), height: cqw(iconH) }}>
        <Image src={icon} alt="" fill sizes="10vw" className="object-cover" />
      </div>
      <div
        className="flex w-full items-center justify-center rounded-[12px] border-solid border-white bg-white shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        style={{ height: cqw(25), borderWidth: cqw(3) }}
      >
        <p className={`whitespace-nowrap ${fredokaOne.className}`} style={{ fontSize: cqw(14), color: "#003750" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function TopDesktop() {
  return (
    <div
      className="relative aspect-[1440/760] w-full overflow-hidden bg-gradient-to-b from-[#017cc2] to-[#003c7a]"
      style={{ containerType: "inline-size" }}
    >
      {/* Flama — trazo decorativo detrás de la línea de tiempo, recortado
          por este mismo contenedor (overflow-hidden) igual que en Figma
          (la capa "Fondo" original también recorta la Flama en y=760). */}
      <div className="absolute" style={{ left: pctX(148), top: pctYTop(230), width: cqw(79.915), height: cqw(759.192) }}>
        <Image src={IMG.flama} alt="" fill sizes="6vw" className="object-cover" />
      </div>

      <div className="absolute" style={{ left: pctX(134), top: pctYTop(43), width: cqw(123), height: cqw(268.592) }}>
        <Image
          src={IMG.cohete}
          alt="Cohete despegando, símbolo del crecimiento de Colegio Champal"
          fill
          sizes="9vw"
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute" style={{ left: pctX(1099), top: pctYTop(588), width: cqw(340.808), height: cqw(172.298) }}>
        <Image src={IMG.nubeDerecha} alt="" fill sizes="24vw" className="object-contain" />
      </div>
      <div className="absolute" style={{ left: pctX(0), top: pctYTop(588), width: cqw(483.463), height: cqw(171.898) }}>
        <Image src={IMG.nubeIzquierda} alt="" fill sizes="34vw" className="object-contain" />
      </div>

      {/* Marca de agua — texto decorativo translúcido de fondo (Fredoka One 100px, como en Figma) */}
      <p
        className={`absolute whitespace-nowrap leading-none ${fredokaOne.className}`}
        style={{ left: pctX(230), top: pctYTop(369), fontSize: cqw(100), color: "rgba(255,255,255,0.2)" }}
      >
        Nuestro futuro
      </p>
      <p
        className={`absolute whitespace-nowrap leading-none ${fredokaOne.className}`}
        style={{
          left: pctX(91),
          top: pctYTop(496),
          fontSize: cqw(100),
          color: "rgba(255,255,255,0.2)",
          textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
        }}
      >
        Nuestra historia
      </p>

      {/* Párrafo introductorio */}
      <div className="absolute" style={{ left: pctX(320), top: pctYTop(46), width: pctX(378) }}>
        <IntroParrafo fontSize={cqw(16)} capSize={cqw(24)} />
      </div>

      {/* Línea de tiempo */}
      <div
        className="absolute flex flex-col items-start"
        style={{ left: pctX(166), top: pctYTop(316), width: pctX(449), gap: cqw(31) }}
      >
        {HITOS.map((hito) => (
          <Milestone key={hito.year} {...hito} />
        ))}
      </div>

      {/* Escudo + texto — el radio de 18px y el borde azul cielo (#38bdf8,
          2px) son un ajuste pedido explícitamente sobre el diseño; el
          layer original en Figma es un rectángulo recto sin borde. Se
          usan valores fijos en px (no cqw) porque así se pidió, igual
          que otros radios fijos ya usados en el proyecto. */}
      <div
        className="absolute flex flex-col items-start"
        style={{ left: pctX(800), top: pctYTop(46), width: pctX(447), gap: cqw(24) }}
      >
        <div
          className="relative w-full shrink-0 overflow-hidden rounded-[18px] border-solid"
          style={{ height: cqw(247), borderWidth: "2px", borderColor: "#38bdf8" }}
        >
          <Image src={IMG.escudo} alt={ESCUDO_ALT} fill sizes="28vw" className="object-cover" />
        </div>
        <Historia2Texto gap={cqw(22)} fontSize={cqw(16)} capSize={cqw(20)} className="w-full" />
      </div>
    </div>
  );
}

function PrincipiosDesktop() {
  return (
    <div className="relative aspect-[1440/410] w-full overflow-hidden" style={{ containerType: "inline-size" }}>
      <Image
        src={IMG.fondoPrincipios}
        alt="Fachada e instalaciones deportivas de Colegio Champal"
        fill
        sizes="100vw"
        className="object-cover"
      />

      {/* Acento + título en una misma fila flex (items-center): el "top"
          literal del título en Figma (170) describe la caja de texto
          recortada que usa su propio motor de layout, no la métrica real
          de línea de Fredoka One en el navegador — copiarlo tal cual deja
          el acento desalineado del texto. Centrando ambos en una fila cuya
          altura es la del acento (62px, un valor real y sin ambigüedad) se
          reproduce la intención del diseño: el rectángulo rojo alineado al
          texto "Nuestros principios". El left del título resulta 103+14+15
          = 132px, igual al valor original de Figma. */}
      <div className="absolute flex items-center" style={{ left: pctX(103), top: pctYPrin(150), height: cqw(62), gap: cqw(15) }}>
        <span className="block h-full shrink-0" style={{ width: cqw(14), backgroundColor: "#DA2028" }} />
        <h2
          className={`whitespace-nowrap leading-none text-white ${fredokaOne.className}`}
          style={{ fontSize: cqw(64), textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
        >
          Nuestros principios
        </h2>
      </div>

      <div className="absolute flex items-start" style={{ left: pctX(746), top: pctYPrin(20), gap: cqw(22) }}>
        {PRINCIPIOS_FILA1.map((p) => (
          <PrincipioBadge key={p.label} {...p} />
        ))}
      </div>
      <div className="absolute flex items-start" style={{ left: pctX(744), top: pctYPrin(217), gap: cqw(23) }}>
        {PRINCIPIOS_FILA2.map((p) => (
          <PrincipioBadge key={p.label} {...p} />
        ))}
      </div>
    </div>
  );
}

function DesktopFrame() {
  return (
    <div className="hidden lg:block">
      <TopDesktop />
      <PrincipiosDesktop />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile / tablet (< lg) — se reordena el contenido en flujo normal para
// mantener la legibilidad: la línea de tiempo se mantiene vertical y clara,
// el escudo conserva su proporción (aspect-ratio) y los 6 principios pasan
// a una cuadrícula responsiva (2 columnas / 3 en sm+), sin scroll horizontal.
// ---------------------------------------------------------------------------

function MilestoneMobile({ year, label, dot }) {
  return (
    <div className="relative flex items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- punto SVG decorativo, no una foto de contenido */}
      <img alt="" src={dot} className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
      <div className="text-left">
        <p className="font-serif text-xl font-semibold leading-none text-white sm:text-2xl">{year}</p>
        <p className="mt-1 font-sans text-sm text-white sm:text-base">{label}</p>
      </div>
    </div>
  );
}

function TopMobile() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#017cc2] to-[#003c7a] px-6 py-14 sm:px-10">
      {/* Marca de agua decorativa, recortada y detrás del contenido */}
      <p
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-8 select-none whitespace-nowrap text-center leading-none ${fredokaOne.className}`}
        style={{ fontSize: "clamp(32px, 14vw, 64px)", color: "rgba(255,255,255,0.15)" }}
      >
        Nuestra historia
      </p>

      {/* Nubes decorativas — recortadas por el overflow-hidden del contenedor */}
      <div className="pointer-events-none absolute -bottom-6 -left-10 h-24 w-40 opacity-90 sm:h-28 sm:w-52">
        <Image src={IMG.nubeIzquierda} alt="" fill sizes="40vw" className="object-contain" />
      </div>
      <div className="pointer-events-none absolute -bottom-4 -right-10 h-20 w-36 opacity-90 sm:h-24 sm:w-48">
        <Image src={IMG.nubeDerecha} alt="" fill sizes="40vw" className="object-contain" />
      </div>

      <div className="relative flex flex-col items-center gap-6 text-center">
        <div className="relative h-40 w-20 sm:h-48 sm:w-24">
          <Image
            src={IMG.cohete}
            alt="Cohete despegando, símbolo del crecimiento de Colegio Champal"
            fill
            sizes="20vw"
            className="object-contain"
            priority
          />
        </div>
        <IntroParrafo fontSize="clamp(15px, 3.6vw, 17px)" capSize="1.4em" className="max-w-xl leading-relaxed" />
      </div>

      {/* Línea de tiempo — se mantiene vertical, con un trazo continuo
          detrás de los puntos para conservar la lectura de "línea de
          tiempo" también en mobile. */}
      <div className="relative mt-10">
        <span
          aria-hidden
          className="absolute bottom-2 top-2 w-1.5 rounded-full sm:left-[27px]"
          style={{ left: "23px", background: "linear-gradient(to bottom, #DA2028, #FF7300, #FFC708, #0AB6C7)" }}
        />
        <div className="relative flex flex-col gap-8">
          {HITOS.map((hito) => (
            <MilestoneMobile key={hito.year} {...hito} />
          ))}
        </div>
      </div>

      {/* Escudo + texto — misma franja azul, debajo de la línea de tiempo */}
      <div className="relative mt-12 flex flex-col items-center gap-6">
        <div
          className="relative aspect-[408/247] w-full max-w-sm overflow-hidden rounded-[18px] border-solid"
          style={{ borderWidth: "2px", borderColor: "#38bdf8" }}
        >
          <Image src={IMG.escudo} alt={ESCUDO_ALT} fill sizes="90vw" className="object-cover" />
        </div>
        <Historia2Texto gap="1em" fontSize="clamp(15px, 3.6vw, 17px)" capSize="1.25em" className="max-w-xl text-left leading-relaxed" />
      </div>
    </div>
  );
}

function PrincipiosMobile() {
  const principios = [...PRINCIPIOS_FILA1, ...PRINCIPIOS_FILA2];
  return (
    <div
      className="relative flex flex-col items-start gap-8 overflow-hidden px-6 py-14 sm:px-10"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(3,45,76,0.35) 0%, rgba(3,45,76,0.78) 100%), url(${IMG.fondoPrincipios})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="h-12 w-3 shrink-0 sm:h-14" style={{ backgroundColor: "#DA2028" }} />
        <h2
          className={`text-3xl leading-none text-white sm:text-4xl ${fredokaOne.className}`}
          style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
        >
          Nuestros principios
        </h2>
      </div>

      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6">
        {principios.map((p) => (
          <div key={p.label} className="flex flex-col items-center gap-2 text-center">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24">
              <Image src={p.icon} alt="" fill sizes="25vw" className="object-cover" />
            </div>
            <span
              className={`inline-flex items-center justify-center rounded-xl border-[3px] border-solid border-white bg-white px-3 py-1 text-[11px] text-[#003750] shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:text-xs ${fredokaOne.className}`}
            >
              {p.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileFrame() {
  return (
    <div className="lg:hidden">
      <TopMobile />
      <PrincipiosMobile />
    </div>
  );
}

export default function NuestraHistoria() {
  return (
    <section className="relative isolate" aria-label="Nuestra historia">
      <DesktopFrame />
      <MobileFrame />
    </section>
  );
}
