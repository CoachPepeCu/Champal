import Image from "next/image";
import CardStack from "@/components/effects/CardStack";

// "Bloque_Preparatoria" (node 506:1416, 4 secciones apiladas: 05_Prepa_Ingles,
// 06_Prepa_Progrentis, 07_Prepa_Digital, 08_Prepa_International) — el
// equivalente de Preparatoria a SecundariaAccesosEspecializados.js: el
// destino real de los 4 accesos que ya deja enlazados PreparatoriaAccesos.js
// (Inglés/PROGRENTIS/Vanguardia Digital/International High School). Va
// pegada directo debajo de esa sección.
//
// A diferencia de Secundaria (tarjetas con degradado radial de fondo), acá
// Figma trae un patrón distinto: FOTO a pantalla completa como fondo de la
// tarjeta (esquinas redondeadas asimétricas — sin redondear arriba-izq,
// "bandera"), con un velo/scrim (el SVG "Fondo", con degradado hacia
// transparente) cubriendo la mitad izquierda para que el texto blanco sea
// legible, más una insignia circular (2 aros + ícono) en la esquina
// superior derecha y un par de "cuadritos" rojos decorativos (30x30,
// apilados en diagonal) junto al título — mismo lenguaje visual que ya usa
// el bloque largo de Primaria (PrimariaIngles.js/PrimariaProgrentis.js:
// insignia con inset de aro 7.8%, ícono con offset LITERAL de Figma en vez
// de un inset fijo, porque cada ícono trae su propia proporción).
//
// La 1a tarjeta (05_Prepa_Ingles) ocupa el ancho COMPLETO del contenedor
// (`w-full`, canvas 1280x740, radio 80px); las otras 3 (canvas 1232x740,
// radio 40px) quedan centradas con un inset fijo de 24px por lado dentro
// de ese mismo contenedor — así lo trae Figma (node 506:1416: flex-col
// items-center, hijo 1 con `w-full`, hijos 2-4 con ancho fijo menor) — por
// eso el wrapper de esta sección usa `max-w-[1280px]` (mismo valor que
// `max-w-7xl` de Tailwind) sin padding propio, y las tarjetas 2-4 llevan
// `mx-6` (24px) para el inset.
//
// Los íconos de insignia (Inglés/PROGRENTIS/Vanguardia Digital) son el
// MISMO asset que ya usa PreparatoriaAccesos.js — se duplican acá en su
// propia carpeta `experiencias/` siguiendo el mismo criterio de
// organización por sección que ya usa Secundaria (accesos-especializados/
// con sus propias copias).
//
// ANIMACIÓN 2026-08-24 — dos intentos previos (documentados en git history
// de este archivo): una cortina de barrido (`CurtainWipe`, clip-path) y
// luego una versión que además hacía que la tarjeta "saliera/regresara"
// de pantalla atada al scroll (`ScrollExitCard`). El usuario probó ambas
// en vivo y pidió quitarlas ("no se ve bien") — se revirtieron por
// completo. En su lugar, mismo efecto ya validado en
// SecundariaAccesosEspecializados.js: las 4 tarjetas van envueltas en
// `<CardStack>` (src/components/effects/CardStack.jsx, sin modificar —
// "como la teníamos"), que las apila con scroll (`position:sticky` +
// fundido/encogido) en vez de cualquier cortina/salida. Además, a pedido
// del usuario, cada una de las 4 tarjetas (Caja01-04 en la nomenclatura de
// Figma — ver comentario de `Banda`/`CAJA_GRADIENT` abajo) lleva un borde
// blanco de 2px en todo su contorno (`border-2 border-white`), sobre el
// propio div redondeado de la tarjeta — sigue su mismo radio asimétrico
// (bandera) porque un `border` respeta el `border-radius` del elemento.

const RED = "#da2028";

