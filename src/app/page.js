import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Bienvenidos from "@/components/Bienvenidos";
import Comunidad from "@/components/Comunidad";
import Niveles from "@/components/Niveles";
import Ventajas from "@/components/Ventajas";
import StatsRow from "@/components/StatsRow";
import WhyChampal from "@/components/WhyChampal";
import HistoryTimeline from "@/components/HistoryTimeline";
import Testimonials from "@/components/Testimonials";
import ExploreChampal from "@/components/ExploreChampal";
import AdmissionsSteps from "@/components/AdmissionsSteps";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <Hero />
        <Bienvenidos />
        <Comunidad />
        <Niveles />
        <Ventajas />
        <StatsRow />
        <WhyChampal />
        <HistoryTimeline />
        <Testimonials />
        <ExploreChampal />
        <AdmissionsSteps />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
