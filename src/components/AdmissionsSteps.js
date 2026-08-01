"use client";

import { motion } from "framer-motion";

const STEPS = [
  { number: "1", title: "Agenda una visita", text: "Conoce nuestras instalaciones y proyecto educativo." },
  { number: "2", title: "Conoce el colegio", text: "Te acompañamos y resolvemos todas tus preguntas." },
  { number: "3", title: "Inicia tu proceso", text: "En línea, fácil y con tu asesor." },
  { number: "4", title: "Bienvenido a Champal", text: "Comienzas una nueva etapa llena de oportunidades." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AdmissionsSteps() {
  return (
    <section id="admisiones" className="bg-neutral-50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-center font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary"
        >
          Admisiones
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative"
        >
          {STEPS.map(({ number, title, text }, i) => (
            <motion.div key={number} variants={item} className="relative flex flex-col items-center text-center gap-3">
              {i < STEPS.length - 1 && (
                <span className="hidden lg:block absolute top-6 left-[60%] w-full border-t border-dashed border-neutral-300" />
              )}
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-serif text-lg text-white">
                {number}
              </span>
              <h3 className="font-serif text-base text-primary">{title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-[200px]">{text}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-light transition-colors duration-200"
          >
            Agenda una visita <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