// --- Insignia circular (2 aros + ícono/flag) ------------------------------
// El inset entre ellipse1/ellipse2 (aro exterior/interior) es ~7.8% del
// aro exterior en las 4 tarjetas (mismo patrón ya documentado en
// PrimariaIngles.js) — el ícono en cambio SIEMPRE recibe su propio
// left/top/size LITERAL de Figma (relativo al aro exterior), nunca un
// inset fijo, porque cada ícono trae su propia proporción/recorte.
function Badge({ pctX, pctY, cqw, leftPx, topPx, sizePx, ring1Src, ring2Src, iconSrc, iconLeftPx, iconTopPx, iconSizePx, iconShadow, extraIconSrc }) {
  return (
    <div className="absolute" style={{ left: pctX(leftPx), top: pctY(topPx), width: cqw(sizePx), height: cqw(sizePx) }}>
      <Image src={ring1Src} alt="" fill sizes="150px" />
      <div className="absolute inset-[7.8%]">
        <Image src={ring2Src} alt="" fill sizes="127px" />
      </div>
      {iconSrc && (
        <div
          className="absolute"
          style={{
            left: cqw(iconLeftPx - leftPx),
            top: cqw(iconTopPx - topPx),
            width: cqw(iconSizePx),
            height: cqw(iconSizePx),
            filter: iconShadow ? `drop-shadow(${iconShadow})` : undefined,
          }}
        >
          <Image src={iconSrc} alt="" fill sizes="135px" className="object-cover" />
        </div>
      )}
      {/* node 491:1174 (solo tarjeta 4) — la bandera va en capa aparte, por
          encima del aro interior, con el mismo encuadre que éste */}
      {extraIconSrc && (
        <div className="absolute inset-[7.8%] overflow-hidden rounded-full">
          <Image src={extraIconSrc} alt="Bandera de México y Estados Unidos" fill sizes="127px" className="object-cover" />
        </div>
      )}
    </div>
  );
}

// Par de cuadritos rojos apilados en diagonal, decoración fija junto a
// cada título (mismo patrón en las 4 tarjetas, solo cambia la posición).
function Cuadritos({ pctX, pctY, cqw, aLeftPx, aTopPx, bLeftPx, bTopPx }) {
  return (
    <>
      <div className="absolute" style={{ left: pctX(aLeftPx), top: pctY(aTopPx), width: cqw(30), height: cqw(30), backgroundColor: RED }} />
      <div className="absolute" style={{ left: pctX(bLeftPx), top: pctY(bTopPx), width: cqw(30), height: cqw(30), backgroundColor: RED }} />
    </>
  );
}

// --- Pleca_oscura (velo curvo del lado izquierdo) -------------------------
// El asset (PNG/SVG) exportado de Figma trae ~15px de sangrado TRANSPARENTE
// en sus 4 bordes (Figma incluye el área del efecto al exportar la capa) —
// sin compensar ese sangrado con un inset NEGATIVO, el borde visible/curvo
// de la pleca queda encogido hacia adentro por ese margen: dejaba de tocar
// el borde izquierdo real de la tarjeta y el alto dejaba de coincidir
// exacto — el bug reportado ("la pleca sale desfasada, se ve en medio").
// `insetClassName` es ese sangrado medido en Figma para CADA asset (cada
// tarjeta trae el suyo propio, no es un valor fijo) — se pasa como clase
// Tailwind LITERAL en cada sitio de uso para que el scanner la detecte.
// `leftPx`/`widthPx`/`heightPx` también son el cuadro EXACTO de Figma: en
// la tarjeta 3 (Vanguardia) ese cuadro es más ancho/alto que la tarjeta
// misma y arranca en left NEGATIVO (se sale por la izquierda) — el
// `overflow-hidden` del envoltorio de la tarjeta lo recorta solo, igual
// que en Figma.
function Pleca({ cqw, leftPx = 0, topPx = 0, widthPx, heightPx, insetClassName, src, sizesPx }) {
  return (
    <div className="absolute" style={{ left: cqw(leftPx), top: cqw(topPx), width: cqw(widthPx), height: cqw(heightPx) }}>
      <div className={`absolute ${insetClassName}`}>
        <Image src={src} alt="" fill sizes={`${sizesPx}px`} />
      </div>
    </div>
  );
}

