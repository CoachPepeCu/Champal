import Image from "next/image";

// Réplica 1:1 de Figma para "01_Bienvenida" (node 762:903, canvas 1440x501) —
// la segunda mitad del Hero completo que compartió el usuario: el mural
// "G19" (izquierda, oscuro) + el saludo "¡Bienvenidos!" (derecha, claro).
// Misma técnica que Hero.js: aspect-ratio + containerType:inline-size en
// desktop, posiciones en % vía pctX/pctY y tipografía en cqw — canvas propio
// (1440x501) porque esta sección tampoco es una plantilla compartida.
const CANVAS_W = 1440;
const CANVAS_H = 501;
const pctX = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}%`;
const pctY = (px) => `${((px / CANVAS_H) * 100).toFixed(3)}%`;
const cqw = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;

const ASTRONAUT_SHADOW = "drop-shadow(0px 4px 2px rgba(0,0,0,0.25))";

// El degradado que Figma usa para el velo (771:6412) que funde el mural
// hacia la zona clara del saludo.
const FADE_TO_WHITE =
  "linear-gradient(90deg, rgba(249, 249, 246, 0) 0%, rgba(249, 249, 246, 0.45) 16%, rgba(249, 249, 246, 0.92) 28%, rgb(249, 249, 246) 42%, rgb(249, 249, 246) 100%)";

const PARAGRAPH_2 =
  "En nuestro Colegio cada alumno descubre su potencial, aprende con propósito y crece con valores.";
const PARAGRAPH_1 =
  "Desde 1992 acompañamos a las familias Champal en cada etapa. Hoy celebramos la huella de nuestros alumnos y egresados, y renovamos cada día nuestro compromiso con una formación humana, cercana y con visión de futuro.";

export default function Bienvenidos() {
  return (
    // Sin overflow-hidden acá a propósito: el ADN (Mur01) y el "Camino
    // Mural" traen top negativo porque se salen del mural hacia arriba,
    // invadiendo la franja blanca inferior del Hero — pedido explícito del
    // usuario. El recorte horizontal que necesita el "Camino Mural" (se sale
    // por la derecha del canvas de 1440, igual que en Figma) se resuelve en
    // el <body> (layout.js) — mezclar "overflow-x-hidden overflow-y-visible"
    // directo en esta sección NO funciona: la spec de CSS fuerza ese
    // "visible" a "auto" en cuanto el otro eje no es "visible", y "auto"
    // recorta el contenido exactamente igual que "hidden" (así se cortaba
    // el ADN contra el borde de la sección).
    <section className="relative bg-[#fafaf7]">
      {/* ---------- Desktop (>=lg): réplica exacta del canvas 1440x501 ---------- */}
      <div className="relative hidden aspect-[1440/501] w-full lg:block" style={{ containerType: "inline-size" }}>
        {/* MuralG19 — sí recorta su propio fondo (overflow-clip en Figma).
            El "Subtract" (768:6324) de Figma es en realidad un círculo
            completo (centro ~600.5,250.5 / radio 250.5, calculado desde su
            propio path) relleno con un degradado transparente→blanco, pero
            el propio nodo lo recorta a una caja más angosta (438 a 870.68 —
            el círculo real se sale por la izquierda hasta 350, esa parte no
            se ve en el diseño). El primer intento reconstruyó el CÍRCULO
            COMPLETO sin ese recorte: al ser más ancho por la izquierda de lo
            debido, invadía la zona del ADN y creaba un "ADN doble" (el
            degradado blanco tapando parcialmente una copia, dejando la otra
            de fondo intacta) y la curva se veía desproporcionada. Por eso el
            círculo va con clip-path, recortado a la misma caja angosta que
            usaba el asset original (17.56% = 88/501, la diferencia entre el
            borde izquierdo del círculo real y el de esa caja). */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/bienvenidos/mural-g19-fondo.png"
            alt='"Del caos nacen las ESTRELLAS" — mural G19'
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute rounded-full"
            style={{
              left: pctX(350),
              top: pctY(0),
              width: cqw(501),
              height: cqw(501),
              background: "linear-gradient(90deg, rgba(250,250,247,0) 32%, rgba(250,250,247,1) 100%)",
              clipPath: "inset(0 0 0 17.56%)",
            }}
          />
          {/* El círculo de arriba (igual que el "Subtract" original de
              Figma) es angosto cerca de y=0 — ahí justo es donde el fondo
              trae su propio ADN "de fábrica", que por eso seguía asomando
              (ligeramente desfasado del ADN nítido que pega Hero.js encima,
              se veía como un segundo ADN fantasma). Este parche sólo tapa
              esa franja de arriba, con un degradado que se disuelve hacia
              abajo para no crear un borde recto nuevo. */}
          <div
            className="absolute"
            style={{
              left: pctX(370),
              top: pctY(0),
              width: cqw(600),
              height: cqw(150),
              background: "linear-gradient(180deg, rgba(250,250,247,1) 0%, rgba(250,250,247,0.9) 45%, rgba(250,250,247,0) 100%)",
            }}
          />
        </div>

        {/* Velo que termina de fundir el mural hacia la zona clara del
            saludo. */}
        <div className="absolute" style={{ left: pctX(650), top: pctY(-2), width: cqw(790), height: cqw(503), backgroundImage: FADE_TO_WHITE }} />

        {/* Astronauta — DESPUÉS del velo (encima de él) para que nunca quede
            tapado por el degradado; antes estaba dentro del wrapper de
            arriba, pintado ANTES que el velo, por eso el velo lo cubría. */}
        <div className="absolute" style={{ left: pctX(657), top: pctY(245), width: cqw(214), height: cqw(228) }}>
          <Image
            src="/images/bienvenidos/astronauta-flotando.png"
            alt=""
            fill
            preload
            sizes="15vw"
            className="object-contain"
            style={{ filter: ASTRONAUT_SHADOW }}
          />
        </div>

        {/* ADN + matraz — capa SIN recortar, a propósito invade la franja
            blanca inferior del Hero, tocando el borde inferior de la
            tarjeta "Formación Humana". Valores RAW del nodo "Mur01 1" de
            Figma (antes se habían descartado por verse desalineados, pero
            esa desalineación era el bug real de overflow ya corregido —
            con el overflow bien resuelto, el tamaño/posición de Figma sí
            calzan). */}
        <div className="absolute" style={{ left: pctX(343), top: pctY(-77), width: cqw(311), height: cqw(164) }}>
          <Image src="/images/bienvenidos/adn-flask.png" alt="" fill preload sizes="22vw" className="object-contain" />
        </div>

        <p
          className="absolute font-sans text-right whitespace-pre-line text-[#494949]"
          style={{ left: pctX(866), top: pctY(318), width: cqw(479), fontSize: cqw(18), lineHeight: cqw(28), letterSpacing: cqw(1.8) }}
        >
          {PARAGRAPH_1}
        </p>

        <p
          className="absolute font-serif font-bold text-center whitespace-nowrap"
          style={{ left: pctX(882), top: pctY(5), fontSize: cqw(96), letterSpacing: cqw(9.6), color: "#00055c", transform: "translateX(-50%)" }}
        >
          ¡
        </p>
        <p
          className="absolute font-serif font-bold whitespace-nowrap"
          style={{ left: pctX(1093.5), top: pctY(55), fontSize: cqw(48), letterSpacing: cqw(4.8), color: "#00055c", transform: "translateX(-50%)" }}
        >
          BIENVENIDOS
        </p>
        <p
          className="absolute font-serif font-bold whitespace-nowrap"
          style={{ left: pctX(1300), top: pctY(32), fontSize: cqw(96), letterSpacing: cqw(9.6), color: "#00055c", transform: "translateX(-50%)" }}
        >
          !
        </p>

        <p
          className="absolute font-serif font-medium text-center whitespace-pre-line"
          style={{
            left: pctX(1107),
            top: pctY(245),
            width: cqw(514),
            fontSize: cqw(17),
            lineHeight: cqw(28),
            letterSpacing: cqw(1.7),
            color: "#102c54",
            transform: "translateX(-50%)",
          }}
        >
          {PARAGRAPH_2}
        </p>

        <div className="absolute" style={{ left: pctX(984), top: pctY(114), width: cqw(200), height: cqw(91) }}>
          <Image
            src="/images/bienvenidos/logo-champal-bienvenidos.png"
            alt="Colegio Champal"
            fill
            preload
            sizes="14vw"
            className="object-contain"
          />
        </div>

        {/* Camino Mural — capa SIN recortar, también invade el Hero */}
        <div className="absolute flex items-center justify-center" style={{ left: pctX(1266), top: pctY(-52), width: cqw(352.166), height: cqw(369.885) }}>
          <div className="relative" style={{ width: cqw(258.609), height: cqw(292.055), transform: "rotate(23deg)" }}>
            <Image src="/images/bienvenidos/camino-mural.png" alt="" fill preload sizes="18vw" className="object-contain" />
          </div>
        </div>
      </div>

      {/* ---------- Mobile / tablet (<lg): reinterpretación apilada ---------- */}
      <div className="relative lg:hidden">
        <div className="relative h-[320px] overflow-hidden sm:h-[420px]">
          <Image
            src="/images/bienvenidos/mural-g19-fondo.png"
            alt='"Del caos nacen las ESTRELLAS" — mural G19'
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute right-[8%] top-[42%] h-[26%] w-[20%]">
            <Image
              src="/images/bienvenidos/astronauta-flotando.png"
              alt=""
              fill
              sizes="20vw"
              className="object-contain"
              style={{ filter: ASTRONAUT_SHADOW }}
            />
          </div>
        </div>

        {/* ADN — FUERA del recorte de arriba a propósito: sigue "invadiendo"
            el borde superior (contra el Hero) igual que en desktop */}
        <div className="absolute -top-8 left-[8%] h-24 w-40 sm:h-28 sm:w-48">
          <Image src="/images/bienvenidos/adn-flask.png" alt="" fill sizes="30vw" className="object-contain" />
        </div>

        <div className="flex flex-col items-center gap-6 px-6 py-14 text-center sm:px-10">
          <Image
            src="/images/bienvenidos/logo-champal-bienvenidos.png"
            alt="Colegio Champal"
            width={200}
            height={91}
            className="h-auto w-32 sm:w-40"
          />
          <h2 className="font-serif font-bold text-4xl sm:text-5xl" style={{ color: "#00055c" }}>
            ¡Bienvenidos!
          </h2>
          <p className="max-w-md font-serif font-medium text-base sm:text-lg" style={{ color: "#102c54" }}>
            {PARAGRAPH_2}
          </p>
          <p className="max-w-md text-sm sm:text-base text-[#494949]">{PARAGRAPH_1}</p>
        </div>
      </div>
    </section>
  );
}
