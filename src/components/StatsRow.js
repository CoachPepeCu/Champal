"use client";

import { motion } from "framer-motion";
import { IconMedal, IconGlobe, IconHeart, IconStar, IconBulb } from "./icons";

const STATS = [
  {
    icon: IconMedal,
    title: "+30 años",
    text: "Formando generaciones con excelencia.",
    href: "#nosotros",
  },
  {
    icon: IconGlobe,
    title: "Bachillerato Internacional",
    text: "Preparación académica con visión global.",
    href: "#academico",
  },
  {
    icon: IconHeart,
    title: "Formación con valores",
    text: "Educamos personas íntegras, empáticas y comprometidas.",
    href: "#nosotros",
  },
  {
    icon: IconStar,
    title: "Campus rodeado de naturaleza",
    text: "Espacios que inspiran el aprendizaje.",
    href: "#vida-estudiantil",
  },
  {
    icon: IconBulb,
    title: "Acompañamiento personalizado",
    text: "Guiamos a cada estudiante en su desarrollo integral.",
    href: "#admisiones",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function StatsRow() {
  return (
    <section className="relative z-10 -mt-14 lg:-mt-16">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {STATS.map(({ icon: Icon, title, text, href }) => (
          <motion.a
            key={title}
            href={href}
            variants={item}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col gap-3 rounded-2xl bg-white p-5 lg:p-6 shadow-lg shadow-neutral-900/10 border border-transparent hover:border-accent/30 hover:shadow-xl hover:shadow-neutral-900/15 transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-200">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-accent opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                →
              </span>
            </div>
            <div>
              <p className="font-serif text-sm lg:text-base font-semibold text-primary leading-snug">
                {title}
              </p>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed">{text}</p>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
