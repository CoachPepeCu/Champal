"use client";

import Image from "next/image";
import { motion } from "motion/react";

// Sección "06_Kinder_Ingles" (node 136:642): tarjeta azul (gradiente exacto
// de Figma) sobre un fondo de textura ondulada, con foto circular (ya trae
// el aro amarillo horneado en el propio asset), el logo "Jolly Phonics"
// inclinado sobrepuesto arriba a la izquierda de la foto, la serpiente
// mascota sobrepuesta abajo, y la insignia roja "Hi/Hello" en la esquina
// superior izquierda de la tarjeta (se sale del marco, como en Figma).
//
// El párrafo de Figma trae el texto COMPLETO en el código exportado aunque
// el frame estático lo recorta a la mitad (overflow-clip a una altura fija,
// tanto en el propio Figma como en el screenshot que mandó el usuario) — se
// muestra completo aquí en vez de replicar ese recorte, que es un defecto
// del diseño estático, no la intención.
//
// A diferencia del Hero (una composición fotográfica fija), esta tarjeta
// tiene un párrafo largo que no debe recortarse, así que NO se replica como
// canvas de proporción fija (aspect-ratio + posiciones absolutas en % del
// canvas 1360x600 de Figma) — el texto fluye en flexbox normal y la tarjeta
// crece con su contenido. Los elementos decorativos que sí son imágenes de
// tamaño fijo (logo Jolly, serpiente) se posicionan en % relativos al
// contenedor de la FOTO (no del canvas completo de Figma), para que
// escalen junto con la foto en cualquier ancho.
const GRADIENT = "linear-gradient(113.45743852761876deg, rgb(0,111,230) 40.449%, rgb(23,67,154) 97.849%)";

