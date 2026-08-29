"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const fredokaOne = localFont({
  src: "../fonts/fredoka-one-regular.ttf",
  weight: "400",
  style: "normal",
});

const BASE = "/images/conoce-champal/certificaciones";
const CANVAS_W = 1440;
const CANVAS_H = 760;
const x = (value) => `${(value / CANVAS_W) * 100}%`;
const y = (value) => `${(value / CANVAS_H) * 100}%`;
const cw = (value) => `${(value / CANVAS_W) * 100}cqw`;
const EASE_OUT = [0.22, 1, 0.36, 1];
const CATEGORY_STARTS = [1.65, 3.8, 5.62, 7.63];

const categories = [
  {
    number: "1",
    title: "Innovación y aprendizaje",
    color: "#efcb41",
    logos: [
      { src: "apple-teacher.png", alt: "Apple Teacher" },
      { src: "eduqatia.png", alt: "Eduqatia" },
      { src: "google-workspace.png", alt: "Google Workspace" },
      { src: "lego-education.png", alt: "LEGO Education" },
      { src: "progrentis.png", alt: "Progrentis" },
      { src: "educando-en-red.png", alt: "Educando en Red" },
      { src: "great-place-to-study.png", alt: "Great Place to Study" },
      { src: "micole.png", alt: "MiCole" },
    ],
    positions: [128, 231, 334, 437, 540, 643, 746, 849],
  },
  {
    number: "2",
    title: "Proyección académica y global",
    color: "#729ed9",
    logos: [
      { src: "alianza-francesa.png", alt: "Alianza Francesa" },
      { src: "key.png", alt: "Key" },
      { src: "cambridge.png", alt: "University of Cambridge" },
      { src: "unesco.png", alt: "UNESCO" },
      { src: "universidad-valladolid.png", alt: "Universidad de Valladolid" },
    ],
    positions: [198, 316, 434, 552, 670],
  },
  {
    number: "3",
    title: "Valores, bienestar y comunidad",
    color: "#577ca1",
    logos: [
      { src: "ashoka.png", alt: "Ashoka" },
      { src: "caritas-tabasco.png", alt: "Cáritas de Tabasco" },
      { src: "charter-for-compassion.png", alt: "Charter for Compassion" },
      { src: "ejercito-salvacion.png", alt: "Ejército de Salvación" },
      { src: "hagamoslo-bien.png", alt: "Hagámoslo Bien" },
      { src: "objetivos-desarrollo-sostenible.png", alt: "Objetivos de Desarrollo Sostenible" },
      {
        src: "olweus.png",
        alt: "Olweus Bullying Prevention Program",
        imageSize: 48,
        imageTop: 10,
        caption: "BULLYNG PREVENTION PROGRAM",
      },
    ],
    positions: [120, 241, 362, 483, 604, 725, 846],
  },
  {
    number: "4",
    title: "Deporte y desarrollo personal",
    color: "#1f4784",
    logos: [
      { src: "rayados.png", alt: "Rayados" },
      { src: "victor-estrada-taekwondo.png", alt: "Asociación Víctor Estrada Taekwondo" },
    ],
    positions: [375, 493],
  },
];

function LogoImage({ logo, sizes }) {
  return (
    <Image
      src={`${BASE}/${logo.src}`}
      alt={logo.alt}
      fill
      sizes={sizes}
      className="object-contain"
    />
  );
}

