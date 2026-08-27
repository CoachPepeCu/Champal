import Header from "@/components/Header";
import SecundariaHero from "@/components/SecundariaHero";
import SecundariaAccesos from "@/components/SecundariaAccesos";
import SecundariaProgramas from "@/components/SecundariaProgramas";
import SecundariaAccesosEspecializados from "@/components/SecundariaAccesosEspecializados";
import Cambridge from "@/components/Cambridge";
import Footer from "@/components/Footer";
import HalconButton from "@/components/HalconButton";

export const metadata = {
  title: "Secundaria | Colegio Champal",
  description:
    "Fomentamos el valor de tomar buenas decisiones con libertad y responsabilidad. Conoce el nivel Secundaria de Colegio Champal.",
};

export default function SecundariaPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <SecundariaHero />
        <SecundariaAccesos />
        {/* "03_..." de Secundaria todavía no existe en la página — 04_Programas
            (node 360:818) va pegada directo después de Accesos por ahora;
            si 03 se construye más adelante, insertarla entre ambas. */}
        <SecundariaProgramas />
        <SecundariaAccesosEspecializados />
        <Cambridge />
      </main>
      <Footer />
      <HalconButton />
    </div>
  );
}
