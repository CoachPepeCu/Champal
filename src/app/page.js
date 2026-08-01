import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsRow from "@/components/StatsRow";
import TodayInChampal from "@/components/TodayInChampal";
import QuickAccessGrid from "@/components/QuickAccessGrid";
import MonthGallery from "@/components/MonthGallery";
import WhyChampal from "@/components/WhyChampal";
import HistoryTimeline from "@/components/HistoryTimeline";
import GlobalReach from "@/components/GlobalReach";
import EducationLevels from "@/components/EducationLevels";
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
        <StatsRow />
        <TodayInChampal />
        <QuickAccessGrid />
        <MonthGallery />
        <WhyChampal />
        <HistoryTimeline />
        <GlobalReach />
        <EducationLevels />
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
