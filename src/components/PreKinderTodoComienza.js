"use client";

import { useState } from "react";
import Image from "next/image";

// Texto en tarjeta (Figma) + mensaje de la nube al hacer hover (confirmado
// por el usuario — no estaba en Figma). "align" y "textColor" replican la
// posición/color exactos de cada tarjeta en el diseño.
const CARDS = [
  {
    key: "prelector",
    image: "/images/prekinder/card-prelector.webp",
    title: ["Programa prelector"],
    align: "left",
    textColor: "#fff",
    border: "#cecece",
    message:
      "Inculcar el amor por la lectura y la pasión por el conocimiento, para que desde los primeros años se vean atrapados por ellos a través de los libros con actividades divertidas.",
  },
  {
    key: "grafo",
    image: "/images/prekinder/card-grafo.webp",
    title: ["Grafomotricidad"],
    align: "left",
    textColor: "#fff",
    border: "#5d747f",
    message:
      "Comenzando con trazos libres, los niños van logrando dominar el espacio y adquirir soltura que serán de gran apoyo en su proceso de lecto-escritura al ingresar al Kinder.",
  },
  {
    key: "feel",
    image: "/images/prekinder/card-feel.webp",
    title: ["Aula FEEL"],
    align: "center",
    textColor: "#fff",
    border: "#cecece",
    message: "Programa de desarrollo de habilidades sensoriales.",
  },
  {
    key: "ritmo",
    image: "/images/prekinder/card-ritmo.webp",
    title: ["Ritmo y movimiento"],
    align: "center",
    textColor: "#09008a",
    border: "#5d747f",
    message:
      "Estimula las habilidades musicales de los pequeños a través de diferentes instrumentos que generan ritmos y canciones divertidas, favoreciendo el desarrollo intelectual, motriz y de lenguaje.",
  },
  {
    key: "mate",
    image: "/images/prekinder/card-mate.webp",
    title: ["Habilidades", "matemáticas"],
    align: "center",
    textColor: "#fff",
    border: "#cecece",
    message:
      "Introducimos a nuestros pequeños a las matemáticas con conceptos básicos como ubicación espacial, forma y nociones de cantidad.",
  },
  {
    key: "esfinter",
    image: "/images/prekinder/card-esfinter.webp",
    title: ["Control de", "esfínteres"],
    align: "center",
    textColor: "#fff",
    border: "#cecece",
    message:
      "Programa personalizado para que los niños adquieran la seguridad necesaria para lograrlo de la mano de papá y/o mamá.",
  },
  {
    key: "natural",
    image: "/images/prekinder/card-natural.webp",
    title: ["Explorar el", "mundo natural"],
    align: "center",
    textColor: "#fff",
    border: "#cecece",
    message:
      "Despertamos su curiosidad para que exploren y descubran el mundo por medio de sus sentidos, manipulando materiales, texturas y elementos de la naturaleza.",
  },
  {
    key: "digital",
    image: "/images/prekinder/card-digital.webp",
    title: ["Aprendizaje", "digital"],
    align: "center",
    textColor: "#fff",
    border: "#fbfbfb",
    message:
      "Trabajamos con tabletas, proyectores y Mimio Teach con el uso de aplicaciones didácticas, como herramientas de aprendizaje para hacer nuestras clases atractivas para los pequeños.",
  },
];

const TEXT_SHADOW = "0px 2px 3px rgba(10,23,48,0.35)";

