import Image from "next/image";

// "03_AprenderADescubrir" de Primaria (node 196:511, canvas 1440x720) —
// diseño propio de esta sección, distinto del patrón "carrusel + panel"
// de KinderDescubrir.js/PreKinderDescubrir.js: fondo gris diagonal, texto a
// la izquierda (antetítulo + acento, título, dos párrafos con la primera
// letra destacada) y a la derecha una foto circular rotada 5° con dos
// trazos SVG decorativos superpuestos. Al ser layout absoluto de Figma
// (como el Hero), se replica con la misma técnica px->%/cqw sobre un
// canvas 1440x720 — ver src/components/hero/heroMath.js para la técnica
// original; aquí se reimplementa localmente porque esta sección no forma
// parte del kit de Hero.
const CANVAS_W = 1440;
const CANVAS_H = 720;
function pctX(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}%`;
}
function pctY(px) {
  return `${((px / CANVAS_H) * 100).toFixed(3)}%`;
}
function cqw(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;
}

// Foto (node 390:863 "Ellipse 8") — asset FILL original referenciado por
// get_design_context, no el "export" de download_assets (ver memoria de
// proyecto "champal-niveles-pages-pattern").
const PHOTO = "/images/primaria/formacion-ninas-porras.png";
const PHOTO_ALT = "Alumnas de Primaria animando con pompones en una cancha deportiva de Colegio Champal";

// Trazos decorativos (nodes 390:896 y 390:901) — SVGs originales de Figma,
// nunca redibujados a mano (ver skill figma-design-to-code). Pese al
// nombre "Vector 18/20" no son rojo/amarillo puros sino dos tonos
// naranja-dorado (#FFAE00 y #FDC03D) que en el screenshot se leen como
// rojo/amarillo por el contraste entre ellos.
const SWIRL_NARANJA = "/images/primaria/formacion-trazo-naranja.svg";
const SWIRL_DORADO = "/images/primaria/formacion-trazo-dorado.svg";

const PARRAFO_1 =
  "n Primaria acompañamos a cada alumno a construir bases sólidas en lo académico y lo humano. Aprenden a pensar, expresarse, colaborar y descubrir que sus preguntas pueden llevarlos mucho más lejos.";
const PARRAFO_2 =
  "Estamos incorporados a la Secretaría de Educación, lo que le da validez oficial a los estudios realizados. Además, manejamos programas de extensión en las materias básicas, garantizando el excelente nivel académico que nos distingue";

export default function PrimariaFormacion() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: "linear-gradient(-41.088deg, rgb(209,209,209) 35.482%, rgb(131,131,131) 96.741%)" }}
    >
      {/* Mobile/tablet (< lg): apilado simple, sin los trazos decorativos
          (no traducen bien a un canvas angosto) — mismo criterio que
          HeroMobileStack en src/components/hero. */}
      <div className="flex flex-col gap-8 px-6 py-14 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: "#e5303d" }} />
          <p className="text-xs font-semibold tracking-wide text-white sm:text-sm">
            BASES QUE SE CONSTRUYEN TODOS LOS DÍAS
          </p>
        </div>
        <h2 className="-mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl" style={{ color: "#082761" }}>
          Formamos seres humanos con valores firmes
        </h2>
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-full shadow-[0px_10px_24px_rgba(0,0,0,0.25)]">
          <Image src={PHOTO} alt={PHOTO_ALT} fill sizes="100vw" className="object-cover" />
        </div>
        <div className="space-y-4 text-base leading-relaxed" style={{ color: "#29303d" }}>
          <p>
            <span className="text-lg font-semibold">E</span>
            {PARRAFO_1}
          </p>
          <p>{PARRAFO_2}</p>
        </div>
      </div>

      {/* Desktop (lg+): réplica 1:1 del canvas de Figma 1440x720 */}
      <div className="relative hidden aspect-[1440/720] w-full lg:block" style={{ containerType: "inline-size" }}>
        <span
          className="absolute rounded-full"
          style={{ left: pctX(104), top: pctY(112), width: cqw(56), height: cqw(6), backgroundColor: "#e5303d" }}
        />
        <p
          className="absolute font-semibold leading-none text-white"
          style={{ left: pctX(178), top: pctY(101), width: pctX(460), fontSize: cqw(14) }}
        >
          BASES QUE SE CONSTRUYEN TODOS LOS DÍAS
        </p>
        <h2
          className="absolute font-serif font-semibold leading-tight"
          style={{ left: pctX(104), top: pctY(151), width: pctX(470), fontSize: cqw(49), color: "#082761" }}
        >
          Formamos seres humanos con valores firmes
        </h2>
        <div
          className="absolute"
          style={{ left: pctX(104), top: pctY(347), width: pctX(518), fontSize: cqw(18), lineHeight: cqw(32), color: "#29303d" }}
        >
          <p>
            <span className="font-semibold" style={{ fontSize: cqw(20) }}>
              E
            </span>
            {PARRAFO_1}
          </p>
          <p className="mt-[1em]">{PARRAFO_2}</p>
        </div>

        {/* Foto circular rotada 5° — la caja exterior (729.095px) es el
            bounding-box real de un cuadrado de 673px rotado 5°; centrar
            el cuadrado sin rotar dentro de esa caja con flex reproduce
            exactamente el mismo cálculo que hace Figma. */}
        <div
          className="absolute flex items-center justify-center"
          style={{ left: pctX(678.95), top: pctY(5.95), width: cqw(729.095), height: cqw(729.095) }}
        >
          <div
            className="relative overflow-hidden rounded-full shadow-[0px_10px_30px_rgba(0,0,0,0.3)]"
            style={{ width: cqw(673), height: cqw(673), transform: "rotate(5deg)" }}
          >
            <Image src={PHOTO} alt={PHOTO_ALT} fill sizes="47vw" className="object-cover" />
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- trazo SVG decorativo, no una foto de contenido */}
        <img
          aria-hidden
          alt=""
          src={SWIRL_NARANJA}
          className="pointer-events-none absolute"
          style={{ left: pctX(301), top: pctY(537.84), width: cqw(1030), height: cqw(152.375) }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          aria-hidden
          alt=""
          src={SWIRL_DORADO}
          className="pointer-events-none absolute"
          style={{ left: pctX(433), top: pctY(608), width: cqw(731), height: cqw(112.478) }}
        />
      </div>
    </section>
  );
}
