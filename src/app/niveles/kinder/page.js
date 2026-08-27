import Header from "@/components/Header";
import KinderHero from "@/components/KinderHero";
import KinderAccesos from "@/components/KinderAccesos";
import KinderDescubrir from "@/components/KinderDescubrir";
import KinderProgramas from "@/components/KinderProgramas";
import KinderIngles from "@/components/KinderIngles";
import KinderLectoEscritura from "@/components/KinderLectoEscritura";
import KinderLogica from "@/components/KinderLogica";
import HorariosServicios from "@/components/HorariosServicios";
import Footer from "@/components/Footer";
import HalconButton from "@/components/HalconButton";
import CardStack from "@/components/effects/CardStack";

export const metadata = {
  title: "Kinder | Colegio Champal",
  description:
    "Iniciamos el maravilloso viaje por la lectoescritura y la lógica-matemática. Conoce el nivel Kinder de Colegio Champal.",
};

export default function KinderPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <KinderHero />
        <KinderAccesos />
        <KinderDescubrir />
        <KinderProgramas />
        <CardStack>
          <KinderIngles />
          <KinderLectoEscritura />
          <KinderLogica />
        </CardStack>
        <HorariosServicios />
      </main>
      <Footer />
      <HalconButton />
    </div>
  );
}
