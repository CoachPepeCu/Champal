import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Bienvenidos from "@/components/Bienvenidos";
import Comunidad from "@/components/Comunidad";
import Niveles from "@/components/Niveles";
import ExploreChampal from "@/components/ExploreChampal";
import NosotrosHistoria from "@/components/nosotros/NosotrosHistoria";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SomosHalconesIntroGate from "@/components/intro/SomosHalconesIntroGate";

export default function Home() {
  return (
    <>
      <SomosHalconesIntroGate homeId="home-content" />
      <div id="home-content" tabIndex={-1} className="flex flex-col flex-1">
        <Header />
        <main className="flex-1">
          <Hero />
          <Bienvenidos />
          <Comunidad />
          <Niveles />
          <ExploreChampal />
          <NosotrosHistoria />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
}
