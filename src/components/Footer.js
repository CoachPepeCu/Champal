import Image from "next/image";

// Enlaces exactos del diseño de Figma (node 82:777) — "Modelo educativo" no
// tiene una sección propia todavía, así que apunta a Niveles como el
// contenido más cercano; confirmar con el usuario si conviene crear una
// sección dedicada más adelante.
const COLUMNS = [
  {
    title: "Conoce Champal",
    widthClass: "lg:w-[180px]",
    links: [
      { label: "Colegio", href: "/#nosotros" },
      { label: "Modelo educativo", href: "/#niveles-educativos" },
      { label: "Explora Champal", href: "/#vida-estudiantil" },
      { label: "Admisiones", href: "/#admisiones" },
    ],
  },
  {
    title: "Niveles académicos",
    widthClass: "lg:w-[230px]",
    // Mismos destinos que el submenú "Niveles" del header: la ruta propia
    // si ya existe (Pre-Kinder), el ancla de la home si aún no.
    links: [
      { label: "Pre-Kinder", href: "/niveles/pre-kinder" },
      { label: "Kinder", href: "/niveles/kinder" },
      { label: "Primaria", href: "/niveles/primaria" },
      { label: "Secundaria", href: "/niveles/secundaria" },
      { label: "Preparatoria", href: "/niveles/preparatoria" },
      { label: "International High School", href: "/#international-high-school" },
    ],
  },
];

const SOCIAL = [
  { label: "Facebook", href: "https://www.facebook.com/colegiochampal", icon: "/icons/social-facebook.svg", width: 22, height: 22 },
  { label: "X", href: "https://x.com/colegiochampal", icon: "/icons/social-x.svg", width: 22, height: 22 },
  { label: "YouTube", href: "https://www.youtube.com/colegiochampal", icon: "/icons/social-youtube.svg", width: 24, height: 22 },
  { label: "Instagram", href: "https://www.instagram.com/colegiochampal", icon: "/icons/social-instagram.svg", width: 22, height: 22 },
  { label: "TikTok", href: "https://www.tiktok.com/discover/colegio-champal", icon: "/icons/social-tiktok.svg", width: 22, height: 22 },
];

// Degradado de 3 capas — valores exactos de Figma (nodes 82:49 / 82:50 / 82:51)
// — matiza la foto de fondo hacia el navy institucional sin taparla del todo.
const OVERLAY_AZUL =
  "linear-gradient(68.65033514461675deg, rgba(10,23,48,0.9) 1.9691%, rgba(10,23,48,0.772) 11.457%, rgba(10,23,48,0.78) 24.086%, rgba(10,23,48,0.52) 38.48%)";
const OVERLAY_INCLINADO =
  "linear-gradient(-23.82787113711285deg, rgb(10,23,48) 4.4805%, rgba(10,23,48,0.78) 12.618%, rgba(10,23,48,0.52) 32.002%)";
const OVERLAY_ARRIBA =
  "linear-gradient(217.73304095535025deg, rgb(10,23,48) 1.4766%, rgba(10,23,48,0.78) 3.9674%, rgba(10,23,48,0.52) 9.9003%)";

export default function Footer() {
  return (
    <footer id="contacto" className="relative overflow-hidden" style={{ backgroundColor: "#0a1730" }}>
      <div className="absolute inset-0">
        <Image src="/images/footer-edificio.webp" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ backgroundImage: OVERLAY_AZUL }} />
        <div className="absolute inset-0" style={{ backgroundImage: OVERLAY_INCLINADO }} />
        <div className="absolute inset-0" style={{ backgroundImage: OVERLAY_ARRIBA }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-14 pb-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Col_Identidad */}
          <div className="flex shrink-0 flex-col items-center gap-3">
            <Image
              src="/images/footer-logo-champal-blanco.svg"
              alt="Colegio Champal"
              width={200}
              height={83}
            />
            <Image
              src="/images/footer-champal-35.svg"
              alt="35 años Colegio Champal"
              width={120}
              height={87}
              className="mt-[44px]"
            />
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className={`flex flex-col items-start gap-3 ${col.widthClass}`}>
              <h4
                className="font-serif text-base font-semibold text-white"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm leading-[22px] text-white/[0.86] transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col_Contacto */}
          <div className="flex flex-col items-start gap-3 lg:w-[380px]">
            <h4
              className="font-serif text-base font-semibold text-white"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Contacto
            </h4>
            <p className="text-sm leading-[22px] text-white/[0.86]">
              Prolongación de Ignacio Allende No. 162
              <br />
              Colonia Sabina, Villahermosa, Centro
              <br />
              Tabasco, C.P. 86153
            </p>
            <div className="text-[15px] font-medium leading-[22px] text-white/[0.86]">
              <a href="tel:+19933515478" className="block transition-colors duration-200 hover:text-white">
                (993) 351 5478
              </a>
              <a href="tel:+19933516869" className="block transition-colors duration-200 hover:text-white">
                (993) 351 6869
              </a>
              <a href="tel:+19933513250" className="block transition-colors duration-200 hover:text-white">
                (993) 351 3250
              </a>
            </div>
            <a
              href="mailto:contacto@colegiochampal.edu.mx"
              className="text-sm font-medium text-white transition-colors duration-200 hover:text-white/80"
            >
              contacto@colegiochampal.edu.mx
            </a>
            <div className="flex items-center gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/25"
                  style={{ backgroundColor: "rgba(255,255,255,0.14)", border: "1.5px solid rgba(255,255,255,0.9)" }}
                >
                  <Image src={s.icon} alt="" width={s.width} height={s.height} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.34)" }} />

        <div className="mt-6 flex flex-col items-center gap-3 text-xs text-white/[0.76] sm:flex-row sm:justify-between">
          <p>© 2026 Colegio Champal. Todos los derechos reservados.</p>
          <a href="#" className="transition-colors duration-200 hover:text-white">
            Aviso de privacidad
          </a>
        </div>
      </div>
    </footer>
  );
}
