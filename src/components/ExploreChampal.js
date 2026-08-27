import Image from "next/image";

const CANVAS_W = 1440;
const CANVAS_H = 760;
const pctX = (px) => `${((px / CANVAS_W) * 100).toFixed(4)}%`;
const pctY = (px) => `${((px / CANVAS_H) * 100).toFixed(4)}%`;
const cqw = (px) => `${((px / CANVAS_W) * 100).toFixed(4)}cqw`;

const IMAGE_ROOT = "/images/conoce-champal";

const ISLANDS = [
  { name: "Campus", src: `${IMAGE_ROOT}/campus-exterior.png`, left: 96, top: 17, width: 300, height: 300 },
  { name: "Vida Champal", src: `${IMAGE_ROOT}/vida-champal.png`, left: 96, top: 336, width: 300, height: 300 },
  { name: "Convenios", src: `${IMAGE_ROOT}/convenios.png`, left: 1025, top: 36, width: 300, height: 300 },
  { name: "Certificaciones", src: `${IMAGE_ROOT}/certificaciones.png`, left: 1025, top: 396, width: 300, height: 300 },
  {
    name: "Actividades extracurriculares",
    src: `${IMAGE_ROOT}/actividades-extracurriculares.png`,
    left: 571,
    top: 472,
    width: 300,
    height: 300,
  },
];

const ROUTES = [
  {
    src: `${IMAGE_ROOT}/ruta-campus.svg`,
    left: 315.57,
    top: 228.41,
    boxWidth: 264.968,
    boxHeight: 92.04,
    width: 259.491,
    height: 62.742,
    transform: "rotate(-173.43deg)",
  },
  {
    src: `${IMAGE_ROOT}/ruta-convenios.svg`,
    left: 846.32,
    top: 235.31,
    boxWidth: 313.683,
    boxHeight: 107.778,
    width: 307.338,
    height: 73.07,
    transform: "rotate(-173.43deg)",
  },
  {
    src: `${IMAGE_ROOT}/ruta-vida-champal.svg`,
    left: 362.62,
    top: 369,
    boxWidth: 259.254,
    boxHeight: 123,
    width: 250.021,
    height: 94.998,
    transform: "rotate(173.43deg) scaleY(-1)",
  },
  {
    src: `${IMAGE_ROOT}/ruta-certificaciones.svg`,
    left: 777,
    top: 333.62,
    boxWidth: 296.91,
    boxHeight: 170.912,
    width: 282.803,
    height: 139.449,
    transform: "rotate(173.43deg) scaleY(-1)",
  },
  {
    src: `${IMAGE_ROOT}/ruta-actividades-extracurriculares.svg`,
    left: 502.99,
    top: 348.58,
    boxWidth: 191.495,
    boxHeight: 251.719,
    width: 165.761,
    height: 234.28,
    transform: "rotate(-173.43deg)",
  },
];

const SECTION_BACKGROUND =
  "radial-gradient(ellipse at 50.5% 50%, #49adff 7.3653%, #3c90dd 30.524%, #2f74bb 53.683%, #225799 76.841%, #153a77 100%)";

function EducationalBackground() {
  return (
    <Image
      src={`${IMAGE_ROOT}/fondo-educativo.png`}
      alt=""
      fill
      sizes="100vw"
      className="pointer-events-none object-cover opacity-10"
    />
  );
}

function IslandButton({ island, desktop = false }) {
  const style = desktop
    ? {
        left: pctX(island.left),
        top: pctY(island.top),
        width: cqw(island.width),
        height: cqw(island.height),
      }
    : undefined;

  return (
    <button
      type="button"
      aria-label={island.name}
      className={
        desktop
          ? "absolute appearance-none border-0 bg-transparent p-0"
          : "relative aspect-square w-full appearance-none border-0 bg-transparent p-0"
      }
      style={style}
    >
      <Image
        src={island.src}
        alt=""
        fill
        sizes={desktop ? "21vw" : "46vw"}
        className="pointer-events-none object-contain"
      />
    </button>
  );
}

function DesktopRoute({ route }) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: pctX(route.left),
        top: pctY(route.top),
        width: cqw(route.boxWidth),
        height: cqw(route.boxHeight),
      }}
    >
      <div
        className="relative flex-none"
        style={{
          width: cqw(route.width),
          height: cqw(route.height),
          transform: route.transform,
        }}
      >
        <Image src={route.src} alt="" fill sizes="22vw" className="pointer-events-none object-fill" />
      </div>
    </div>
  );
}

export default function ExploreChampal() {
  return (
    <section
      id="vida-estudiantil"
      data-section="conoce-champal"
      className="relative overflow-hidden"
      style={{ backgroundImage: SECTION_BACKGROUND }}
    >
      {/* Desktop: canvas exacto de Figma, limitado a 1440 × 760. */}
      <div
        className="relative mx-auto hidden aspect-[1440/760] w-full max-w-[1440px] lg:block"
        style={{ containerType: "inline-size" }}
      >
        <EducationalBackground />

        <div className="absolute inset-0 z-10">
          {ROUTES.map((route) => (
            <DesktopRoute key={route.src} route={route} />
          ))}
        </div>

        <div
          className="absolute z-20"
          style={{ left: pctX(524), top: pctY(116), width: cqw(393), height: cqw(322) }}
        >
          <Image
            src={`${IMAGE_ROOT}/campus-central.png`}
            alt="Campus central de Colegio Champal"
            fill
            sizes="27.3vw"
            className="object-contain"
          />
        </div>

        <div className="absolute inset-0 z-20">
          {ISLANDS.map((island) => (
            <IslandButton key={island.name} island={island} desktop />
          ))}
        </div>
      </div>

      {/* Mobile/tablet: adaptación básica, legible y sin superposiciones. */}
      <div className="relative mx-auto w-full max-w-3xl px-4 py-8 lg:hidden sm:px-8 sm:py-10">
        <EducationalBackground />

        <div className="relative z-20 mx-auto aspect-[393/322] w-[82%] max-w-[393px]">
          <Image
            src={`${IMAGE_ROOT}/campus-central.png`}
            alt="Campus central de Colegio Champal"
            fill
            sizes="82vw"
            className="object-contain"
          />
        </div>

        <div className="relative z-20 mt-4 grid grid-cols-2 gap-2 sm:gap-5">
          {ISLANDS.map((island) => (
            <IslandButton key={island.name} island={island} />
          ))}
        </div>
      </div>
    </section>
  );
}
