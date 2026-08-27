import Image from "next/image";

// "08_AsiSeVive_PreKinder" — reconstrucción desde cero a partir del nodo
// Figma "Columna_Editorial_Izquierda" (345:654, marco local 745x760) más
// la foto principal (foto+barras) a la derecha. Todo se posiciona con
// porcentajes (y el título con `cqw`, unidad de ancho de contenedor) para
// que la distribución exacta de Figma escale igual a cualquier ancho de
// pantalla. Sin animaciones por ahora — el foco de esta pasada es que la
// distribución visual coincida con la referencia.

const TITLE_WORDS = [
  { text: "Una experiencia", cx: 53.69, top: 2.63, color: "#141c2a" },
  { text: "llena de", cx: 28.93, top: 12.24, color: "#141c2a" },
  { text: "movimiento", cx: 42.62, top: 21.84, color: "#d22527" },
  { text: "y", cx: 72.15, top: 21.45, color: "#141c2a" },
  { text: "descubrimiento", cx: 66.91, top: 31.45, color: "#d22527" },
];

const GALLERY = [
  { key: "g1", src: "/images/prekinder/vive-galeria-1.png", alt: "Alumna de Pre-Kinder en actividad de geometría" },
  { key: "g2", src: "/images/prekinder/vive-galeria-2.png", alt: "Miss trabajando con proyector interactivo" },
  { key: "g3", src: "/images/prekinder/vive-galeria-3.png", alt: "Alumno de Pre-Kinder gateando por un túnel de juego" },
];

// left/top en % del marco 745x760 (posiciones 1:1 de Figma).
const FLOWERS = [
  { left: 4.83, top: 80.26 },
  { left: 22.28, top: 79.61 },
  { left: 39.73, top: 78.95 },
  { left: 57.18, top: 79.61 },
  { left: 74.63, top: 79.61 },
];
const FLOWER_W = 9.8;
const FLOWER_H = 16.54;

// Barras de fondo detrás de la foto — degradados exactos de Figma.
const BARS = [
  { from: "#fac600", to: "#947500", stop: "45%" },
  { from: "#ff5353", to: "#993232", stop: "39%" },
  { from: "#53cbff", to: "#327a99", stop: "53%" },
];

function ColumnaEditorial() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "745 / 760", containerType: "inline-size" }}>
      {/* Degradado elíptico verde — franja delgada tipo "pasto" pegada a la
          orilla inferior, termina unos px antes de las hojas de las
          flores (~89% de la altura del marco). Se extiende más allá del
          borde izquierdo del marco (-22%, igual que la nube) para que no
          quede hueco blanco donde la nube también se sale del marco. */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{
          left: "-22%",
          right: "0%",
          background: "radial-gradient(ellipse 150% 11% at 50% 100%, #00ff37 0%, #00ff37 40%, rgba(0,255,55,0) 100%)",
        }}
      />

      {/* Nube decorativa, asoma por el borde izquierdo del marco. */}
      <div className="pointer-events-none absolute" style={{ left: "-18.52%", top: "43.42%", width: "46.2%", height: "13%" }}>
        <Image src="/images/prekinder/vive-nube.png" alt="" fill sizes="300px" className="object-contain" />
      </div>

      {/* Título — cada palabra en su posición exacta de Figma (centrada en
          `cx`), tamaño de letra en `cqw` para escalar con el ancho real
          del marco. */}
      {TITLE_WORDS.map((w) => (
        <p
          key={w.text}
          className="absolute -translate-x-1/2 whitespace-nowrap font-serif font-bold"
          style={{ left: `${w.cx}%`, top: `${w.top}%`, color: w.color, fontSize: "8.591cqw", lineHeight: 1 }}
        >
          {w.text}
        </p>
      ))}

      {/* Mariposa decorativa. */}
      <div className="pointer-events-none absolute" style={{ left: "3.76%", top: "23.24%", width: "27.3%", height: "24.9%" }}>
        <Image src="/images/prekinder/vive-mariposa.png" alt="" fill sizes="220px" className="object-contain" />
      </div>

      {/* Galería de 3 fotos. */}
      <div className="absolute flex" style={{ left: "4.83%", top: "48.68%", width: "77.3%", height: "22.37%", gap: "4.43%" }}>
        {GALLERY.map((photo) => (
          <div
            key={photo.key}
            className="relative aspect-square flex-1 overflow-hidden rounded-xl shadow-[0px_4px_5px_2px_rgba(81,81,81,0.25)]"
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="200px" className="object-cover" />
          </div>
        ))}
      </div>

      {/* Flores en fila. */}
      {FLOWERS.map((f, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={{ left: `${f.left}%`, top: `${f.top}%`, width: `${FLOWER_W}%`, height: `${FLOWER_H}%` }}
        >
          <Image src="/images/prekinder/vive-flor.png" alt="" fill sizes="80px" className="object-contain object-bottom" />
        </div>
      ))}
    </div>
  );
}

function FotoPrincipal() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-t-[24px] shadow-[0px_18px_40px_-8px_rgba(10,37,64,0.25)] lg:aspect-auto lg:h-full lg:min-h-[420px]">
      <div className="absolute inset-0 flex">
        {BARS.map((bar, i) => (
          <div key={i} className="h-full flex-1" style={{ backgroundImage: `linear-gradient(to bottom, ${bar.from} ${bar.stop}, ${bar.to})` }} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-3 rounded-t-2xl border-4 border-dashed border-white/55 sm:inset-4" />

      <div className="pointer-events-none absolute left-[74%] top-[5%] w-[13%]">
        <Image src="/images/prekinder/vive-manzana.png" alt="" width={107} height={111} />
      </div>
      <div className="pointer-events-none absolute left-[83%] top-[22%] w-[11%]">
        <Image src="/images/prekinder/vive-abeja.png" alt="" width={92} height={95} />
      </div>
      <div className="pointer-events-none absolute left-[62%] top-[29%] w-[17%]">
        <Image src="/images/prekinder/vive-avion.png" alt="" width={141} height={99} />
      </div>

      <Image
        src="/images/prekinder/vive-foto-principal.png"
        alt="Alumna de Pre-Kinder amasando pan"
        fill
        sizes="(max-width: 1024px) 90vw, 50vw"
        className="object-contain object-bottom"
      />
    </div>
  );
}

export default function PreKinderAsiSeVive() {
  return (
    <section className="relative overflow-hidden bg-white py-8 lg:py-0">
      <div className="px-6 lg:px-0">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[745fr_695fr] lg:items-stretch lg:gap-0">
          <div className="order-2 flex items-center lg:order-1 lg:pl-12 xl:pl-20">
            <ColumnaEditorial />
          </div>
          <div className="order-1 flex lg:order-2">
            <FotoPrincipal />
          </div>
        </div>
      </div>
    </section>
  );
}
