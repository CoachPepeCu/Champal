"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Marco compartido "Bloque_Desarrollo" (fondo cielo + nubes difuminadas) que
// envuelve las tres secciones de "Flujo_Desarrollo" en Figma: 05_Ingles,
// 06_Seguros y 07_Estimulación — todas dentro de la misma tarjeta blanca,
// una continuación de la otra.
//
// Las nubes son los mismos SVG exportados de Figma (elipses con blur nativo),
// posicionadas en % relativas al frame original de 1440x2411 para que
// escalen igual sin importar el alto real del contenido.
export default function PreKinderDesarrollo() {
  return (
    <section
      className="relative overflow-hidden py-10 lg:flex lg:min-h-screen lg:items-center lg:py-8"
      style={{
        background: "linear-gradient(175deg, #cfe3f5 0%, #a9c9e8 45%, #86b2d8 100%)",
      }}
    >
      <div className="pointer-events-none absolute -right-[14%] top-[16%] aspect-[1340/890] w-[93%]">
        <Image src="/images/prekinder/nube-central.svg" alt="" fill className="object-contain" />
      </div>
      <div className="pointer-events-none absolute -left-[9%] -top-[9%] aspect-[1330/790] w-[62%]">
        <Image src="/images/prekinder/nube-superior-top.svg" alt="" fill className="object-contain" />
      </div>
      <div className="pointer-events-none absolute -left-[18%] bottom-[-6%] aspect-[1330/830] w-[65%]">
        <Image src="/images/prekinder/nube-superior-bottom.svg" alt="" fill className="object-contain" />
      </div>

      <div className="relative mx-auto w-full max-w-[1230px] overflow-hidden rounded-[32px] bg-white px-6 py-8 shadow-[0px_20px_50px_-12px_rgba(10,37,64,0.28)] sm:px-10 sm:py-10 lg:px-[25px] lg:py-10">
        <Ingles />
        <Seguros />
        <Estimulacion />
      </div>
    </section>
  );
}

// Carrusel vertical: las 4 insignias comparten UN solo carril — el mismo
// punto de salida (abajo) y el mismo punto de llegada/estallido (arriba,
// donde está iAvión en el diseño estático). No son 4 posiciones fijas
// distintas; es un solo lugar por el que van pasando una tras otra,
// escalonadas en el tiempo.
const HOME = { top: -10.7, left: 68.9, width: 31.4, height: 31.8 };

// Duración total del ciclo y separación entre insignias — recalculada
// junto con la velocidad de subida (ver floatAnimation) para mantener los
// mismos ~20-25px de separación real ahora que van más despacio.
const CYCLE_DURATION = 8.5;
const STAGGER = 2.12;

const BADGES = [
  { key: "avion", src: "/images/prekinder/desarrollo-badge-avion-v2.png", delay: 0 },
  { key: "hormiga", src: "/images/prekinder/desarrollo-badge-hormiga-v2.png", delay: STAGGER },
  { key: "apple", src: "/images/prekinder/desarrollo-badge-apple-v2.png", delay: STAGGER * 2 },
  { key: "lagarto", src: "/images/prekinder/desarrollo-badge-lagarto-v2.png", delay: STAGGER * 3 },
];

// Ciclo de cada insignia: aparece con fade in en el borde inferior del
// marco, sube columpiándose (rotate oscilante) y al llegar arriba "truena
// como burbuja de jabón" antes de reiniciar.
//
// La subida (y, opacity, scale) usa solo 5 puntos clave con ease "linear"
// en el tramo de subida — antes tenía 9 puntos con easeInOut en cada
// tramo, y cada punto intermedio frenaba y volvía a acelerar, dando ese
// efecto de "interrupción". Con menos puntos y easing lineal en el tramo
// largo, la subida es un solo movimiento continuo a velocidad constante.
// El columpio (rotate) sí necesita varios puntos para oscilar, así que
// mantiene su propio calendario independiente vía transition por-propiedad.
const RISE_TIMES = [0, 0.05, 0.85, 0.92, 1];
const SWING_TIMES = [0, 0.05, 0.19, 0.33, 0.47, 0.61, 0.75, 0.85, 1];

