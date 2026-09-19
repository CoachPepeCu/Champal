"use client";

import { useLayoutEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import NosotrosHistoria from "@/components/nosotros/NosotrosHistoria";
import ExploreToWorldsPhaseOne from "./ExploreToWorldsPhaseOne";

export default function ExploreToWorldsFlow() {
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <ExploreToWorldsPhaseOne />
      <NosotrosHistoria previousSectionOverlap={0} />
    </>
  );
}
