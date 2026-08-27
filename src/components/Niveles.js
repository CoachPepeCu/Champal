import Image from "next/image";

// Réplica 1:1 de Figma para "03_niveles" (node 817:976, canvas 1440x772) —
// va pegada justo después de 02_Comunidad. Misma técnica que Comunidad.js:
// aspect-ratio + containerType:inline-size en desktop, posiciones en % vía
// pctX/pctY y tipografía en cqw. Cada tarjeta de nivel es a su vez un
// contenedor cqw local (250x250) para que su rótulo escale con la tarjeta.
const CANVAS_W = 1440;
const CANVAS_H = 772;
const pctY = (px) => `${((px / CANVAS_H) * 100).toFixed(3)}%`;
const cqw = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;

const SECTION_GRADIENT =
  "linear-gradient(-56.221deg, rgb(10, 23, 48) 5.936%, rgb(10, 23, 48) 22.554%, rgb(4, 83, 178) 44.208%, rgba(4, 83, 178, 0.698) 54.894%, rgb(22, 74, 146) 61.88%)";

// Cuánto se baja la placa del bloque IHS (y todo lo dibujado sobre ella)
// respecto al valor crudo del nodo de Figma: con ese valor tal cual la
// muesca queda demasiado arriba y el globo —que sí necesita su aire
// respecto a las tarjetas de arriba— termina hundido en el rectángulo en
// vez de flotando sobre la curva. El globo/halo no llevan este corrimiento
// (van por encima de la placa, no forman parte de ella).
const PANEL_SHIFT = 18;

// "Pleca_Izquierda" (blob claro detrás de las 5 tarjetas, 520.5x711.5) se
// exporta vacío desde Figma (capa sin relleno resuelto, mismo problema que
// tuvo Comunidad.js con su propia pleca). Sin un export corregido a mano,
// se aproxima el contorno con un path dibujado sobre la captura de pantalla
// del nodo: esquina superior a escuadra, barrido circular grande hacia
// abajo-izquierda, termina en punta cerca de (0, 710). Color muestreado del
// screenshot (#e3e3e3), igual en ambos breakpoints.
const PLECA_IZQUIERDA_PATH =
  "M0 0 L480 0 Q520 0 520 40 C520 220 480 380 380 460 C220 590 120 610 40 650 C20 670 8 690 0 710 Z";

// Card local (250x250) — tamaño real de cada "Cuadro_*" en el export.
const CARD = 250;
const pc = (px) => `${((px / CARD) * 100).toFixed(3)}%`;
const ccqw = (px) => `${((px / CARD) * 100).toFixed(3)}cqw`;

const RIBBON_GRADIENT = "linear-gradient(180deg, #0b6bd7 0%, #063871 100%)";
// drop-shadow (no box-shadow): box-shadow sigue el rectángulo del elemento,
// así que en un sticker con fondo transparente se veía como un cuadro gris
// detrás en vez de una sombra pegada a la silueta. drop-shadow sí sigue la
// forma real (canal alfa) del contenido.
const STICKER_SHADOW = "drop-shadow(0px 2.222px 2.222px rgba(0,0,0,0.25))";

// Path normalizado de "Estrella decorativa" (mismo en las 15 instancias del
// export, solo cambia tamaño/color) — viewBox 0 0 17.513 16.6558.
function Star({ color, width, height }) {
  return (
    <svg viewBox="0 0 17.513 16.6558" width={width} height={height} fill="none">
      <path
        d="M8.7565 0L11.3542 5.63174L17.513 6.36197L12.9596 10.5728L14.1683 16.6558L8.7565 13.6265L3.34468 16.6558L4.55338 10.5728L0 6.36197L6.15883 5.63174L8.7565 0Z"
        fill={color}
      />
    </svg>
  );
}

// Envoltorio genérico para cualquier pieza rotada (estrella o sticker): `box`
// es el bounding box YA rotado tal como lo reporta Figma (posición/tamaño
// final en la tarjeta), `rotate` los grados de esa rotación y `w`/`h` el
// tamaño NATURAL (sin rotar) del contenido — que es lo que hay que rotar
// puertas adentro para reproducir el mismo bbox final. El tamaño interno se
// expresa como % del propio `box` (no de la tarjeta): es un hijo flex de
// ese contenedor, así que su % se resuelve contra ESE ancho/alto, no
// contra los 250px de la tarjeta — anidar dos "% de la tarjeta" encogería
// el contenido de más (bug ya corregido una vez, dejar la nota).
function Rotated({ box, rotate, w, h, children }) {
  const innerW = `${((w / box.width) * 100).toFixed(3)}%`;
  const innerH = `${((h / box.height) * 100).toFixed(3)}%`;
  return (
    <div className="absolute flex items-center justify-center" style={{ left: pc(box.left), top: pc(box.top), width: pc(box.width), height: pc(box.height) }}>
      <div className="flex-none" style={{ width: innerW, height: innerH, transform: `rotate(${rotate}deg)` }}>
        {children}
      </div>
    </div>
  );
}

