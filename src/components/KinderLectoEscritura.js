import Image from "next/image";

// Sección "07_Kinder_Lecto_Escritura" (node 128:549) — mismo esquema que
// "06_Kinder_Ingles" (KinderIngles.js): tarjeta de color sobre un marco
// ondulado sin esquinas redondeadas (full-bleed, va pegado a la pantalla),
// insignia circular que se sale por la esquina superior izquierda, foto
// grande con una mascota sobrepuesta, columna de texto con eyebrow +
// título + párrafo en su propio cuadro con scroll (mismo patrón que
// PreKinderDesarrollo.js `Ingles()` y que KinderIngles.js) para que el alto
// del marco lo defina la foto, no el párrafo. Aquí además hay dos
// "tarjetas de ventaja" (no existían en Inglés) debajo del párrafo.
//
// Diferencias con Inglés (incluidas a propósito, no son inconsistencias):
// - Foto a la IZQUIERDA, texto a la DERECHA (Inglés es al revés) — la
//   insignia sigue en la esquina superior izquierda, pero aquí queda
//   pegada arriba de la foto en vez de chocar con el texto.
// - Foto cuadrada con borde amarillo (no circular).
// - Una sola mascota (búho) en vez de logo+serpiente.
// - Ícono del cohete-crayón en la insignia en vez de "Hi/Hello".
// - Dos tarjetas de ventaja bajo el párrafo.
const GRADIENT = "linear-gradient(113.45743852761876deg, rgba(190,0,0,0.9) 40.449%, rgba(98,26,26,0.9) 97.849%)";
const ADVANTAGE_GRADIENT = "linear-gradient(to bottom, #0a1730, #163e7a)";

const ADVANTAGES = [
  { key: "palabras", text: "Las palabras empiezan a tener sentido." },
  { key: "letras", text: "Las letras se vuelven parte de su mundo." },
];

