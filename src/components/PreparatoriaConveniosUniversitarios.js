import Image from "next/image";

// "10_Convenios_Universitarios" (node 447:841, canvas 1440x650) — va pegada
// directo debajo de PreparatoriaInternationalHighSchool.js. Fondo: degradado
// vertical simple azul->verde azulado (#0c317f -> #099e9b, de arriba a
// abajo).
//
// RE-SYNC 2026-08-24 (re-fetch de get_design_context tras cambios del
// usuario en Figma): la tarjeta pasó de 15 logos (3 filas de 5, cajones
// dispares 100x100 salvo Ashoka/Eduqatia que no eran cuadrados, gaps
// distintos por fila 69/58/65px) a 18 logos (3 filas de 6, cajón uniforme
// 120x100 para TODOS, gap uniforme 80px) — layout más simple que el
// anterior. Se quitaron Ashoka y Eduqatia, y el duplicado accidental de
// "Universidad Iberoamericana" (aparecía una vez en la fila 1 y otra vez,
// con un archivo de imagen distinto, en la fila 2 — el archivo viejo
// "logo-universidad-iberoamericana.png" ya no se usa, se eliminó). Se
// agregaron: ITESO, University of Texas at Austin, TecMilenio, UVM, CEDIM,
// Vatel. La tarjeta blanca también cambió de tamaño/posición (999x416 en
// 178,209 -> 1232x432 en 172,192) y de radio: en Figma SOLO 3 esquinas están
// redondeadas (`rounded-tr/br/bl`, la esquina superior-izquierda queda recta
// a 90°) — confirmado en el screenshot, no es un descuido de export.
//
// 4 de los 18 logos (Texas, UVM, CEDIM, Vatel) NO son archivos de imagen en
// Figma — el propio archivo los "dibujó" con texto real (fuente Inter) +
// unas pocas formas vectoriales sueltas (subrayado, cuadrado, "V"), en vez
// de importar el logotipo oficial como PNG/SVG. Se replican aquí con el
// mismo criterio (texto real + los vectores exportados de Figma), no como
// una imagen rasterizada — más nítido en cualquier resolución y consistente
// con cómo Figma los define. Cada uno vive en su propio sistema de
// coordenadas local (`containerType: inline-size` sobre su propio cajón de
// 120x100, mismo truco ya usado en PrimariaProgramas.js/ProgramaCard) para
// que las mismas posiciones/tamaños funcionen tanto en el cajón `cqw` de
// escritorio como en el cajón `aspect-[6/5]` de móvil, sin duplicar la
// lógica.
//
// RE-SYNC 2026-08-24 (2): el usuario reportó que el 5to logo "recreado"
// (TecMilenio, texto+vectores) se veía mal — Figma lo tenía cortado a media
// palabra ("tecmiler" en vez de "tecmilenio", por overflow-clip sobre una
// caja de texto más ancha que el cajón de 120px, confirmado en un
// screenshot en alta resolución del propio archivo). El usuario reemplazó
// ese nodo en Figma por uno nuevo, "Logo_Universidad_Tecmilenio_Original"
// (846:940) — un logotipo real de nuevo (imagen), como los otros 13 — así
// que aquí también volvió a ser una `<Image>` normal
// (`logo-tecmilenio.png`), no un componente custom. Los otros 4 (Texas,
// UVM, CEDIM, Vatel) siguen siendo recreaciones texto+vector porque el
// archivo de Figma no los cambió.
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

const GRADIENT = "linear-gradient(to bottom, #0c317f 0%, #099e9b 100%)";
const RED = "#d62838";
const BASE = "/images/preparatoria/convenios-universitarios";

// Unidad local para los 5 logos "recreados": cqw relativo al propio cajón
// de 120x100 del logo (no al canvas de la sección) — válido tanto para
// ejes X como Y porque el cajón mantiene su proporción 120:100 fija en
// cualquier contexto (ver nota de la cabecera y la misma prueba algebraica
// ya documentada para ProgramaCard en la memoria de proyecto).
function bx(px) {
  return `${((px / 120) * 100).toFixed(3)}cqw`;
}
const LOGO_FONT = "Arial, Helvetica, sans-serif"; // aproximación a Inter (Figma) — el proyecto no usa Inter en ningún otro lado, y ambas son grotescas neutras muy similares en peso/proporción; no vale la pena cargar una fuente nueva para 5 logotipos decorativos.

function LogoBox({ children }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ containerType: "inline-size" }}>
      {children}
    </div>
  );
}

