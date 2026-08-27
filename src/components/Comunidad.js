import Image from "next/image";

// Réplica 1:1 de Figma para "02_Comunidad" (node 790:6492, canvas 1440x760) —
// la sección "Así vivimos Champal" que sigue después de Bienvenidos. Misma
// técnica que Hero.js/Bienvenidos.js: aspect-ratio + containerType:inline-
// size en desktop, posiciones en % vía pctX/pctY y tipografía en cqw.
const CANVAS_W = 1440;
const CANVAS_H = 760;
const pctX = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}%`;
const pctY = (px) => `${((px / CANVAS_H) * 100).toFixed(3)}%`;
const cqw = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;

// Mismo degradado que el "Cielo" del Hero (86.175deg, misma terna de
// colores) — 02_Comunidad reabre la escena espacial.
const CIELO_GRADIENT =
  "linear-gradient(86.175deg, rgb(10, 23, 48) 2.9386%, rgb(3, 81, 170) 46.937%, rgb(22, 74, 146) 98.593%)";

// Las 4 insignias son "text on a path" en Figma (curva alrededor del
// círculo) — get_design_context no exporta ese tipo de nodo a JSX, así que
// se reconstruye a mano con un <path> circular invisible + <textPath>. El
// radio (108) sale de comparar la caja del text-path de Figma (220x220,
// ligeramente menor que el círculo de 250x250) contra el centro del círculo.
const BADGE_RADIUS = 108;

// Halo celeste suave detrás de cada círculo — radial-gradient centrado,
// bastante más grande que el círculo (250px) para que se note como brillo,
// no como un borde duro.
const BADGE_GLOW = "radial-gradient(circle, rgba(135,206,250,0.55) 0%, rgba(135,206,250,0.28) 45%, rgba(135,206,250,0) 72%)";

function CurvedBadge({ src, alt, label, pathId, fontSize = 15 }) {
  const size = 250;
  const c = size / 2;
  return (
    <>
      <div className="absolute" style={{ inset: "-38%", background: BADGE_GLOW }} />
      <Image src={src} alt={alt} fill sizes="18vw" className="relative object-contain" />
      <svg className="absolute inset-0" viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
        <path id={pathId} d={`M ${c - BADGE_RADIUS} ${c} A ${BADGE_RADIUS} ${BADGE_RADIUS} 0 1 1 ${c + BADGE_RADIUS} ${c}`} fill="none" />
        <text fill="#ffffff" fontSize={fontSize} fontWeight="700" letterSpacing="1.4" fontFamily="var(--font-sans)">
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      </svg>
    </>
  );
}

const BADGES = [
  { key: "cuenta", src: "/images/comunidad/circulo-cuenta.png", alt: "Cada alumno cuenta", left: 799, top: 154, label: "CADA ALUMNO CUENTA" },
  { key: "comunidad", src: "/images/comunidad/circulo-comunidad.png", alt: "Crecemos en comunidad", left: 561, top: 294, label: "CRECEMOS EN COMUNIDAD" },
  { key: "mente", src: "/images/comunidad/circulo-mente.png", alt: "Desarrollamos mente, cuerpo y carácter", left: 788, top: 485, label: "DESARROLLAMOS MENTE, CUERPO Y CARÁCTER", fontSize: 11 },
  { key: "haciendo", src: "/images/comunidad/circulo-haciendo.png", alt: "Aprendemos haciendo", left: 1091, top: 422, label: "APRENDEMOS HACIENDO" },
];

export default function Comunidad() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundImage: CIELO_GRADIENT }}>
      {/* ---------- Desktop (>=lg): réplica exacta del canvas 1440x760 ---------- */}
      <div className="relative hidden aspect-[1440/760] w-full lg:block" style={{ containerType: "inline-size" }}>
        {/* Plano 01 · Estrellas y atmósfera */}
        <Image src="/images/comunidad/estrellas-atmosfera.svg" alt="" fill preload sizes="100vw" className="object-cover" />

        {/* Pleca_Izquierda — blob claro detrás del título y la foto. Versión
            "v3" pedida directo a Figma: la primera exportación no traía
            relleno (capa vacía) y la segunda traía un stroke blanco de más
            que causaba la raya entre secciones — esta ya viene limpia
            (fill sólido, sin stroke). */}
        <div className="absolute" style={{ left: 0, top: 0, width: cqw(649), height: "100%" }}>
          <div className="absolute inset-[-4.21%_-7.24%_-4.21%_-2.62%]">
            <Image src="/images/comunidad/pleca-izquierda-v3.svg" alt="" fill preload sizes="45vw" className="object-contain" />
          </div>
        </div>

        {/* Pleca_Derecha — blob azul detrás de las 4 insignias (rotado 90°) */}
        <div className="absolute flex items-center justify-center" style={{ left: pctX(668), top: 0, width: cqw(772), height: cqw(417) }}>
          <div className="relative flex-none" style={{ width: cqw(417), height: cqw(772), transform: "rotate(90deg)" }}>
            <div className="absolute inset-[-2.2%_-7.67%_-6.09%_-7.67%]">
              <Image src="/images/comunidad/pleca-derecha-v2.svg" alt="" fill preload sizes="53vw" className="object-contain" />
            </div>
          </div>
        </div>

        {/* Bandera/pleca decorativa que asoma arriba del blob azul */}
        <div className="absolute" style={{ left: pctX(525), top: pctY(-2), width: cqw(148.284), height: cqw(221.5) }}>
          <div className="absolute inset-[-9.93%_-14.84%]">
            <Image src="/images/comunidad/flag-rectangle.svg" alt="" fill sizes="10vw" className="object-contain" />
          </div>
        </div>
        <div className="absolute" style={{ left: pctX(639), top: pctY(-21.5), width: cqw(25.707), height: cqw(235.5) }}>
          <div className="absolute inset-[-1.75%_-23.84%_0_-8.75%]">
            <Image src="/images/comunidad/flag-vector24.svg" alt="" fill sizes="2vw" className="object-contain" />
          </div>
        </div>
        <div className="absolute" style={{ left: pctX(644.5), top: pctY(-2), width: cqw(34.856), height: cqw(219.5) }}>
          <div className="absolute inset-[-0.38%_-14.57%_0_0]">
            <Image src="/images/comunidad/flag-vector26.svg" alt="" fill sizes="3vw" className="object-contain" />
          </div>
        </div>
        <div className="absolute" style={{ left: pctX(639.5), top: pctY(-8), width: cqw(29.494), height: cqw(143.5) }}>
          <div className="absolute inset-[-2.72%_-6.02%_0_-3.56%]">
            <Image src="/images/comunidad/flag-vector25.svg" alt="" fill sizes="2vw" className="object-contain" />
          </div>
        </div>

        {/* Foto principal — niño constructor */}
        <div className="absolute" style={{ left: pctX(245), top: pctY(335), width: cqw(352), height: cqw(425) }}>
          <Image
            src="/images/comunidad/kid-construccion.png"
            alt="Alumno de Champal vestido de constructor"
            fill
            preload
            sizes="24vw"
            className="object-cover"
          />
        </div>

        {/* Insignias circulares con texto curvo */}
        {BADGES.map((b) => (
          <div key={b.key} className="absolute" style={{ left: pctX(b.left), top: pctY(b.top), width: cqw(250), height: cqw(250) }}>
            <CurvedBadge src={b.src} alt={b.alt} label={b.label} pathId={`comunidad-arc-${b.key}`} fontSize={b.fontSize} />
          </div>
        ))}

        {/* Título */}
        <div className="absolute flex items-center gap-3" style={{ left: pctX(112), top: pctY(84) }}>
          <div className="rounded-sm" style={{ width: cqw(32), height: cqw(4), backgroundColor: "#aa181f" }} />
          <p
            className="whitespace-nowrap font-sans font-semibold"
            style={{ fontSize: cqw(18), lineHeight: cqw(22), letterSpacing: cqw(1.08), color: "#102c54" }}
          >
            ASÍ VIVIMOS CHAMPAL
          </p>
        </div>
        <p
          className="absolute font-serif font-semibold"
          style={{ left: pctX(122), top: pctY(119), width: cqw(403), fontSize: cqw(42), lineHeight: cqw(52), color: "#003750" }}
        >
          Una comunidad comprometida con el desarrollo integral de sus alumnos.
        </p>
      </div>

      {/* ---------- Mobile / tablet (<lg): reinterpretación apilada ---------- */}
      <div className="relative lg:hidden">
        <Image src="/images/comunidad/estrellas-atmosfera.svg" alt="" fill preload sizes="100vw" className="object-cover" />

        <div className="relative px-6 pt-14 pb-10 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 rounded-sm" style={{ backgroundColor: "#aa181f" }} />
            <p className="font-sans text-sm font-semibold tracking-wide" style={{ color: "#0e2a4d" }}>
              ASÍ VIVIMOS CHAMPAL
            </p>
          </div>
          <p className="mt-4 font-serif text-3xl font-semibold sm:text-4xl" style={{ color: "#0e2a4d" }}>
            Una comunidad comprometida con el desarrollo integral de sus alumnos.
          </p>

          <div className="relative mt-8 flex justify-center">
            <Image
              src="/images/comunidad/kid-construccion.png"
              alt="Alumno de Champal vestido de constructor"
              width={352}
              height={425}
              preload
              sizes="70vw"
              className="h-[300px] w-auto sm:h-[360px]"
            />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 place-items-center">
            {BADGES.map((b) => (
              <div key={b.key} className="relative h-28 w-28 sm:h-32 sm:w-32">
                <CurvedBadge src={b.src} alt={b.alt} label={b.label} pathId={`comunidad-arc-mobile-${b.key}`} fontSize={b.fontSize ? b.fontSize * 0.85 : 15} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
