// Degradado azul exacto de Figma ("Fondo_Azul_Hero") — mismo token de marca
// en todos los niveles (confirmado igual en Pre-Kinder node 82:195 y Kinder
// node 82:1553).
export const HERO_BLUE_GRADIENT =
  "linear-gradient(229.45117225739378deg, rgb(0,62,206) 1.4194%, rgb(12,36,67) 56.22%)";

// Banda azul — por defecto ancho completo, mitad inferior del canvas 1440x720
// (que es donde ha caído en los niveles vistos hasta ahora). Si algún nivel
// la trae en otra proporción, pasa `className` para sobreescribir el h-1/2.
export default function HeroBlueBand({ className = "absolute inset-x-0 bottom-0 h-1/2" }) {
  return <div className={className} style={{ backgroundImage: HERO_BLUE_GRADIENT }} />;
}