// --- Título + texto descriptivo --------------------------------------------
// Antes cada uno llevaba su propio `top` fijo copiado literal de Figma,
// pero esos números ya venían MUY ajustados entre sí en el archivo
// original (en Progrentis y Vanguardia el texto empieza ANTES de que
// termine el bloque del título — se pisan) — cualquier diferencia de
// wrapping entre el motor de texto de Figma y el navegador lo empeora.
// Ahora van en un solo flex-col con un gap real (`GAP_TITULO_TEXTO`): el
// título se queda anclado en su posición/tamaño EXACTO de Figma (se sale
// del ancho de la pleca a propósito, así se pidió), y el texto fluye
// SIEMPRE después de él sin importar a cuántas líneas envuelva el título.
// El texto sí debe quedar dentro de la pleca — por eso conserva su propio
// `textWidthPx` (más angosto que el del título) y su propio `textLeftPx`
// (unos px distinto al del título en Figma; se preserva con un
// `marginLeft` relativo en vez de forzar el mismo left que el título).
const GAP_TITULO_TEXTO = 22;

function TituloTexto({ cqw, pctX, pctY, titleLeftPx, titleTopPx, titleWidthPx, titleFontPx, title, textLeftPx, textWidthPx, textFontPx, textLineHeightPx, text }) {
  return (
    <div className="absolute flex flex-col" style={{ left: pctX(titleLeftPx), top: pctY(titleTopPx), gap: cqw(GAP_TITULO_TEXTO) }}>
      <p className="font-serif font-semibold text-white" style={{ width: cqw(titleWidthPx), fontSize: cqw(titleFontPx) }}>
        {title}
      </p>
      <p
        className="leading-relaxed text-white"
        style={{
          width: cqw(textWidthPx),
          fontSize: cqw(textFontPx),
          lineHeight: cqw(textLineHeightPx),
          marginLeft: cqw(textLeftPx - titleLeftPx),
        }}
      >
        {text}
      </p>
    </div>
  );
}

// --- Fondo "Caja01" de cada tarjeta (desktop) -----------------------------
// Figma trae un marco "Bloque_Preparatoria" (531:1455) con 4 rectángulos,
// los 4 llamados literalmente "Caja01" (531:1456/57/58/59) — uno detrás de
// cada tarjeta, a TODO el ancho (1440px, sin el max-w del wrapper general)
// con el MISMO degradado navy->azul (`CAJA_GRADIENT`, quiebre en 15.517%).
// Como cada franja tiene un alto real distinto (841/822/805/798px), el
// quiebre del degradado cae en un punto distinto en cada una: se ve un
// patrón de 4 "olas" repetidas, no un degradado único y continuo — así lo
// trae Figma, no es un error replicarlo así. En pantalla, `<CardStack>`
// (ver export por defecto al final del archivo) es quien decide cómo se
// apilan/solapan las 4 franjas al hacer scroll — ya no van simplemente
// "pegadas" en flujo normal.
const CAJA_GRADIENT = "linear-gradient(to bottom, #0a1a3c 0%, #0a1a3c 15.517%, #1b46a2 100%)";

// Alto del header fijo (Header.js: `h-[88px]`) — se descuenta del alto de
// pantalla disponible para que cada franja quepa completa (de borde
// superior a borde inferior de su foto) sin quedar tapada por el header ni
// obligar a hacer scroll dentro de una misma tarjeta, a pedido del usuario.
const HEADER_H = 88;

