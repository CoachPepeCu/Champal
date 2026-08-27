import Image from "next/image";

// "03_Editorial_Preparatoria" (node 437:789, canvas 1440x720) — va pegada
// directo debajo de PreparatoriaAccesos.js (mismo criterio "sin espacios en
// blanco" que ya se usó para Hero→Accesos). Réplica 1:1 del layout absoluto
// de Figma, misma técnica px->%/cqw que PrimariaIngles.js/PrimariaProgrentis.js
// (canvas propio de esta sección, no el kit de src/components/hero — ese es
// solo para el Hero en sí).
//
// Fondo compuesto por 3 capas apiladas: azul sólido (#0a1a3c) + 2 SVG
// decorativos que Figma exporta ya resueltos como paths (curvas azules más
// oscuras arriba-izq/arriba-der/abajo-izq, y la "ola" crema #F8F5F0 que aloja
// el bloque de texto) — se usan literales (mismos assets que
// get_design_context) en vez de intentar reproducir los paths a mano.
const CANVAS_W = 1440;
const CANVAS_H = 720;
function pctX(px) { return `${((px / CANVAS_W) * 100).toFixed(3)}%`; }
function pctY(px) { return `${((px / CANVAS_H) * 100).toFixed(3)}%`; }
function cqw(px) { return `${((px / CANVAS_W) * 100).toFixed(3)}cqw`; }

const FOTO = "/images/preparatoria/editorial-jovenes.png";
const FOTO_ALT = "Alumnos de Preparatoria de Colegio Champal, staff estudiantil";
const CURVAS_AZUL = "/images/preparatoria/editorial-curvas-azul.svg";
const ONDA_BLANCA = "/images/preparatoria/editorial-onda-blanca.svg";
const CREMA = "#f8f5f0";

export default function PreparatoriaEditorial() {
  return (
    <section id="editorial" className="relative" style={{ backgroundColor: "#0a1a3c" }}>
      {/* Mobile/tablet (< lg): apilado simple — foto arriba, panel crema con
          el mensaje abajo, mismo criterio de simplificación que el resto de
          los niveles (no se intenta replicar la forma de "ola" en móvil). */}
      <div className="flex flex-col lg:hidden">
        <div className="relative aspect-[4/3] w-full">
          <Image src={FOTO} alt={FOTO_ALT} fill sizes="100vw" className="object-cover" />
        </div>
        <div className="flex flex-col items-start gap-4 px-6 py-10" style={{ backgroundColor: CREMA }}>
          <span className="h-[6px] w-24 rounded-full" style={{ backgroundColor: "#d61c2b" }} />
          <p className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            <span style={{ color: "#021c53" }}>
              Los retamos a descubrir y emprender sus{" "}
            </span>
            <span style={{ color: "#3878f2" }}>sueños</span>
            <span style={{ color: "#011948" }}> con </span>
            <span style={{ color: "#3878f2" }}>responsabilidad.</span>
          </p>
        </div>
      </div>

      {/* Desktop (lg+): réplica 1:1 del canvas de Figma 1440x720 */}
      <div className="relative hidden aspect-[1440/720] w-full overflow-hidden lg:block" style={{ containerType: "inline-size" }}>
        <Image src={CURVAS_AZUL} alt="" fill sizes="1440px" />
        <Image src={ONDA_BLANCA} alt="" fill sizes="1440px" />

        {/* node 456:825 — foto de los 3 alumnos */}
        <div className="absolute" style={{ left: pctX(545), top: pctY(76), width: cqw(960), height: cqw(640) }}>
          <Image src={FOTO} alt={FOTO_ALT} fill sizes="960px" className="object-cover" />
        </div>

        {/* node 467:827 — bloque de texto sobre la ola crema */}
        <div className="absolute flex flex-col items-start" style={{ left: pctX(120), top: pctY(222), width: cqw(580) }}>
          <div className="rounded-[3px]" style={{ width: cqw(94), height: cqw(6), backgroundColor: "#d61c2b" }} />
          <p
            className="font-serif font-semibold"
            style={{ marginTop: cqw(20), fontSize: cqw(50), lineHeight: cqw(66), color: "#021c53" }}
          >
            Los retamos a
          </p>
          <p className="font-serif font-semibold" style={{ fontSize: cqw(50), lineHeight: cqw(66), color: "#021c53" }}>
            descubrir y
          </p>
          <p className="font-serif font-semibold" style={{ fontSize: cqw(50), lineHeight: cqw(66), color: "#021c53" }}>
            emprender sus
          </p>
          <p className="font-serif font-semibold" style={{ fontSize: cqw(50), lineHeight: cqw(66) }}>
            <span style={{ color: "#3878f2" }}>sueños </span>
            <span style={{ color: "#011948" }}>con</span>
          </p>
          <p className="font-serif font-semibold" style={{ fontSize: cqw(50), lineHeight: cqw(66), color: "#3878f2" }}>
            responsabilidad.
          </p>
        </div>
      </div>
    </section>
  );
}
