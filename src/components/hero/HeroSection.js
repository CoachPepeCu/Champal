// Wrapper <section> común a todos los Hero de nivel. id="top" — el Header
// usa este id (el mismo que la home) para saber cuándo oscurecerse al hacer
// scroll fuera del hero.
export default function HeroSection({ children }) {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {children}
    </section>
  );
}
