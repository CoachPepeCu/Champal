"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IconBulb, IconStar, IconGlobe, IconHeart } from "./icons";

const CARDS = [
  {
    icon: IconBulb,
    color: "var(--color-info)",
    title: "Hoy aprendimos",
    text: "Trabajo en equipo, ideas compartidas y proyectos que cobran vida en el aula.",
    image: "/images/hoy-aprendimos.jpg",
  },
  {
    icon: IconHeart,
    color: "var(--color-accent)",
    title: "Hoy celebramos",
    text: "Cada logro, grande o pequeño, merece ser reconocido y compartido.",
    image: "/images/hoy-celebramos.jpg",
  },
  {
    icon: IconStar,
    color: "var(--color-warm)",
    title: "Hoy descubrimos",
    text: "Explorar, cuestionar y crear: así nace el aprendizaje que perdura.",
    image: "/images/hoy-descubrimos.jpg",
  },
  {
    icon: IconGlobe,
    color: "var(--color-teal)",
    title: "Hoy vivimos",
    text: "La vida escolar en su día a día: deporte, arte, amistad y comunidad.",
    image: "/images/hoy-vivimos.jpg",
  },
];

const AGENDA = [
  { day: "Lunes", text: "Inicio de exámenes" },
  { day: "Miércoles", text: "Torneo de básquetbol" },
  { day: "Viernes", text: "Festival cultural" },
  { day: "Lunes", text: "Inicio de exámenes" },
  { day: "Miércoles", text: "Torneo de básquetbol" },
  { day: "Viernes", text: "Festival cultural" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function TodayInChampal() {
  return (
    <section id="comunidad" className="bg-neutral-50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-center font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary"
        >
          Hoy en Champal
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {CARDS.map(({ icon: Icon, color, title, text, image }) => (
            <motion.article
              key={title}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm shadow-neutral-900/5 border border-neutral-100"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                <div
                  className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full shadow-md"
                  style={{ background: color }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg text-primary">{title}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{text}</p>
                <a
                  href="#comunidad"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                  style={{ color }}
                >
                  Ver más
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-10 overflow-hidden rounded-full bg-primary py-3">
          <motion.div
            className="flex w-max gap-12 whitespace-nowrap px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {[...AGENDA, ...AGENDA].map((entry, i) => (
              <span key={i} className="text-sm text-white/90">
                <span className="font-semibold text-white">Esta semana · {entry.day}:</span>{" "}
                {entry.text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
