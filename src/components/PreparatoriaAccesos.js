import Image from "next/image";

// "02_Accesos" de Preparatoria (node 437:772) — mismo patrón "de vidrio"
// sobre fondo navy que Secundaria (SecundariaAccesos.js): idéntico
// degradado de sección, mismo panel con borde/sombra, mismas tarjetas con
// degradado+borde+sombra interior (los valores de get_design_context caen
// prácticamente idénticos a los ya usados en Secundaria — mismo token de
// marca reutilizado, solo cambia el redondeo del ángulo del degradado por
// instancia de Figma). Va pegada directo debajo del Hero (el nodo empieza
// justo en y:720, el borde inferior del Hero, node 437:772).
//
// A diferencia de Secundaria (3 accesos), Preparatoria trae un 4o acceso
// "International High School" (node 448:797) con una tarjeta especial: en
// vez de insignia circular + título + descripción centrados, lleva la
// imagen de banderas México/EUA (node 449:1146) ocupando la mitad derecha
// de la tarjeta (se sale un poco del borde derecho — el propio
// `overflow-hidden` de la tarjeta la recorta, igual que las fotos que se
// salen del borde en SecundariaAccesosEspecializados.js) y el texto
// (título en 2 líneas + "Doble certificación") en la esquina superior
// izquierda, sin insignia.
//
// Los 4 destinos ya existen (PreparatoriaAccesosEspecializados.js —
// 05_Prepa_Ingles/06_Prepa_Progrentis/07_Prepa_Digital/08_Prepa_International):
// #ingles, #progrentis, #vanguardia-digital, #international-high-school son
// los ids reales de esas 4 tarjetas.
const ACCESOS = [
  {
    key: "ingles",
    title: "INGLÉS",
    desc: "Certificaciones en inglés por la universidad de Cambridge",
    icon: "/images/preparatoria/accesos-icono-ingles.png",
    href: "#ingles",
  },
  {
    key: "progrentis",
    title: "PROGRENTIS",
    desc: "Aprenden a comprender, investigar y pensar mejor",
    icon: "/images/preparatoria/accesos-icono-progrentis.png",
    href: "#progrentis",
  },
  {
    key: "vanguardia-digital",
    title: "VANGUARDIA DIGITAL",
    desc: "Uso de tecnologías digitales para aprender y crear",
    icon: "/images/preparatoria/accesos-icono-vanguardia-digital.png",
    href: "#vanguardia-digital",
  },
];

