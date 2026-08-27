"use client";

// Página de preview aislada para CardStack — NO enlazada desde el Header ni
// el Footer, y NO aplicada a ningún Hero/sección real todavía. Bórrala
// cuando ya no la necesites; sirve solo para comparar scaleDown=true vs.
// scaleDown=false en aislamiento.
//
// Ver en dev: http://localhost:3000/dev/card-stack

import CardStack from "@/components/effects/CardStack";

// Tarjeta de placeholder con wrapper propio — sombras/bordes tomados de
// Design System v2 (.claude/skills/champal-design/tokens/spacing.css):
// --radius-lg (16px, "large photo/hero tiles" por su readme) +
// --shadow-elevated (0 8px 24px rgba(10,31,61,0.14)) + hairline
// --border-default (--ink-100 = #DCE0E6). Esos custom properties no están
// definidos todavía en src/app/globals.css (solo viven en el bundle del
// skill), así que se usan sus valores LITERALES aquí en vez de var(...).
// Colores de marca (navy/red) sí vienen de globals.css (--color-*, Design
// System v2 §2.1/§2.2).
const CARD_RADIUS = 16; // --radius-lg
const CARD_SHADOW = "0 8px 24px rgba(10,31,61,0.14)"; // --shadow-elevated
const CARD_BORDER = "1px solid #DCE0E6"; // --border-default (--ink-100)

const CARDS = [
  {
    key: "explorar",
    label: "01",
    eyebrow: "Educación Integral",
    title: "Exploran su mundo con curiosidad",
    accent: "var(--color-accent)",
    bg: "var(--color-navy-900)",
  },
  {
    key: "crecer",
    label: "02",
    eyebrow: "Formación Socioemocional",
    title: "Crecen seguros y acompañados",
    accent: "var(--color-gold)",
    bg: "var(--color-navy-700)",
  },
  {
    key: "aprender",
    label: "03",
    eyebrow: "Excelencia Académica",
    title: "Aprenden con propósito y método",
    accent: "var(--color-accent-light)",
    bg: "var(--color-navy-800)",
  },
  {
    key: "proyectar",
    label: "04",
    eyebrow: "Preparación Universitaria",
    title: "Proyectan su futuro con confianza",
    accent: "var(--color-teal)",
    bg: "var(--color-primary)",
  },
];

function PlaceholderCard({ card }) {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center px-6">
      <div
        className="flex h-full w-full max-w-4xl flex-col justify-center gap-6 p-10 sm:p-14"
        style={{
          borderRadius: CARD_RADIUS,
          boxShadow: CARD_SHADOW,
          border: CARD_BORDER,
          backgroundColor: card.bg,
          color: "#ffffff",
        }}
      >
        <span className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: card.accent }}>
          {card.label} — {card.eyebrow}
        </span>
        <h3 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">{card.title}</h3>
        <p className="max-w-lg text-lg leading-relaxed text-white/80">
          Contenido de relleno para ver el efecto de apilado — esta tarjeta no representa ningún
          programa real, solo demuestra cómo CardStack maneja sticky + z-index + opacidad/escala.
        </p>
        <span className="h-[6px] w-16 rounded-full" style={{ backgroundColor: card.accent }} />
      </div>
    </div>
  );
}

function Demo({ title, description, scaleDown }) {
  return (
    <section className="border-t border-[#DCE0E6] py-10">
      <div className="mx-auto mb-6 max-w-3xl px-6 text-center">
        <h2 className="font-serif text-2xl text-primary">{title}</h2>
        <p className="mt-2 text-sm text-ink-700">{description}</p>
      </div>

      <CardStack scaleDown={scaleDown}>
        {CARDS.map((card) => (
          <PlaceholderCard key={card.key} card={card} />
        ))}
      </CardStack>
    </section>
  );
}

export default function CardStackDemoPage() {
  return (
    <main className="min-h-screen bg-surface-100">
      <div className="mx-auto max-w-3xl px-6 pt-10 text-center">
        <h1 className="font-serif text-3xl text-primary">CardStack — demo aislada</h1>
        <p className="mt-2 text-sm text-ink-700">
          4 tarjetas de placeholder · haz scroll para ver el apilado. Dos demos independientes abajo
          para comparar <code>scaleDown</code> true vs. false.
        </p>
      </div>

      <Demo
        title="scaleDown = true (default)"
        description="Cada tarjeta, además de perder opacidad, se encoge levemente (1 → 0.92) mientras la siguiente la cubre."
        scaleDown
      />

      <Demo
        title="scaleDown = false"
        description="Cada tarjeta mantiene su tamaño completo — solo cambia la opacidad (1 → 0.6), sin ningún cambio de escala."
        scaleDown={false}
      />

      {/* Relleno final para poder hacer scroll más allá de la última tarjeta
          de la segunda demo y confirmar que no queda nada "flotando". */}
      <div className="h-[30vh]" />
    </main>
  );
}