// Franja + tarjeta centrada encima. Antes escalaba solo por ANCHO
// (`w-full` + aspect-ratio, igual que el resto del sitio) — en monitores
// anchos eso podía volver la franja más alta que la pantalla. Ahora el
// ancho real de la franja es `min(100%, alto_disponible * 1440/cajaH)`:
// si escalar a todo el ancho ya cabe verticalmente, se comporta como antes
// (llena el ancho); si no cabría, el propio `min()` la encoge hasta que su
// alto coincida con el alto disponible bajo el header — el `aspect-ratio`
// deriva el alto final a partir de ese ancho ya acotado, nunca al revés.
// El envoltorio EXTERIOR (`w-full`, sin tamaño propio más allá de lo que
// mide su hijo) lleva el degradado para que siga corriendo de punta a
// punta del viewport aun cuando la franja interior quede más angosta
// (centrada con `mx-auto`) — así nunca aparecen franjas en blanco a los
// lados. `cardTopPx` posiciona la tarjeta dentro de su franja con el
// offset vertical exacto de Figma (top de la tarjeta menos top de su
// Caja01, medidos dentro de Bloque_Preparatoria) — las 4 tarjetas
// comparten el mismo ancho/alto/left (1280x740, left 78px), solo cambia
// ese offset vertical.
function Banda({ cajaHeightPx, cardTopPx, children }) {
  function bPctX(px) { return `${((px / 1440) * 100).toFixed(3)}%`; }
  function bPctY(px) { return `${((px / cajaHeightPx) * 100).toFixed(3)}%`; }
  return (
    <div className="hidden w-full lg:block" style={{ backgroundImage: CAJA_GRADIENT }}>
      <div
        className="relative mx-auto"
        style={{
          width: `min(100%, calc((100vh - ${HEADER_H}px) * 1440 / ${cajaHeightPx}))`,
          aspectRatio: `1440 / ${cajaHeightPx}`,
          containerType: "inline-size",
        }}
      >
        <div className="absolute" style={{ left: bPctX(78), top: bPctY(cardTopPx), width: bPctX(1280), height: bPctY(740) }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 1) 05_Prepa_Ingles (node 500:1308) — canvas 1280x740, ancho completo,
// radio 80px, SIN sombra (corre borde a borde del contenedor).
const C1_W = 1280;
const C1_H = 740;
function c1PctX(px) { return `${((px / C1_W) * 100).toFixed(3)}%`; }
function c1PctY(px) { return `${((px / C1_H) * 100).toFixed(3)}%`; }
function c1Cqw(px) { return `${((px / C1_W) * 100).toFixed(3)}cqw`; }

const ING_FOTO = "/images/preparatoria/experiencias/05-ingles-foto.png";
const ING_ICONO = "/images/preparatoria/experiencias/05-ingles-icono.png";
const ING_SCRIM = "/images/preparatoria/experiencias/fondo-scrim-05.svg";
const ING_RING1 = "/images/preparatoria/experiencias/ellipse1.svg";
const ING_RING2 = "/images/preparatoria/experiencias/ellipse2.svg";
const ING_TEXT =
  "Al llegar a Preparatoria, nuestros alumnos pueden acreditar su nivel de inglés y comunicarse con seguridad y fluidez en cualquier entorno. Sus certificaciones Cambridge los respaldan en procesos de admisión, becas, intercambios y programas universitarios que solicitan comprobación del idioma. El inglés se convierte en una herramienta real para seguir aprendiendo y aprovechar oportunidades dentro y fuera de México.";

function SeccionIngles() {
  return (
    <section id="ingles" className="relative bg-[#0a1a3c]">
      {/* Mobile/tablet (< lg): apilado simple */}
      <div className="relative flex flex-col gap-6 overflow-hidden lg:hidden">
        <div className="relative aspect-[3/4] w-full">
          <Image src={ING_FOTO} alt="Alumnos de Preparatoria de Colegio Champal" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <Image src={ING_RING1} alt="" fill sizes="64px" />
                <div className="absolute inset-[7.8%]">
                  <Image src={ING_RING2} alt="" fill sizes="58px" />
                </div>
                <div className="absolute inset-[18%]">
                  <Image src={ING_ICONO} alt="" fill sizes="46px" className="object-cover" />
                </div>
              </div>
              <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: RED }} />
            </div>
            <h2 className="font-serif text-3xl font-semibold text-white">Cambridge en Champal</h2>
            <p className="text-base leading-relaxed text-white/90">{ING_TEXT}</p>
          </div>
        </div>
      </div>

      {/* Desktop (lg+): franja Caja01 (531:1456, 1440x841) con la tarjeta
          centrada en su offset real de Figma (top 72px dentro de la franja) —
          la tarjeta en sí sigue siendo réplica 1:1 de Figma, canvas 1280x740,
          w-full dentro de esa franja (corre borde a borde de su slot de
          1280px, sin inset propio). */}
      <Banda cajaHeightPx={841} cardTopPx={72}>
        <div
          className="relative aspect-[1280/740] w-full overflow-hidden rounded-bl-[80px] rounded-br-[80px] rounded-tr-[80px] border-2 border-white"
          style={{ containerType: "inline-size" }}
        >
          <Image src={ING_FOTO} alt="Alumnos de Preparatoria de Colegio Champal en Nueva York" fill sizes="1280px" className="object-cover" />
          <Pleca cqw={c1Cqw} widthPx={610.5} heightPx={740} insetClassName="inset-[-2.03%_-2.46%]" src={ING_SCRIM} sizesPx={611} />

          <Cuadritos pctX={c1PctX} pctY={c1PctY} cqw={c1Cqw} aLeftPx={40} aTopPx={109} bLeftPx={70} bTopPx={80} />
          <TituloTexto
            cqw={c1Cqw}
            pctX={c1PctX}
            pctY={c1PctY}
            titleLeftPx={94}
            titleTopPx={109}
            titleWidthPx={446}
            titleFontPx={42}
            title="Cambridge en Champal"
            textLeftPx={95}
            textWidthPx={288}
            textFontPx={18}
            textLineHeightPx={35}
            text={ING_TEXT}
          />

          <Badge
            pctX={c1PctX}
            pctY={c1PctY}
            cqw={c1Cqw}
            leftPx={1079}
            topPx={26}
            sizePx={150}
            ring1Src={ING_RING1}
            ring2Src={ING_RING2}
            iconSrc={ING_ICONO}
            iconLeftPx={1109.66}
            iconTopPx={59.33}
            iconSizePx={89.333}
          />
        </div>
      </Banda>
    </section>
  );
}

