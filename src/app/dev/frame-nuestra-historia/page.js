import NuestraHistoria from "@/components/nuestra-historia/NuestraHistoria";

// Ruta temporal de desarrollo — solo para revisar el frame "Nuestra_Historia"
// (Figma node 1240:1191) en localhost. No forma parte de la navegación del
// sitio ni de ninguna página real.
export const metadata = {
  title: "Nuestra historia (frame) | Vista de desarrollo",
};

export default function FrameNuestraHistoriaDevPage() {
  return (
    <main className="min-h-screen bg-white">
      <NuestraHistoria />
    </main>
  );
}
