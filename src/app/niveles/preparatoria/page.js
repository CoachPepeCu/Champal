import Header from "@/components/Header";
import PreparatoriaHero from "@/components/PreparatoriaHero";
import PreparatoriaAccesos from "@/components/PreparatoriaAccesos";
import PreparatoriaEditorial from "@/components/PreparatoriaEditorial";
import PreparatoriaProgramas from "@/components/PreparatoriaProgramas";
import PreparatoriaAccesosEspecializados from "@/components/PreparatoriaAccesosEspecializados";
import PreparatoriaInternationalHighSchool from "@/components/PreparatoriaInternationalHighSchool";
import PreparatoriaConveniosUniversitarios from "@/components/PreparatoriaConveniosUniversitarios";
import Cambridge from "@/components/Cambridge";
import Footer from "@/components/Footer";
import HalconButton from "@/components/HalconButton";

export const metadata = {
  title: "Preparatoria | Colegio Champal",
  description:
    "Descubrimos el potencial de cada persona para ayudarlo a trazar su proyecto de vida. Conoce el nivel Preparatoria de Colegio Champal.",
};

export default function PreparatoriaPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <PreparatoriaHero />
        <PreparatoriaAccesos />
        <PreparatoriaEditorial />
        <PreparatoriaProgramas />
        <PreparatoriaAccesosEspecializados />
        <PreparatoriaInternationalHighSchool />
        <PreparatoriaConveniosUniversitarios />
        <Cambridge />
      </main>
      <Footer />
      <HalconButton />
    </div>
  );
}