// ---------------------------------------------------------------------
// Canvas compartido de las tarjetas 2-4 (1232x740, radio 40px, con
// sombra — mismo CARD_SHADOW ya usado en SecundariaAccesosEspecializados.js).
const C2_W = 1232;
const C2_H = 740;
function c2PctX(px) { return `${((px / C2_W) * 100).toFixed(3)}%`; }
function c2PctY(px) { return `${((px / C2_H) * 100).toFixed(3)}%`; }
function c2Cqw(px) { return `${((px / C2_W) * 100).toFixed(3)}cqw`; }
const CARD_SHADOW = "5px 5px 50px 5px rgba(255,255,255,0.6)";

const RING3 = "/images/preparatoria/experiencias/ellipse3.svg";
const RING4 = "/images/preparatoria/experiencias/ellipse4.svg";
const RING5 = "/images/preparatoria/experiencias/ellipse5.svg";

// 2) 06_Prepa_Progrentis (node 476:1003)
const PRO_FOTO = "/images/preparatoria/experiencias/06-progrentis-foto.png";
const PRO_ICONO = "/images/preparatoria/experiencias/06-progrentis-icono.png";
const PRO_SCRIM = "/images/preparatoria/experiencias/fondo-scrim-06.svg";
// El texto original en Figma trae un tramo de espacios sueltos entre "En
// preparatoria" y la coma (`"En preparatoria                    , los
// desafíos..."`, node 476:1015) — un hueco a medio llenar del diseñador,
// no contenido real. Se cierra ese hueco y se corrige "Secundaria" (que
// había quedado mal copiado de la sección equivalente de otro nivel) por
// "Preparatoria".
const PRO_TEXT =
  "En Preparatoria, los desafíos digitales personalizados fortalecen el uso eficiente de la información, el pensamiento crítico y la resolución de problemas complejos. Así, nuestros alumnos aprenden a analizar, investigar y tomar decisiones con mayor seguridad y responsabilidad";