const floatAnimation = {
  y: [600, 600, 0, -10, 600],
  opacity: [0, 1, 1, 0, 0],
  scale: [0.75, 0.85, 1, 1.8, 1.8],
  rotate: [0, -11, 9, -9, 7, -6, 3, 0, 0],
};

function floatTransition(delay) {
  const base = { duration: CYCLE_DURATION, repeat: Infinity, delay };
  return {
    y: { ...base, times: RISE_TIMES, ease: ["linear", "linear", "easeOut", "linear"] },
    opacity: { ...base, times: RISE_TIMES, ease: "linear" },
    scale: { ...base, times: RISE_TIMES, ease: ["easeOut", "linear", "easeOut", "linear"] },
    rotate: { ...base, times: SWING_TIMES, ease: "easeInOut" },
  };
}

function FloatingBadge({ badge }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute drop-shadow-[0_8px_16px_rgba(10,37,64,0.25)]"
      style={{
        top: `${HOME.top}%`,
        left: `${HOME.left}%`,
        width: `${HOME.width}%`,
        height: `${HOME.height}%`,
      }}
      animate={floatAnimation}
      transition={floatTransition(badge.delay)}
    >
      <Image src={badge.src} alt="" fill sizes="180px" className="object-contain" />
    </motion.div>
  );
}

// Mosaico que revela la foto — cuadritos que se desvanecen en orden
// escalonado hasta formar la imagen completa.
const MOSAIC_COLS = 8;
const MOSAIC_ROWS = 6;
const mosaicContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018, delayChildren: 0.1 } },
};
const mosaicTile = {
  hidden: { opacity: 1 },
  show: { opacity: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function ImageMosaicReveal() {
  const tiles = Array.from({ length: MOSAIC_COLS * MOSAIC_ROWS });
  return (
    <motion.div
      variants={mosaicContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0 }}
      className="pointer-events-none absolute inset-0 z-10 grid rounded-[32px] overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${MOSAIC_COLS}, 1fr)`, gridTemplateRows: `repeat(${MOSAIC_ROWS}, 1fr)` }}
    >
      {tiles.map((_, i) => (
        <motion.div key={i} variants={mosaicTile} style={{ backgroundColor: "#dfeaf7" }} />
      ))}
    </motion.div>
  );
}

function Ingles() {
  return (
    <div id="ingles" className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-[100px]">
      <div className="flex w-full max-w-[500px] flex-col items-start gap-4 lg:shrink-0 lg:gap-4">
        <motion.div
          className="flex items-center gap-3.5"
          initial={{ x: 70, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: "#aa181f" }} />
          <p className="text-[13px] font-semibold uppercase tracking-[0.18px] sm:text-[15px]" style={{ color: "#172d58" }}>
            Inglés desde los primeros sonidos
          </p>
        </motion.div>

        {/* El título no se mueve de lugar — se revela de arriba hacia abajo
            con un recorte (clip-path) animado, como una cortina que se
            despliega, para que las letras "aparezcan" en su sitio. */}
        <motion.h2
          className="font-serif text-3xl font-semibold leading-tight tracking-[0.44px] text-black sm:text-4xl lg:text-[44px] lg:leading-[55px]"
          initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.4 }}
          whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.15 }}
        >
          Aprendemos inglés con todos los sentidos
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
          className="soft-scrollbar max-h-[150px] w-full overflow-y-auto pr-3 sm:max-h-[170px] lg:max-h-[210px]"
        >
          <p className="text-lg leading-relaxed tracking-[0.24px] sm:text-xl lg:text-[22px] lg:leading-[33px]" style={{ color: "#494949" }}>
            A través de la metodología de Jolly Phonics utilizamos un enfoque divertido y muy efectivo para
            iniciar a los niños en el aprendizaje del idioma inglés. Acompañamos a los pequeños a descubrir
            los sonidos del idioma a través de historias, canciones, gestos físicos y recursos visuales. Esta
            combinación hace que la experiencia sea sumamente dinámica e incluyente, permitiendo que cada
            niño aprenda a su propio ritmo mientras conecta el oído, la vista y el movimiento de una manera
            completamente natural.
          </p>
        </motion.div>
      </div>

      <div className="relative h-[280px] w-full max-w-[560px] shrink-0 rounded-[32px] shadow-[0px_18px_40px_-8px_rgba(10,37,64,0.18)] sm:h-[380px] lg:h-[520px] lg:w-[560px]">
        <Image
          src="/images/prekinder/ingles-foto.webp"
          alt="Niña explorando tarjetas de Jolly Phonics"
          fill
          sizes="(max-width: 1024px) 100vw, 560px"
          className="rounded-[32px] object-cover object-bottom"
        />
        <ImageMosaicReveal />
        {BADGES.map((badge) => (
          <FloatingBadge key={badge.key} badge={badge} />
        ))}
      </div>
    </div>
  );
}

