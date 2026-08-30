"use client";

// Página de preview aislada para el visor 3D de Spline "CRAFT" — NO enlazada
// desde el Header ni el Footer, y NO aplicada a ninguna página real. Bórrala
// cuando ya no la necesites; sirve solo para ver la animación del planeta en
// aislamiento y verificar transparencia/responsividad.
//
// Ver en dev: http://localhost:3000/dev/spline-craft

import SplineCraft from "@/components/spline/SplineCraft";

export default function SplineCraftDemoPage() {
  return (
    <main
      className="min-h-screen py-10"
      style={{
        // Fondo a rayas (en vez de un color plano) a propósito: si la
        // escena de Spline tuviera un fondo opaco se vería como un cuadrado
        // sólido tapando las rayas; si es transparente, las rayas del
        // "planeta" y de la página se ven de forma continua.
        background:
          "repeating-linear-gradient(45deg, var(--color-surface-100), var(--color-surface-100) 12px, var(--color-navy-100) 12px, var(--color-navy-100) 24px)",
      }}
    >
      <div className="mx-auto mb-8 max-w-3xl px-6 text-center">
        <h2 className="font-serif text-2xl text-primary">Spline CRAFT — demo aislada</h2>
        <p className="mt-2 text-sm text-ink-700">
          Visor 3D del planeta CRAFT (Spline). Contenedor cuadrado, máx. 420×420px
          en escritorio, responsivo en móvil sin scroll horizontal.
        </p>
      </div>

      <div className="px-6">
        <SplineCraft />
      </div>
    </main>
  );
}
