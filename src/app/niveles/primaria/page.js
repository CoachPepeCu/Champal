import Header from "@/components/Header";
import PrimariaHero from "@/components/PrimariaHero";
import PrimariaAccesos from "@/components/PrimariaAccesos";
import PrimariaFormacion from "@/components/PrimariaFormacion";
import PrimariaProgramas from "@/components/PrimariaProgramas";
import PrimariaIngles from "@/components/PrimariaIngles";
import PrimariaProgrentis from "@/components/PrimariaProgrentis";
import PrimariaFinanciera from "@/components/PrimariaFinanciera";
import PrimariaEmocional from "@/components/PrimariaEmocional";
import Cambridge from "@/components/Cambridge";
import Footer from "@/components/Footer";
import HalconButton from "@/components/HalconButton";

export const metadata = {
  title: "Primaria | Colegio Champal",
  description:
    "Preguntamos más, aprendemos mejor. Conoce el nivel Primaria de Colegio Champal.",
};

export default function PrimariaPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <PrimariaHero />
        <PrimariaAccesos />
        <PrimariaFormacion />
        <PrimariaProgramas />
        <PrimariaIngles />
        <PrimariaProgrentis />
        <PrimariaFinanciera />
        <PrimariaEmocional />
        <Cambridge />
      </main>
      <Footer />
      <HalconButton />
    </div>
  );
}
