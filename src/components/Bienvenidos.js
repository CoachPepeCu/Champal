"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const CANVAS_W = 1440;
const CANVAS_H = 501;
const pctX = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}%`;
const pctY = (px) => `${((px / CANVAS_H) * 100).toFixed(3)}%`;
const cqw = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;
const ASTRONAUT_SHADOW = "drop-shadow(0px 4px 2px rgba(0,0,0,0.25))";
const EASE_OUT = [0.22, 1, 0.36, 1];
const SCRAMBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!¡";

const PARAGRAPH_2 = "En nuestro Colegio cada alumno descubre su potencial, aprende con propósito y crece con valores.";
const PARAGRAPH_1 = "Desde 1992 acompañamos a las familias Champal en cada etapa. Hoy celebramos la huella de nuestros alumnos y egresados, y renovamos cada día nuestro compromiso con una formación humana, cercana y con visión de futuro.";
const PARAGRAPH_1_LINES = [
  "Desde 1992 acompañamos a las familias Champal",
  "en cada etapa. Hoy celebramos la huella de",
  "nuestros alumnos y egresados, y renovamos cada",
  "día nuestro compromiso con una formación",
  "humana, cercana y con visión de futuro.",
];
const PARAGRAPH_2_LINES = [
  "En nuestro Colegio cada alumno descubre su",
  "potencial, aprende con propósito y crece con valores.",
];
const MOBILE_PARAGRAPH_1_LINES = [
  "Desde 1992 acompañamos a las familias Champal en cada etapa.",
  "Hoy celebramos la huella de nuestros alumnos y egresados,",
  "y renovamos cada día nuestro compromiso con una formación",
  "humana, cercana y con visión de futuro.",
];
const MOBILE_PARAGRAPH_2_LINES = [
  "En nuestro Colegio cada alumno descubre su potencial,",
  "aprende con propósito y crece con valores.",
];

function revealTransition(reduceMotion, delay, duration = 0.65) {
  return { duration: reduceMotion ? 0.18 : duration, delay: reduceMotion ? 0 : delay, ease: EASE_OUT };
}

function PopIn({ children, className = "", style, play, reduceMotion, delay }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={false}
      animate={!play
        ? { opacity: 0, scale: reduceMotion ? 1 : 0.35 }
        : reduceMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: [0, 1, 1, 1], scale: [0.35, 1.5, 0.92, 1] }}
      transition={reduceMotion
        ? revealTransition(true, 0)
        : { duration: 0.72, delay, times: [0, 0.42, 0.74, 1], ease: [0.2, 0.85, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedParagraph({ text, lines, className = "", style, play, reduceMotion, delay }) {
  return (
    <p className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {lines.map((line, index) => (
          <motion.span
            key={line}
            className="block"
            initial={false}
            animate={{ opacity: play ? 1 : 0, y: play || reduceMotion ? 0 : "0.7em" }}
            transition={revealTransition(reduceMotion, delay + index * 0.13, 0.58)}
          >
            {line}
          </motion.span>
        ))}
      </span>
    </p>
  );
}

function WelcomeSequence({ play, reduceMotion, mobile = false }) {
  const [message, setMessage] = useState("");
  const [showFinal, setShowFinal] = useState(false);
  const finalVisible = (reduceMotion && play) || showFinal;
  const finalClass = mobile
    ? "absolute inset-0 flex items-center justify-center font-serif text-4xl font-bold sm:text-5xl"
    : "absolute inset-0 font-serif font-bold";

  useEffect(() => {
    if (!play) return;
    if (reduceMotion) return;

    const timers = [];
    const intervals = [];
    const schedule = (callback, delay) => timers.push(window.setTimeout(callback, delay));
    const scrambleTo = (target, startAt) => {
      schedule(() => {
        const startedAt = performance.now();
        const duration = 380;
        const interval = window.setInterval(() => {
          const progress = Math.min((performance.now() - startedAt) / duration, 1);
          const fixedCharacters = Math.floor(target.length * progress);
          setMessage(target.split("").map((character, index) => {
            if (character === " ") return " ";
            if (index < fixedCharacters || progress === 1) return character;
            return SCRAMBLE_CHARACTERS[Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)];
          }).join(""));
          if (progress === 1) window.clearInterval(interval);
        }, 38);
        intervals.push(interval);
      }, startAt);
    };

    schedule(() => setMessage("Welcome!"), 2150);
    scrambleTo("Bienvenue !", 2850);
    scrambleTo("¡Bienvenidos!", 3700);
    schedule(() => setShowFinal(true), 4080);

    return () => {
      timers.forEach(window.clearTimeout);
      intervals.forEach(window.clearInterval);
    };
  }, [play, reduceMotion]);

  return (
    <div className="relative h-full w-full" aria-live="off">
      {!reduceMotion && !finalVisible && (
        <motion.p
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center font-serif font-bold"
          style={{ fontSize: mobile ? undefined : cqw(48), letterSpacing: mobile ? undefined : cqw(4.8), color: "#00055c" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: message ? 1 : 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {message}
        </motion.p>
      )}

      <motion.h2
        className={finalClass}
        style={{ color: "#00055c" }}
        initial={false}
        animate={{ opacity: finalVisible ? 1 : 0, y: finalVisible && !reduceMotion && !mobile ? [cqw(170), cqw(170), 0] : 0 }}
        transition={reduceMotion
          ? revealTransition(true, 0)
          : mobile
            ? { opacity: { duration: 0 } }
            : {
                opacity: { duration: 0 },
                y: { duration: 0.92, delay: 0.35, times: [0, 0.2, 1], ease: EASE_OUT },
              }}
      >
        {mobile ? "¡Bienvenidos!" : (
          <>
            <span className="absolute text-center" style={{ left: cqw(31), top: pctY(5), fontSize: cqw(96), letterSpacing: cqw(9.6), transform: "translateX(-50%)" }}>¡</span>
            <span className="absolute whitespace-nowrap" style={{ left: cqw(242.5), top: pctY(55), fontSize: cqw(48), letterSpacing: cqw(4.8), transform: "translateX(-50%)" }}>BIENVENIDOS</span>
            <span className="absolute whitespace-nowrap" style={{ left: cqw(449), top: pctY(32), fontSize: cqw(96), letterSpacing: cqw(9.6), transform: "translateX(-50%)" }}>!</span>
          </>
        )}
      </motion.h2>
    </div>
  );
}

function LogoStamp({ play, reduceMotion, className = "", style, children }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={false}
      animate={{ opacity: play ? 1 : 0 }}
      transition={revealTransition(reduceMotion, 5.15, 0.42)}
    >
      {children}
    </motion.div>
  );
}

export default function Bienvenidos() {
  const sectionRef = useRef(null);
  const play = useInView(sectionRef, { amount: 0.22, once: true });
  const reduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className="relative bg-[#fafaf7]">
      <div className="relative hidden aspect-[1440/501] w-full lg:block" style={{ containerType: "inline-size" }}>
        <motion.svg
          role="img"
          aria-label='"Del caos nacen las ESTRELLAS" — mural G19'
          className="absolute inset-0 h-full w-full overflow-hidden"
          viewBox="0 0 1440 501"
          preserveAspectRatio="none"
          initial={false}
          animate={{ opacity: play ? 1 : 0 }}
          transition={revealTransition(reduceMotion, 0, 0.76)}
        >
          <defs><clipPath id="bienvenidos-mural-clip"><path d="M0 0H600.5C738.85 0 851 112.15 851 250.5C851 388.85 754.35 501 650 501H0Z" /></clipPath></defs>
          <image href="/images/bienvenidos/mural-g19-fondo.png" width="1442" height="501" preserveAspectRatio="xMidYMid slice" clipPath="url(#bienvenidos-mural-clip)" />
        </motion.svg>

        <motion.div
          className="absolute z-30"
          style={{ left: pctX(657), top: pctY(245), width: cqw(214), height: cqw(228) }}
          initial={false}
          animate={{
            opacity: play ? 1 : 0,
            x: play || reduceMotion ? 0 : cqw(-26),
            y: play || reduceMotion ? 0 : cqw(22),
          }}
          transition={revealTransition(reduceMotion, 6.95, 1.18)}
        >
          <Image src="/images/bienvenidos/astronauta-flotando.png" alt="" fill preload sizes="15vw" className="object-contain" style={{ filter: ASTRONAUT_SHADOW }} />
        </motion.div>

        <motion.div
          className="absolute inset-y-0 right-0"
          style={{ width: pctX(589) }}
          initial={false}
          animate={{ opacity: play ? 1 : 0, x: play || reduceMotion ? 0 : "100%" }}
          transition={revealTransition(reduceMotion, 0.7, 0.82)}
        >
          <div className="absolute inset-0 bg-[#fafaf7]" />
          <div className="absolute inset-0">
            <WelcomeSequence play={play} reduceMotion={reduceMotion} />
          </div>

          <LogoStamp play={play} reduceMotion={reduceMotion} className="absolute" style={{ left: cqw(133), top: pctY(114), width: cqw(200), height: cqw(91) }}>
            <Image src="/images/bienvenidos/logo-champal-bienvenidos.png" alt="Colegio Champal" fill preload sizes="14vw" className="object-contain" />
          </LogoStamp>

          <AnimatedParagraph text={PARAGRAPH_2} lines={PARAGRAPH_2_LINES} play={play} reduceMotion={reduceMotion} delay={5.45} className="absolute font-serif font-medium text-center" style={{ left: cqw(256), top: pctY(245), width: cqw(514), fontSize: cqw(17), lineHeight: cqw(28), letterSpacing: cqw(1.7), color: "#102c54", transform: "translateX(-50%)" }} />
          <AnimatedParagraph text={PARAGRAPH_1} lines={PARAGRAPH_1_LINES} play={play} reduceMotion={reduceMotion} delay={5.8} className="absolute font-sans text-right text-[#494949]" style={{ left: cqw(15), top: pctY(318), width: cqw(479), fontSize: cqw(18), lineHeight: cqw(28), letterSpacing: cqw(1.8) }} />
        </motion.div>

        <PopIn play={play} reduceMotion={reduceMotion} delay={1.52} className="absolute" style={{ left: pctX(343), top: pctY(-77), width: cqw(311), height: cqw(164) }}>
          <Image src="/images/bienvenidos/adn-flask.png" alt="" fill preload sizes="22vw" className="object-contain" />
        </PopIn>

        <PopIn play={play} reduceMotion={reduceMotion} delay={1.7} className="absolute flex items-center justify-center" style={{ left: pctX(1266), top: pctY(-52), width: cqw(352.166), height: cqw(369.885) }}>
          <div className="relative" style={{ width: cqw(258.609), height: cqw(292.055), transform: "rotate(23deg)" }}>
            <Image src="/images/bienvenidos/camino-mural.png" alt="" fill preload sizes="18vw" className="object-contain" />
          </div>
        </PopIn>
      </div>

      <div className="relative lg:hidden">
        <motion.div className="relative h-[320px] overflow-hidden sm:h-[420px]" initial={false} animate={{ opacity: play ? 1 : 0 }} transition={revealTransition(reduceMotion, 0, 0.76)}>
          <Image src="/images/bienvenidos/mural-g19-fondo.png" alt='"Del caos nacen las ESTRELLAS" — mural G19' fill preload sizes="100vw" className="object-cover object-left" />
        </motion.div>

        <motion.div
          className="absolute right-[8%] top-[134px] z-30 h-[83px] w-[20%] sm:top-[176px] sm:h-[109px]"
          initial={false}
          animate={{ opacity: play ? 1 : 0, x: play || reduceMotion ? 0 : -18, y: play || reduceMotion ? 0 : 16 }}
          transition={revealTransition(reduceMotion, 6.95, 1.18)}
        >
          <Image src="/images/bienvenidos/astronauta-flotando.png" alt="" fill sizes="20vw" className="object-contain" style={{ filter: ASTRONAUT_SHADOW }} />
        </motion.div>

        <PopIn play={play} reduceMotion={reduceMotion} delay={1.52} className="absolute -top-8 left-[8%] h-24 w-40 sm:h-28 sm:w-48">
          <Image src="/images/bienvenidos/adn-flask.png" alt="" fill sizes="30vw" className="object-contain" />
        </PopIn>

        <motion.div className="flex flex-col items-center gap-6 px-6 py-14 text-center sm:px-10" initial={false} animate={{ opacity: play ? 1 : 0, x: play || reduceMotion ? 0 : "100%" }} transition={revealTransition(reduceMotion, 0.7, 0.82)}>
          <LogoStamp play={play} reduceMotion={reduceMotion}>
            <Image src="/images/bienvenidos/logo-champal-bienvenidos.png" alt="Colegio Champal" width={200} height={91} className="h-auto w-32 sm:w-40" />
          </LogoStamp>
          <div className="h-14 w-full sm:h-16"><WelcomeSequence play={play} reduceMotion={reduceMotion} mobile /></div>
          <AnimatedParagraph text={PARAGRAPH_2} lines={MOBILE_PARAGRAPH_2_LINES} play={play} reduceMotion={reduceMotion} delay={5.45} className="max-w-md font-serif font-medium text-base sm:text-lg" style={{ color: "#102c54" }} />
          <AnimatedParagraph text={PARAGRAPH_1} lines={MOBILE_PARAGRAPH_1_LINES} play={play} reduceMotion={reduceMotion} delay={5.8} className="max-w-md text-sm text-[#494949] sm:text-base" />
        </motion.div>
      </div>
    </section>
  );
}
