import SomosHalconesIntro from "@/components/intro/SomosHalconesIntro";

export const metadata = {
  title: "Intro Somos Halcones | Desarrollo",
  robots: { index: false, follow: false },
};

export default function IntroSomosHalconesPage() {
  return <SomosHalconesIntro showReplayControl />;
}
