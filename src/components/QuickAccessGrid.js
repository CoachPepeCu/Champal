"use client";

import { motion } from "framer-motion";
import { IconTrophy, IconCalendar, IconMegaphone, IconMedal } from "./icons";

const ITEMS = [
  {
    icon: IconTrophy,
    title: "Cuadro de Honor",
    text: "Reconocemos el esfuerzo y talento de nuestros alumnos destacados.",
    href: "#comunidad",
  },
  {
    icon: IconCalendar,
    title: "Calendario Escolar",
    text: "Consulta fechas importantes, eventos y periodos de exámenes.",
    href: "#comunidad",
  },
  {
    icon: IconMegaphone,
    title: "Próximos Eventos",
    text: "Entérate de lo que se acerca: torneos, festivales y reuniones.",
    href: "#comunidad",
  },
  {
    icon: IconMedal,
    title: "Talento Champal",
    text: "Descubre los proyectos, retos y creaciones de nuestros estudiantes.",
    href: "#comunidad",
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

export default function QuickAccessGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8 -mt-4 lg:-mt-6 pb-8 lg:pb-10">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {ITEMS.map(({ icon: Icon, title, text, href }) => (
          <motion.a
            key={title}
            href={href}
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 hover:border-accent/40 hover:shadow-md hover:shadow-neutral-900/5 transition-shadow duration-200"
          >
            <Icon className="h-7 w-7 text-accent" />
            <h3 className="mt-4 font-serif text-base text-primary">{title}</h3>
            <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">{text}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
              Ver más <span>→</span>
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
