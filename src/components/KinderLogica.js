import Image from "next/image";

// Sección "08_Kinder_Logica" (node 139:662) — mismo esquema que Inglés y
// Lecto-Escritura (KinderIngles.js / KinderLectoEscritura.js): tarjeta de
// color sobre marco ondulado sin esquinas redondeadas (full-bleed, pegado
// a la sección anterior), insignia en la esquina superior izquierda,
// mascota sobrepuesta, columna de texto con eyebrow + título + párrafo con
// scroll, y las dos tarjetas de ventaja (como en Lecto-Escritura).
//
// Layout: texto a la izquierda / foto a la derecha (como Inglés, no como
// Lecto-Escritura que las tiene al revés) — por eso la insignia SÍ choca
// con el texto si no se le da el mismo padding asimétrico que usamos en
// Inglés (pl = pr + lo que la insignia se mete en la tarjeta).
//
// Diferente de las dos anteriores: la foto es un pentágono ya con su
// borde rojo horneado en el propio asset (no es un círculo ni un cuadro
// con borde CSS) e inclinado 10° — se rota con `style`, no con una
// utilidad Tailwind (las utilidades de transform no generan CSS en este
// proyecto, ver memoria "champal-tailwind-v4-negative-utilities"). El
// caracol sí necesita el espejo horizontal (a diferencia de la serpiente
// de Inglés): se comparó visualmente contra la referencia y, sin espejo,
// quedaba mirando al lado contrario.
const GRADIENT = "linear-gradient(179.52254894534946deg, rgb(227,184,66) 18.069%, rgb(173,127,0) 99.098%)";
const ADVANTAGE_GRADIENT = "linear-gradient(to bottom, #0a1730, #163e7a)";

const ADVANTAGES = [
  { key: "contar", text: "Contar, clasificar y reconocer formas." },
  { key: "responder", text: "Encontrar respuestas a pequeños desafíos." },
];

export default function KinderLogica() {
  return (
    <section id="logica-matematica" className="relative overflow-hidden">
      {/* Ya no es la última de la cadena de marcos ondulados full-bleed
          (Inglés → Lecto-Escritura → esta → Horarios) — le sigue
          Horarios_Servicios pegada, así que sin padding-bottom aquí
          tampoco. HorariosServicios ya no necesita padding-top propio (su
          fondo es sólido, no ondulado con margen), así que basta con que
          esta sección no deje espacio abajo.
          Sin esquinas redondeadas ni max-w-7xl: mismo criterio que Inglés
          y Lecto-Escritura — este marco es full-bleed. */}
      <div className="relative">
        <div className="relative overflow-hidden">
          <Image src="/images/kinder/logica-fondo.png" alt="" fill sizes="100vw" className="object-cover" />

          {/* Margen de 104px sobre 1440 (7.2222%) — mismo criterio que las
              dos secciones anteriores. */}
          <div className="relative px-[7.2222%] py-[3.5%] lg:py-[2.8%]">
            {/* Envoltura sin overflow-hidden, mismo mx-auto max-w-[1100px]
                que la tarjeta, para que la insignia (hermana suya) quede
                anclada al borde real de la tarjeta ya centrada. */}
            <div className="relative mx-auto max-w-[1100px]">
              <div
                className="relative overflow-hidden rounded-[20px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.35)]"
                style={{ backgroundImage: GRADIENT }}
              >
                {/* Texto a la izquierda choca con la insignia igual que en
                    Inglés: pl = pr + lo que la insignia se mete (~110px),
                    con justify-center para que el grupo quede centrado
                    entre el borde de la insignia y el borde derecho de la
                    tarjeta (mismo cálculo verificado en KinderIngles.js). */}
                <div className="flex flex-col items-center gap-8 px-6 py-8 sm:px-10 lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:pl-[160px] lg:pr-[50px] lg:py-10">
                  {/* Texto — eyebrow + título fijos, párrafo con scroll,
                      tarjetas de ventaja debajo; la columna mide lo mismo
                      que la foto (mismo patrón que Lecto-Escritura). */}
                  <div className="flex w-full max-w-xl flex-col items-start gap-4 lg:h-[440px] lg:max-w-[420px] lg:shrink-0">
                    <div className="flex items-center gap-3.5">
                      <span className="h-[6px] w-14 shrink-0" style={{ backgroundColor: "#aa181f" }} />
                      <p className="text-[13px] font-semibold uppercase tracking-[0.18px] text-white sm:text-[15px]">
                        Lógica-matemática
                      </p>
                    </div>
                    <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[0.44px] text-white sm:text-4xl lg:text-[44px] lg:leading-[55px]">
                      Razonamiento y Descubrimiento
                    </h2>
                    <div
                      className="min-h-0 w-full flex-1 overflow-y-auto pr-3"
                      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.55) rgba(255,255,255,0.15)" }}
                    >
                      <p className="text-lg leading-relaxed tracking-[0.24px] text-white/90 sm:text-xl lg:text-[22px] lg:leading-[32px]">
                        La lógica-matemática florece a través de la exploración concreta y la experiencia directa.
                        Los niños aprenden a clasificar, identificar patrones, contar y resolver pequeños retos
                        cotidianos manipulando objetos, jugando con formas y explorando su entorno. Al conectar
                        los conceptos numéricos con situaciones de su vida diaria, transformamos las matemáticas
                        en un lenguaje intuitivo y divertido que fomenta el pensamiento crítico, la confianza y
                        el razonamiento desde sus primeros años.
                      </p>
                    </div>

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

                  {/* Foto pentagonal (borde rojo ya horneado en el asset),
                      inclinada 10°, con el caracol sobrepuesto abajo. */}
                  <div className="relative aspect-square w-[220px] shrink-0 sm:w-[280px] md:w-[340px] lg:w-[440px]">
                    <div
                      className="absolute inset-0"
                      style={{ transform: "rotate(10deg)" }}
                    >
                      <Image
                        src="/images/kinder/logica-foto.png"
                        alt="Alumno de Kinder identificando números en el salón"
                        fill
                        sizes="(max-width: 1024px) 320px, 400px"
                        className="object-contain"
                      />
                    </div>

                    {/* Caracol, sobrepuesto abajo-izquierda — espejado
                        (ver nota arriba del archivo). */}
                    <div className="absolute" style={{ left: "-8%", top: "60%", width: "48%", height: "48%" }}>
                      <Image
                        src="/images/kinder/logica-caracol.png"
                        alt=""
                        fill
                        sizes="200px"
                        className="object-contain"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Insignia — número "5" + rompecabezas, aro rojo, esquina
                  superior izquierda, hermana de la tarjeta. */}
              <div className="absolute -left-[50px] -top-[14px] aspect-square w-[110px] sm:-left-[68px] sm:-top-[18px] sm:w-[150px] lg:-left-[90px] lg:-top-[25px] lg:w-[200px]">
                <Image src="/images/kinder/logica-ellipse1.svg" alt="" fill sizes="200px" />
                <div className="absolute inset-[7.8%]">
                  <Image src="/images/kinder/logica-ellipse2.svg" alt="" fill sizes="180px" />
                </div>
                <div className="absolute inset-[23%]">
                  <Image src="/images/kinder/logica-icono.png" alt="" fill sizes="150px" className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
