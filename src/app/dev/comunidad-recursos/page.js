// Página de preview aislada para ComunidadRecursos — NO enlazada desde el
// Header ni el Footer, y NO integrada a ninguna página real. Bórrala cuando
// ya no la necesites; sirve solo para revisar el marco "Comunidad" de Figma
// (node-id 1185:941) en aislamiento antes de decidir dónde/si se integra.
//
// Ver en dev: http://localhost:3000/dev/comunidad-recursos

import ComunidadRecursos from "@/components/comunidad-recursos/ComunidadRecursos";

export default function ComunidadRecursosDemoPage() {
  return (
    <main className="min-h-screen bg-[#eef0f4] py-10">
      <div className="mx-auto max-w-5xl px-6 pb-6 text-center">
        <h1 className="font-sans text-2xl font-bold text-primary">Comunidad — muestra aislada</h1>
        <p className="mt-2 text-sm text-ink-700">
          Réplica del marco de Figma &quot;Comunidad&quot; · no está integrado a ninguna página del sitio.
        </p>
      </div>
      <div className="mx-auto max-w-[1440px] px-4">
        <ComunidadRecursos />
      </div>
    </main>
  );
}
