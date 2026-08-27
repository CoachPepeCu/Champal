"use client";

import { useEffect } from "react";

/**
 * CardStackAnchorFix
 * -------------------
 * Sin salida visual (`return null`) — solo efectos secundarios, montado UNA
 * vez en layout.js (corre en cada página del sitio). Corrige dos síntomas
 * del mismo problema que el usuario reportó probando el `<CardStack>` de
 * Preparatoria — pero el bug vive en el propio `CardStack` (ver su
 * `data-card-stack` en CardStack.jsx), así que afecta por igual a
 * Kinder/Secundaria, que usan el mismo componente; el fix vive acá,
 * centralizado, en vez de repetido en cada Accesos*.js.
 *
 * 1) SALTO INSTANTÁNEO al entrar por ancla. Un link `<a href="#id">` cuyo
 *    destino vive DENTRO de un CardStack (ej. los accesos "Inglés",
 *    "International High School"...) normalmente hereda el
 *    `scroll-behavior:smooth` global del sitio (definido a propósito en
 *    globals.css + `data-scroll-behavior` en layout.js, para el resto de
 *    la navegación por ancla — no tocar esa parte). El problema: como cada
 *    tarjeta del stack añade ~190vh de alto de scroll (ver DWELL_VH/
 *    OVERLAP_VH en CardStack.jsx), un salto "smooth" a la ÚLTIMA tarjeta
 *    recorre TODO ese tramo de forma animada — visualmente reproduce en
 *    cámara rápida el apilado de las tarjetas anteriores antes de llegar
 *    al destino, en vez de mostrarlo ya asentado. A pedido del usuario,
 *    este listener intercepta esos clics específicos (comprobando que el
 *    destino tenga un ancestro `[data-card-stack]`) y hace el salto con
 *    `behavior:"instant"` — el resto de los links ancla del sitio (los que
 *    NO apuntan a algo dentro de un CardStack) siguen exactamente igual
 *    que antes, sin tocarlos.
 *
 * 2) SCROLL CON RUEDA "atorado". Con `scroll-behavior:smooth` activo,
 *    Chrome trata cada "click" de la rueda del mouse (no del trackpad,
 *    que manda deltas continuos) como el disparador de su propia mini
 *    animación de scroll — si el usuario vuelve a girar la rueda antes de
 *    que esa animación termine, el evento nuevo puede quedar "comido",
 *    sintiéndose como que la página se traba y hay que repetir el gesto
 *    2-3 veces para que avance. Reportado por el usuario como más notorio
 *    justo en los bordes de cada tarjeta del stack (donde además cambia el
 *    elemento `sticky` activo, agravando el efecto). Mientras haya
 *    eventos `wheel` Y la página tenga algún `<CardStack>` en el DOM, se
 *    apaga `scroll-behavior` (a `auto`, 1:1 e inmediato) y se restaura el
 *    `smooth` global 170ms después del último evento — así el scroll
 *    manual con rueda deja de animarse en mini-tramos, pero cualquier
 *    salto por click (ancla, "volver arriba", etc.) conserva su
 *    `scroll-behavior:smooth` normal.
 */
export default function CardStackAnchorFix() {
  useEffect(() => {
    function onClick(e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target || !target.closest("[data-card-stack]")) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "instant", block: "start" });
      // Refleja el ancla en la URL (compartible, botón "atrás") sin volver a
      // disparar un scroll — `history.pushState` cambia la URL sin más, a
      // diferencia de `location.hash = id`, que el navegador interpreta como
      // una nueva navegación por ancla y vuelve a hacer scroll (esta vez con
      // el `scroll-behavior:smooth` normal, deshaciendo el salto instantáneo
      // recién hecho).
      window.history.pushState(null, "", `#${id}`);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    let restoreTimer = null;
    function onWheel() {
      if (!document.querySelector("[data-card-stack]")) return;
      document.documentElement.style.scrollBehavior = "auto";
      clearTimeout(restoreTimer);
      restoreTimer = setTimeout(() => {
        document.documentElement.style.scrollBehavior = "";
      }, 170);
    }
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(restoreTimer);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return null;
}
