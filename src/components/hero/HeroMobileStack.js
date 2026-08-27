import Image from "next/image";
import { HERO_BLUE_GRADIENT } from "./HeroBlueBand";

// Layout apilado para < lg (una franja 1440x720 quedaría demasiado baja en
// móvil): foto arriba, banda blanca con el título, banda azul con la marca
// de agua y el mensaje. Igual en los niveles vistos hasta ahora — solo
// cambian el contenido y, si aplica, el espejo de la foto.
export default function HeroMobileStack({
  imageSrc,
  imageAlt,
  title,
  watermarkText,
  subheadText,
  imageFlip = false,
  preload = true,
}) {
  return (
    <div className="flex flex-col lg:hidden">
      <div className="relative h-[360px] sm:h-[460px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          preload={preload}
          sizes="100vw"
          className="object-cover object-top"
          style={imageFlip ? { transform: "scaleX(-1)" } : undefined}
        />
      </div>
      <div className="flex items-center justify-center bg-white px-6 py-10">
        <h1 className="font-serif text-[56px] font-bold leading-none sm:text-[80px]" style={{ color: "#00055c" }}>
          {title}
        </h1>
      </div>
      <div
        className="relative flex items-center justify-center overflow-hidden px-6 py-14"
        style={{ backgroundImage: HERO_BLUE_GRADIENT }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 text-center font-serif text-[90px] font-bold leading-none text-[rgba(247,247,247,0.08)] sm:text-[140px]"
        >
          {watermarkText}
        </span>
        <p className="relative max-w-xl text-center font-serif text-2xl font-semibold leading-tight tracking-wide text-white sm:text-4xl">
          {subheadText}
        </p>
      </div>
    </div>
  );
}