function SeccionProgrentis() {
  return (
    <section id="progrentis" className="relative bg-[#0a1a3c]">
      {/* Mobile/tablet (< lg) */}
      <div className="relative flex flex-col gap-6 overflow-hidden lg:hidden">
        <div className="relative aspect-[3/4] w-full">
          <Image src={PRO_FOTO} alt="Alumno de Preparatoria trabajando con PROGRENTIS en Colegio Champal" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <Image src={RING3} alt="" fill sizes="64px" />
                <div className="absolute inset-[7.8%]">
                  <Image src={RING4} alt="" fill sizes="58px" />
                </div>
                <div className="absolute inset-[22%]">
                  <Image src={PRO_ICONO} alt="" fill sizes="40px" className="object-cover" />
                </div>
              </div>
              <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: RED }} />
            </div>
            <h2 className="font-serif text-3xl font-semibold text-white">Pensar y aprender con mayor autonomía</h2>
            <p className="text-base leading-relaxed text-white/90">{PRO_TEXT}</p>
          </div>
        </div>
      </div>

      {/* Desktop (lg+): franja Caja01 (531:1457, 1440x822), tarjeta en su
          offset real (top 50px dentro de la franja); canvas 1232x740,
          centrada con 24px de inset dentro del slot de 1280px de la franja */}
      <Banda cajaHeightPx={822} cardTopPx={50}>
        <div className="px-6">
          <div
            className="relative aspect-[1232/740] w-full overflow-hidden rounded-bl-[40px] rounded-br-[40px] rounded-tr-[40px] border-2 border-white"
            style={{ containerType: "inline-size", boxShadow: CARD_SHADOW }}
          >
            <Image src={PRO_FOTO} alt="Alumno de Preparatoria trabajando con PROGRENTIS en Colegio Champal" fill sizes="1232px" className="object-cover" />
            <Pleca cqw={c2Cqw} widthPx={610.5} heightPx={740} insetClassName="inset-[-2.03%_-2.46%]" src={PRO_SCRIM} sizesPx={611} />

            <Cuadritos pctX={c2PctX} pctY={c2PctY} cqw={c2Cqw} aLeftPx={29} aTopPx={122} bLeftPx={59} bTopPx={93} />
            <TituloTexto
              cqw={c2Cqw}
              pctX={c2PctX}
              pctY={c2PctY}
              titleLeftPx={68}
              titleTopPx={127}
              titleWidthPx={484}
              titleFontPx={44}
              title="Pensar y aprender con mayor autonomía"
              textLeftPx={75}
              textWidthPx={282}
              textFontPx={18}
              textLineHeightPx={35}
              text={PRO_TEXT}
            />

            <Badge
              pctX={c2PctX}
              pctY={c2PctY}
              cqw={c2Cqw}
              leftPx={1059}
              topPx={33}
              sizePx={150}
              ring1Src={RING3}
              ring2Src={RING4}
              iconSrc={PRO_ICONO}
              iconLeftPx={1094.75}
              iconTopPx={63.75}
              iconSizePx={81.517}
            />
          </div>
        </div>
      </Banda>
    </section>
  );
}

// 3) 07_Prepa_Digital (node 476:1016)
const DIG_FOTO = "/images/preparatoria/experiencias/07-digital-foto.png";
const DIG_ICONO = "/images/preparatoria/experiencias/07-digital-icono.png";
const DIG_SCRIM = "/images/preparatoria/experiencias/fondo-scrim-07.svg";
const DIG_TEXT =
  "Integramos plataformas educativas y herramientas digitales que fortalecen la comunicación, el trabajo colaborativo y la autorregulación del aprendizaje. La tecnología no es un fin: es una forma de investigar, participar y construir soluciones.";

