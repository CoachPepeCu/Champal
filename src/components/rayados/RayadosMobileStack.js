import Image from "next/image";

const PORTERIA = "/images/rayados/porteria.png";
const AVATAR = "/images/rayados/avatar-rayados.png";
const HALCON = "/images/rayados/halcon.svg";
const PASTO = "/images/rayados/linea-pasto.png";

// Versión para móvil (< md, 768px) del encabezado + bloque central + pasto
// del frame Rayados: en vez de seguir achicando el mismo canvas absoluto de
// RayadosDesktopFrame.js, reacomoda el contenido en una columna real —lo
// pide el brief explícitamente ("no reduzcas todo el frame como una sola
// imagen")— conservando cada pieza (encabezado, jugador, texto central,
// halcón) sin superposiciones de TEXTO. El jugador sí se deja "montado"
// sobre el borde inferior del encabezado a propósito: es el mismo motivo de
// Figma ("el jugador que sobresale"), no un bug de layout.
export default function RayadosMobileStack() {
  return (
    <div className="md:hidden">
      <div
        className="relative w-full overflow-hidden bg-[#0b3d2e]"
        style={{ aspectRatio: "375 / 210" }}
      >
        <Image
          src={PORTERIA}
          alt=""
          fill
          aria-hidden
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center">
          <p
            className="font-serif font-bold leading-tight text-white"
            style={{
              fontSize: "clamp(20px, 6.5vw, 28px)",
              textShadow: "0px 3px 4px rgba(0,0,0,0.3)",
            }}
          >
            ESCUELA OFICIAL
            <br />
            RAYADOS DE MONTERREY
          </p>
          <span
            className="rounded-full bg-[#003750] px-3 py-1 font-serif font-semibold text-white"
            style={{ fontSize: "clamp(11px, 3.2vw, 13px)" }}
          >
            de los Rayados
          </span>
        </div>
      </div>

      <div className="-mt-10 flex justify-center px-4">
        <div className="relative aspect-[246/311] w-[38%] max-w-[160px] drop-shadow-lg">
          <Image
            src={AVATAR}
            alt="Jugador ilustrado de la Escuela Oficial Rayados de Monterrey"
            fill
            sizes="40vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 px-6 pb-6 pt-4 text-center">
        <p
          className="font-serif font-semibold"
          style={{ color: "#003750", fontSize: "clamp(15px, 4.2vw, 18px)", letterSpacing: "3px" }}
        >
          SE PARTE DE
        </p>
        <p
          className="font-serif font-bold leading-tight"
          style={{ color: "#003750", fontSize: "clamp(26px, 8vw, 34px)" }}
        >
          HALCONES CHAMPAL-RAYADOS
        </p>
        <p
          className="font-serif font-semibold text-black"
          style={{ fontSize: "clamp(15px, 4.2vw, 18px)", letterSpacing: "3px" }}
        >
          ESCUELA OFICIAL DE FÚTBOL
        </p>
        <p
          className="max-w-[34rem] text-black"
          style={{ fontSize: "clamp(14px, 3.8vw, 16px)", letterSpacing: "1.2px", lineHeight: 1.6 }}
        >
          El primer paso en la vida deportiva es importante, es por eso que
          las Escuelas Oficiales de Rayados son las encargadas de recibir a
          niños y jóvenes que desean aprender el deporte del fútbol.
        </p>

        <div className="relative mt-2 h-[140px] w-[112px] opacity-80 sm:h-[180px] sm:w-[145px]">
          {/* mismo espejo en X que RayadosDesktopFrame.js — el filo recto
              del ícono va hacia la derecha. */}
          <Image
            src={HALCON}
            alt=""
            fill
            aria-hidden
            sizes="180px"
            className="object-contain"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
      </div>

      <div className="relative w-full" style={{ aspectRatio: "1440 / 179" }}>
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
