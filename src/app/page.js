import ChampalHeroSequence from "@/components/hero/ChampalHeroSequence";
import ExploreChampal from "@/components/ExploreChampal";
import NosotrosHistoria from "@/components/nosotros/NosotrosHistoria";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div id="home-content" tabIndex={-1} className="flex flex-col flex-1">
      <main className="flex-1">
        <ChampalHeroSequence />
        <ExploreChampal />
        <NosotrosHistoria />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
