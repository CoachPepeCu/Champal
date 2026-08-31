"use client";

import { useCallback, useLayoutEffect, useState, useSyncExternalStore } from "react";

import SomosHalconesIntro from "./SomosHalconesIntro";
import PixelCurtain from "../effects/PixelCurtain";

export const SOMOS_HALCONES_SESSION_KEY = "champal:intro-somos-halcones:v1";

const prePaintCheck = `(function(){try{if(sessionStorage.getItem("${SOMOS_HALCONES_SESSION_KEY}")){document.currentScript.parentElement.hidden=true}}catch(error){}})()`;
const subscribe = () => () => {};

function getSessionSnapshot() {
  try {
    return sessionStorage.getItem(SOMOS_HALCONES_SESSION_KEY) === null;
  } catch {
    return true;
  }
}

export default function SomosHalconesIntroGate({ homeId }) {
  const sessionAllowsIntro = useSyncExternalStore(subscribe, getSessionSnapshot, () => true);
  const [dismissed, setDismissed] = useState(false);
  const [revealingHome, setRevealingHome] = useState(false);
  const visible = !dismissed && (sessionAllowsIntro || revealingHome);

  useLayoutEffect(() => {
    if (!visible) return undefined;

    const home = document.getElementById(homeId);
    if (!home) return undefined;

    const previousAriaHidden = home.getAttribute("aria-hidden");
    const wasInert = home.inert;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    home.inert = true;
    home.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      home.inert = wasInert;
      if (previousAriaHidden === null) home.removeAttribute("aria-hidden");
      else home.setAttribute("aria-hidden", previousAriaHidden);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [homeId, visible]);

  const handleComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SOMOS_HALCONES_SESSION_KEY, "seen");
    } catch {
      // El HOME nunca depende de que el navegador permita persistir la marca.
    }

    setRevealingHome(true);
  }, []);

  const handleHomeRevealed = useCallback(() => {
    setDismissed(true);
    requestAnimationFrame(() => {
      document.getElementById(homeId)?.focus({ preventScroll: true });
    });
  }, [homeId]);

  if (!visible) return null;

  return (
    <div
      suppressHydrationWarning
      style={{ position: "fixed", inset: 0, zIndex: 2147483647 }}
    >
      <script
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: prePaintCheck }}
      />
      {revealingHome ? (
        <PixelCurtain
          color="#6B92C9"
          duration={1}
          className="h-full w-full"
          onComplete={handleHomeRevealed}
        >
          <div className="h-full w-full" />
        </PixelCurtain>
      ) : (
        <SomosHalconesIntro onComplete={handleComplete} showReplayControl={false} />
      )}
    </div>
  );
}
