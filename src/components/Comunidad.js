import Image from "next/image";

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 760;
const x = (value) => `${((value / CANVAS_WIDTH) * 100).toFixed(4)}%`;
const y = (value) => `${((value / CANVAS_HEIGHT) * 100).toFixed(4)}%`;
const unit = (value) => `${((value / CANVAS_WIDTH) * 100).toFixed(4)}cqw`;
const SKY = "linear-gradient(180deg, #024c9e 0%, #0c4e9e 100%)";

const BADGES = [
  { key: "cuenta", src: "/images/comunidad/circulo-cuenta.png", alt: "Cada alumno cuenta", label: "CADA ALUMNO CUENTA", left: 763, top: 148 },
  { key: "comunidad", src: "/images/comunidad/circulo-comunidad.png", alt: "Crecemos en comunidad", label: "CRECEMOS EN COMUNIDAD", left: 569, top: 326 },
  { key: "mente", src: "/images/comunidad/circulo-mente.png", alt: "Desarrollamos mente, cuerpo y carácter", label: "DESARROLLAMOS MENTE, CUERPO Y CARÁCTER", left: 820, top: 471 },
  { key: "haciendo", src: "/images/comunidad/circulo-haciendo.png", alt: "Aprendemos haciendo", label: "APRENDEMOS HACIENDO", left: 1090, top: 438 },
];

const BADGE_GLOW = "radial-gradient(circle, rgba(149, 200, 255, 0.38) 0%, rgba(108, 172, 238, 0.2) 47%, rgba(108, 172, 238, 0) 72%)";

function CurvedLabel({ id, label }) {
  return (
    <svg viewBox="0 0 263 263" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <path id={id} d="M 131.5 255.5 A 119 119 0 1 1 131.5 17.5 A 119 119 0 1 1 131.5 255.5" />
      </defs>
      <text fill="#fff" fontFamily="var(--font-sans)" fontSize="15" fontWeight="700" letterSpacing="1.35">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">{label}</textPath>
      </text>
    </svg>
  );
}

function DesktopBadge({ badge }) {
  return (
    <div className="absolute" style={{ left: x(badge.left), top: y(badge.top), width: unit(263), height: unit(263) }}>
      <div className="pointer-events-none absolute -inset-[24%]" style={{ background: BADGE_GLOW }} />
      <Image src={badge.src} alt={badge.alt} fill sizes="19vw" className="object-contain" />
      <div className="pointer-events-none absolute inset-0">
        <CurvedLabel id={`comunidad-desktop-${badge.key}`} label={badge.label} />
      </div>
    </div>
  );
}

function ResponsiveBadge({ badge }) {
  return (
    <div className="relative aspect-square w-full max-w-[220px]">
      <div className="pointer-events-none absolute -inset-[24%]" style={{ background: BADGE_GLOW }} />
      <Image src={badge.src} alt={badge.alt} fill sizes="(max-width: 640px) 42vw, 220px" className="object-contain" />
      <div className="pointer-events-none absolute inset-0">
        <CurvedLabel id={`comunidad-responsive-${badge.key}`} label={badge.label} />
      </div>
    </div>
  );
}

function DesktopArtwork() {
  return (
    <div className="relative hidden aspect-[1440/760] w-full lg:block" style={{ containerType: "inline-size" }}>
      <Image src="/images/comunidad/estrellas-figma-790-6490.svg" alt="" fill sizes="100vw" className="object-fill" />

      <div className="absolute" style={{ left: x(-4), top: y(-1), width: unit(651.458), height: unit(772) }}>
        <Image src="/images/comunidad/pleca-izquierda-figma-790-6490.svg" alt="" fill sizes="46vw" className="object-fill" />
      </div>
      <div className="absolute" style={{ left: x(390.116), top: y(2.012), width: unit(264.117), height: unit(759.988) }}>
        <Image src="/images/comunidad/borde-blanco-izquierdo-figma-790-6490.svg" alt="" fill sizes="19vw" className="object-fill" />
      </div>

      <div className="absolute flex items-center justify-center" style={{ left: x(661), top: y(-7), width: unit(778), height: unit(409.174) }}>
        <div className="relative flex-none" style={{ width: unit(419.174), height: unit(789), transform: "rotate(90deg)" }}>
          <Image src="/images/comunidad/pleca-derecha-figma-790-6490.svg" alt="" fill sizes="55vw" className="object-fill" />
        </div>
      </div>
      <div className="absolute flex items-center justify-center" style={{ left: x(661), top: y(2), width: unit(778), height: unit(409.174) }}>
        <div className="relative flex-none" style={{ width: unit(409.162), height: unit(777.989), transform: "rotate(90deg)" }}>
          <Image src="/images/comunidad/borde-blanco-derecho-figma-790-6490.svg" alt="" fill sizes="55vw" className="object-fill" />
        </div>
      </div>

      {/* El efecto visual del Pico debe invadir el final de 01_Bienvenida.
          Al mostrarlo desde y=-34, su borde superior recto queda oculto y
          la curva azul es la que cruza la unión entre ambas secciones. */}
      <div className="absolute z-10" style={{ left: x(502.5), top: y(-34), width: unit(175.582), height: unit(230.5) }}>
        <Image src="/images/comunidad/pico-agua-figma-790-6490.svg" alt="" fill sizes="13vw" className="object-fill" />
      </div>
      <div className="absolute" style={{ left: x(226), top: y(326), width: unit(359), height: unit(434) }}>
        <Image src="/images/comunidad/kid-construccion.png" alt="Alumno de Champal caracterizado como constructor" fill sizes="25vw" className="object-fill" />
      </div>

      {BADGES.map((badge) => <DesktopBadge key={badge.key} badge={badge} />)}

      <div className="absolute rounded-full bg-[#df3035]" style={{ left: x(101), top: y(72), width: unit(51), height: unit(6) }} />
      <p className="absolute whitespace-nowrap font-sans font-normal" style={{ left: x(157), top: y(68), fontSize: unit(20), lineHeight: unit(20), color: "#003850" }}>
        ASÍ VIVIMOS CHAMPAL
      </p>
      <h2 className="absolute font-serif font-normal" style={{ left: x(101), top: y(107), width: unit(407), fontSize: unit(40), lineHeight: unit(52), color: "#003850" }}>
        Una comunidad comprometida con el desarrollo integral de sus alumnos
      </h2>
    </div>
  );
}

