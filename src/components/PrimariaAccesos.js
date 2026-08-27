import Image from "next/image";

// "02_Accesos" de Primaria (node 198:539) — mismo patrón "de vidrio" sobre
// fondo navy que KinderAccesos.js/PreKinderAccesos.js (mismo degradado,
// misma estructura de panel/tarjeta), con el contenido/íconos propios de
// Primaria. Los 4 íconos que trae Figma (Inglés, PROGRENTIS, Educación
// Financiera, Educación Socioemocional) ya vienen exportados cuadrados
// (100x100 / 150x150 / 150x150 / 200x200, con su propio margen transparente
// horneado), así que el mismo tamaño uniforme h/w del patrón de Kinder les
// queda bien sin distorsionarlos. Va pegada directo debajo del Hero.
const ACCESOS = [
  {
    key: "ingles",
    title: "Inglés",
    desc: "Inician su camino hacia las certificaciones de Cambridge",
    icon: "/images/primaria/accesos-icono-ingles.png",
    href: "#ingles",
  },
  {
    key: "progrentis",
    title: "PROGRENTIS",
    desc: "Pensar mejor para aprender más",
    icon: "/images/primaria/accesos-icono-progrentis.png",
    href: "#progrentis",
  },
  {
    key: "educacion-financiera",
    title: "Educación Financiera",
    desc: "Descubren el valor del dinero y aprenden a administrarlo",
    icon: "/images/primaria/accesos-icono-financiera.png",
    href: "#educacion-financiera",
  },
  {
    key: "educacion-socioemocional",
    title: "Educación Socioemocional",
    desc: "Conocerse, convivir y actuar con confianza",
    icon: "/images/primaria/accesos-icono-socioemocional.png",
    href: "#educacion-socioemocional",
  },
];

export default function PrimariaAccesos() {
  return (
    <section
      id="accesos"
      className="relative py-14 lg:py-20"
      style={{ backgroundImage: "linear-gradient(109.43170841245328deg, rgb(36,74,122) 0.26076%, rgb(10,23,48) 100%)" }}
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-sm font-semibold tracking-[1.4px]" style={{ color: "rgba(228,188,67,0.9)" }}>
          EXPLORA PRIMARIA
        </p>
        <h2
          className="mt-2 max-w-3xl font-serif text-2xl font-semibold leading-snug sm:text-3xl lg:max-w-none lg:whitespace-nowrap lg:text-4xl"
          style={{ color: "#f4f0e8" }}
        >
          Una fusión de rigor académico, valores e innovación
        </h2>

        <div
          className="relative mt-8 grid grid-cols-1 gap-5 rounded-[28px] border px-5 py-6 shadow-[0px_6px_10px_-3px_rgba(2,7,17,0.42),0px_22px_32px_-8px_rgba(2,7,17,0.55)] sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-[27px] lg:px-8 lg:py-5"
          style={{
            borderColor: "rgba(255,255,255,0.14)",
            backgroundImage:
              "linear-gradient(100.38622028043828deg, rgba(33,74,115,0.96) 0.57586%, rgba(22,54,92,0.978) 45.508%, rgb(10,33,62) 100%)",
          }}
        >
          {ACCESOS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="group relative flex flex-col items-center rounded-[22px] border px-4 py-6 text-center transition-transform duration-300 ease-out hover:-translate-y-1 lg:py-5"
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
