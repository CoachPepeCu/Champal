import Image from "next/image";
import CardStack from "@/components/effects/CardStack";

// "05_Accesos_Especializados_Secundaria" (node 328:9553, bloque de
// 1440x2383) — mismo patrón que el "bloque largo" de Primaria
// (PrimariaIngles.js / PrimariaProgrentis.js / PrimariaFinanciera.js):
// varias secciones seguidas que comparten un fondo común. Acá el fondo
// (node 403:655, "Fondo_Estrellas_Secundaria") es simplemente
// `background-color: #0f76d7` de punta a punta del bloque — el MISMO azul
// exacto en el que termina el degradado de 04_Programas
// (SecundariaProgramas.js), a propósito, para que la costura entre ambas
// secciones sea invisible (el usuario lo pidió explícitamente).
//
// Adentro van 3 "tarjetas" (Inglés/Cambridge, PROGRENTIS, Vanguardia
// Digital), cada una su propio rectángulo redondeado (40px) con sombra
// blanca suave hacia afuera y su propio degradado radial de fondo — no es
// el patrón "wavy full-bleed" de Kinder/Primaria (ahí la tarjeta corre
// borde a borde); acá cada tarjeta vive con margen dentro del fondo azul
// compartido, así que el apilado de las 3 usa flujo normal (flex-col +
// gap), y solo el CONTENIDO interno de cada tarjeta usa la técnica
// px->%/cqw sobre su propio canvas (1232x721, node 333:654 y hermanos).
//
// `overflow-hidden` NUNCA junto al `box-shadow` hacia afuera de cada
// tarjeta (la recortaría) — mismo fix ya aplicado en SecundariaProgramas.js:
// un envoltorio exterior (posición/radio/sombra) + un interior
// (`overflow-hidden`, el degradado de fondo, todo el contenido).
const CANVAS_W = 1232;
const CANVAS_H = 721;
function pctX(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}%`;
}
function pctY(px) {
  return `${((px / CANVAS_H) * 100).toFixed(3)}%`;
}
function cqw(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;
}

const CARD_SHADOW = "5px 5px 50px 5px rgba(255,255,255,0.6)";

// Degradado radial de fondo de cada tarjeta — Figma lo exporta como un SVG
// inline con gradientTransform (matriz de rotación/escala); se reutiliza
// LITERAL (mismo `data:image/svg+xml` que devuelve get_design_context) en
// vez de intentar aproximarlo a un radial-gradient de CSS a mano, para no
// perder la forma/ángulo exactos.
function radialBg(stops) {
  const svg = `<svg viewBox='0 0 1232 721' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(46.75 37.853 -64.68 80.106 323.5 377.02)'>${stops}</radialGradient></defs></svg>`;
  return `url("data:image/svg+xml;utf8,${svg}")`;
}
const BG_INGLES = radialBg(
  "<stop stop-color='rgba(0,75,252,1)' offset='0'/><stop stop-color='rgba(12,92,246,1)' offset='0.125'/><stop stop-color='rgba(24,109,240,1)' offset='0.25'/><stop stop-color='rgba(48,142,228,1)' offset='0.5'/><stop stop-color='rgba(72,176,217,1)' offset='0.75'/><stop stop-color='rgba(96,209,205,1)' offset='1'/>",
);
const BG_PROGRENTIS = radialBg(
  "<stop stop-color='rgba(255,115,0,1)' offset='0'/><stop stop-color='rgba(247,114,13,1)' offset='0.0625'/><stop stop-color='rgba(239,112,26,1)' offset='0.125'/><stop stop-color='rgba(223,110,52,1)' offset='0.25'/><stop stop-color='rgba(207,108,78,1)' offset='0.375'/><stop stop-color='rgba(192,105,105,1)' offset='0.5'/><stop stop-color='rgba(160,101,157,1)' offset='0.75'/><stop stop-color='rgba(128,96,209,1)' offset='1'/>",
);
const BG_VANGUARDIA = radialBg(
  "<stop stop-color='rgba(33,27,134,1)' offset='0'/><stop stop-color='rgba(57,44,153,1)' offset='0.25'/><stop stop-color='rgba(81,62,172,1)' offset='0.5'/><stop stop-color='rgba(128,96,209,1)' offset='1'/>",
);

