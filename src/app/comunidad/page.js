import Header from "@/components/Header";
import ComunidadRecursos from "@/components/comunidad-recursos/ComunidadRecursos";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Comunidad | Colegio Champal",
  description:
    "Recursos de apoyo para la comunidad del Colegio Champal: salud mental, protección, inclusión y convivencia digital.",
};

export default function ComunidadPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 pt-[88px]">
        <ComunidadRecursos />
      </main>
      <Footer />
    </div>
  );
}
