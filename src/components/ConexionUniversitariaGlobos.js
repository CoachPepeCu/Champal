"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const BASE = "/images/preparatoria/convenios-universitarios";
const BALLOON = `${BASE}/globo-aerostatico.png`;
const EASE_OUT = [0.22, 1, 0.36, 1];
const BALLOON_MOTION = [
  { enterX: -170, enterY: 90, enterRotate: -8, delay: 0.92, driftX: 3, driftY: -5, driftRotate: -0.5, duration: 6.8 },
  { enterX: 90, enterY: 150, enterRotate: 6, delay: 1.18, driftX: -4, driftY: -6, driftRotate: 0.6, duration: 7.5 },
  { enterX: -70, enterY: -130, enterRotate: -5, delay: 1.03, driftX: 3, driftY: -4, driftRotate: -0.4, duration: 6.3 },
  { enterX: 160, enterY: 80, enterRotate: 7, delay: 1.31, driftX: -3, driftY: -5, driftRotate: 0.5, duration: 7.1 },
  { enterX: 40, enterY: -150, enterRotate: -7, delay: 0.97, driftX: 4, driftY: -6, driftRotate: -0.6, duration: 7.8 },
  { enterX: 190, enterY: -50, enterRotate: 8, delay: 1.24, driftX: -4, driftY: -4, driftRotate: 0.5, duration: 6.6 },
  { enterX: -190, enterY: 40, enterRotate: 7, delay: 1.42, driftX: 3, driftY: -6, driftRotate: 0.4, duration: 7.3 },
  { enterX: -100, enterY: -110, enterRotate: -6, delay: 1.12, driftX: -3, driftY: -5, driftRotate: -0.5, duration: 6.9 },
  { enterX: 120, enterY: 130, enterRotate: 5, delay: 1.37, driftX: 4, driftY: -4, driftRotate: 0.6, duration: 7.6 },
  { enterX: -140, enterY: 120, enterRotate: -8, delay: 1.01, driftX: -4, driftY: -6, driftRotate: -0.4, duration: 6.5 },
  { enterX: 80, enterY: -140, enterRotate: 6, delay: 1.48, driftX: 3, driftY: -5, driftRotate: 0.5, duration: 7.2 },
  { enterX: 180, enterY: 60, enterRotate: -7, delay: 1.16, driftX: -3, driftY: -4, driftRotate: -0.6, duration: 7.9 },
  { enterX: -160, enterY: -70, enterRotate: 8, delay: 1.34, driftX: 4, driftY: -5, driftRotate: 0.4, duration: 6.7 },
  { enterX: -60, enterY: 160, enterRotate: -5, delay: 1.06, driftX: -4, driftY: -6, driftRotate: -0.5, duration: 7.4 },
  { enterX: 130, enterY: -100, enterRotate: 7, delay: 1.44, driftX: 3, driftY: -4, driftRotate: 0.6, duration: 6.4 },
  { enterX: 70, enterY: 150, enterRotate: -6, delay: 1.21, driftX: -3, driftY: -5, driftRotate: -0.4, duration: 7.7 },
  { enterX: 170, enterY: -80, enterRotate: 5, delay: 1.52, driftX: 4, driftY: -6, driftRotate: 0.5, duration: 7 },
  { enterX: -180, enterY: 70, enterRotate: -8, delay: 1.28, driftX: -4, driftY: -4, driftRotate: -0.6, duration: 6.6 },
];
const universities = [
  { src: "logo-udlap.png", alt: "UDLAP", x: 95, y: 248 }, { src: "logo-universidad-modelo.png", alt: "Universidad Modelo", x: 647, y: 140 },
  { src: "logo-iberoamericana.png", alt: "Universidad Iberoamericana", x: 743, y: 19 }, { src: "logo-upaep.png", alt: "UPAEP", x: 865, y: 116 },
  { src: "logo-udem.png", alt: "UDEM", x: 1029, y: 86, disc: "#ffe900" }, { src: "logo-universidad-panamericana.png", alt: "Universidad Panamericana", x: 1170, y: 27, disc: "#c9002b" },
  { src: "logo-iteso.png", alt: "ITESO, Universidad Jesuita de Guadalajara", x: 251, y: 341 }, { src: "logo-uag.png", alt: "Universidad Autónoma de Guadalajara", x: 407, y: 221 },
  { src: "logo-anahuac.png", alt: "Universidad Anáhuac", x: 551, y: 288 }, { src: "logo-instituto-culinario.png", alt: "Instituto Culinario de México", x: 747, y: 301 },
  { src: "logo-tec-monterrey.png", alt: "Tecnológico de Monterrey", x: 949, y: 281 }, { src: "logo-isu.png", alt: "Instituto Suizo", x: 1124, y: 242 },
  { src: "logo-arkansas-state.png", alt: "Arkansas State University", x: 374, y: 456 }, { kind: "texas", alt: "The University of Texas at Austin", x: 554, y: 509 },
  { src: "logo-tecmilenio.png", alt: "Universidad Tecmilenio", x: 705, y: 534 }, { kind: "uvm", alt: "UVM", x: 857, y: 472 },
  { kind: "cedim", alt: "CEDIM, Universidad de Monterrey", x: 1053, y: 422 }, { kind: "vatel", alt: "Vatel", x: 1207, y: 422 },
];