function ResponsiveArtwork() {
  return (
    <div className="relative isolate overflow-hidden lg:hidden">
      <Image src="/images/comunidad/estrellas-figma-790-6490.svg" alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute -left-[28%] -top-3 -z-10 h-[58%] w-[112%] sm:-left-[18%] sm:w-[84%]">
        <Image src="/images/comunidad/pleca-izquierda-figma-790-6490.svg" alt="" fill sizes="90vw" className="object-fill" />
      </div>
      <div className="absolute -left-[3%] top-0 -z-[5] h-[62%] w-[58%] opacity-90 sm:w-[46%]">
        <Image src="/images/comunidad/borde-blanco-izquierdo-figma-790-6490.svg" alt="" fill sizes="55vw" className="object-fill" />
      </div>
      <div className="absolute -right-[40%] top-[32%] -z-10 h-[38%] w-[130%] rotate-90 sm:-right-[28%] sm:w-[90%]">
        <Image src="/images/comunidad/pleca-derecha-figma-790-6490.svg" alt="" fill sizes="100vw" className="object-fill" />
      </div>
      <div className="absolute -right-[23%] top-[39%] -z-[5] h-[34%] w-[72%] rotate-90 opacity-90">
        <Image src="/images/comunidad/borde-blanco-derecho-figma-790-6490.svg" alt="" fill sizes="70vw" className="object-fill" />
      </div>
      <div className="absolute right-[4%] top-0 -z-[5] h-36 w-28 sm:h-48 sm:w-36">
        <Image src="/images/comunidad/pico-agua-figma-790-6490.svg" alt="" fill sizes="140px" className="object-fill" />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-16 pt-12 sm:px-10 sm:pb-20 sm:pt-16">
        <div className="max-w-[31rem]">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-10 shrink-0 rounded-full bg-[#df3035]" />
            <p className="font-sans text-sm font-normal tracking-[0.04em] text-[#003850] sm:text-base">ASÍ VIVIMOS CHAMPAL</p>
          </div>
          <h2 className="mt-4 font-serif text-[2rem] font-normal leading-[1.18] text-[#003850] sm:text-[2.55rem]">
            Una comunidad comprometida con el desarrollo integral de sus alumnos
          </h2>
        </div>
        <div className="relative -mt-1 flex justify-center sm:-mt-5 sm:justify-start sm:pl-12">
          <Image src="/images/comunidad/kid-construccion.png" alt="Alumno de Champal caracterizado como constructor" width={359} height={434} sizes="(max-width: 640px) 72vw, 330px" className="h-auto w-[72vw] max-w-[330px]" />
        </div>
        <div className="relative z-10 -mt-5 grid grid-cols-2 place-items-center gap-x-3 gap-y-5 sm:-mt-10 sm:gap-x-8 sm:gap-y-8">
          {BADGES.map((badge) => <ResponsiveBadge key={badge.key} badge={badge} />)}
        </div>
      </div>
    </div>
  );
}

export default function Comunidad() {
  return (
    <section className="relative -mt-px" style={{ background: SKY }}>
      <DesktopArtwork />
      <ResponsiveArtwork />
    </section>
  );
}
