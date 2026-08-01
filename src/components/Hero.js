"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IconGlobe, IconStar, IconHeart, IconBulb } from "./icons";
import GlowButton from "./GlowButton";

const FEATURES = [
  { icon: IconGlobe, label: "Visión Internacional" },
  { icon: IconStar, label: "Excelencia Académica" },
  { icon: IconHeart, label: "Atención Personalizada" },
  { icon: IconBulb, label: "Innovación Educativa" },
];

const HEADLINE_WORDS = ["Educación", "que", "impulsa"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const wordItem = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-portada.jpg"
          alt="Alumnos de Champal jugando basquetbol en el campus"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-24 lg:pt-20 lg:pb-28"
      >
        <motion.h1
          variants={wordContainer}
          initial="hidden"
          animate="show"
          className="max-w-xl font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-white"
        >
          {HEADLINE_WORDS.map((word) => (
            <motion.span key={word} variants={wordItem} className="inline-block mr-[0.28em]">
              {word}
            </motion.span>
          ))}
          <br />
          <motion.span variants={wordItem} className="text-shimmer inline-block">
            su futuro.
          </motion.span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-md text-base sm:text-lg text-white/85">
          Formamos estudiantes con excelencia académica, visión internacional
          y valores que los preparan para transformar el mundo.
        </motion.p>

        <motion.div variants={item} className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col gap-2">
              <Icon className="h-7 w-7 text-white" />
              <span className="text-sm font-medium text-white/90">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <GlowButton href="#admisiones">Agenda una visita</GlowButton>
          <a
            href="#nosotros"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors duration-200"
          >
            Conoce Champal
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