// Texas (842:959) — solo texto, sin vectores.
function LogoTexas() {
  return (
    <LogoBox>
      <p
        className="absolute font-bold leading-none"
        style={{ left: bx(16), top: bx(21), width: bx(78), height: bx(28), fontSize: bx(23), color: "#bf5700", fontFamily: LOGO_FONT }}
      >
        TEXAS
      </p>
      <p
        className="absolute font-bold leading-none"
        style={{ left: bx(17), top: bx(53), width: bx(95), height: bx(8), fontSize: bx(7), color: "#bf5700", fontFamily: LOGO_FONT }}
      >
        THE UNIVERSITY OF TEXAS
      </p>
      <p
        className="absolute font-normal leading-none"
        style={{ left: bx(37), top: bx(63), width: bx(37), height: bx(8), fontSize: bx(7), color: "#bf5700", fontFamily: LOGO_FONT }}
      >
        AT AUSTIN
      </p>
    </LogoBox>
  );
}

// UVM (842:947) — texto rojo + subrayado.
function LogoUVM() {
  return (
    <LogoBox>
      <p
        className="absolute font-bold leading-none"
        style={{ left: bx(12), top: bx(13), width: bx(101), height: bx(51), fontSize: bx(42), color: "#d8232a", fontFamily: LOGO_FONT }}
      >
        UVM
      </p>
      <div className="absolute" style={{ left: bx(14), top: bx(64), width: bx(91), height: bx(3) }}>
        <Image src={`${BASE}/uvm-underline.svg`} alt="" fill sizes="91px" />
      </div>
    </LogoBox>
  );
}

// CEDIM (842:950) — solo texto (el borde derecho de la "M" roza el cajón
// por ~2px en Figma, imperceptible, replicado tal cual).
function LogoCedim() {
  return (
    <LogoBox>
      <p
        className="absolute font-bold leading-none"
        style={{ left: bx(10), top: bx(21), width: bx(112), height: bx(41), fontSize: bx(34), color: "#161616", fontFamily: LOGO_FONT }}
      >
        CEDIM
      </p>
      <p
        className="absolute font-normal leading-none"
        style={{ left: bx(12), top: bx(64), width: bx(89), height: bx(7), fontSize: bx(6), color: "#161616", fontFamily: LOGO_FONT }}
      >
        UNIVERSIDAD DE MONTERREY
      </p>
    </LogoBox>
  );
}

// Vatel (842:963) — cuadrado negro con "V" blanca + texto + subrayado azul.
function LogoVatel() {
  return (
    <LogoBox>
      <div className="absolute" style={{ left: bx(12), top: bx(28), width: bx(28), height: bx(28) }}>
        <Image src={`${BASE}/vatel-mark.svg`} alt="" fill sizes="28px" />
      </div>
      <div className="absolute" style={{ left: bx(16.65), top: bx(31.4), width: bx(18.7), height: bx(21.2) }}>
        <Image src={`${BASE}/vatel-mark2.svg`} alt="" fill sizes="19px" />
      </div>
      <p
        className="absolute font-bold leading-none whitespace-nowrap"
        style={{ left: bx(46), top: bx(30), width: bx(61), height: bx(23), fontSize: bx(19), color: "#141414", fontFamily: LOGO_FONT }}
      >
        VATEL
      </p>
      <div className="absolute" style={{ left: bx(47), top: bx(55), width: bx(47), height: bx(2) }}>
        <Image src={`${BASE}/vatel-underline.svg`} alt="" fill sizes="47px" />
      </div>
      <p
        className="absolute font-normal leading-none whitespace-nowrap"
        style={{ left: bx(47), top: bx(61), width: bx(46), height: bx(6), fontSize: bx(5), color: "#3c8ebb", fontFamily: LOGO_FONT }}
      >
        HOTEL &amp; TOURISM
      </p>
    </LogoBox>
  );
}

// Las 3 filas tal cual Figma — cajón uniforme 120x100 para los 13 logos que
// sí son imagen; los otros 5 usan el componente custom correspondiente
// (`custom: true`, sin `src`).
const FILA_1 = [
  { src: `${BASE}/logo-udlap.png`, alt: "UDLAP" },
  { src: `${BASE}/logo-universidad-modelo.png`, alt: "Universidad Modelo" },
  { src: `${BASE}/logo-iberoamericana.png`, alt: "Universidad Iberoamericana" },
  { src: `${BASE}/logo-upaep.png`, alt: "UPAEP" },
  { src: `${BASE}/logo-udem.png`, alt: "Universidad de Monterrey" },
  { src: `${BASE}/logo-universidad-panamericana.png`, alt: "Universidad Panamericana" },
];
const FILA_2 = [
  { src: `${BASE}/logo-iteso.png`, alt: "ITESO, Universidad Jesuita de Guadalajara" },
  { src: `${BASE}/logo-uag.png`, alt: "Universidad Autónoma de Guadalajara" },
  { src: `${BASE}/logo-anahuac.png`, alt: "Universidad Anáhuac" },
  { src: `${BASE}/logo-instituto-culinario.png`, alt: "Instituto Culinario de México" },
  { src: `${BASE}/logo-tec-monterrey.png`, alt: "Tecnológico de Monterrey" },
  { src: `${BASE}/logo-isu.png`, alt: "Instituto Suizo" },
];
const FILA_3 = [
  { src: `${BASE}/logo-arkansas-state.png`, alt: "Arkansas State University" },
  { custom: LogoTexas, alt: "The University of Texas at Austin" },
  { src: `${BASE}/logo-tecmilenio.png`, alt: "Universidad Tecmilenio" },
  { custom: LogoUVM, alt: "UVM" },
  { custom: LogoCedim, alt: "CEDIM, Universidad de Monterrey" },
  { custom: LogoVatel, alt: "Vatel" },
];
const FILAS = [FILA_1, FILA_2, FILA_3];
const GAP_PX = 80;