function DesktopCategory({ category, index, play, reduceMotion }) {
  const start = CATEGORY_STARTS[index];
  const visible = play || reduceMotion;

  return (
    <motion.div
      className="absolute left-0 w-full rounded-r-[12px] drop-shadow-[0_4px_2px_rgba(0,0,0,.25)]"
      style={{
        top: cw(index * 156),
        height: cw(110),
        backgroundColor: category.color,
        transformOrigin: "left center",
        perspective: 900,
      }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scaleX: visible ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.52, delay: reduceMotion ? 0 : start, ease: EASE_OUT }}
    >
      <div
        className="absolute left-0 rounded-t-[6px]"
        style={{ top: cw(-24), width: cw(291), height: cw(28), backgroundColor: category.color }}
      />
      <motion.h3
        className="absolute left-0 top-0 z-10 whitespace-nowrap font-display font-semibold leading-none text-white [text-shadow:0_4px_4px_rgba(0,0,0,.25)]"
        style={{ transform: `translate(${cw(8)}, ${cw(-25)})`, fontSize: cw(20) }}
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : start + 0.12, ease: EASE_OUT }}
      >
        {category.title}
      </motion.h3>
      <motion.span
        aria-hidden="true"
        className={`absolute font-normal leading-none text-[#efefef] [text-shadow:0_4px_4px_rgba(0,0,0,.18)] ${fredokaOne.className}`}
        style={{ left: cw(10), top: cw(-2), fontSize: cw(120), transformOrigin: "center center" }}
        initial={false}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 1.5 }}
        transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : start + 0.3, ease: EASE_OUT }}
      >
        {category.number}
      </motion.span>

      {category.logos.map((logo, logoIndex) => {
        const imageSize = logo.imageSize ?? 68;
        return (
          <motion.div
            key={logo.src}
            className="absolute overflow-hidden rounded-[11px] border border-white bg-[#fafafa] shadow-[inset_0_4px_4px_rgba(0,0,0,.25),0_4px_4px_rgba(0,0,0,.25)]"
            style={{
              left: cw(category.positions[logoIndex]),
              top: cw(11),
              width: cw(88),
              height: cw(88),
              transformOrigin: "left center",
              backfaceVisibility: "hidden",
            }}
            initial={false}
            animate={{ opacity: visible ? 1 : 0, rotateY: visible ? 0 : 90 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : start + 0.65 + logoIndex * 0.11, ease: EASE_OUT }}
          >
            <div
              className="absolute"
              style={{
                left: cw((88 - imageSize) / 2),
                top: cw(logo.imageTop ?? ((88 - imageSize) / 2)),
                width: cw(imageSize),
                height: cw(imageSize),
              }}
            >
              <LogoImage logo={logo} sizes="6.2vw" />
            </div>
            {logo.caption && (
              <span
                className="absolute left-1/2 -translate-x-1/2 text-center font-sans font-light leading-[1.12] tracking-[-.01em] text-[#7e7e7e]"
                style={{ top: cw(58), width: cw(77), fontSize: cw(7) }}
              >
                {logo.caption}
              </span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function MobileCategory({ category, index, play, reduceMotion }) {
  const start = CATEGORY_STARTS[index];
  const visible = play || reduceMotion;

  return (
    <motion.article
      className="relative overflow-hidden rounded-xl shadow-[0_4px_8px_rgba(0,0,0,.22)]"
      style={{ backgroundColor: category.color, transformOrigin: "left center", perspective: 900 }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scaleX: visible ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.52, delay: reduceMotion ? 0 : start, ease: EASE_OUT }}
    >
      <div className="flex items-end gap-3 px-4 pb-3 pt-4 text-white">
        <motion.span
          aria-hidden="true"
          className={`${fredokaOne.className} text-7xl font-normal leading-[.72] text-[#efefef] [text-shadow:0_3px_4px_rgba(0,0,0,.18)]`}
          initial={false}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 1.5 }}
          transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : start + 0.3, ease: EASE_OUT }}
        >
          {category.number}
        </motion.span>
        <h3 className="pb-1 font-display text-xl font-semibold leading-tight [text-shadow:0_3px_4px_rgba(0,0,0,.25)]">
          {category.title}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 bg-white/12 p-4 min-[480px]:grid-cols-3 sm:grid-cols-4">
        {category.logos.map((logo, logoIndex) => (
          <motion.div
            key={logo.src}
            className="relative aspect-square min-w-0 overflow-hidden rounded-[11px] border border-white bg-[#fafafa] p-[12%] shadow-[inset_0_4px_4px_rgba(0,0,0,.18),0_4px_4px_rgba(0,0,0,.22)]"
            style={{ transformOrigin: "left center", backfaceVisibility: "hidden" }}
            initial={false}
            animate={{ opacity: visible ? 1 : 0, rotateY: visible ? 0 : 90 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : start + 0.65 + logoIndex * 0.11, ease: EASE_OUT }}
          >
            <div className={logo.caption ? "relative h-[72%] w-full" : "relative size-full"}>
              <LogoImage logo={logo} sizes="(min-width: 640px) 18vw, (min-width: 480px) 27vw, 40vw" />
            </div>
            {logo.caption && (
              <span className="absolute inset-x-1 bottom-[10%] text-center font-sans text-[7px] font-light leading-tight text-[#7e7e7e]">
                {logo.caption}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.article>
  );
}

export default function CertificacionesColaboraciones() {
  const sectionRef = useRef(null);
  const play = useInView(sectionRef, { amount: 0.08, once: true });
  const reduceMotion = useReducedMotion();
  const visible = play || reduceMotion;

  return (
    <section ref={sectionRef} aria-labelledby="certificaciones-colaboraciones" className="relative min-h-[100dvh] w-full overflow-hidden bg-[linear-gradient(181deg,#ededed_1.66%,#bdbdbd_98.43%)] lg:w-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 z-0 hidden w-[105.231vw] -translate-x-1/2 lg:block"
        style={{
          top: "min(25.416667vw, 48.157895dvh)",
          aspectRatio: "1515.34 / 581.779",
        }}
      >
        <Image src={`${BASE}/fondo-montanas.svg`} alt="" fill sizes="106vw" className="-scale-y-100 object-contain" />
      </div>
      <div
        className="relative z-10 mx-auto hidden aspect-[1440/760] lg:block"
        style={{
          containerType: "inline-size",
          width: "min(100vw, calc(100dvh * 1440 / 760))",
        }}
      >
        <motion.div
          className="pointer-events-none absolute z-[1]"
          style={{ left: x(185), top: y(419), width: cw(209.1), height: cw(114.2) }}
          animate={reduceMotion ? undefined : { x: [0, 7, 0, -5, 0], y: [0, -9, 0, 6, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={`${BASE}/nubes-papel.png`} alt="" fill sizes="15vw" className="object-contain" />
        </motion.div>
        <div className="pointer-events-none absolute z-[1] -scale-x-100" style={{ left: x(28), top: y(366), width: cw(123), height: cw(67.2) }}>
          <motion.div
            className="relative size-full"
            animate={reduceMotion ? undefined : { x: [0, -5, 0, 4, 0], y: [0, 6, 0, -7, 0] }}
            transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src={`${BASE}/nubes-papel.png`} alt="" fill sizes="9vw" className="object-contain drop-shadow-[0_4px_4px_rgba(149,167,225,.25)]" />
          </motion.div>
        </div>

        <header className="absolute z-10" style={{ left: x(104), top: y(76), width: cw(370) }}>
          <motion.div
            className="flex items-center"
            style={{ gap: cw(14) }}
            initial={false}
            animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : cw(-80) }}
            transition={{ duration: reduceMotion ? 0 : 0.58, delay: reduceMotion ? 0 : 0.08, ease: EASE_OUT }}
          >
            <span className="shrink-0 bg-[#aa181f]" style={{ width: cw(56), height: cw(6) }} />
            <p className="whitespace-nowrap text-center font-sans font-normal leading-[1.2] tracking-[.012em] text-[#003750]" style={{ fontSize: cw(15) }}>
              CERTIFICACIONES Y COLABORACIONES
            </p>
          </motion.div>
          <motion.div
            className="overflow-hidden"
            style={{ marginTop: cw(10), width: cw(287) }}
            initial={false}
            animate={{ clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduceMotion ? 0 : 0.68, delay: reduceMotion ? 0 : 0.72, ease: EASE_OUT }}
          >
          <h2 id="certificaciones-colaboraciones" className="font-display font-medium leading-[1.22] text-[#003750]" style={{ fontSize: cw(36) }}>
            Reconocimientos y alianzas para fortalecer su formación.
          </h2>
          </motion.div>
        </header>

        <div className="absolute z-10" style={{ left: x(397), top: y(156), width: cw(956), height: cw(578) }}>
          {categories.map((category, index) => <DesktopCategory key={category.number} category={category} index={index} play={play} reduceMotion={reduceMotion} />)}
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl overflow-hidden px-4 py-10 lg:hidden sm:px-8 sm:py-12">
        <div className="pointer-events-none absolute inset-x-[-25%] bottom-0 h-[42%] opacity-80">
          <Image src={`${BASE}/fondo-montanas.svg`} alt="" fill sizes="150vw" className="object-cover object-bottom" />
        </div>
        <div className="relative z-10 mb-10">
          <motion.div
            className="flex items-center gap-3"
            initial={false}
            animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -64 }}
            transition={{ duration: reduceMotion ? 0 : 0.58, delay: reduceMotion ? 0 : 0.08, ease: EASE_OUT }}
          >
            <span className="h-1.5 w-10 shrink-0 bg-[#aa181f]" />
            <p className="text-xs tracking-[.012em] text-[#003750] sm:text-sm">CERTIFICACIONES Y COLABORACIONES</p>
          </motion.div>
          <motion.div
            className="mt-3 max-w-lg overflow-hidden"
            initial={false}
            animate={{ clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduceMotion ? 0 : 0.68, delay: reduceMotion ? 0 : 0.72, ease: EASE_OUT }}
          >
          <h2 className="font-display text-4xl font-medium leading-[1.08] text-[#003750] sm:text-5xl">
            Reconocimientos y alianzas para fortalecer su formación.
          </h2>
          </motion.div>
        </div>
        <div className="relative z-10 grid gap-7">
          {categories.map((category, index) => <MobileCategory key={category.number} category={category} index={index} play={play} reduceMotion={reduceMotion} />)}
        </div>
      </div>
    </section>
  );
}