// Envoltorio compartido de tarjeta (borde/gradiente/sombra idénticos en las
// 4, incl. la de International High School) — mismos tokens que
// SecundariaAccesos.js. `href` la vuelve un link ancla hacia su tarjeta de
// detalle en PreparatoriaAccesosEspecializados.js.
//
// SIN padding propio (a diferencia de la versión anterior): la tarjeta de
// International High School necesita que la bandera llegue hasta el borde
// REAL de la tarjeta (igual que en Figma, node 449:1146), así que el
// padding ahora lo pone cada tarjeta en su propio contenido interior — ver
// nota en el 4o acceso más abajo.
function CardShell({ href, children }) {
  return (
    <a
      href={href}
      className="group relative flex overflow-hidden rounded-[22px] border transition-transform duration-300 ease-out hover:-translate-y-1"
      style={{
        borderColor: "rgba(255,255,255,0.26)",
        backgroundImage:
          "linear-gradient(131.11825049238723deg, rgb(102,141,179) 4.8663%, rgb(73,113,152) 48.428%, rgb(42,81,120) 93.698%)",
        boxShadow:
          "0px 14px 20px -3px rgba(4,16,32,0.6), inset 0px -14px 20px -2px rgba(16,43,73,0.48), inset 0px 3px 7px 0px rgba(255,255,255,0.38)",
      }}
    >
      {/* Glow blanco sutil detrás de la tarjeta, aparece en hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[30px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        style={{
          background: "radial-gradient(closest-side, rgba(255,255,255,0.35), rgba(255,255,255,0) 75%)",
          filter: "blur(12px)",
        }}
      />
      {children}
    </a>
  );
}

export default function PreparatoriaAccesos() {
  return (
    <section
      id="accesos"
      className="relative py-14 lg:py-20"
      style={{ backgroundImage: "linear-gradient(109.43170841245328deg, rgb(36,74,122) 0.26076%, rgb(10,23,48) 100%)" }}
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-sm font-semibold tracking-[1.4px]" style={{ color: "rgba(228,188,67,0.9)" }}>
          EXPLORA PREPARATORIA
        </p>
        <h2
          className="mt-2 max-w-3xl font-serif text-2xl font-semibold leading-snug sm:text-3xl lg:max-w-none lg:whitespace-nowrap lg:text-4xl"
          style={{ color: "#f4f0e8" }}
        >
          Metodologías activas que transforman el sistema en un laboratorio de ideas
        </h2>

        <div
          className="relative mt-8 grid grid-cols-1 gap-5 rounded-[28px] border px-5 py-6 shadow-[0px_6px_10px_-3px_rgba(2,7,17,0.42),0px_22px_32px_-8px_rgba(2,7,17,0.55)] sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:px-8 lg:py-5"
          style={{
            borderColor: "rgba(255,255,255,0.14)",
            backgroundImage:
              "linear-gradient(100.38622028043828deg, rgba(33,74,115,0.96) 0.57586%, rgba(22,54,92,0.978) 45.508%, rgb(10,33,62) 100%)",
          }}
        >
          {ACCESOS.map((item) => (
            <CardShell key={item.key} href={item.href}>
              <div className="flex w-full flex-col items-center px-4 py-6 text-center lg:py-5">
                <Image
                  src={item.icon}
                  alt=""
                  width={88}
                  height={88}
                  className="h-[72px] w-[72px] lg:h-[88px] lg:w-[88px]"
                />
                <h3
                  className="mt-3 font-serif text-lg font-semibold tracking-wide lg:text-xl"
                  style={{ color: "#fff9ef" }}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-snug" style={{ color: "rgba(255,249,239,0.9)" }}>
                  {item.desc}
                </p>
              </div>
            </CardShell>
          ))}

          {/* node 448:797 — Acceso_International_High_School: mismo shell,
              contenido especial (bandera de fondo + texto en la esquina,
              sin insignia). node 449:1146 ("icono Banderas High School 1")
              trae x:57 y:0 w:249 h:220 sobre un card de 284x220 — es decir,
              la bandera ocupa del ~20% al borde derecho REAL de la tarjeta
              (se sale un poco, x+w=306>284) y todo el alto — no una caja
              recortada aparte. Por eso ya NO lleva envoltorio con
              min-h/inset propio: es un <Image fill> anclado directo a los
              bordes de la tarjeta (izq:20%, resto de los lados a 0), detrás
              del texto (que ahora sí lleva su propio padding, ya que
              CardShell dejó de ponerlo). */}
          <CardShell href="#international-high-school">
            <div className="absolute inset-y-0 left-[20%] right-0">
              <Image
                src="/images/preparatoria/accesos-icono-banderas-ihs.png"
                alt="Bandera de México y Estados Unidos"
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
            <div className="relative flex w-full flex-col items-start p-4 pt-5 text-left">
              <h3
                className="font-serif text-base font-semibold leading-snug tracking-wide"
                style={{ color: "#fff9ef" }}
              >
                INTERNATIONAL
                <br />
                HIGH SCHOOL
              </h3>
              <p className="mt-2 max-w-[9.5rem] text-xs leading-snug tracking-wide" style={{ color: "rgba(255,249,239,0.9)" }}>
                Doble certificación
              </p>
            </div>
          </CardShell>
        </div>
      </div>
    </section>
  );
}