export default function KinderLectoEscritura() {
  return (
    <section id="lecto-escritura" className="relative overflow-hidden">
      {/* Sin padding-bottom: le sigue pegada KinderLogica, otra sección de
          marco ondulado full-bleed. El respiro final va en la ÚLTIMA
          sección de la cadena (por ahora, KinderLogica), no aquí.
          Sin max-w-7xl y sin esquinas redondeadas en el marco ondulado:
          este marco llega hasta el borde de la pantalla (full-bleed, igual
          que el Hero e Inglés) — ver memoria de proyecto sobre este mismo
          ajuste hecho en KinderIngles.js. */}
      <div className="relative">
        <div className="relative overflow-hidden">
          <Image src="/images/kinder/lecto-fondo.png" alt="" fill sizes="100vw" className="object-cover" />

          {/* Margen horizontal de 104px sobre 1440 (7.2222%), igual que en
              Inglés — confirmado por el usuario para este tipo de marco. */}
          <div className="relative px-[7.2222%] py-[3.5%] lg:py-[2.8%]">
            {/* Envoltura SIN overflow-hidden, mismo mx-auto max-w-[1100px]
                que la tarjeta, para que la insignia (hermana suya, no hija
                de la tarjeta con overflow-hidden) quede anclada al borde
                REAL de la tarjeta ya centrada. */}
            <div className="relative mx-auto max-w-[1100px]">
              <div
                className="relative overflow-hidden rounded-[20px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.35)]"
                style={{ backgroundImage: GRADIENT }}
              >
                <div className="flex flex-col items-center gap-8 px-6 py-8 sm:px-10 lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:pl-[160px] lg:pr-[50px] lg:py-10">
                  {/* Foto cuadrada con borde amarillo + búho sobrepuesto */}
                  <div className="relative aspect-square w-[200px] shrink-0 border-4 border-[#ffcc00] shadow-[0px_5px_3px_0px_rgba(0,0,0,0.25)] sm:w-[260px] sm:border-[6px] md:w-[320px] lg:w-[440px] lg:border-8">
                    <Image
                      src="/images/kinder/lecto-foto.png"
                      alt="Alumnos de Kinder leyendo un libro en clase"
                      fill
                      sizes="(max-width: 1024px) 320px, 440px"
                      className="object-cover"
                    />

                    {/* Búho, sobrepuesto abajo-izquierda de la foto (misma
                        técnica que la serpiente/logo de Inglés: % relativo
                        al contenedor de la foto, no al canvas completo). */}
                    <div className="absolute" style={{ left: "-20.74%", top: "58.52%", width: "42.41%", height: "45.93%" }}>
                      <Image src="/images/kinder/lecto-buho.png" alt="" fill sizes="200px" className="object-contain" />
                    </div>
                  </div>

                  {/* Texto — eyebrow + título fijos, párrafo con scroll
                      (soft-scrollbar clara sobre el rojo, sin bordes
                      dibujados) que ocupa lo que sobra tras el eyebrow, el
                      título y las tarjetas de ventaja, para que la columna
                      completa mida lo mismo que la foto. */}
                  <div className="flex w-full max-w-xl flex-col items-start gap-4 lg:h-[440px] lg:max-w-[420px] lg:shrink-0">
                    <div className="flex items-center gap-3.5">
                      <span className="h-[6px] w-14 shrink-0" style={{ backgroundColor: "#fecf3b" }} />
                      <p className="text-[13px] font-semibold uppercase tracking-[0.18px] text-white sm:text-[15px]">
                        Lecto-escritura
                      </p>
                    </div>
                    <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[0.44px] text-white sm:text-4xl lg:text-[44px] lg:leading-[55px]">
                      Los primeros trazos hacia grandes historias
                    </h2>
                    <div
                      className="min-h-0 w-full flex-1 overflow-y-auto pr-3"
                      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.55) rgba(255,255,255,0.15)" }}
                    >
                      <p className="text-lg leading-relaxed tracking-[0.24px] text-white/90 sm:text-xl lg:text-[22px] lg:leading-[32px]">
                        En esta etapa, el proceso de prelectura se vivencia como un viaje lleno de juego y
                        descubrimiento, enfocado en despertar el amor por la comunicación. A través de la
                        literatura infantil, las rimas, las canciones y actividades de conciencia fonológica,
                        nuestros alumnos aprenden a escuchar con atención, a enriquecer su vocabulario y a
                        comprender el mundo que los rodea. No buscamos acelerar la lectura, sino construir bases
                        sólidas donde la curiosidad por las palabras y la imaginación se conviertan en el impulso
                        natural para querer leer.
                      </p>
                    </div>

                    {/* Tarjetas de ventaja — no existen en Inglés, son
                        propias de esta sección. */}
                    <div className="flex shrink-0 gap-4">
                      {ADVANTAGES.map((adv) => (
                        <div
                          key={adv.key}
                          className="flex h-[90px] w-[90px] items-center justify-center rounded-[6px] border-2 border-white p-2 text-center shadow-[0px_5px_4px_2px_rgba(0,0,0,0.25)] sm:h-[100px] sm:w-[100px]"
                          style={{ backgroundImage: ADVANTAGE_GRADIENT }}
                        >
                          <p className="text-[12px] font-semibold leading-snug text-white sm:text-[13px]">{adv.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Insignia — cohete-crayón sobre aro azul con anillo
                  amarillo, esquina superior izquierda, hermana de la
                  tarjeta (fuera de su overflow-hidden). */}
              <div className="absolute -left-[50px] -top-[14px] aspect-square w-[110px] sm:-left-[68px] sm:-top-[18px] sm:w-[150px] lg:-left-[90px] lg:-top-[25px] lg:w-[200px]">
                <Image src="/images/kinder/lecto-ellipse1.svg" alt="" fill sizes="200px" />
                <div className="absolute inset-[7.8%]">
                  <Image src="/images/kinder/lecto-ellipse2.svg" alt="" fill sizes="180px" />
                </div>
                <div className="absolute inset-[24%]">
                  <Image src="/images/kinder/lecto-icono-crayon.png" alt="" fill sizes="150px" className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
