import RayadosDesktopFrame from "./RayadosDesktopFrame";
import RayadosMobileStack from "./RayadosMobileStack";
import RayadosCards from "./RayadosCards";

// Frame "Rayados" (Figma node 1240:1190, canvas ~1440x1365) — SOLO el
// contenido visual/responsivo: encabezado con cancha/portería/portero,
// jugador ilustrado, bloque "SE PARTE DE / HALCONES CHAMPAL-RAYADOS /
// ESCUELA OFICIAL DE FÚTBOL" + halcón geométrico, franja de pasto y las
// cuatro tarjetas con hover/foco/toque. Deliberadamente SIN Header, Footer,
// botón Halcón, controles de cierre/regreso, navegación ni overlay — ver
// README.md de esta carpeta para el alcance completo y por qué.
export default function Rayados() {
  return (
    <section aria-label="Escuela Oficial Rayados de Monterrey" className="w-full bg-white">
      <RayadosMobileStack />
      <RayadosDesktopFrame />
      <div className="py-10 md:py-12 lg:py-14">
        <RayadosCards />
      </div>
    </section>
  );
}
