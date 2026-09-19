import ChampalHeroSequence from "@/components/hero/ChampalHeroSequence";
import ExploreToWorldsFlow from "@/components/mas-alla-del-aula/ExploreToWorldsFlow";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div id="home-content" tabIndex={-1} className="flex flex-col flex-1">
      <main className="flex-1">
        <ChampalHeroSequence />
        <ExploreToWorldsFlow />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
