"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IconStar, IconGlobe, IconHeart, IconMedal } from "./icons";

const REASONS = [
  {
    icon: IconStar,
    title: "Excelencia Académica",
    text: "Alto rendimiento con programas rigurosos y actualizados.",
    tint: "var(--color-warm)",
  },
  {
    icon: IconGlobe,
    title: "Visión Internacional",
    text: "Preparación global para un mundo sin fronteras.",
    tint: "var(--color-info)",
  },
  {
    icon: IconHeart,
    title: "Atención Personalizada",
    text: "Acompañamos a cada estudiante en su desarrollo integral.",
    tint: "var(--color-accent)",
  },
  {
    icon: IconMedal,
    title: "Comunidad y Valores",
    text: "Formamos personas íntegras, empáticas y comprometidas.",
    tint: "var(--color-teal)",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyChampal() {
  return (
    <section id="nosotros" className="py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-center font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary"
        >
          ¿Por qué Champal?
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4"
        >
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-3xl min-h-[280px] lg:col-span-2 lg:row-span-2 flex flex-col justify-end p-8"
          >
            <Image
              src="/images/campus-aereo.jpg"
              alt="Vista aérea del campus de Colegio Champal"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/10" />
            <span className="relative text-xs font-semibold uppercase tracking-[0.15em] text-gold-light">
              +30 años de trayectoria
            </span>
            <h3 className="relative mt-2 font-serif text-2xl lg:text-3xl text-white leading-snug max-w-sm">
              Un campus que forma personas para toda la vida.
            </h3>
          </motion.div>

          {REASONS.map(({ icon: Icon, title, text, tint }) => (
            <motion.div
              key={title}
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-neutral-200 p-6 flex flex-col gap-3 hover:shadow-md hover:shadow-neutral-900/5 transition-shadow duration-200"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: `color-mix(in srgb, ${tint} 15%, white)`, color: tint }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-serif text-base text-primary">{title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