function Logo({ logo, unit }) {
  if (logo.custom) {
    const Custom = logo.custom;
    return (
      <div className="relative shrink-0" style={{ width: unit(120), height: unit(100) }} role="img" aria-label={logo.alt}>
        <Custom />
      </div>
    );
  }
  return (
    <div className="relative shrink-0" style={{ width: unit(120), height: unit(100) }}>
      <Image src={logo.src} alt={logo.alt} fill sizes="120px" className="object-contain" />
    </div>
  );
}

function Fila({ logos, unit, gap }) {
  return (
    <div className="flex items-center" style={{ gap }}>
      {logos.map((logo) => (
        <Logo key={logo.alt} logo={logo} unit={unit} />
      ))}
    </div>
  );
}

// Versión móvil — grilla simple pareja (3/4 columnas), sin replicar el gap
// fijo de 80px del canvas de escritorio (no flexiona a pantallas
// angostas); cada cajón usa `aspect-[6/5]` (= 120:100, la proporción real
// del cajón de Figma) en vez de `aspect-square`, para que los 5 logos
// "recreados" (posicionados con esa proporción) no se vean aplastados.
const MOBILE_LOGOS = [...FILA_1, ...FILA_2, ...FILA_3];

export default function PreparatoriaConveniosUniversitarios() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundImage: GRADIENT }}>
      {/* Mobile/tablet (< lg) */}
      <div className="flex flex-col gap-8 px-6 py-14 lg:hidden">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-[18px]">
            <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: RED }} />
            <p className="text-sm font-semibold uppercase text-white">Convenios Universitarios</p>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-white">Decidir con información, avanzar con confianza</h2>
        </div>
        <div
          className="grid grid-cols-3 gap-4 rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] bg-white p-6 shadow-[0px_4px_10px_6px_rgba(0,0,0,0.25)] sm:grid-cols-4"
        >
          {MOBILE_LOGOS.map((logo) => (
            <div key={logo.alt} className="relative aspect-[6/5] w-full">
              {logo.custom ? (
                <div role="img" aria-label={logo.alt} className="h-full w-full">
                  <logo.custom />
                </div>
              ) : (
                <Image src={logo.src} alt={logo.alt} fill sizes="120px" className="object-contain" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop (lg+): réplica 1:1 de Figma, canvas 1440x650 */}
      <div className="relative hidden aspect-[1440/650] w-full lg:block" style={{ containerType: "inline-size" }}>
        {/* Antetítulo */}
        <div className="absolute flex items-center" style={{ left: pctX(104), top: pctY(59), gap: cqw(18) }}>
          <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: RED }} />
          <p className="whitespace-nowrap font-semibold uppercase text-white" style={{ fontSize: cqw(16) }}>
            Convenios Universitarios
          </p>
        </div>

        {/* Título */}
        <p
          className="absolute font-serif font-semibold text-white"
          style={{ left: pctX(178), top: pctY(104), width: cqw(982), fontSize: cqw(44), lineHeight: "normal" }}
        >
          Decidir con información, avanzar con confianza
        </p>

        {/* Tarjeta blanca con los 18 logos — solo 3 esquinas redondeadas
            (la superior-izquierda queda recta, tal cual Figma). */}
        <div
          className="absolute rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] bg-white"
          style={{ left: pctX(172), top: pctY(192), width: cqw(1232), height: cqw(432), boxShadow: "0px 4px 10px 6px rgba(0,0,0,0.25)" }}
        />
        <div className="absolute flex flex-col" style={{ left: pctX(228), top: pctY(238), width: cqw(1120), gap: cqw(20) }}>
          {FILAS.map((fila, i) => (
            <Fila key={i} logos={fila} unit={cqw} gap={cqw(GAP_PX)} />
          ))}
        </div>
      </div>
    </section>
  );
}