// Tinte de la "Columna2" (mitad derecha o izquierda, según la tarjeta) —
// mismo ángulo/paradas en las 3 tarjetas, solo cambia el color de salida.
function columnTint(colorRgb) {
  return `linear-gradient(66.624deg, ${colorRgb} 6.2014%, rgba(44,117,171,0) 70.905%)`;
}

const ANTETITULO_STYLE = { fontFamily: "var(--font-sans)", color: "#ffffff" };
const TITLE_STYLE = { fontFamily: "var(--font-serif)", color: "#ffffff" };
const PARAGRAPH_STYLE = { fontFamily: "var(--font-sans)", color: "#ffffff" };

// Antetítulo (barra blanca + etiqueta) — igual en las 3 tarjetas, solo
// cambia el texto. `mobile` ajusta tamaños para la versión apilada.
function Antetitulo({ text, mobile = false }) {
  if (mobile) {
    return (
      <div className="flex items-center gap-3">
        <span className="h-[6px] w-14 shrink-0 rounded-full bg-white" />
        <p className="text-xs font-semibold tracking-wide text-white sm:text-sm">{text}</p>
      </div>
    );
  }
  return (
    <div className="flex items-center" style={{ gap: cqw(18) }}>
      <span className="shrink-0 rounded-full bg-white" style={{ width: cqw(56), height: cqw(6) }} />
      <p className="whitespace-nowrap font-semibold" style={{ fontSize: cqw(14), ...ANTETITULO_STYLE }}>
        {text}
      </p>
    </div>
  );
}

// Insignia circular (2 aros + ícono) — el inset del aro interior
// (ellipse2) resultó ser el mismo ~7.8% del aro exterior en las 3
// tarjetas (igual que ya se documentó en PrimariaIngles.js), así que se
// reutiliza ese inset; el ÍCONO en cambio SÍ trae su propia
// posición/tamaño literal por tarjeta (no un inset fijo — ver la misma
// nota en PrimariaIngles.js/PrimariaFinanciera.js), relativa a la esquina
// del aro exterior. `iconShadow` (solo lo trae Vanguardia, el ícono de
// LapTop) se aplica SIEMPRE como `filter: drop-shadow(...)`, nunca como
// `boxShadow` — Figma lo da como box-shadow, pero el PNG del ícono trae su
// propio margen transparente horneado, así que un box-shadow dibuja la
// sombra del RECTÁNGULO completo de la caja (se ve como un "fantasma"
// cuadrado) en vez de seguir la silueta real de la laptop — mismo bug ya
// corregido varias veces en este proyecto (ver SecundariaProgramas.js y la
// memoria de proyecto "champal-niveles-pages-pattern").
function Badge({ leftPx, topPx, ellipse1Src, ellipse2Src, iconSrc, iconLeftPx, iconTopPx, iconSizePx, iconShadow }) {
  return (
    <div className="absolute" style={{ left: cqw(leftPx), top: cqw(topPx), width: cqw(150), height: cqw(150) }}>
      <Image src={ellipse1Src} alt="" fill sizes="150px" />
      <div className="absolute inset-[7.8%]">
        <Image src={ellipse2Src} alt="" fill sizes="130px" />
      </div>
      <div
        className="absolute"
        style={{
          left: cqw(iconLeftPx),
          top: cqw(iconTopPx),
          width: cqw(iconSizePx),
          height: cqw(iconSizePx),
          filter: iconShadow ? `drop-shadow(${iconShadow})` : undefined,
        }}
      >
        <Image src={iconSrc} alt="" fill sizes="135px" className="object-cover" />
      </div>
    </div>
  );
}

