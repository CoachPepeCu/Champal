import Header from "@/components/Header";
import PreKinderHero from "@/components/PreKinderHero";
import PreKinderAccesos from "@/components/PreKinderAccesos";
import PreKinderAsiSeVive from "@/components/PreKinderAsiSeVive";
import PreKinderDescubrir from "@/components/PreKinderDescubrir";
import PreKinderTodoComienza from "@/components/PreKinderTodoComienza";
import PreKinderDesarrollo from "@/components/PreKinderDesarrollo";
import HorariosServicios from "@/components/HorariosServicios";
import Footer from "@/components/Footer";
import HalconButton from "@/components/HalconButton";

export const metadata = {
  title: "Pre-Kinder | Colegio Champal",
  description:
    "Educación basada en la curiosidad, el pensamiento crítico y el respeto. Conoce el nivel Pre-Kinder de Colegio Champal.",
};

export default function PreKinderPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <PreKinderHero />
        <PreKinderAccesos />
        <PreKinderAsiSeVive />
        <PreKinderDescubrir />
        <PreKinderTodoComienza />
        <PreKinderDesarrollo />
        <HorariosServicios />
      </main>
      <Footer />
      <HalconButton />
    </div>
  );
}
