// Página de preview aislada para el módulo Nosotros — NO enlazada desde el
// Header ni el Footer, y NO integrada en ninguna página existente todavía.
// Sirve solo para revisar el banner "Conoce Nuestra Historia / Nuestro
// Futuro" en aislamiento, en escritorio/tableta/móvil.
//
// Ver en dev: http://localhost:3000/dev/nosotros

import NosotrosHistoria from "@/components/nosotros/NosotrosHistoria";

export const metadata = {
  title: "Nosotros | Vista de desarrollo",
};

export default function NosotrosDevPage() {
  return (
    <main className="min-h-screen bg-white">
      <NosotrosHistoria />
    </main>
  );
}
