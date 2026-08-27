"use client";

// Página de preview aislada para PixelCurtain — NO enlazada desde el Header
// ni el Footer, y NO aplicada a ningún Hero real. Bórrala cuando ya no la
// necesites; sirve solo para ver el efecto en aislamiento.
//
// Ver en dev: http://localhost:3000/dev/pixel-curtain

import { useState } from "react";
import PixelCurtain from "@/components/effects/PixelCurtain";

function FakeHero() {
  return (
    <section className="flex h-[70vh] w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary to-primary-light text-white">
      <h1 className="font-serif text-4xl sm:text-5xl">Educación que impulsa su futuro.</h1>
      <p className="max-w-md text-center text-white/85">
        Este es un placeholder de Hero solo para ver la cortina de píxeles en
        aislamiento — no es el Hero real del sitio.
      </p>
    </section>
  );
}

export default function PixelCurtainDemoPage() {
  const [key, setKey] = useState(0);

  return (
    <main className="min-h-screen bg-surface-100 py-10">
      <div className="mx-auto mb-6 max-w-3xl px-6 text-center">
        <h2 className="font-serif text-2xl text-primary">PixelCurtain — demo aislada</h2>
        <p className="mt-2 text-sm text-ink-700">
          rows=8 cols=12 · duration=1s · color plano #6B92C9 · barrido diagonal
          inferior-izquierda → superior-derecha
        </p>
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="mt-4 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-light transition-colors"
        >
          Repetir animación
        </button>
      </div>

      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-lg">
        <PixelCurtain key={key} rows={8} cols={12} duration={1}>
          <FakeHero />
        </PixelCurtain>
      </div>
    </main>
  );
}
