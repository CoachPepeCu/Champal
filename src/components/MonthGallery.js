"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const PHOTOS = [
  { src: "/images/hoy-aprendimos.jpg", alt: "Alumnos en círculo participando en clase", size: "tall" },
  { src: "/images/hoy-vivimos.jpg", alt: "Alumnos en el Modelo de Naciones Unidas", size: "short" },
  { src: "/images/nivel-secundaria.jpg", alt: "Alumnos en el laboratorio de ciencias", size: "tall" },
  { src: "/images/hoy-celebramos.jpg", alt: "Alumna celebrando con su papá", size: "short" },
  { src: "/images/nivel-preparatoria.jpg", alt: "Ceremonia de graduación", size: "tall" },
  { src: "/images/hoy-descubrimos.jpg", alt: "Alumna armando un proyecto de LEGO", size: "short" },
  { src: "/images/nivel-kinder.jpg", alt: "Alumnos de kinder en formación", size: "tall" },
  { src: "/images/nivel-primaria.jpg", alt: "Alumno de primaria saludando", size: "short" },
];

export default function MonthGallery() {
  const trackRef = useRef(null);

  return (
    <section className="py-10 lg:py-14 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary"
          >
            Galería del Mes
          </motion.h2>
          <p className="hidden sm:block text-sm text-neutral-500">Arrastra para explorar →</p>
        </div>

        <div ref={trackRef} className="mt-8 overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ left: -900, right: 0 }}
            dragElastic={0.08}
            className="flex gap-5 cursor-grab active:cursor-grabbing w-max"
          >
            {PHOTOS.map((photo, i) => (
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: "easeOut" }}
                whileHover={{ scale: 1.03 }}
                className={`relative shrink-0 overflow-hidden rounded-[28px] w-56 sm:w-64 ${
                  photo.size === "tall" ? "h-96 sm:h-[26rem]" : "h-72 sm:h-80 self-end"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  draggable={false}
                  sizes="256px"
                  className="object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
