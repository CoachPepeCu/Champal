"use client";

// Componente aislado para probar el visor 3D de Spline (planeta "CRAFT").
// SOLO para la prueba en src/app/dev/spline-craft — no se usa en ninguna
// página real todavía. No lo importes fuera de esa página de prueba.
//
// El script del visor se carga vía next/script (strategy="afterInteractive").
// Next.js deduplica por `src`/`id`, así que aunque este componente se
// remonte (fast refresh, revisitar la ruta) el <script> solo se inyecta una
// vez — ver "Optimizing Scripts" en node_modules/next/dist/docs/01-app.

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const VIEWER_SRC =
  "https://cdn.spline.design/@splinetool/viewer@2.0.14/build/spline-viewer.webgpu.js";
const SCENE_URL = "https://prod.spline.design/UeotxmsAx4XR2hoq/scene.splinecode";

export default function SplineCraft() {
  const viewerRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Una vez el script terminó de cargar, confirmamos que el custom element
  // quedó registrado antes de confiar en él.
  useEffect(() => {
    if (!scriptReady || typeof window === "undefined" || !window.customElements) {
      return undefined;
    }

    let cancelled = false;
    window.customElements.whenDefined("spline-viewer").catch(() => {
      if (!cancelled) setError("No se pudo registrar el custom element <spline-viewer>.");
    });
    return () => {
      cancelled = true;
    };
  }, [scriptReady]);

  // El propio <spline-viewer> dispara "load" cuando termina de renderizar
  // la escena, y "error" si falla. Nos suscribimos apenas el script cargó,
  // que es cuando el elemento ya existe en el DOM con su comportamiento real.
  useEffect(() => {
    if (!scriptReady) return undefined;
    const el = viewerRef.current;
    if (!el) return undefined;

    const handleLoad = () => setSceneLoaded(true);
    const handleError = () => setError("La escena de Spline no pudo cargarse.");

    el.addEventListener("load", handleLoad);
    el.addEventListener("error", handleError);
    return () => {
      el.removeEventListener("load", handleLoad);
      el.removeEventListener("error", handleError);
    };
  }, [scriptReady]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <Script
        id="spline-viewer-webgpu"
        src={VIEWER_SRC}
        type="module"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setError("No se pudo cargar el script del visor de Spline.")}
      />

      {!sceneLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-ink-500">
            <span
              className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            <span className="text-xs">Cargando escena…</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-accent">
          {error}
        </div>
      )}

      <spline-viewer
        ref={viewerRef}
        url={SCENE_URL}
        className="block h-full w-full"
        // pan-y: deja que el gesto vertical del dedo siga haciendo scroll de
        // la página en móvil en vez de que el canvas WebGL/WebGPU lo capture,
        // sin desactivar nada que el propio visor ya maneje internamente.
        style={{ touchAction: "pan-y" }}
      />
    </div>
  );
}
