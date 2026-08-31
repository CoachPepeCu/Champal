import Image from "next/image";
import { pctX, pctY, cqw, cqwText } from "./rayadosMath";

const PORTERIA = "/images/rayados/porteria.png";
const AVATAR = "/images/rayados/avatar-rayados.png";
const ELLIPSE = "/images/rayados/ellipse-dot.svg";
const HALCON = "/images/rayados/halcon.svg";
const PASTO = "/images/rayados/linea-pasto.png";

// node 1272:991 "Porteria" mide 278 de alto (contra los 895 del canvas
// completo de rayadosMath.js) y es "position: absolute" — por spec CSS eso
// la vuelve el CONTAINING BLOCK de sus hijos absolutos, así que el `top` en
// % de esos hijos (círculo, títulos, "de los") se resuelve contra SU propio
// alto (278), no contra el del canvas grande. Usar pctY() del canvas ahí
// adentro fue el bug que descentraba "de los" del círculo: pctY(111) daba
// 12.4% del alto de Porteria en vez de 111/278 = 39.9%. porteriaPctY()
// calcula el % correcto para cualquier hijo directo de ese contenedor.
const PORTERIA_H = 278;
function porteriaPctY(px) {
  return `${((px / PORTERIA_H) * 100).toFixed(3)}%`;
}

// Réplica del encabezado + bloque central + franja de pasto del frame
// Rayados (node 1240:1190, canvas 1440x895 — ver rayadosMath.js) para
// tablet/desktop (md y arriba). Visible desde `md` (768px) porque a esa
// escala (factor ~0.53) el texto sigue siendo legible gracias al piso de
// cqwText(); por debajo de eso, RayadosMobileStack.js rearma el contenido
// en una columna real en vez de seguir achicando el mismo canvas (así lo
// pide el brief: "no reduzcas todo el frame como una sola imagen").
export default function RayadosDesktopFrame() {
  return (
    <div
      className="relative hidden w-full md:block"
      style={{
        aspectRatio: "1440 / 895",
        containerType: "inline-size",
      }}
    >
      {/* node 1272:991 "Porteria" — cancha, portería y portero */}
      <div
        className="absolute overflow-hidden bg-[#0b3d2e]"
        style={{ left: 0, top: 0, width: cqw(1440), height: cqw(278) }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={PORTERIA}
            alt=""
            width={1344}
            height={752}
            aria-hidden
            className="pointer-events-none absolute max-w-none object-cover"
            style={{ left: 0, top: "-138.61%", width: "100%", height: "289.83%" }}
          />
        </div>

        {/* node 1273:993 — círculo "de los" */}
        <div
          className="absolute"
          style={{ left: pctX(879), top: porteriaPctY(75), width: cqw(72), height: cqw(72) }}
        >
          <Image src={ELLIPSE} alt="" fill aria-hidden sizes="72px" />
        </div>

        {/* node 1273:992 */}
        <p
          className="absolute whitespace-nowrap text-center font-serif font-bold text-white"
          style={{
            left: pctX(661),
            top: porteriaPctY(83),
            transform: "translateX(-50%)",
            fontSize: cqwText(48, 22),
            lineHeight: 1,
            textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
          }}
        >
          <span className="block" style={{ marginBottom: cqw(14) }}>
            ESCUELA OFICIAL
          </span>
          <span className="block">RAYADOS DE MONTERREY</span>
        </p>

        {/* node 1273:994 — centrada dentro del círculo (node 1273:993), no
            flotando a su lado: ancla en el CENTRO del círculo (879+36,
            75+36) con translate(-50%,-50%) en vez del translateX(-50%) +
            top de borde que trae el código crudo de Figma. */}
        <p
          className="absolute w-max text-center font-serif font-semibold text-white"
          style={{
            left: pctX(879 + 36),
            top: porteriaPctY(75 + 36),
            maxWidth: cqw(64),
            transform: "translate(-50%, -50%)",
            fontSize: cqwText(24, 12),
            lineHeight: 1.1,
            textShadow: "0px 2px 3px rgba(0,0,0,0.3)",
          }}
        >
          de los
        </p>
      </div>

      {/* node 1270:990 "Avatar Rayados" — jugador que sobresale del encabezado */}
      <div
        className="absolute"
        style={{ left: pctX(41), top: pctY(43), width: cqw(246), height: cqw(311) }}
      >
        <Image
          src={AVATAR}
          alt="Jugador ilustrado de la Escuela Oficial Rayados de Monterrey"
          fill
          sizes="(max-width: 1024px) 20vw, 246px"
          className="object-cover"
        />
      </div>

      {/* node 1273:1001 "Halcón" — bloque central */}
      <div
        className="absolute flex items-center"
        style={{ left: pctX(73), top: pctY(322), gap: cqw(57) }}
      >
        <div
          className="flex flex-col items-center"
          style={{ width: cqw(929), gap: cqw(13) }}
        >
          <p
            className="text-center font-serif font-semibold"
            style={{
              color: "#003750",
              fontSize: cqwText(32, 16),
              letterSpacing: cqw(6.4),
              lineHeight: 1.5,
            }}
          >
            SE PARTE DE
          </p>
          {/* Varsity no está instalada en el proyecto (solo Fredoka/Outfit/
              Patrick Hand — ver AGENTS del componente); se sustituye por
              Fredoka en su peso más pesado para conservar el aire "deportivo
              display" sin instalar ninguna fuente nueva. */}
          <p
            className="text-center font-serif font-bold"
            style={{
              color: "#003750",
              fontSize: cqwText(64, 28),
              lineHeight: 1.2,
            }}
          >
            HALCONES CHAMPAL-RAYADOS
          </p>
          <p
            className="text-center font-serif font-semibold text-black"
            style={{
              fontSize: cqwText(32, 16),
              letterSpacing: cqw(6.4),
              lineHeight: 1.5,
            }}
          >
            ESCUELA OFICIAL DE FÚTBOL
          </p>
          <p
            className="text-black"
            style={{
              width: cqw(734),
              fontSize: cqwText(20, 13),
              letterSpacing: cqw(4),
              lineHeight: 1.75,
            }}
          >
            El primer paso en la vida deportiva es importante, es por eso que
            las Escuelas Oficiales de Rayados son las encargadas de recibir a
            niños y jóvenes que desean aprender el deporte del fútbol.
          </p>
        </div>

        <div
          className="relative shrink-0"
          style={{ width: cqw(381.487), height: cqw(473.743) }}
        >
          {/* El recorte recto del ícono geométrico trae el filo hacia la
              DERECHA en Figma (queda hacia la esquina); el SVG fuente lo
              trae con el filo a la izquierda, así que se espeja en X.
              Transform por `style`, no con una utilidad Tailwind
              `-scale-x-100` — no funciona en este proyecto (Tailwind v4),
              ver memoria de proyecto "champal-tailwind-v4-negative-utilities". */}
          <Image
            src={HALCON}
            alt=""
            fill
            aria-hidden
            sizes="(max-width: 1024px) 25vw, 382px"
            className="object-contain"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
      </div>

      {/* node 1275:1003/1275:1002 "Pasto" — franja de pasto */}
      <div
        className="absolute overflow-hidden"
        style={{ left: 0, top: pctY(696), width: cqw(1440), height: cqw(199) }}
      >
        <Image
          src={PASTO}
          alt=""
          fill
          aria-hidden
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