function CustomLogo({ kind }) {
  if (kind === "texas") return <div className="text-center text-[#bf5700]"><b className="text-[16px]">TEXAS</b><small className="mt-1 block text-[4px] font-bold">THE UNIVERSITY OF TEXAS<br />AT AUSTIN</small></div>;
  if (kind === "uvm") return <div className="text-center text-[28px] font-bold leading-none text-[#d8232a]">UVM<span className="mx-auto mt-1 block h-[2px] w-14 bg-[#d8232a]" /></div>;
  if (kind === "cedim") return <div className="text-center text-[#161616]"><b className="text-[23px] leading-none">CEDIM</b><small className="mt-1 block text-[4px]">UNIVERSIDAD DE MONTERREY</small></div>;
  return <div className="flex items-center gap-1 text-[#141414]"><span className="grid size-5 place-items-center bg-black text-sm font-bold text-white">V</span><span><b className="text-[13px]">VATEL</b><small className="block text-[3px] text-[#3c8ebb]">HOTEL &amp; TOURISM</small></span></div>;
}

function UniversityLogo({ university }) {
  return <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-white p-[9px] shadow-[0_4px_10px_rgba(0,0,0,.28)]" style={university.disc ? { backgroundColor: university.disc } : undefined}>
    {university.kind ? <CustomLogo kind={university.kind} /> : <Image src={`${BASE}/${university.src}`} alt={university.alt} fill sizes="96px" className="object-contain p-[10px]" />}
  </div>;
}

function Balloon({ university, index, mobile = false, reduceMotion }) {
  const movement = BALLOON_MOTION[index];
  const position = mobile ? undefined : { left: `${university.x / 14.4}%`, top: `${university.y / 7.6}%`, width: `${147 / 14.4}%` };
  return <motion.div
    className={mobile ? "relative aspect-[147/198] w-full" : "absolute aspect-[147/198]"}
    style={position}
    initial={reduceMotion ? false : { opacity: 0, x: movement.enterX, y: movement.enterY, rotate: movement.enterRotate, scale: 0.86 }}
    animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
    transition={{ duration: reduceMotion ? 0 : 1.35, delay: reduceMotion ? 0 : movement.delay, ease: EASE_OUT }}
  >
    <motion.div
      className="relative size-full"
      animate={reduceMotion ? undefined : {
        x: [0, movement.driftX, -movement.driftX * 0.35, 0],
        y: [0, movement.driftY, -movement.driftY * 0.25, 0],
        rotate: [0, movement.driftRotate, -movement.driftRotate * 0.4, 0],
      }}
      transition={{ duration: movement.duration, delay: movement.delay + 1.35, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image src={BALLOON} alt="" fill sizes={mobile ? "30vw" : "147px"} className="object-contain" />
      <div className="absolute left-1/2 top-[13.65%] aspect-square w-[65.3%] -translate-x-1/2"><UniversityLogo university={university} /></div>
    </motion.div>
  </motion.div>;
}

export default function ConexionUniversitariaGlobos() {
  const reduceMotion = useReducedMotion();

  return <section aria-labelledby="conexion-universitaria" className="relative min-h-[100dvh] w-full overflow-hidden bg-[linear-gradient(89.7deg,#637e99_3.8%,#8dbad7_30.9%)] lg:w-screen">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[-2.57vw] z-0 hidden w-[102.57vw] lg:block"
      style={{ bottom: "-9.027778vw", aspectRatio: "1477 / 418" }}
    >
      <Image src={`${BASE}/fondo-montanas-figma.svg`} alt="" fill sizes="103vw" className="object-contain object-bottom" />
    </div>
    <div
      className="relative z-10 mx-auto hidden aspect-[1440/760] lg:block"
      style={{ width: "min(100vw, calc(100dvh * 1440 / 760))" }}
    >
      <div className="absolute left-[7.15%] top-[7.75%] z-10 w-[30.7%]">
        <motion.div
          className="mb-[5px] flex items-center gap-[14px]"
          initial={reduceMotion ? false : { opacity: 0, x: -90 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : 0.72, ease: EASE_OUT }}
        ><span className="h-[6px] w-14 bg-red-700" /><p className="whitespace-nowrap text-[clamp(11px,1.05vw,15px)] text-white [text-shadow:0_4px_4px_rgba(0,0,0,.25)]">CONEXIÓN UNIVERSITARIA</p></motion.div>
        <motion.div
          className="overflow-hidden"
          initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 0.94, ease: EASE_OUT }}
        ><h2 id="conexion-universitaria" className="font-display text-[clamp(34px,3.2vw,46px)] font-medium leading-[.96] text-white [text-shadow:0_4px_4px_rgba(0,0,0,.25)]">Construimos puentes para ampliar sus posibilidades</h2></motion.div>
      </div>
      {universities.map((university, index) => <Balloon key={university.alt} university={university} index={index} reduceMotion={reduceMotion} />)}
    </div>
    <div className="relative px-5 pb-20 pt-12 lg:hidden">
      <Image src={`${BASE}/fondo-montanas-figma.svg`} alt="" fill sizes="100vw" className="object-cover object-bottom" />
      <div className="relative z-10 mb-8">
        <motion.div
          className="mb-2 flex items-center gap-3"
          initial={reduceMotion ? false : { opacity: 0, x: -64 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : 0.72, ease: EASE_OUT }}
        ><span className="h-1 w-10 bg-red-700" /><p className="text-xs text-white">CONEXIÓN UNIVERSITARIA</p></motion.div>
        <motion.div
          className="max-w-md overflow-hidden"
          initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 0.94, ease: EASE_OUT }}
        ><h2 className="font-display text-4xl font-medium leading-none text-white [text-shadow:0_3px_4px_rgba(0,0,0,.25)]">Construimos puentes para ampliar sus posibilidades</h2></motion.div>
      </div>
      <div className="relative z-10 grid grid-cols-3 gap-x-2 gap-y-1 sm:grid-cols-4">{universities.map((university, index) => <Balloon key={university.alt} university={university} index={index} mobile reduceMotion={reduceMotion} />)}</div>
    </div>
  </section>;
}
