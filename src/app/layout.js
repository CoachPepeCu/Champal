import { Outfit, Fredoka, Patrick_Hand } from "next/font/google";
import "./globals.css";
import CardStackAnchorFix from "@/components/effects/CardStackAnchorFix";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Fuente manuscrita para los mensajes dentro de la nube-globo de diálogo
// (sección "Todo Comienza" de Pre-Kinder) — solo tiene peso 400.
const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Vive Champal | Colegio Champal",
  description:
    "Educación que impulsa su futuro. Conoce la comunidad educativa de Colegio Champal.",
};

export default function RootLayout({ children }) {
  return (
    // `data-scroll-behavior="smooth"` — Next.js 16 dejó de coordinarse
    // automáticamente con `scroll-behavior:smooth` (definido en
    // globals.css) durante sus propias transiciones internas; sin este
    // atributo, el scroll-al-ancla de los links `href="#id"` (p.ej. los 4
    // accesos de PreparatoriaAccesos.js) entra en carrera con el manejo de
    // scroll de Next y a veces la pierde, devolviendo la página a
    // scroll 0 a medio camino. Ver node_modules/next/dist/docs/01-app/
    // 02-guides/upgrading/version-16.md, sección "Scroll Behavior Override".
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${fredoka.variable} ${patrickHand.variable} h-full antialiased overflow-x-clip`}
    >
      {/* overflow-x-clip acá (no en cada sección, y no "hidden"): Bienvenidos.js
          necesita overflow visible en Y (el ADN y el "Camino Mural" invaden
          el Hero hacia arriba a propósito) pero sin overflow horizontal —
          mezclar "overflow-x-hidden overflow-y-visible" en la propia sección
          no funciona porque la spec de CSS fuerza ese "visible" a "auto" en
          cuanto el otro eje no es "visible" (hidden/scroll/auto), y "auto"
          recorta igual que "hidden" (así fue como se cortaba el ADN).
          "hidden" acá arriba en <html>/<body> tenía el mismo problema un
          nivel más arriba: forzaba el propio documento a volverse su scroll
          container en el eje Y (en vez de usar el scroll nativo del
          viewport), lo que dibujaba un borde/línea vertical delgada junto al
          scrollbar en TODA la página. "clip" sí recorta sin disparar esa
          conversión — no cuenta como "scrolleable", así que el otro eje se
          queda de verdad en "visible" y el documento vuelve a scrollear
          nativo, sin ese borde. */}
      <body className="min-h-full flex flex-col overflow-x-clip">
        {children}
        <CardStackAnchorFix />
      </body>
    </html>
  );
}