// Envoltorio compartido de cada tarjeta de escritorio: exterior (posición
// vía flujo normal — no absoluta, ya que las 3 tarjetas solo se apilan en
// flujo, ver nota arriba — radio + sombra) + interior (overflow-hidden +
// fondo + `containerType: inline-size` para que cqw() funcione en los
// hijos + todo el contenido).
function CardShell({ bgImage, children }) {
  return (
    <div className="relative hidden aspect-[1232/721] w-full lg:block" style={{ borderRadius: 40, boxShadow: CARD_SHADOW }}>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius: "inherit", backgroundImage: bgImage, containerType: "inline-size" }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 1) Inglés / Cambridge (node 333:654) — foto a la izquierda (se sale por
// el borde izquierdo, left negativo), texto+insignia a la derecha sobre
// un panel "Cristal" translúcido (única de las 3 con ese panel).
const ING_PHOTO = "/images/secundaria/accesos-especializados/foto-ingles.png";
const ING_ICON = "/images/secundaria/accesos-especializados/icono-ingles.png";
const ING_ELLIPSE_1 = "/images/secundaria/accesos-especializados/ingles-ellipse1.svg";
const ING_ELLIPSE_2 = "/images/secundaria/accesos-especializados/ingles-ellipse2.svg";
const ING_TITLE = "Cambridge en Champal";
const ING_ANTETITULO = "EL INGLÉS COMO HABILIDAD";
const ING_TEXT =
  "En Secundaria fortalecen su comunicación oral y escrita en inglés, avanzando con las certificaciones Cambridge hacia una expresión segura, autónoma y preparada para conectar con el mundo";

function SeccionIngles() {
  return (
    <>
      {/* Mobile/tablet (< lg): apilado simple */}
      <div className="flex flex-col gap-6 rounded-[32px] p-6 lg:hidden" style={{ backgroundImage: BG_INGLES }}>
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-[20px]">
          <Image src={ING_PHOTO} alt="Alumnos de Secundaria de Colegio Champal" fill sizes="320px" className="object-cover" />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <Image src={ING_ELLIPSE_1} alt="" fill sizes="64px" />
            <div className="absolute inset-[7.8%]">
              <Image src={ING_ELLIPSE_2} alt="" fill sizes="56px" />
            </div>
            <div className="absolute inset-[16%]">
              <Image src={ING_ICON} alt="" fill sizes="48px" className="object-cover" />
            </div>
          </div>
          <Antetitulo text={ING_ANTETITULO} mobile />
        </div>
        <h3 className="font-serif text-3xl font-semibold text-white">{ING_TITLE}</h3>
        <p className="text-base leading-relaxed text-white/90">{ING_TEXT}</p>
      </div>

      {/* Desktop (lg+): réplica 1:1 de Figma, canvas 1232x721 */}
      <CardShell bgImage={BG_INGLES}>
        {/* node 435:762 — foto que se sale por el borde izquierdo */}
        <div className="absolute" style={{ left: cqw(-93), top: cqw(12), width: cqw(709), height: cqw(709) }}>
          <Image src={ING_PHOTO} alt="Alumnos de Secundaria de Colegio Champal" fill sizes="709px" className="object-cover" />
        </div>

        {/* node 334:655 — Columna2_ingles (mitad derecha), tinte propio */}
        <div className="absolute" style={{ left: cqw(616), top: 0, width: cqw(616), height: cqw(720), backgroundImage: columnTint("rgb(100,211,217)") }}>
          {/* node 426:759 — Cristal (panel translúcido detrás del texto) */}
          <div
            className="absolute"
            style={{ left: cqw(31), top: cqw(230), width: cqw(567), height: cqw(279), borderRadius: cqw(28), backgroundImage: "linear-gradient(196.26deg, rgba(0,45,113,0.2) 39.217%, rgba(255,255,255,0.02) 77.309%)" }}
          />
          {/* node 343:806 — Texto_Ingles */}
          <div className="absolute flex flex-col" style={{ left: cqw(54), top: cqw(255), width: cqw(550), gap: cqw(10) }}>
            <Antetitulo text={ING_ANTETITULO} />
            <p className="font-semibold" style={{ fontSize: cqw(42), ...TITLE_STYLE }}>
              {ING_TITLE}
            </p>
            <p style={{ width: cqw(540), fontSize: cqw(18), lineHeight: cqw(30), ...PARAGRAPH_STYLE }}>{ING_TEXT}</p>
          </div>
          {/* node 421:706 — Identifica_Ingles */}
          <Badge
            leftPx={438}
            topPx={28}
            ellipse1Src={ING_ELLIPSE_1}
            ellipse2Src={ING_ELLIPSE_2}
            iconSrc={ING_ICON}
            iconLeftPx={30.667}
            iconTopPx={33.333}
            iconSizePx={89.333}
          />
        </div>
      </CardShell>
    </>
  );
}

// ---------------------------------------------------------------------
// 2) PROGRENTIS (node 401:1513) — insignia+texto a la izquierda (directo
// sobre el fondo de la tarjeta, sin panel Cristal), foto a la derecha
// (dentro de su Columna2, se sale por arriba/izquierda de esa mitad).
const PRO_PHOTO = "/images/secundaria/accesos-especializados/foto-progrentis-v4.webp";
const PRO_ICON = "/images/secundaria/accesos-especializados/icono-progrentis.png";
const PRO_ELLIPSE_1 = "/images/secundaria/accesos-especializados/progrentis-ellipse1.svg";
const PRO_ELLIPSE_2 = "/images/secundaria/accesos-especializados/progrentis-ellipse2.svg";
const PRO_TITLE = "DESARROLLANDO PENSAMIENTO CRÍTICO Y AUTONOMÍA";
const PRO_ANTETITULO = "PROGRENTIS. Entrenamiento estudiantil de vanguardia";
const PRO_TEXT =
  "En Secundaria, los desafíos digitales personalizados fortalecen el uso eficiente de la información, el pensamiento crítico y la resolución de problemas complejos. Así, nuestros alumnos aprenden a analizar, investigar y tomar decisiones con mayor seguridad y responsabilidad";

function SeccionProgrentis() {
  return (
    <>
      {/* Mobile/tablet (< lg) */}
      <div className="flex flex-col gap-6 rounded-[32px] p-6 lg:hidden" style={{ backgroundImage: BG_PROGRENTIS }}>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <Image src={PRO_ELLIPSE_1} alt="" fill sizes="64px" />
            <div className="absolute inset-[7.8%]">
              <Image src={PRO_ELLIPSE_2} alt="" fill sizes="56px" />
            </div>
            <div className="absolute inset-[17%]">
              <Image src={PRO_ICON} alt="" fill sizes="48px" className="object-cover" />
            </div>
          </div>
          <Antetitulo text={PRO_ANTETITULO} mobile />
        </div>
        <h3 className="font-serif text-2xl font-semibold uppercase text-white sm:text-3xl">{PRO_TITLE}</h3>
        <p className="text-base leading-relaxed text-white/90">{PRO_TEXT}</p>
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-[20px]">
          <Image src={PRO_PHOTO} alt="Alumno de Secundaria trabajando con PROGRENTIS en Colegio Champal" fill sizes="320px" className="object-cover" />
        </div>
      </div>

      {/* Desktop (lg+) */}
      <CardShell bgImage={BG_PROGRENTIS}>
        {/* node 401:1514 — Columna2 (mitad derecha), tinte propio. Solo el
            tinte va adentro — la foto (justo abajo) es HERMANA de esta
            columna, no hija, porque a pedido del usuario debe rebasar
            hacia la izquierda MÁS ALLÁ del borde de la columna; puesta
            adentro, el propio overflow-hidden de la columna la recortaría
            ahí mismo en vez de dejarla sobresalir. */}
        <div className="absolute overflow-hidden" style={{ left: cqw(616), top: 0, width: cqw(616), height: cqw(720), backgroundImage: columnTint("rgb(191,18,18)") }} />

        {/* Foto final que dio el usuario directo (fondo ya transparente,
            sin pantalla verde): "Secundaria Niño-Maestro.webp", 981x643. A
            pedido del usuario: agrandada, anclada al borde INFERIOR de la
            columna (top+height = 720, sin margen abajo) y su borde derecho
            anclado al borde derecho de la TARJETA completa, dejándola
            rebasar hacia la izquierda sobre el área entre el bloque de
            texto y la columna — mismo patrón que ya usan Inglés/Vanguardia
            (la foto es hermana de Columna2, la recorta el
            `overflow-hidden` de la TARJETA completa en CardShell, no el de
            la columna). Tamaño elegido (750 de ancho, 492 de alto,
            proporción sin deformar) simulado antes con Pillow contra el
            fondo de la tarjeta para confirmar que el letrero/segunda
            laptop quedan visibles y el solape con el texto es mínimo. */}
        <div
          className="absolute"
          style={{
            left: cqw(1232 - 750), // 482: el borde derecho de la foto (left+width) queda en 1232, el borde derecho de la tarjeta completa
            top: cqw(720 - 492),
            width: cqw(750),
            height: cqw(492),
            backgroundImage: `url(${PRO_PHOTO})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* node 421:710 — Identifica_Progrentis */}
        <Badge
          leftPx={29}
          topPx={16}
          ellipse1Src={PRO_ELLIPSE_1}
          ellipse2Src={PRO_ELLIPSE_2}
          iconSrc={PRO_ICON}
          iconLeftPx={35.75}
          iconTopPx={30.75}
          iconSizePx={81.517}
        />

        {/* node 401:1515 — Texto_Secu_Progrentis */}
        <div className="absolute flex flex-col" style={{ left: cqw(65), top: cqw(184), width: cqw(484), gap: cqw(10) }}>
          <Antetitulo text={PRO_ANTETITULO} />
          <p className="font-semibold uppercase" style={{ fontSize: cqw(42), ...TITLE_STYLE }}>
            {PRO_TITLE}
          </p>
          <p style={{ width: cqw(417), fontSize: cqw(18), lineHeight: cqw(30), ...PARAGRAPH_STYLE }}>{PRO_TEXT}</p>
        </div>
      </CardShell>
    </>
  );
}

// ---------------------------------------------------------------------
// 3) Vanguardia Digital (node 401:1522) — foto a la izquierda (se sale
// por arriba de la tarjeta), texto+insignia a la derecha, sin panel
// Cristal.
const VAN_PHOTO = "/images/secundaria/accesos-especializados/foto-vanguardia.png";
const VAN_ICON = "/images/secundaria/accesos-especializados/icono-laptop.png";
const VAN_ELLIPSE_1 = "/images/secundaria/accesos-especializados/vanguardia-ellipse1.svg";
const VAN_ELLIPSE_2 = "/images/secundaria/accesos-especializados/vanguardia-ellipse2.svg";
const VAN_TITLE = "Tecnología para aprender, colaborar y crear.";
const VAN_ANTETITULO = "VANGUARDIA DIGITAL";
const VAN_TEXT =
  "Integramos plataformas educativas y herramientas digitales que fortalecen la comunicación, el trabajo colaborativo y la autorregulación del aprendizaje. La tecnología no es un fin: es una forma de investigar, participar y construir soluciones.";

function SeccionVanguardia() {
  return (
    <>
      {/* Mobile/tablet (< lg) */}
      <div className="flex flex-col gap-6 rounded-[32px] p-6 lg:hidden" style={{ backgroundImage: BG_VANGUARDIA }}>
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-[20px]">
          <Image src={VAN_PHOTO} alt="Alumna de Secundaria con tecnología en Colegio Champal" fill sizes="320px" className="object-cover" />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <Image src={VAN_ELLIPSE_1} alt="" fill sizes="64px" />
            <div className="absolute inset-[7.8%]">
              <Image src={VAN_ELLIPSE_2} alt="" fill sizes="56px" />
            </div>
            <div className="absolute inset-[6%]" style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))" }}>
              <Image src={VAN_ICON} alt="" fill sizes="60px" className="object-cover" />
            </div>
          </div>
          <Antetitulo text={VAN_ANTETITULO} mobile />
        </div>
        <h3 className="font-serif text-3xl font-semibold text-white">{VAN_TITLE}</h3>
        <p className="text-base leading-relaxed text-white/90">{VAN_TEXT}</p>
      </div>

      {/* Desktop (lg+) */}
      <CardShell bgImage={BG_VANGUARDIA}>
        {/* node 401:1530 — foto que se sale por arriba de la tarjeta */}
        <div className="absolute" style={{ left: cqw(0), top: cqw(105), width: cqw(615), height: cqw(615) }}>
          <Image src={VAN_PHOTO} alt="Alumna de Secundaria con tecnología en Colegio Champal" fill sizes="615px" className="object-cover" />
        </div>

        {/* node 401:1523 — Columna2_Vanguardia (mitad derecha), tinte propio */}
        <div className="absolute overflow-hidden" style={{ left: cqw(616), top: 0, width: cqw(616), height: cqw(720), backgroundImage: columnTint("rgb(140,100,217)") }}>
          {/* node 401:1524 — Texto_Vanguardia */}
          <div className="absolute flex flex-col" style={{ left: cqw(48), top: cqw(195), width: cqw(550), gap: cqw(30) }}>
            <Antetitulo text={VAN_ANTETITULO} />
            <p className="font-semibold" style={{ fontSize: cqw(42), ...TITLE_STYLE }}>
              {VAN_TITLE}
            </p>
            <p style={{ width: cqw(540), fontSize: cqw(18), lineHeight: cqw(30), ...PARAGRAPH_STYLE }}>{VAN_TEXT}</p>
          </div>
          {/* node 421:714 — Identifica_Vanguardia (el ícono se sale por arriba del aro) */}
          <Badge
            leftPx={442}
            topPx={29}
            ellipse1Src={VAN_ELLIPSE_1}
            ellipse2Src={VAN_ELLIPSE_2}
            iconSrc={VAN_ICON}
            iconLeftPx={13.5}
            iconTopPx={-12}
            iconSizePx={135}
            iconShadow="0px 4px 4px rgba(0,0,0,0.25)"
          />
        </div>
      </CardShell>
    </>
  );
}

export default function SecundariaAccesosEspecializados() {
  return (
    <section className="relative" style={{ backgroundColor: "#0f76d7" }}>
      {/* Las 3 tarjetas (Inglés/Progrentis/Vanguardia) ya vienen cada una con
          su propio rounded-[40px]+box-shadow (CardShell) — exactamente el
          caso "agnóstico del contenido" que CardStack fue escrito para
          soportar (ver su docstring). CardStack reemplaza el flex-col+gap
          anterior por su propio mecanismo sticky/scroll: cada slot se
          encarga de su propia altura/posicionamiento, así que ya no hace
          falta el `shrink-0` que evitaba que flexbox comprimiera una
          tarjeta con aspect-ratio (ese bug era específico del flujo flex,
          que CardStack ya no usa). */}
      <div className="mx-auto w-full max-w-[1440px] px-[7.2222%] py-10 lg:py-[50px]">
        <CardStack>
          <div id="ingles-especializado">
            <SeccionIngles />
          </div>
          <div id="progrentis-especializado">
            <SeccionProgrentis />
          </div>
          <div id="vanguardia-digital">
            <SeccionVanguardia />
          </div>
        </CardStack>
      </div>
    </section>
  );
}