function SeccionVanguardia() {
  return (
    <section id="vanguardia-digital" className="relative bg-[#0a1a3c]">
      {/* Mobile/tablet (< lg) */}
      <div className="relative flex flex-col gap-6 overflow-hidden lg:hidden">
        <div className="relative aspect-[3/4] w-full">
          <Image src={DIG_FOTO} alt="Alumno de Preparatoria con tecnología en Colegio Champal" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <Image src={RING3} alt="" fill sizes="64px" />
                <div className="absolute inset-[7.8%]">
                  <Image src={RING4} alt="" fill sizes="58px" />
                </div>
                <div className="absolute inset-[6%]" style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))" }}>
                  <Image src={DIG_ICONO} alt="" fill sizes="60px" className="object-cover" />
                </div>
              </div>
              <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: RED }} />
            </div>
            <h2 className="font-serif text-3xl font-semibold text-white">Tecnología para aprender, colaborar y crear.</h2>
            <p className="text-base leading-relaxed text-white/90">{DIG_TEXT}</p>
          </div>
        </div>
      </div>

      {/* Desktop (lg+): franja Caja01 (531:1458, 1440x805), tarjeta en su
          offset real (top 28px dentro de la franja); canvas 1232x740,
          centrada con 24px de inset dentro del slot de 1280px de la franja */}
      <Banda cajaHeightPx={805} cardTopPx={28}>
        <div className="px-6">
          <div
            className="relative aspect-[1232/740] w-full overflow-hidden rounded-bl-[40px] rounded-br-[40px] rounded-tr-[40px] border-2 border-white"
            style={{ containerType: "inline-size", boxShadow: CARD_SHADOW }}
          >
            <Image src={DIG_FOTO} alt="Alumno de Preparatoria con tecnología en Colegio Champal" fill sizes="1232px" className="object-cover" />
            {/* Esta pleca (única entre las 4) es más ancha/alta que la propia
                tarjeta y arranca en left NEGATIVO (624x756 vs. la tarjeta
                1232x740) — así lo trae Figma (node 506:1404); el
                overflow-hidden de la tarjeta la recorta sola. */}
            <Pleca cqw={c2Cqw} leftPx={-13} widthPx={624} heightPx={756} insetClassName="inset-[-1.98%_-2.4%]" src={DIG_SCRIM} sizesPx={624} />

            <Cuadritos pctX={c2PctX} pctY={c2PctY} cqw={c2Cqw} aLeftPx={36} aTopPx={166} bLeftPx={66} bTopPx={137} />
            <TituloTexto
              cqw={c2Cqw}
              pctX={c2PctX}
              pctY={c2PctY}
              titleLeftPx={75}
              titleTopPx={167}
              titleWidthPx={550}
              titleFontPx={42}
              title="Tecnología para aprender, colaborar y crear."
              textLeftPx={81}
              textWidthPx={276}
              textFontPx={18}
              textLineHeightPx={30}
              text={DIG_TEXT}
            />

            <Badge
              pctX={c2PctX}
              pctY={c2PctY}
              cqw={c2Cqw}
              leftPx={1059}
              topPx={44}
              sizePx={150}
              ring1Src={RING3}
              ring2Src={RING4}
              iconSrc={DIG_ICONO}
              iconLeftPx={1072.5}
              iconTopPx={32}
              iconSizePx={135}
              iconShadow="0px 4px 4px rgba(0,0,0,0.25)"
            />
          </div>
        </div>
      </Banda>
    </section>
  );
}

// 4) 08_Prepa_International (node 489:1151) — insignia especial: el
// "ícono" es la bandera México/EUA recortada en círculo (ellipse6) dentro
// del mismo aro que las otras 3 tarjetas, sin ícono adicional.
const INTL_FOTO = "/images/preparatoria/experiencias/08-international-foto.png";
const INTL_BANDERA = "/images/preparatoria/experiencias/08-international-bandera.png";
// Tenía su propio asset en Figma (node 506:1408) — el código anterior
// reusaba por error el de la tarjeta 3 (DIG_SCRIM, 624x756, sangrado
// distinto); esta pleca en cambio comparte medidas con las tarjetas 1 y 2
// (610.5x740, sangrado -2.03%/-2.46%).
const INTL_SCRIM = "/images/preparatoria/experiencias/fondo-scrim-08.svg";
const INTL_TEXT =
  "Las Cambridge English Qualifications acompañan el avance continuo de las habilidades lingüísticas y ofrecen una ruta clara para seguir aprendiendo inglés.";

