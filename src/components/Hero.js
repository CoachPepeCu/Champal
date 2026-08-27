"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// Réplica 1:1 del layout absoluto de Figma para el HERO de Home — "parte
// superior" del diseño completo (node 700:918 "HERO", canvas 1440x780,
// sacado con get_design_context — no a ojo desde el screenshot). La parte
// inferior ("¡Bienvenidos!" / G19) es la siguiente sección a construir.
//
// Técnica: aspect-[1440/780] + containerType:inline-size en desktop (>=lg),
// cada elemento posicionado en % (relativo al canvas) vía pctX/pctY y
// tipografía/tamaños en cqw (1cqw = 1% del ancho del contenedor) — misma
// receta que src/components/hero/heroMath.js usa para los Hero de nivel,
// con un canvas propio (1440x780) porque este Hero es contenido único de
// Home, no una plantilla compartida entre varias páginas. Pegar los valores
// RAW en px que devuelve get_design_context evita el paso manual de
// "px/1440*100" — ver memoria "champal-figma-sites-pixel-accuracy".
const CANVAS_W = 1440;
const CANVAS_H = 780;
const pctX = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}%`;
const pctY = (px) => `${((px / CANVAS_H) * 100).toFixed(3)}%`;
const cqw = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;

const CIELO_GRADIENT =
  "linear-gradient(86.273deg, rgb(10, 23, 48) 2.9386%, rgb(3, 81, 170) 46.937%, rgb(22, 74, 146) 98.593%)";

// Carrusel de fondo heredado de la versión anterior del Hero: hasta 4 fotos
// reales de vida escolar que se muestran con fade-in, una por una, SOLO en
// la capa de fondo del "cielo" — nunca se ve sobre la superficie blanca de
// abajo, esa la tapa la ola (Pleca_Soft3D) que va encima. El resto del
// contenido (encabezado, planetas, insignias, astronauta, "35 años") se
// queda fijo siempre arriba, igual que en la versión anterior el texto se
// quedaba fijo sobre las fotos.
//
// Un slot sin foto todavía (`src: null`) no rompe nada: el carrusel no
// dibuja nada en su turno (se ve el fondo espacial de siempre) y sigue
// avanzando igual — mismo comportamiento "sigue corriendo sin mostrar algo
// en pantalla" que tenía la versión anterior con los slots placeholder.
// Al terminar la vuelta NO vuelve a la primera foto: se queda fija en el
// fondo espacial (estrellas + planetas), que actúa como cuadro final.
//
// Apagado por pedido explícito del usuario mientras no haya fotos
// definitivas — cambiar a `true` para activarlo.
const CAROUSEL_ENABLED = false;
const SLIDE_DURATION_MS = 6000;
const HERO_PHOTOS = [
  { src: "/images/hero-1.jpg", alt: "Alumnos de Champal en el campus" },
  { src: "/images/hero-2.jpg", alt: "Vida en el campus de Champal" },
  { src: "/images/hero-3.jpg", alt: "Vida en el campus de Champal" },
  { src: null, alt: "" }, // aún no hay 4ª foto — cae en el fondo espacial y el carrusel sigue su curso
];

// Figma trae estas sombras como box-shadow sobre un div cuadrado, pero las
// imágenes son recortes con fondo transparente (planetas circulares,
// astronauta, íconos de insignia) — un box-shadow dibujaría un cuadro visible
// detrás del recorte, así que se convierten a filter:drop-shadow (sigue el
// alfa real de la imagen) con los mismos valores.
const PLANET_GLOW =
  "drop-shadow(0px 0px 22px rgba(64,224,184,0.18)) drop-shadow(0px 12px 20px rgba(3,10,28,0.46))";
const BADGE_ICON_SHADOW = "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))";
const ASTRONAUT_SHADOW = "drop-shadow(0px 12px 16px rgba(0,0,0,0.25))";
const LABEL_TEXT_SHADOW = "0px 1px 3px rgba(10,23,48,0.6), 0px 0px 10px rgba(61,214,249,0.8)";

const PLANETS = [
  {
    key: "cambridge",
    src: "/images/hero/planeta-cambridge.png",
    alt: "Certificación Cambridge",
    left: 690,
    top: 115,
    w: 128,
    h: 127,
    label: "CAMBRIDGE",
    labelLeft: 693,
    labelTop: 166,
    labelSize: 20,
    labelTracking: 2,
  },
  {
    key: "ihs",
    src: "/images/hero/planeta-ihs.png",
    alt: "",
    left: 904,
    top: 200,
    w: 142,
    h: 143,
    label: "INTERNATIONAL HIGH SCHOOL",
    labelLeft: 809,
    labelTop: 250,
    labelSize: 20,
    labelTracking: 2,
  },
  {
    key: "rayados",
    src: "/images/hero/planeta-rayados.png",
    alt: "Alianza Rayados",
    left: 1132,
    top: 95,
    w: 147,
    h: 147,
    label: "RAYADOS",
    labelLeft: 1147,
    labelTop: 154,
    labelSize: 24,
    labelTracking: 2.4,
  },
  {
    key: "craft",
    src: "/images/hero/planeta-craft.png",
    alt: "Programa CRAFT",
    left: 1115,
    top: 307,
    w: 145,
    h: 145,
    label: "CRAFT",
    labelLeft: 1147,
    labelTop: 360,
    labelSize: 24,
    labelTracking: 2.4,
  },
];

const BADGE_W = 236;
const BADGE_H = 51;

const BADGES = [
  {
    key: "excelencia",
    icon: "/images/hero/insignia-diez.png",
    iconLeft: 153,
    iconTop: 566,
    iconSize: 60,
    plecaLeft: 156,
    plecaTop: 571,
    label: "EXCELENCIA",
    labelLeft: 208,
    labelTop: 579,
    accent: "académica",
    accentLeft: 208,
    accentTop: 598,
  },
  {
    key: "vision",
    icon: "/images/hero/insignia-vision.png",
    iconLeft: 436,
    iconTop: 566,
    iconSize: 60,
    plecaLeft: 436,
    plecaTop: 571,
    label: "VISIÓN",
    labelLeft: 492,
    labelTop: 579,
    accent: "internacional",
    accentLeft: 492,
    accentTop: 598,
  },
  {
    key: "acompanamiento",
    icon: "/images/hero/insignia-acompana.png",
    iconLeft: 156,
    iconTop: 647,
    iconSize: 50,
    plecaLeft: 156,
    plecaTop: 652,
    label: "ACOMPAÑAMIENTO",
    labelLeft: 208,
    labelTop: 660,
    accent: "cercano",
    accentLeft: 208,
    accentTop: 679,
  },
  {
    key: "formacion",
    icon: "/images/hero/insignia-valor.png",
    iconLeft: 428,
    iconTop: 651,
    iconSize: 60,
    plecaLeft: 436,
    plecaTop: 652,
    label: "FORMACIÓN HUMANA",
    labelLeft: 488,
    labelTop: 660,
    accent: "con valores",
    accentLeft: 488,
    accentTop: 679,
  },
];

// Índice de foto activa (0..HERO_PHOTOS.length-1), o `null` en reposo (sin
// foto — fondo espacial fijo). Arranca en reposo si el carrusel está
// apagado, para que el resultado visual sea idéntico al fondo estático de
// siempre mientras `CAROUSEL_ENABLED` sea `false`.
function useHeroCarouselSlide() {
  const [slide, setSlide] = useState(CAROUSEL_ENABLED ? 0 : null);

  useEffect(() => {
    if (!CAROUSEL_ENABLED) return undefined;
    const id = setInterval(() => {
      setSlide((current) => {
        if (current === null) return current; // ya llegó al reposo — no reinicia el ciclo
        const next = current + 1;
        return next >= HERO_PHOTOS.length ? null : next;
      });
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  return slide;
}

// Fondo del "cielo": degradado fijo + foto del carrusel encima (si hay) con
// fade-in, más un velo del mismo degradado sobre la foto para que el
// encabezado siga legible — misma idea que la máscara editorial de la
// versión anterior del Hero.
function HeroSkyBackground({ photo, slideKey }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ backgroundImage: CIELO_GRADIENT }} />
      <AnimatePresence>
        {photo?.src && (
          <motion.div
            key={slideKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 opacity-70" style={{ backgroundImage: CIELO_GRADIENT }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  const slide = useHeroCarouselSlide();
  const photo = slide !== null ? HERO_PHOTOS[slide] : null;

  return (
    <section id="top" data-nav-theme="dark" className="relative overflow-hidden bg-[#f7f5f0]">
      {/* ---------- Desktop (>=lg): réplica exacta del canvas 1440x780 ---------- */}
      <div className="relative hidden aspect-[1440/780] w-full lg:block" style={{ containerType: "inline-size" }}>
        {/* Cielo (+ carrusel de fondo, ver HeroSkyBackground) */}
        <HeroSkyBackground photo={photo} slideKey={slide} />

        {/* Plano 01 · Estrellas y atmósfera */}
        <Image src="/images/hero/estrellas-atmosfera.svg" alt="" fill preload sizes="100vw" className="object-cover" />

        {/* Pleca_Soft3D — ola blanca que separa el cielo del primer plano */}
        <div className="absolute" style={{ left: 0, top: pctY(419), width: "100%", height: cqw(342.673) }}>
          <div className="absolute inset-[-14.88%_-2.5%_-7.88%_-2.5%]">
            <Image src="/images/hero/bisel-fondo.svg" alt="" fill preload sizes="100vw" className="object-contain" />
          </div>
        </div>
        <div className="absolute" style={{ left: 0, top: pctY(447), width: "100%", height: cqw(342.673) }}>
          <div className="absolute inset-[-0.29%_0]">
            <Image src="/images/hero/superficie-blanca.svg" alt="" fill preload sizes="100vw" className="object-contain" />
          </div>
        </div>
        <div className="absolute" style={{ left: pctX(269), top: pctY(383), width: cqw(116), height: cqw(111) }}>
          <Image src="/images/hero/planeta-mini.png" alt="" fill preload sizes="8vw" className="object-contain" />
        </div>

        {/* Papel rasgado + encabezado */}
        <div className="absolute" style={{ left: pctX(172), top: pctY(248), width: cqw(553), height: cqw(79) }}>
          <Image
            src="/images/hero/papel-rasgado.png"
            alt=""
            fill
            preload
            sizes="38vw"
            className="object-cover pointer-events-none"
          />
        </div>

        <p
          className="absolute font-serif font-bold leading-none whitespace-nowrap text-white"
          style={{ left: pctX(104), top: pctY(127), fontSize: cqw(36) }}
        >
          Formamos seres humanos
        </p>
        <p
          className="absolute font-serif font-bold leading-none whitespace-nowrap"
          style={{ left: pctX(140), top: pctY(173), fontSize: cqw(48), color: "#fdcb2e" }}
        >
          felices<span className="text-white">,</span> exitosos
        </p>
        <p
          className="absolute font-serif font-bold leading-none whitespace-nowrap text-white"
          style={{ left: pctX(523), top: pctY(186), fontSize: cqw(36) }}
        >
          y con
        </p>
        <p
          className="absolute font-serif font-bold leading-none whitespace-nowrap"
          style={{ left: pctX(201), top: pctY(258), fontSize: cqw(48), color: "#0a1730" }}
        >
          gran calidad humana.
        </p>

        {/* Plano 02 · Planetas + labels */}
        {PLANETS.map((p) => (
          <div key={p.key}>
            <div className="absolute" style={{ left: pctX(p.left), top: pctY(p.top), width: cqw(p.w), height: cqw(p.h) }}>
              <Image src={p.src} alt={p.alt} fill preload sizes="10vw" className="object-contain" style={{ filter: PLANET_GLOW }} />
            </div>
            <p
              className="absolute font-sans font-semibold whitespace-nowrap text-white"
              style={{
                left: pctX(p.labelLeft),
                top: pctY(p.labelTop),
                fontSize: cqw(p.labelSize),
                letterSpacing: cqw(p.labelTracking),
                textShadow: LABEL_TEXT_SHADOW,
              }}
            >
              {p.label}
            </p>
          </div>
        ))}

        {/* Plano 03 · Primer plano — astronauta */}
        <div className="absolute" style={{ left: pctX(682), top: pctY(337), width: cqw(327), height: cqw(440) }}>
          <Image
            src="/images/hero/nina-astronauta.png"
            alt="Alumna de Champal vestida de astronauta"
            fill
            preload
            sizes="23vw"
            className="object-contain"
            style={{ filter: ASTRONAUT_SHADOW }}
          />
        </div>

        {/* Insignia "35 años" + círculo punteado + flecha */}
        <div className="absolute opacity-45" style={{ left: pctX(1116), top: pctY(532), width: cqw(235), height: cqw(235) }}>
          <Image src="/images/hero/circulo-subraya.png" alt="" fill preload sizes="16vw" className="object-contain" />
        </div>
        {/* El export plano de Figma para este logo venía con fondo sólido
            opaco (mismo tono que el bg de la página), así que tapaba casi
            todo el círculo punteado de atrás — se usa el SVG real (mismo
            logo, con transparencia de verdad) que ya vive en el Footer.
            Tamaño reducido (145 en vez de los 231 "de caja" de Figma) y
            centrado sobre el mismo círculo (centro 1233.5,649.5): a ese
            tamaño de caja el logo casi tocaba el aro punteado — el usuario
            pidió que quede claramente contenido adentro, con aire alrededor. */}
        <div className="absolute" style={{ left: pctX(1161), top: pctY(577), width: cqw(145), height: cqw(145) }}>
          <Image src="/images/footer-champal-35.svg" alt="35 años de Colegio Champal" fill preload sizes="10vw" className="object-contain" />
        </div>
        {/* Flecha punteada, dibujada a mano en SVG (ver nota más abajo).
            Nace del borde superior-derecho del "techo" azul del camión —
            medido en vivo con getBoundingClientRect, no a ojo — y viaja en
            línea recta con la MISMA pendiente que el propio camión
            (rotate(23deg) en su capa) hasta tocar el aro punteado. Mismo
            azul y misma composición de opacidad que el aro (wrapper
            opacity-45 + rgb(11,49,255), color tomado con sharp del propio
            circulo-subraya.png) para que ambos se vean del mismo tono. */}
        <div className="absolute opacity-45" style={{ left: pctX(1310), top: pctY(680), width: cqw(90), height: cqw(60) }}>
          <svg className="absolute inset-0" viewBox="0 0 90 60" fill="none">
            <path d="M69.6 47.5 L32 31.6" stroke="rgb(11,49,255)" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
            <path d="M32.5 27.4 L25.4 28.75 L29.4 34.8" stroke="rgb(11,49,255)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Insignias de valor */}
        {BADGES.map((b) => (
          <div key={b.key}>
            <div className="absolute" style={{ left: pctX(b.plecaLeft), top: pctY(b.plecaTop), width: cqw(BADGE_W), height: cqw(BADGE_H) }}>
              <div className="absolute inset-[-9.8%_-3.81%_-25.49%_-3.81%]">
                <Image src="/images/hero/pleca-insignia.svg" alt="" fill preload sizes="17vw" className="object-contain" />
              </div>
            </div>
            <p
              className="absolute font-sans font-semibold whitespace-nowrap text-black"
              style={{ left: pctX(b.labelLeft), top: pctY(b.labelTop), fontSize: cqw(14), letterSpacing: cqw(1.4) }}
            >
              {b.label}
            </p>
            <p
              className="absolute font-sans font-bold whitespace-nowrap"
              style={{ left: pctX(b.accentLeft), top: pctY(b.accentTop), fontSize: cqw(14), letterSpacing: cqw(1.4), color: "#000c96" }}
            >
              {b.accent}
            </p>
            <div className="absolute" style={{ left: pctX(b.iconLeft), top: pctY(b.iconTop), width: cqw(b.iconSize), height: cqw(b.iconSize) }}>
              <Image src={b.icon} alt="" fill preload sizes="5vw" className="object-contain" style={{ filter: BADGE_ICON_SHADOW }} />
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Mobile / tablet (<lg): reinterpretación apilada ----------
          Figma no trae un frame mobile para este Hero — se reconstruye el
          mismo contenido (encabezado, planetas, astronauta, insignias, "35
          años") en un layout de flujo normal en vez de intentar forzar el
          canvas absoluto 1440x780 a una pantalla angosta. */}
      <div className="relative lg:hidden">
        <HeroSkyBackground photo={photo} slideKey={slide} />
        <Image src="/images/hero/estrellas-atmosfera.svg" alt="" fill preload sizes="100vw" className="object-cover" />

        <div className="relative px-6 pt-24 pb-14 sm:px-10">
          <h1 className="font-serif font-bold leading-tight text-3xl sm:text-4xl text-white">
            Formamos seres humanos{" "}
            <span style={{ color: "#fdcb2e" }}>
              felices<span className="text-white">,</span> exitosos
            </span>{" "}
            y con
          </h1>
          <span
            className="mt-3 inline-block rounded-sm px-3 py-1.5 font-serif font-bold text-2xl sm:text-3xl"
            style={{ backgroundColor: "#fdcb2e", color: "#0a1730" }}
          >
            gran calidad humana.
          </span>

          <div className="mt-8 flex items-center justify-center gap-4">
            {PLANETS.map((p) => (
              <Image
                key={p.key}
                src={p.src}
                alt={p.alt}
                width={64}
                height={64}
                className="h-10 w-10 sm:h-14 sm:w-14 object-contain"
                style={{ filter: PLANET_GLOW }}
              />
            ))}
          </div>

          <div className="relative mt-2 flex justify-center">
            <Image
              src="/images/hero/nina-astronauta.png"
              alt="Alumna de Champal vestida de astronauta"
              width={327}
              height={440}
              preload
              sizes="60vw"
              className="h-[280px] w-auto sm:h-[340px]"
              style={{ filter: ASTRONAUT_SHADOW }}
            />
            <div className="absolute -bottom-4 -right-3 h-24 w-24 sm:h-28 sm:w-28">
              <Image src="/images/hero/circulo-subraya.png" alt="" fill className="object-contain opacity-80" />
              <Image
                src="/images/footer-champal-35.svg"
                alt="35 años de Colegio Champal"
                fill
                className="object-contain p-6"
              />
              <div className="absolute -bottom-3 -left-9 h-6 w-[72px]">
                <Image
                  src="/images/hero/arrow.png"
                  alt=""
                  fill
                  className="object-contain opacity-80"
                  style={{ transform: "rotate(-155.93deg)" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {BADGES.map((b) => (
              <div
                key={b.key}
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.18)]"
              >
                <Image src={b.icon} alt="" width={60} height={60} className="h-8 w-8 shrink-0 object-contain" />
                <div className="leading-tight">
                  <p className="text-[10px] font-semibold tracking-wide text-black">{b.label}</p>
                  <p className="text-[10px] font-bold" style={{ color: "#000c96" }}>
                    {b.accent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
