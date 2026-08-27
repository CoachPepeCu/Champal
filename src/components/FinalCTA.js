"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import GlowButton from "./GlowButton";

export default function FinalCTA() {
  return (
    <section data-nav-theme="dark" className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0">
        <Image
          src="/images/campus-aereo.jpg"
          alt="Vista aérea del campus de Colegio Champal"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/75" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl px-6 lg:px-8 text-center"
      >
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-white">
          El lugar donde comienzan
          <br />
          los grandes <span className="text-accent-light">proyectos de vida.</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <GlowButton href="#admisiones">
            Agenda una visita <span>→</span>
          </GlowButton>
        </div>
      </motion.div>
    </section>
  );
}