// Rótulo vertical: reproduce el patrón exacto del export (wrapper con
// -translate-x-full + texto rotado -90deg) en vez de centrarlo a ojo en el
// listón — mismos left/top/width/height/fontSize/tracking que Figma.
function VerticalLabel({ box, fontSize, tracking, lines }) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{ left: pc(box.left), top: pc(box.top), width: pc(box.width), height: pc(box.height), transform: "translateX(-100%)" }}
    >
      <div
        className="flex-none whitespace-nowrap text-right font-display font-semibold text-white"
        style={{ transform: "rotate(-90deg)", fontSize: ccqw(fontSize), lineHeight: ccqw(40), letterSpacing: ccqw(tracking) }}
      >
        {lines.map((line, i) => (
          <p key={i} className="m-0">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

// Todas las coordenadas de abajo (ribbon/label/photo/sticker/estrellas) son
// las que reporta get_design_context nodo por nodo (no una aproximación):
// 591:2499 Cuadro_PreKInder, 600:2557 Cuadro_KInder, 591:2438 Cuadro_Primaria,
// 610:814 Cuadro_Secundaria, 616:1264 Cuadro_Preparatoria.
const LEVELS = [
  {
    slug: "prekinder",
    label: ["PRE-", "KINDER"],
    labelBox: { left: 239.22, top: 35.56, width: 80, height: 167 },
    labelFontSize: 43.333,
    labelTracking: 2.1667,
    ribbon: { left: 157, top: -3, width: 90, height: 251 },
    photo: { src: "/images/niveles/foto-prekinder.png", alt: "Alumno de Pre-Kinder", left: -23, top: 37, width: 209, height: 209 },
    cluster: { src: "/images/niveles/estrellas-prekinder.svg", alt: "", left: 46, top: 0.07, width: 102.569, height: 51.104 },
    decal: { src: "/images/niveles/decal-dino.svg", alt: "", left: 131.88, top: 165, width: 89.05, height: 87.22 },
  },
  {
    slug: "kinder",
    label: ["KINDER"],
    labelBox: { left: 235.89, top: 40.56, width: 40, height: 167 },
    labelFontSize: 43.333,
    labelTracking: 2.1667,
    ribbon: { left: 185.33, top: -2.44, width: 61.11, height: 250.56 },
    photo: { src: "/images/niveles/foto-kinder.png", alt: "Alumna de Kinder", left: -3, top: 10, width: 219, height: 240 },
    stars: [
      { box: { left: 46.44, top: 13.03, width: 21.84, height: 21.84 }, rotate: -12, w: 17.513, h: 16.656, color: "#FFC708" },
      { box: { left: 108.49, top: 6.74, width: 20.846, height: 20.846 }, rotate: -12, w: 16.716, h: 15.898, color: "#0573C7" },
      { box: { left: 107, top: 39.45, width: 19.648, height: 19.648 }, rotate: -12, w: 15.755, h: 14.984, color: "#FFC708" },
    ],
    decal: { src: "/images/niveles/decal-mariposa.svg", alt: "", left: 32.53, top: 103, width: 105.85, height: 99.79 },
  },
  {
    slug: "primaria",
    label: ["PRIMARIA"],
    labelBox: { left: 227, top: 6.44, width: 40, height: 224 },
    labelFontSize: 43.333,
    labelTracking: 2.1667,
    ribbon: { left: 157, top: -3, width: 90, height: 250.556 },
    photo: { src: "/images/niveles/foto-primaria-v2.png", alt: "Alumna de Primaria", left: 68.11, top: -2.44, width: 139.844, height: 250 },
    sticker: {
      src: "/images/niveles/sticker-primaria-margarita.png",
      box: { left: -13.56, top: -9.67, width: 101.825, height: 101.825 },
      rotate: -20,
      w: 79.444,
      h: 79.444,
    },
    stars: [
      { box: { left: 60.33, top: 63.12, width: 30.848, height: 30.848 }, rotate: -12, w: 26.009, h: 26.009, color: "#FFC708" },
      { box: { left: 0.33, top: 107.35, width: 23.671, height: 23.671 }, rotate: -12, w: 19.958, h: 19.958, color: "#0573C7" },
      { box: { left: 13.75, top: 140.14, width: 26.849, height: 25.851 }, rotate: -12, w: 22.864, h: 21.569, color: "#FFC708" },
    ],
  },
  {
    slug: "secundaria",
    label: ["SECUNDARIA"],
    labelBox: { left: 233.11, top: 30.44, width: 40, height: 193 },
    labelFontSize: 28,
    labelTracking: 1.4,
    ribbon: { left: 157, top: -3, width: 90, height: 251 },
    photo: { src: "/images/niveles/foto-secundaria-v2.png", alt: "Alumna de Secundaria", left: 45, top: 21, width: 137.778, height: 226.111 },
    sticker: {
      src: "/images/niveles/sticker-secundaria.png",
      box: { left: -54.11, top: -36.33, width: 194.768, height: 140.452 },
      rotate: -19,
      w: 175.67,
      h: 88.057,
    },
    stars: [
      { box: { left: 32.29, top: 90.2, width: 24.461, height: 24.461 }, rotate: -12, w: 20.624, h: 20.624, color: "#FFC708" },
      { box: { left: 0.33, top: 108.75, width: 15.724, height: 15.724 }, rotate: -12, w: 13.257, h: 13.257, color: "#0573C7" },
      { box: { left: 13.75, top: 135.34, width: 19.247, height: 22.864 }, rotate: -12, w: 15.405, h: 20.1, color: "#FFC708" },
    ],
  },
  {
    slug: "preparatoria",
    label: ["PREPARATORIA"],
    labelBox: { left: 234.22, top: 9.22, width: 40, height: 227 },
    labelFontSize: 28,
    labelTracking: 1.4,
    ribbon: { left: 157, top: -3, width: 90, height: 250.556 },
    photo: { src: "/images/niveles/foto-preparatoria-v2.png", alt: "Alumno de Preparatoria", left: -3, top: 34, width: 183.432, height: 220.556 },
    sticker: {
      src: "/images/niveles/sticker-preparatoria.png",
      box: { left: 69.64, top: -8.03, width: 136.212, height: 83.364 },
      rotate: 8,
      w: 128.253,
      h: 66.159,
    },
    stars: [
      { box: { left: 17, top: 92, width: 19.427, height: 19.427 }, rotate: -12, w: 16.38, h: 16.38, color: "#FFC708" },
      { box: { left: 3, top: 67, width: 15.607, height: 15.607 }, rotate: -11.35, w: 13.257, h: 13.257, color: "#0573C7" },
      { box: { left: 19, top: 25, width: 17.428, height: 17.428 }, rotate: -12, w: 14.694, h: 14.694, color: "#FFC708" },
    ],
  },
];

function LevelCard({ level, compact = false }) {
  return (
    <div
      id={level.slug}
      className="relative aspect-square shrink-0 overflow-hidden rounded-[10px] border-[3px] border-white shadow-[0px_2.222px_2.222px_0px_rgba(0,0,0,0.25)]"
      style={{
        width: compact ? "200px" : cqw(CARD),
        backgroundColor: "#f0f0fa",
        containerType: "inline-size",
      }}
    >
      {/* Orden de capas = orden de hijos en el export de Figma: el cúmulo de
          estrellas / sticker, las estrellas sueltas, el listón y el rótulo
          van DETRÁS de la foto (la foto los tapa donde se superponen); el
          decal (Dino/Mariposa) es la única pieza que Figma dibuja DESPUÉS
          de la foto, o sea encima de ella. */}
      {level.cluster && (
        <div className="absolute" style={{ left: pc(level.cluster.left), top: pc(level.cluster.top), width: pc(level.cluster.width), height: pc(level.cluster.height) }}>
          <Image src={level.cluster.src} alt={level.cluster.alt} fill sizes="10vw" className="pointer-events-none object-contain" />
        </div>
      )}
      {level.stars?.map((s, i) => (
        <Rotated key={i} box={s.box} rotate={s.rotate} w={s.w} h={s.h}>
          <Star color={s.color} width="100%" height="100%" />
        </Rotated>
      ))}

      {/* Listón azul + rótulo vertical */}
      <div
        className="absolute"
        style={{ left: pc(level.ribbon.left), top: pc(level.ribbon.top), width: pc(level.ribbon.width), height: pc(level.ribbon.height), backgroundImage: RIBBON_GRADIENT }}
      />
      <VerticalLabel box={level.labelBox} fontSize={level.labelFontSize} tracking={level.labelTracking} lines={level.label} />

      {/* Sticker (Primaria/Secundaria/Preparatoria) — va DESPUÉS del listón en
          el export (encima de él); en Preparatoria el sticker sí invade la
          franja del listón y debe ganarle, por eso va aquí y no antes. */}
      {level.sticker && (
        <Rotated box={level.sticker.box} rotate={level.sticker.rotate} w={level.sticker.w} h={level.sticker.h}>
          <div className="relative size-full" style={{ filter: STICKER_SHADOW }}>
            <Image src={level.sticker.src} alt="" fill sizes="14vw" className="pointer-events-none object-cover" />
          </div>
        </Rotated>
      )}

      {/* Foto principal — encima del listón/estrellas/sticker, tapándolos donde se superponen (object-cover, como en el export) */}
      <div
        className="absolute"
        style={{ left: pc(level.photo.left), top: pc(level.photo.top), width: pc(level.photo.width), height: pc(level.photo.height) }}
      >
        <Image src={level.photo.src} alt={level.photo.alt} fill sizes="20vw" className="pointer-events-none object-cover" />
      </div>

      {/* Decal (Dino/Mariposa) — única pieza que va ENCIMA de la foto */}
      {level.decal && (
        <div className="absolute" style={{ left: pc(level.decal.left), top: pc(level.decal.top), width: pc(level.decal.width), height: pc(level.decal.height) }}>
          <Image src={level.decal.src} alt={level.decal.alt} fill sizes="10vw" className="pointer-events-none object-contain" />
        </div>
      )}
    </div>
  );
}

export default function Niveles() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundImage: SECTION_GRADIENT }}>
      {/* ---------- Desktop (>=lg): réplica exacta del canvas 1440x772 ---------- */}
      <div className="relative hidden aspect-[1440/772] w-full lg:block" style={{ containerType: "inline-size" }}>
        {/* Pleca_Izquierda — aproximación (ver comentario arriba), color plano #e3e3e3 */}
        <svg
          className="absolute pointer-events-none"
          style={{ left: 0, top: 0, width: cqw(520.5), height: pctY(711.5) }}
          viewBox="0 0 520.5 711.5"
          preserveAspectRatio="none"
        >
          <path d={PLECA_IZQUIERDA_PATH} fill="#e3e3e3" />
        </svg>

        {/* Fila de 5 tarjetas de nivel */}
        <div
          className="absolute left-0 top-0 flex w-full items-center justify-center"
          style={{ height: pctY(300), paddingLeft: cqw(33), paddingRight: cqw(33), gap: cqw(20) }}
        >
          {LEVELS.map((level) => (
            <LevelCard key={level.slug} level={level} />
          ))}
        </div>

        {/* Bloque IHS: pleca + globo + banderas + textos */}
        <div className="absolute left-0" style={{ top: pctY(342), width: "100%", height: pctY(430) }}>
          {(() => {
            const ihsPctY = (px) => `${((px / 430) * 100).toFixed(3)}%`;
            return (
              <>
                {/* Placa (ver PANEL_SHIFT). Todo lo dibujado SOBRE ella —barra
                    roja, textos, bandera— baja el mismo tanto; si no, el
                    hueco entre placa y contenido cambia y aparecen encimes
                    que no existían (la bandera invadiendo el texto). */}
                <div className="absolute" style={{ left: cqw(24), top: ihsPctY(-8 + PANEL_SHIFT), width: cqw(1402.88), height: ihsPctY(430.45) }}>
                  <Image src="/images/niveles/pleca-inferior-ihs.svg" alt="" fill sizes="98vw" className="object-contain" />
                </div>

                {/* Globo + halo — valores exactos del nodo (left 592/597, top
                    -58/-60, tal cual get_design_context). */}
                <div className="absolute" style={{ left: cqw(597 - 30), top: ihsPctY(-60 - 30), width: cqw(320), height: cqw(320) }}>
                  <Image src="/images/niveles/glow-ellipse.svg" alt="" fill sizes="22vw" className="object-contain" />
                </div>
                <div className="absolute" style={{ left: cqw(592), top: ihsPctY(-58), width: cqw(267), height: cqw(265) }}>
                  <Image src="/images/niveles/globo-mundo.png" alt="Globo terráqueo" fill sizes="19vw" className="object-contain" />
                </div>

                <div className="absolute rounded-sm" style={{ left: cqw(99), top: ihsPctY(74 + PANEL_SHIFT), width: cqw(56), height: cqw(6), backgroundColor: "#df3035" }} />
                <p
                  className="absolute whitespace-nowrap font-sans font-semibold text-white"
                  style={{ left: cqw(173), top: ihsPctY(69 + PANEL_SHIFT), fontSize: cqw(13), lineHeight: cqw(16.25), letterSpacing: cqw(0.5) }}
                >
                  EDUCACIÓN GLOBAL
                </p>

                <div
                  className="absolute font-sans font-semibold text-white"
                  style={{ left: cqw(99), top: ihsPctY(99 + PANEL_SHIFT), width: cqw(291), fontSize: cqw(24), lineHeight: cqw(30) }}
                >
                  <p className="m-0">Doble certificado,</p>
                  <p className="m-0">misma formación humana.</p>
                </div>

                <p
                  className="absolute font-display font-semibold text-white"
                  style={{
                    left: cqw(428),
                    top: ihsPctY(258 + PANEL_SHIFT),
                    width: cqw(700),
                    fontSize: cqw(54),
                    lineHeight: cqw(67.5),
                    textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
                    // Encima de la bandera pase lo que pase con su posición
                    // exacta — el texto nunca debe quedar tapado por ella.
                    zIndex: 10,
                  }}
                >
                  International High School
                </p>

                {/* Bandera — el recorte transparente propio de este nodo (no el
                    bandera-mexico-eua.png genérico que se usaba en GlobalReach,
                    que es otra foto con otra relación de aspecto). Caja real
                    de Figma (960, 6, 450×398) desplazada +18 con el resto del
                    contenido de la placa, y recortada con overflow-hidden al
                    rectángulo real de la placa (41, 6, 1368.88×396.45, mismo
                    +18) para que no se salga por la esquina redondeada —
                    la placa es una silueta (rect + muesca), no hay ancestro
                    en Figma que la recorte de por sí, así que sin este
                    contenedor la bandera "sobresale" del borde superior. */}
                <div
                  className="absolute overflow-hidden"
                  style={{ left: cqw(41), top: ihsPctY(6 + PANEL_SHIFT - 9), width: cqw(1368.88), height: ihsPctY(396.45), borderRadius: cqw(28) }}
                >
                  <div className="absolute" style={{ left: cqw(1005 - 41), top: 0, width: cqw(450), height: "100%" }}>
                    <Image src="/images/niveles/banderas-ihs.png" alt="Bandera de México y Estados Unidos" fill sizes="30vw" className="object-contain object-right-bottom" />
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* ---------- Mobile / tablet (<lg): reinterpretación apilada ---------- */}
      <div className="relative lg:hidden">
        <div className="relative">
          <svg className="absolute left-0 top-0 pointer-events-none" width="220" height="300" viewBox="0 0 520.5 711.5" preserveAspectRatio="none">
            <path d={PLECA_IZQUIERDA_PATH} fill="#e3e3e3" />
          </svg>
          <div className="relative flex gap-4 overflow-x-auto px-6 pb-2 pt-8 soft-scrollbar sm:px-10">
            {LEVELS.map((level) => (
              <LevelCard key={level.slug} level={level} compact />
            ))}
          </div>
        </div>

        <div className="relative px-6 pb-14 pt-10 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-8 rounded-sm" style={{ backgroundColor: "#df3035" }} />
            <p className="font-sans text-sm font-semibold tracking-wide text-white">EDUCACIÓN GLOBAL</p>
          </div>
          <p className="mt-4 font-sans text-xl font-semibold leading-snug text-white">
            Doble certificado, misma formación humana.
          </p>

          <div className="relative mx-auto mt-8 h-52 w-52">
            <Image src="/images/niveles/glow-ellipse.svg" alt="" fill sizes="40vw" className="object-contain" />
            <Image src="/images/niveles/globo-mundo.png" alt="Globo terráqueo" fill sizes="40vw" className="object-contain" />
          </div>

          <p
            className="mt-8 text-center font-display text-4xl font-semibold text-white sm:text-5xl"
            style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
          >
            International High School
          </p>

          <div className="relative mx-auto mt-8 h-40 w-full max-w-xs">
            <Image src="/images/bandera-mexico-eua.png" alt="Bandera de México y Estados Unidos" fill sizes="80vw" className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