function SeccionInternational() {
  return (
    <section id="international-high-school" className="relative bg-[#0a1a3c]">
      {/* Mobile/tablet (< lg) */}
      <div className="relative flex flex-col gap-6 overflow-hidden lg:hidden">
        <div className="relative aspect-[3/4] w-full">
          <Image src={INTL_FOTO} alt="Alumnas de Preparatoria en Londres, programa International High School" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
              <Image src={INTL_BANDERA} alt="Bandera de México y Estados Unidos" fill sizes="64px" className="object-cover" />
            </div>
            <h2 className="font-serif text-3xl font-semibold text-white">Un camino de aprendizaje con reconocimiento internacional</h2>
            <p className="text-base leading-relaxed text-white/90">{INTL_TEXT}</p>
          </div>
        </div>
      </div>

      {/* Desktop (lg+): franja Caja01 (531:1459, 1440x798), tarjeta en su
          offset real (top 23px dentro de la franja); canvas 1232x740,
          centrada con 24px de inset dentro del slot de 1280px de la franja */}
      <Banda cajaHeightPx={798} cardTopPx={23}>
        <div className="px-6">
          <div
            className="relative aspect-[1232/740] w-full overflow-hidden rounded-bl-[40px] rounded-br-[40px] rounded-tr-[40px] border-2 border-white"
            style={{ containerType: "inline-size", boxShadow: CARD_SHADOW }}
          >
            <Image src={INTL_FOTO} alt="Alumnas de Preparatoria en Londres, programa International High School" fill sizes="1232px" className="object-cover" />
            <Pleca cqw={c2Cqw} widthPx={610.5} heightPx={740} insetClassName="inset-[-2.03%_-2.46%]" src={INTL_SCRIM} sizesPx={611} />

            <Cuadritos pctX={c2PctX} pctY={c2PctY} cqw={c2Cqw} aLeftPx={21} aTopPx={150} bLeftPx={51} bTopPx={121} />
            <TituloTexto
              cqw={c2Cqw}
              pctX={c2PctX}
              pctY={c2PctY}
              titleLeftPx={62}
              titleTopPx={154}
              titleWidthPx={550}
              titleFontPx={42}
              title="Un camino de aprendizaje con reconocimiento internacional"
              textLeftPx={66}
              textWidthPx={293}
              textFontPx={18}
              textLineHeightPx={30}
              text={INTL_TEXT}
            />

            <Badge
              pctX={c2PctX}
              pctY={c2PctY}
              cqw={c2Cqw}
              leftPx={1055}
              topPx={20}
              sizePx={150}
              ring1Src={RING3}
              ring2Src={RING5}
              extraIconSrc={INTL_BANDERA}
            />
          </div>
        </div>
      </Banda>
    </section>
  );
}

export default function PreparatoriaAccesosEspecializados() {
  // <CardStack> (src/components/effects/CardStack.jsx) reemplaza el
  // apilado simple anterior (flex-col+gap) — mismo componente, sin tocar,
  // que ya se usa en SecundariaAccesosEspecializados.js: cada tarjeta se
  // fija con scroll y la siguiente la va cubriendo. Reemplaza también el
  // `lg:gap-0 lg:py-0` que antes mantenía las 4 franjas "Caja01" pegadas
  // sin espacio — CardStack ya maneja su propio espaciado/solape.
  //
  // `dwellVh={30}` (el default es 90, afinado para el texto largo de
  // Kinder): las 4 tarjetas de este bloque traen bastante menos texto
  // (título + 1 párrafo corto), así que el reposo largo por default se
  // sentía como que la página se trababa — el usuario reportó necesitar
  // "exactamente 8" giros de rueda de mouse sin ver ningún cambio antes de
  // que apareciera la siguiente tarjeta. 30vh reduce ese tramo muerto a
  // ~1/3, dejando un respiro breve de lectura sin sentirse atorado.
  return (
    <CardStack dwellVh={30}>
      <SeccionIngles />
      <SeccionProgrentis />
      <SeccionVanguardia />
      <SeccionInternational />
    </CardStack>
  );
}
