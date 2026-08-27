import Image from "next/image";

// "Cambridge" (node 388:844 en el archivo de Primaria) — sección compartida
// entre los niveles que ofrecen la trayectoria de certificaciones Cambridge
// (Primaria y, próximamente, Secundaria/Preparatoria) — por eso vive como
// componente genérico en src/components (sin prefijo de nivel), no dentro
// de un archivo Primaria*. En Primaria va inmediatamente después del
// "bloque largo" de 4 experiencias (termina en PrimariaEmocional): en
// Figma, "Sección_Primaria" (el bloque) termina exactamente en block-Y
// 5275 y este frame arranca justo ahí (x=0,y=5275) — 0px de separación,
// mismo criterio "pegadas" del resto de la página. Canvas 1440x680.
//
// A diferencia de las 4 secciones del bloque, aquí el fondo (degradado
// verde-azulado + la insignia "Where your world grows" + las formas de
// color de la esquina inferior derecha) viene YA COMPUESTO como una sola
// imagen exportada por Figma (no hay capas sueltas de círculos/óvalos que
// reconstruir con pctX/pctY) — así que se usa tal cual como fondo
// full-bleed con object-cover, y el resto (logo Cambridge, texto,
// etiquetas de certificaciones) se posiciona encima con el mismo sistema
// de canvas absoluto pxToPct/cqw de siempre.
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

const FONDO = "/images/cambridge/cambridge-fondo.png";
const LOGO_3D = "/images/cambridge/cambridge-logo3d.png";
const TEAL = "#05b5b0";

const ETIQUETAS = [
  { top: "KET", sub: "Key English Test" },
  { top: "PET", sub: "Preliminary English Test" },
  { top: "FCE", sub: "First Certificate in English" },
  { top: "CAE", sub: "Certificate in Advanced English" },
];

function Etiqueta({ top, sub, className = "", fontSize, gapPx = 0 }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[20px] text-center text-white shadow-[0px_6px_10px_0px_rgba(5,20,51,0.22)] ${className}`}
      style={{ background: "linear-gradient(to top, #002b38, #185162)", fontSize, gap: gapPx }}
    >
      <p className="font-semibold leading-tight">{top}</p>
      <p className="font-normal leading-tight">{sub}</p>
    </div>
  );
}

export default function Cambridge() {
  return (
    <section className="relative bg-white">
      {/* Mobile/tablet (< lg): apilado simple — fondo sólido (mismo teal
          muestreado del PNG) en vez del recorte diagonal + escudo, que no
          escala bien a un ancho angosto; mismo criterio de simplificación
          ya usado en el resto del sitio para mobile. */}
      <div className="relative flex flex-col gap-6 px-6 py-14 lg:hidden" style={{ backgroundColor: TEAL }}>
        <div className="relative h-16 w-56">
          <Image src={LOGO_3D} alt="Cambridge English" fill sizes="224px" className="object-contain object-left" />
        </div>
        <div className="flex items-center gap-3">
          <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: "#e5303d" }} />
          <p className="text-xs font-semibold tracking-wide text-black">TRAYECTORIA DE INGLÉS</p>
        </div>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-black sm:text-4xl">
          Un camino de aprendizaje con reconocimiento internacional
        </h2>
        <p className="text-lg leading-relaxed text-black">
          Las Cambridge English Qualifications acompañan el avance continuo de las habilidades lingüísticas y ofrecen
          una ruta clara para seguir aprendiendo inglés.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {ETIQUETAS.map((e) => (
            <Etiqueta key={e.top} top={e.top} sub={e.sub} className="aspect-square p-3 text-sm" />
          ))}
        </div>
      </div>

      {/* Desktop (lg+): réplica 1:1 del canvas de Figma 1440x680. */}
      <div className="relative hidden aspect-[1440/680] w-full overflow-hidden lg:block" style={{ containerType: "inline-size" }}>
        <Image src={FONDO} alt="" fill sizes="1440px" className="object-cover" priority={false} />

        <div className="absolute" style={{ left: pctX(104), top: pctY(104), width: cqw(300), height: cqw(82) }}>
          <Image src={LOGO_3D} alt="Cambridge English" fill sizes="300px" className="object-contain object-left" />
        </div>

        <div
          className="absolute"
          style={{ left: pctX(104), top: pctY(228), width: cqw(56), height: cqw(6), backgroundColor: "#e5303d", borderRadius: cqw(3) }}
        />
        <p
          className="absolute font-semibold leading-none text-black"
          style={{ left: pctX(170), top: pctY(228), width: pctX(444), fontSize: cqw(14) }}
        >
          TRAYECTORIA DE INGLÉS
        </p>
        <h2
          className="absolute font-serif font-semibold leading-tight text-black"
          style={{ left: pctX(104), top: pctY(257), width: pctX(502), fontSize: cqw(36) }}
        >
          Un camino de aprendizaje con reconocimiento internacional
        </h2>
        <p
          className="absolute text-black"
          style={{ left: pctX(104), top: pctY(360), width: pctX(522), fontSize: cqw(20), lineHeight: cqw(28) }}
        >
          Las Cambridge English Qualifications acompañan el avance continuo de las habilidades lingüísticas y ofrecen
          una ruta clara para seguir aprendiendo inglés.
        </p>

        {ETIQUETAS.map((e, i) => (
          <div key={e.top} className="absolute" style={{ left: pctX(104 + i * 160), top: pctY(477), width: cqw(128), height: cqw(128) }}>
            <Etiqueta top={e.top} sub={e.sub} className="h-full w-full px-2" fontSize={cqw(16)} />
          </div>
        ))}
      </div>
    </section>
  );
}