// La foto entra como una esfera desde la derecha, rebota y al asentarse en
// su lugar toma su forma final (cuadrada, esquinas redondeadas). El rebote
// es un spring real (no una curva tween) para que se sienta físico.
function SeguridadFoto() {
  return (
    <motion.div
      className="relative h-[280px] w-full max-w-[560px] shrink-0 overflow-hidden shadow-[0px_18px_40px_-8px_rgba(10,37,64,0.18)] sm:h-[380px] lg:h-[520px] lg:w-[560px]"
      initial={{ x: 340, opacity: 0, borderRadius: "50%" }}
      whileInView={{ x: 0, opacity: 1, borderRadius: "32px" }}
      viewport={{ once: true, amount: 0 }}
      transition={{
        x: { type: "spring", duration: 1, bounce: 0.42 },
        borderRadius: { duration: 0.65, ease: "easeOut" },
        opacity: { duration: 0.25, ease: "easeOut" },
      }}
    >
      <Image
        src="/images/prekinder/seguros-foto.webp"
        alt="Alumnos de Pre-Kinder con playera de la Selección Mexicana"
        fill
        sizes="(max-width: 1024px) 100vw, 560px"
        className="object-cover"
      />
    </motion.div>
  );
}

function Seguros() {
  return (
    <div id="seguros" className="mt-14 flex flex-col items-center gap-8 lg:mt-20 lg:flex-row lg:items-center lg:justify-center lg:gap-[100px]">
      <SeguridadFoto />

      <div className="flex w-full max-w-[500px] flex-col items-start gap-4">
        <motion.div
          className="flex items-center gap-3.5"
          initial={{ x: 70, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: "#aa181f" }} />
          <p className="text-[13px] font-semibold uppercase tracking-[0.18px] sm:text-[15px]" style={{ color: "#172d58" }}>
            Habilidades afectivo sociales
          </p>
        </motion.div>

        <motion.h2
          className="font-serif text-3xl font-semibold leading-tight tracking-[0.44px] text-black sm:text-4xl lg:text-[36px] lg:leading-[42px]"
          initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.4 }}
          whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.15 }}
        >
          Crecemos seguros y felices
        </motion.h2>

        <motion.p
          className="text-lg leading-relaxed tracking-[0.24px] sm:text-xl lg:text-[24px] lg:leading-[35px]"
          style={{ color: "#494949" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
        >
          Desde su llegada al colegio, acompañamos a los niños para que reconozcan y expresen sus emociones,
          se relacionen con sus compañeros y construyan autonomía con la guía cercana de sus misses.
        </motion.p>

        <motion.p
          className="text-lg leading-relaxed tracking-[0.24px] sm:text-xl lg:text-[24px] lg:leading-[35px]"
          style={{ color: "#494949" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          En un ambiente de sana convivencia, fortalecen valores y lenguaje, aprendiendo poco a poco a
          regular lo que sienten y a desenvolverse con mayor confianza.
        </motion.p>
      </div>
    </div>
  );
}

// Bento de 5 fotos: entran una a una (staggerChildren), cada una arranca
// invisible y diminuta, crece rápido hasta 150% y rebota (dos pasadas de
// sobre/sub-escala) antes de asentarse en su tamaño real.
const BENTO_PHOTOS = [
  { key: "motricidad", src: "/images/prekinder/estimulacion-motricidad.webp", alt: "Alumno de Pre-Kinder jugando con un aro", big: true },
  { key: "lenguaje", src: "/images/prekinder/estimulacion-lenguaje.webp", alt: "Miss trabajando lenguaje con alumnos de Pre-Kinder" },
  { key: "desarrollo", src: "/images/prekinder/estimulacion-desarrollo.webp", alt: "Alumnos de Pre-Kinder jugando con bloques" },
  { key: "social", src: "/images/prekinder/estimulacion-social.webp", alt: "Grupo de Pre-Kinder sentado en círculo" },
  { key: "cognicion", src: "/images/prekinder/estimulacion-cognicion.webp", alt: "Alumna de Pre-Kinder jugando con bloques de construcción" },
];

const bentoContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const bentoItem = {
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1,
    scale: [0, 1.5, 0.92, 1.04, 1],
    transition: { duration: 0.7, times: [0, 0.45, 0.7, 0.85, 1], ease: "easeOut" },
  },
};

function BentoPhoto({ photo }) {
  return (
    <motion.div
      variants={bentoItem}
      className={
        photo.big
          ? "relative aspect-square w-full overflow-hidden rounded-[28px] border border-[#d1d1d1] sm:h-[360px] sm:aspect-auto lg:h-[560px] lg:w-[490px]"
          : "relative aspect-square overflow-hidden rounded-[28px] border-[3px] border-[#d1d1d1] lg:h-full lg:aspect-auto"
      }
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={photo.big ? "(max-width: 1024px) 100vw, 490px" : "(max-width: 1024px) 50vw, 354px"}
        className="object-cover"
      />
    </motion.div>
  );
}

function Estimulacion() {
  const [big, ...small] = BENTO_PHOTOS;
  return (
    <div id="estimulacion" className="mt-14 flex flex-col items-center gap-8 lg:mt-20">
      <div className="flex w-full max-w-[951px] flex-col items-start gap-4">
        <motion.div
          className="flex items-center gap-3.5"
          initial={{ x: 70, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: "#aa181f" }} />
          <p className="text-[13px] font-semibold uppercase tracking-[0.18px] sm:text-[15px]" style={{ color: "#172d58" }}>
            Estimulación Integral
          </p>
        </motion.div>

        <motion.h2
          className="font-serif text-3xl font-semibold leading-tight tracking-[0.44px] text-black sm:text-4xl lg:text-[36px] lg:leading-[42px]"
          initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.4 }}
          whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.15 }}
        >
          Cada experiencia despierta una nueva forma de aprender
        </motion.h2>

        <motion.p
          className="text-lg leading-relaxed tracking-[0.24px] sm:text-xl lg:text-[24px] lg:leading-[35px]"
          style={{ color: "#494949" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
        >
          Con actividades acordes a cada etapa y logro, estimulamos el desarrollo motriz, cognitivo, emocional
          y social. Así, cada niño explora, disfruta el movimiento y fortalece sus capacidades con seguridad.
        </motion.p>
      </div>

      <motion.div
        variants={bentoContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
        className="flex w-full max-w-[1230px] flex-col gap-3 sm:gap-4 lg:flex-row lg:gap-[10px]"
      >
        <BentoPhoto photo={big} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:h-[544px] lg:w-[724px] lg:gap-4">
          {small.map((photo) => (
            <BentoPhoto key={photo.key} photo={photo} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
