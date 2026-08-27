"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// 4 diapositivas exactas de Figma (component "Carrusel_Fotos_Kinder",
// node 97:368 — variantes Propiedad1=Construir/Imaginar/Descubrir/Ilusión;
// "Reinicio" es solo el regreso a la primera, no una 5a diapositiva). A
// diferencia de Pre-Kinder, las 4 vinieron completas en el export de
// Figma — no hubo que preguntarle nada al usuario.
const SLIDES = [
  {
    key: "construir",
    image: "/images/kinder/carrusel-construir.png",
    title: "Construimos nuevas ideas",
    subtitle: "Entre formas, colores y desafíos, juegan mientras desarrollan su pensamiento.",
  },
  {
    key: "imaginar",
    image: "/images/kinder/carrusel-imaginar.png",
    title: "La imaginación toma el escenario",
    subtitle: "Expresarse, crear personajes y compartir con otros fortalece su seguridad.",
  },
  {
    key: "descubrir",
    image: "/images/kinder/carrusel-descubrir.png",
    title: "La curiosidad encuentra respuestas",
    subtitle: "Tecnología y juego se unen para participar, pensar y descubrir.",
  },
  {
    key: "ilusion",
    image: "/images/kinder/carrusel-ilusion.png",
    title: "Cada día llegan con ilusión",
    subtitle: "Aprender comienza con las ganas de venir al Colegio.",
  },
];

const SLIDE_DURATION_MS = 5000;

function CarruselFotosKinder() {
  // "tick" avanza indefinidamente (no da vuelta a 0) para que el ícono
  // pueda girar 90° de forma continua en cada cambio, sin "regresar de
  // golpe" cuando el carrusel vuelve a la primera foto — igual que en
  // Pre-Kinder.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  const current = SLIDES[tick % SLIDES.length];

  return (
    <div className="relative aspect-[728/560] w-full overflow-hidden rounded-[32px] bg-white shadow-[0px_5px_6px_5px_rgba(0,0,0,0.25)]">
      <AnimatePresence initial={false}>
        <motion.div
          key={current.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={current.image}
            alt={current.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Panel de leyenda — degradado blanco exacto de Figma (node 97:375):
          opaco (75%) en la mitad superior del panel, se desvanece cerca del
          borde inferior sin llegar a 0% dentro del área visible. */}
      <div className="absolute inset-x-0 bottom-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,254,254,0.85) 0%, rgba(255,254,254,0.85) 44%, rgba(255,255,255,0) 109%)",
          }}
        />
        <div className="relative flex items-center gap-4 px-5 py-4 sm:gap-6 sm:px-7 sm:py-5">
          {/* El ícono gira 90° en cada cambio de texto, dando la
              apariencia de "rodar" al mismo tiempo que el texto sube. */}
          <motion.div
            animate={{ rotate: tick * 90 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="h-11 w-11 shrink-0 sm:h-[65px] sm:w-[65px]"
          >
            <Image src="/icons/cuartos.svg" alt="" width={65} height={65} className="h-full w-full" />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              {/* Tamaño uniforme para las 4: en Figma la diapositiva
                  "Construir" trae el título a 36px y las otras 3 a 30px
                  (inconsistencia del archivo) — se pareja a 30px para que
                  el texto no "salte" de tamaño en cada rotación. */}
              <p className="font-serif text-lg font-semibold leading-tight sm:text-2xl lg:text-[30px]" style={{ color: "#102c54" }}>
                {current.title}
              </p>
              <p className="mt-0.5 text-xs font-medium leading-snug sm:text-base lg:text-xl" style={{ color: "#494949" }}>
                {current.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Sección "03_AprenderADescubrir" (node 82:1578): panel de texto (node
// 82:1579 "La_Experiencia", 524x560 en Figma — más grande que el de
// Pre-Kinder, 420x420) + carrusel de fotos (node 82:1585, 728x560, igual
// medida que el de Pre-Kinder).
export default function KinderDescubrir() {
  return (
    <section className="py-14 lg:py-20" style={{ backgroundImage: "linear-gradient(to bottom, #f7f9fc, #e9eef5)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-10 px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <div
          className="flex w-full flex-col items-start gap-5 rounded-[15px] px-8 py-10 shadow-[0px_6px_18px_0px_rgba(10,23,48,0.14)] lg:h-[560px] lg:w-[524px] lg:shrink-0 lg:justify-center lg:py-0"
          style={{ backgroundColor: "#f8fafd" }}
        >
          <div className="flex items-center gap-3">
            <span className="h-1 w-8 rounded-full" style={{ backgroundColor: "#aa181f" }} />
            <p className="font-serif text-[18px] font-semibold" style={{ color: "#102c54" }}>
              Aprendemos jugando
            </p>
          </div>
          <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-[48px] lg:leading-[52px]" style={{ color: "#0a1730" }}>
            Cariño y confianza para descubrir el mundo
          </h2>
          <p className="text-lg leading-relaxed sm:text-xl lg:text-[30px] lg:leading-[38px]" style={{ color: "#494949" }}>
            Integramos motricidad, tecnología y actividades acordes a su edad para que cada pequeño aprenda de forma
            interesante, divertida y respetando sus propios intereses.
          </p>
        </div>

        <div
          className="w-full rounded-[32px] p-0 shadow-[0px_6px_18px_0px_rgba(10,23,48,0.14)] lg:max-w-[728px]"
          style={{ backgroundColor: "#e9e9e9" }}
        >
          <CarruselFotosKinder />
        </div>
      </div>
    </section>
  );
}
