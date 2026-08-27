"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  IconBuilding,
  IconCourt,
  IconUsers,
  IconRun,
  IconRibbon,
  IconHandshake,
} from "./icons";

const LINKS = [
  { icon: IconBuilding, label: "Campus", image: "/images/campus-aereo.jpg" },
  { icon: IconCourt, label: "Instalaciones", image: "/images/explora-instalaciones.jpg" },
  { icon: IconUsers, label: "Vida Estudiantil", image: "/images/explora-vida-estudiantil.jpg" },
  { icon: IconRun, label: "Actividades", image: "/images/explora-actividades.jpg" },
  { icon: IconRibbon, label: "Certificaciones", image: "/images/explora-certificaciones.jpg" },
  { icon: IconHandshake, label: "Convenios", image: "/images/explora-convenios.jpg" },
];

const BANNERS = [
  {
    id: null,
    tag: "Club Rayados Monterrey",
    title: "Formamos atletas con disciplina, pasión y carácter.",
    cta: "Conoce más",
    image: "/images/banner-rayados.jpg",
    objectPosition: "center 25%",
    from: "var(--color-primary)",
    to: "#0a1730",
  },
  {
    id: "international-high-school",
    tag: "International High School",
    title: "Educación global para líderes del mañana.",
    cta: "Descubre el programa",
    image: "/images/banner-internacional.jpg",
    objectPosition: "center 15%",
    from: "var(--color-accent)",
    to: "#7a0f14",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ExploreChampal() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const blobY1 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      id="vida-estudiantil"
      ref={sectionRef}
      className="relative overflow-hidden py-10 lg:py-14"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-100 to-neutral-200" />
      <motion.div
        style={{ y: blobY1 }}
        className="absolute -top-10 -left-20 h-72 w-72 rounded-full bg-neutral-300/40 blur-3xl"
      />
      <motion.div
        style={{ y: blobY2 }}
        className="absolute bottom-0 -right-20 h-72 w-72 rounded-full bg-neutral-300/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-center font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary"
        >
          Explora Champal
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 grid grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {LINKS.map(({ icon: Icon, label, image }) => (
            <motion.a
              key={label}
              href="#"
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={image}
                alt={label}
                fill
                sizes="(max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-transparent" />
              <div className="absolute inset-1.5 rounded-lg border border-white/70 pointer-events-none" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <Icon className="w-[68%] h-[68%] text-white drop-shadow-md" strokeWidth={0.9} />
              </div>
              <span className="absolute bottom-2 inset-x-0 text-center text-[11px] sm:text-xs font-semibold text-white drop-shadow">
                {label}
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {BANNERS.map(({ id, tag, title, cta, image, objectPosition, from, to }) => (
            <motion.div
              key={tag}
              id={id ?? undefined}
              variants={item}
              className="group relative overflow-hidden rounded-2xl p-8 lg:p-10 text-white min-h-[260px] flex flex-col justify-end"
            >
              <Image
                src={image}
                alt={tag}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectPosition }}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(0deg, ${to} 5%, transparent 65%)` }}
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${from}22, ${to}66)` }}
              />
              <span className="relative text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
                {tag}
              </span>
              <h3 className="relative mt-2 font-serif text-2xl lg:text-3xl leading-tight max-w-sm">
                {title}
              </h3>
              <a
                href="#admisiones"
                className="relative mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/25 transition-colors duration-200"
              >
                {cta} <span>→</span>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