export default function KinderIngles() {
  // Fade-in de entrada — SOLO esta tarjeta (la primera del CardStack de
  // Kinder, justo después de Programas): a las otras dos (LectoEscritura,
  // Logica) no se les agrega, ya que el propio CardStack ya las revela con
  // su transición de apilado al cubrir a la anterior; esta primera, en
  // cambio, no tiene ninguna tarjeta cubriéndola antes de aparecer, así que
  // necesita su propio efecto de entrada al hacer scroll hasta ella.
  // `viewport={{ once: true }}` para que no se repita si se vuelve a
  // scrollear hacia arriba y abajo.
  return (
    <motion.section
      id="ingles"
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Sin padding-bottom: le sigue KinderLectoEscritura, otra sección de
          marco ondulado full-bleed — deben quedar pegadas entre sí. El
          respiro final (pb-14/pb-20) va en la ÚLTIMA sección de la cadena,
          no en cada una. */}
      {/* Sin max-w-7xl: en Figma este marco ocupa casi todo el canvas de
          1440 (tarjeta 1360 + 40px de margen por lado, igual de proporción
          que el Hero) — meterlo en el contenedor de contenido angosto que
          usan Descubrir/Programas lo restringía más de lo que el diseño
          pedía. El padding proporcional (p-[3.5%]/lg:p-[2.8%] ≈ 40px sobre
          1440) ya reproduce ese margen sin necesidad de un contenedor. */}
      <div className="relative">
          {/* Marco ondulado — fondo de textura detrás de la tarjeta azul.
              Sin esquinas redondeadas: este marco llega hasta el borde de
              la pantalla (full-bleed), así que las esquinas deben ser de
              90° — a diferencia de la tarjeta azul interior, que sí
              conserva su radio. */}
          <div className="relative overflow-hidden">
            <Image src="/images/kinder/ingles-fondo.png" alt="" fill sizes="100vw" className="object-cover" />

            {/* Margen horizontal exacto que dio el usuario: 104px de cada
                lado sobre un marco de 1440px de ancho (104/1440 = 7.2222%)
                → área útil de 1232px. Vertical queda como estaba. */}
            <div className="relative px-[7.2222%] py-[3.5%] lg:py-[2.8%]">
              {/* Envoltura SIN overflow-hidden, con el mismo mx-auto
                  max-w-[1100px] que la tarjeta — así la insignia (que va
                  aquí, no dentro de la tarjeta) queda anclada al borde REAL
                  de la tarjeta ya centrada, en vez de al borde del padding
                  de 104px (que dejó de coincidir con la tarjeta al
                  centrarla, y por eso la insignia quedó flotando suelta). */}
              <div className="relative mx-auto max-w-[1100px]">
                <div
                  className="relative overflow-hidden rounded-[20px] shadow-[0px_10px_30px_0px_rgba(0,20,60,0.35)]"
                  style={{ backgroundImage: GRADIENT }}
                >
                  {/* justify-center centra texto+foto dentro del espacio que
                      deja el padding. Ahora el padding es ASIMÉTRICO a
                      propósito: el usuario pidió que las columnas se centren
                      entre el borde DERECHO de la insignia y el borde
                      derecho de la tarjeta (no entre los dos bordes de la
                      tarjeta completa) — como la insignia se mete ~110px
                      por la izquierda, pl = pr + 110 logra exactamente eso
                      (verificado midiendo: con justify-center, el margen
                      izquierdo real —desde el borde de la insignia— y el
                      derecho —desde el borde de la tarjeta— quedan
                      iguales). OJO: el contenido (texto+gap+foto) tiene que
                      caber dentro del espacio libre o justify-center vuelve
                      a centrar el desborde respecto a TODA la tarjeta y este
                      cálculo deja de valer. */}
                  <div className="flex flex-col items-center gap-8 px-6 py-8 sm:px-10 lg:flex-row lg:items-center lg:justify-center lg:gap-6 lg:pl-[160px] lg:pr-[50px] lg:py-10">
                  {/* Texto — mismo patrón que el inglés de Pre-Kinder
                      (PreKinderDesarrollo.js `Ingles()`): el párrafo va en
                      su propio cuadro con scroll (soft-scrollbar, sin
                      bordes dibujados) en vez de mostrarse completo motion
                      libre. La columna tiene la MISMA altura que la foto
                      (lg:h-[…] igual en ambas) y el cuadro de texto usa
                      flex-1 para ocupar lo que sobra tras el eyebrow y el
                      título — así el alto del marco interno lo define la
                      foto, no el párrafo, y ambas columnas quedan a la
                      misma altura sin tener que calcular a mano cuánto
                      ocupan el eyebrow/título. */}
                  <div className="flex w-full max-w-xl flex-col items-start gap-4 lg:h-[440px] lg:max-w-[400px] lg:shrink-0">
                    <div className="flex items-center gap-3.5">
                      <span className="h-[6px] w-14 shrink-0" style={{ backgroundColor: "#aa181f" }} />
                      <p className="text-[13px] font-semibold uppercase tracking-[0.18px] text-white sm:text-[15px]">
                        Inglés desde los primeros sonidos
                      </p>
                    </div>
                    <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[0.44px] text-white sm:text-4xl lg:text-[44px] lg:leading-[55px]">
                      Descubren nuevos sonidos y formas de comunicarse
                    </h2>
                    <div
                      className="max-h-[150px] w-full flex-1 overflow-y-auto pr-3 sm:max-h-[170px] lg:max-h-none"
                      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.55) rgba(255,255,255,0.15)" }}
                    >
                      <p className="text-lg leading-relaxed tracking-[0.24px] text-white/90 sm:text-xl lg:text-[24px] lg:leading-[35px]">
                        En nuestras aulas de Prekinder y Kinder, transformamos este método en una aventura diaria
                        llena de entusiasmo e imaginación. Con nuestros alumnos más pequeños, nos enfocamos en
                        despertar su conciencia fonológica y en asociar cada sonido con un movimiento y una canción,
                        logrando que aprendan jugando. Conforme avanzan, guiamos a los niños para que comiencen a
                        unir esos sonidos de forma intuitiva.
                      </p>
                    </div>
                  </div>

                  {/* Foto circular + decoraciones sobrepuestas — puede
                      crecer un poco más que antes; la columna de texto
                      (arriba) usa la misma altura para mantener el
                      balance. */}
                  <div className="relative aspect-square w-[200px] shrink-0 sm:w-[260px] md:w-[320px] lg:w-[440px]">
                    <Image
                      src="/images/kinder/ingles-foto-elipse.png"
                      alt="Alumna de Kinder participando en una clase de Jolly Phonics"
                      fill
                      sizes="(max-width: 1024px) 320px, 440px"
                      className="object-contain"
                    />

                    {/* Logo "Jolly Phonics", inclinado, sobrepuesto arriba-izquierda de la foto */}
                    <div
                      className="absolute overflow-hidden"
                      style={{
                        left: "-14.63%",
                        top: "-3.89%",
                        width: "64.56%",
                        height: "51.35%",
                        transform: "rotate(-22deg)",
                      }}
                    >
                      <Image
                        src="/images/kinder/ingles-jolly-phonics.png"
                        alt="Jolly Phonics"
                        fill
                        sizes="220px"
                        className="object-cover"
                        style={{ objectPosition: "50% 58%" }}
                      />
                    </div>

                    {/* Serpiente mascota, sobrepuesta abajo-izquierda de la foto */}
                    <div className="absolute" style={{ left: "-12.41%", top: "52.78%", width: "55.56%", height: "55.56%" }}>
                      <Image src="/images/kinder/ingles-snake.png" alt="" fill sizes="220px" className="object-contain" />
                    </div>
                  </div>
                </div>
              </div>
              {/* ↑ cierra la tarjeta (overflow-hidden). La insignia va
                  FUERA de ese overflow-hidden a partir de aquí, como
                  hermana suya dentro de la envoltura sin recorte. */}

                {/* Insignia "Hi / Hello" — hermana de la tarjeta DENTRO de
                    esta misma envoltura (sin overflow-hidden), así que sus
                    offsets negativos son relativos al borde REAL de la
                    tarjeta ya centrada, no al padding de 104px del marco
                    exterior (eso fue lo que la dejó flotando suelta). */}
                <div className="absolute -left-[50px] -top-[14px] aspect-square w-[110px] sm:-left-[68px] sm:-top-[18px] sm:w-[150px] lg:-left-[90px] lg:-top-[25px] lg:w-[200px]">
                  <Image src="/images/kinder/ingles-ellipse1.svg" alt="" fill sizes="200px" />
                  <div className="absolute inset-[7.8%]">
                    <Image src="/images/kinder/ingles-ellipse2.svg" alt="" fill sizes="180px" />
                  </div>
                  <div className="absolute inset-[20.2%]">
                    <Image src="/images/kinder/ingles-icono.png" alt="" fill className="object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </motion.section>
  );
}