function Card({ item }) {
  return (
    <div className="group relative w-[260px] shrink-0 sm:w-[320px]">
      {/* Nube-globo de diálogo: aparece arriba de la tarjeta en hover, por
          delante de ella (z-20 — antes pintaba detrás porque la tarjeta
          venía después en el DOM y no había z-index explícito). */}
      <div className="pointer-events-none absolute -top-[200px] left-1/2 z-20 w-[300px] -translate-x-1/2 opacity-0 scale-90 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-2 sm:w-[360px]">
        <div className="relative">
          <Image
            src="/images/prekinder/nube-v3.webp"
            alt=""
            width={360}
            height={279}
            className="h-auto w-full drop-shadow-[0_16px_28px_rgba(10,23,48,0.38)]"
          />
          {/* Centrado en el cuerpo redondo de la nube, sin invadir la colita
              inferior derecha. text-pretty evita que quede una sola palabra
              suelta en el último renglón (soporte progresivo: sin efecto en
              navegadores que no lo reconocen todavía, sin romper nada). La
              primera letra de cada mensaje lleva un tratamiento de letra
              capital — sin flotar, para no romper el centrado dentro de la
              nube. */}
          <div className="absolute inset-x-[16%] top-[9%] bottom-[27%] flex items-center justify-center overflow-hidden">
            <p
              className="font-hand text-pretty text-center text-[11px] leading-[1.4] text-[#0a1730] first-letter:text-[1.7em] first-letter:font-bold first-letter:leading-none sm:text-[14px] sm:leading-[1.45]"
              style={{ textWrap: "pretty" }}
            >
              {item.message}
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-[300px] w-full overflow-hidden rounded-[24px] shadow-[0px_18px_38px_0px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out group-hover:-translate-y-2 sm:h-[380px]">
        <Image
          src={item.image}
          alt={item.title.join(" ")}
          fill
          sizes="(max-width: 640px) 260px, 320px"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-[3.16%_3.13%] rounded-[24px] border-[1.5px]"
          style={{ borderColor: item.border }}
        />
        <div
          className={`absolute inset-x-5 top-[9%] font-serif text-xl font-semibold leading-[1.15] sm:text-[26px] sm:leading-[28px] ${
            item.align === "center" ? "text-center" : "text-left"
          }`}
          style={{ color: item.textColor, textShadow: TEXT_SHADOW }}
        >
          {item.title.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Arrow({ direction, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Circular hacia la izquierda" : "Circular hacia la derecha"}
      className={`flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-white bg-transparent transition-colors duration-200 hover:bg-[var(--color-primary)] ${className}`}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        {direction === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

export default function PreKinderTodoComienza() {
  // Valor de animation-direction directamente: "normal" (0%→-50%) mueve la
  // pista hacia la izquierda — el sentido por defecto del diseño original.
  // "reverse" la mueve hacia la derecha.
  const [flowDirection, setFlowDirection] = useState("normal");
  const cards = [...CARDS, ...CARDS];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/prekinder/fondo-todo-comienza.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div
            className="flex flex-col items-center gap-3 rounded-[28px] border px-6 py-9 text-center shadow-[0px_4px_4px_0px_rgba(23,45,88,0.1)] sm:px-16 sm:py-9"
            style={{
              backgroundColor: "rgba(255,255,255,0.18)",
              borderColor: "rgba(255,255,255,0.42)",
              backdropFilter: "blur(9px)",
              WebkitBackdropFilter: "blur(9px)",
            }}
          >
            <span className="h-[5px] w-16 rounded-full" style={{ backgroundColor: "#aa181f" }} />
            <p className="font-serif text-lg font-semibold tracking-wide" style={{ color: "#0a1730" }}>
              Todo comienza aquí
            </p>
            <h2 className="font-serif text-2xl font-semibold leading-tight sm:text-3xl lg:text-[44px] lg:leading-[50px]" style={{ color: "#0a1730" }}>
              Despertamos en nuestros pequeños la curiosidad a través de sus sentidos
            </h2>
            <p className="max-w-2xl text-base leading-relaxed sm:text-lg lg:text-[22px] lg:leading-[30px]" style={{ color: "#494949" }}>
              En esta etapa, actividades divertidas y un ambiente de confianza y cariño favorecen el desarrollo de sus
              habilidades motrices y afectivo-sociales.
            </p>
          </div>
        </div>

        {/* pt-* reserva espacio dentro de la caja recortada para que la nube
            no se corte al aparecer; -mt-* compensa ese padding para que las
            tarjetas visualmente queden a la misma distancia del encabezado. */}
        <div className="relative overflow-hidden pt-[220px] -mt-[172px] sm:pt-[240px] sm:-mt-[184px]">
          <div
            className="animate-cards-marquee flex w-max gap-6"
            style={{ animationDirection: flowDirection }}
          >
            {cards.map((item, i) => (
              <Card key={`${item.key}-${i}`} item={item} />
            ))}
          </div>

          {/* Controles laterales — a los bordes del carrusel, centrados
              verticalmente con la fila de tarjetas (no con toda la caja,
              que incluye el espacio reservado para la nube). La flecha
              izquierda mueve la fila hacia la izquierda; la derecha, hacia
              la derecha. */}
          <Arrow
            direction="left"
            onClick={() => setFlowDirection("normal")}
            className="absolute left-3 top-[370px] z-30 -translate-y-1/2 sm:left-6 sm:top-[430px]"
          />
          <Arrow
            direction="right"
            onClick={() => setFlowDirection("reverse")}
            className="absolute right-3 top-[370px] z-30 -translate-y-1/2 sm:right-6 sm:top-[430px]"
          />
        </div>
      </div>
    </section>
  );
}
