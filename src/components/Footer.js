import Image from "next/image";

const COLUMNS = [
  {
    title: "Nosotros",
    links: ["Historia", "Misión y visión", "Valores", "Equipo directivo"],
  },
  {
    title: "Académico",
    links: ["Modelo educativo", "Programas", "Bachillerato Internacional", "International High School"],
  },
  {
    title: "Vida Estudiantil",
    links: ["Actividades", "Deportes", "Arte y Cultura", "Pastoral"],
  },
  {
    title: "Comunidad",
    links: ["Noticias", "Calendario", "Galería", "Padres"],
  },
];

const SOCIAL = [
  {
    label: "Facebook",
    path: "M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z",
  },
  {
    label: "Instagram",
    path: "M8 3h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5zm0 2a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3V8a3 3 0 00-3-3H8zm4 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM17.8 6.2a1 1 0 110 2 1 1 0 010-2z",
  },
  {
    label: "YouTube",
    path: "M21.5 7.5s-.2-1.5-.9-2.2c-.8-.9-1.8-.9-2.2-1C15.6 4 12 4 12 4h0s-3.6 0-6.4.3c-.4 0-1.4.1-2.2 1-.7.7-.9 2.2-.9 2.2S2.2 9.3 2.2 11v1.9c0 1.7.3 3.5.3 3.5s.2 1.5.9 2.2c.8.9 1.9.9 2.4 1 1.7.2 7.2.3 7.2.3s3.6 0 6.4-.3c.4 0 1.4-.1 2.2-1 .7-.7.9-2.2.9-2.2s.3-1.7.3-3.5V11c0-1.7-.3-3.5-.3-3.5zM10 14.5v-6l5.2 3-5.2 3z",
  },
  {
    label: "LinkedIn",
    path: "M4.5 3.5a2 2 0 100 4 2 2 0 000-4zM3 9h3v12H3zM10 9h2.9v1.6h.04c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V21h-3v-6.1c0-1.5 0-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V21h-3z",
  },
];

export default function Footer() {
  return (
    <footer id="contacto" className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14 grid grid-cols-2 lg:grid-cols-6 gap-10">
        <div className="col-span-2">
          <Image
            src="/logo-champal.svg"
            alt="Colegio Champal"
            width={140}
            height={60}
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-xs">
            © 2026 Colegio Champal.
            <br />
            Todos los derechos reservados.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-serif text-sm text-white">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/70 hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/60 space-y-1 text-center sm:text-left">
            <p>(81) 8000 1064 al 07 · info@champal.edu.mx</p>
            <p>Av. Roatícosa 401 Col. El Barrial, Santiago, N.L., México</p>
          </div>

          <div className="flex items-center gap-3">
            {SOCIAL.map(({ label, path }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-accent transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
