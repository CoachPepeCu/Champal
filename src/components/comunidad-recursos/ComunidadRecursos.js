import Image from "next/image";

// ============================================================================
// ComunidadRecursos — recursos de apoyo para la comunidad Champal.
//
// Réplica del marco de Figma "Comunidad" (node-id 1185:941, archivo Champ):
// https://www.figma.com/design/UBACmzTCtVZqRDiTHDYi98/Champ?node-id=1185-941
//
// Es un póster informativo de líneas de ayuda/contacto (salud mental,
// violencia de género, protección infantil, neurodivergencias y
// ciberseguridad), publicado en /comunidad.
//
// OJO: ya existe `src/components/Comunidad.js` (la sección "Así vivimos
// Champal" de la home) — es un componente completamente distinto. Este
// vive en su propia carpeta con otro nombre para no pisarlo ni confundirse
// con él.
//
// Técnica de escalado: la misma que usa src/components/Comunidad.js —
// un lienzo fijo (CANVAS_WIDTH x CANVAS_HEIGHT, las dimensiones reales del
// frame de Figma) convertido a %/cqw mediante los helpers x()/y()/unit(),
// dentro de un contenedor con containerType:"inline-size" y aspect-ratio
// fijo. Así el diseño de escritorio escala de forma proporcional y
// pixel-accurate en cualquier ancho >= lg. Debajo de lg se usa una versión
// apilada en flujo normal (MobileFrame) con las mismas copies/colores.
// ============================================================================

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 878;
const x = (value) => `${((value / CANVAS_WIDTH) * 100).toFixed(4)}%`;
const y = (value) => `${((value / CANVAS_HEIGHT) * 100).toFixed(4)}%`;
const unit = (value) => `${((value / CANVAS_WIDTH) * 100).toFixed(4)}cqw`;

// Triángulos decorativos — assets reales exportados desde el node de Figma.
// Viven en su propia carpeta para no mezclarse con /public/images/comunidad/
// (que pertenece al otro componente Comunidad.js).
const TRIANGLE = {
  pink: "/images/comunidad-recursos/polygon-16.svg",
  green: "/images/comunidad-recursos/polygon-17.svg",
  purple: "/images/comunidad-recursos/polygon-18.svg",
  blue: "/images/comunidad-recursos/polygon-19.svg",
  yellow: "/images/comunidad-recursos/polygon-20.svg",
};

const HEADER_BG = "#0a1730";

// Colores/gradientes tal cual el node de Figma (paleta bespoke de este
// póster de contactos de emergencia, no la paleta general de marca).
const GRADIENTS = {
  green: "linear-gradient(-88deg, #7ff599 0%, #047c1e 77.166%)",
  purple: "linear-gradient(-88deg, #b175d2 0%, #490070 77.166%)",
  blue: "linear-gradient(-88deg, #718bff 0%, #0029e0 77.166%)",
  yellow: "linear-gradient(-88deg, #efd580 0%, #fecf3b 77.166%)",
  pink: "linear-gradient(-88deg, #ffbcb6 0%, #8d0f04 77.166%)",
};

const CARD_COLORS = {
  green: { content: "#04c82f", title: "#00a123", text: "white" },
  purple: { content: "#b175d2", title: "#4e0675", text: "white" },
  blue: { content: "#708aff", title: "#0029df", text: "black" },
  yellow: { content: "#f0d580", title: "#fecf3b", text: "black" },
  pink: { content: "#ffbcb6", title: "#8d0f04", text: "black" },
};

// ---------------------------------------------------------------------------
// Desktop — piezas pixel-accurate (cqw), visibles desde lg hacia arriba.
// ---------------------------------------------------------------------------

function DPleca({ left, top, gradient, dark, children }) {
  return (
    <div
      className="absolute flex items-center"
      style={{
        left: x(left),
        top: y(top),
        width: unit(590),
        height: unit(30),
        background: gradient,
        paddingLeft: unit(11),
      }}
    >
      <span
        className={`font-sans font-bold leading-none whitespace-nowrap ${dark ? "text-[#0c0909]" : "text-white"}`}
        style={{ fontSize: unit(18) }}
      >
        {children}
      </span>
    </div>
  );
}

function DIntro({ left, top, width, children }) {
  return (
    <p
      className="absolute font-sans text-black"
      style={{ left: x(left), top: y(top), width: unit(width), fontSize: unit(14), lineHeight: unit(19) }}
    >
      {children}
    </p>
  );
}

function DCard({ left, top, width, height, colors, title, children, align = "center", padTop = 68, padBottom = 16, gap = 10 }) {
  const isWhite = colors.text === "white";
  return (
    <div className="absolute" style={{ left: x(left), top: y(top), width: unit(width), height: unit(height) }}>
      <div
        className={`absolute inset-0 flex flex-col font-sans ${isWhite ? "text-white" : "text-black"}`}
        style={{
          justifyContent: align === "start" ? "flex-start" : "center",
          background: colors.content,
          borderRadius: unit(12),
          paddingTop: unit(padTop),
          paddingBottom: unit(padBottom),
          paddingLeft: unit(9),
          paddingRight: unit(1),
          gap: unit(gap),
        }}
      >
        {children}
      </div>
      <div
        className="absolute left-0 top-0 flex items-center justify-center text-center"
        style={{
          width: unit(width),
          height: unit(54),
          background: colors.title,
          borderTopLeftRadius: unit(12),
          borderTopRightRadius: unit(12),
          boxShadow: "0 5px 3px rgba(0,0,0,0.25)",
          padding: `0 ${unit(16)}`,
        }}
      >
        <div
          className={`font-sans font-bold leading-tight ${colors.title === "#fecf3b" ? "text-black" : "text-white"}`}
          style={{ fontSize: unit(20) }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

// Línea de cuerpo de tarjeta: "Etiqueta: " normal + valor en negritas/20px.
function DPhoneLine({ label, value }) {
  return (
    <p style={{ width: unit(297), fontSize: unit(15), lineHeight: unit(22) }}>
      {label}
      <span className="font-semibold" style={{ fontSize: unit(20) }}>
        {value}
      </span>
    </p>
  );
}

// Línea de cuerpo: "**Etiqueta**: resto de la oración", misma talla (14px,
// un poco más compacta que el 15px del node — ver comentario en las 3
// tarjetas de 3 renglones que usan align="start"/gap reducido más abajo).
function DLabelLine({ label, rest }) {
  return (
    <p style={{ width: unit(297), fontSize: unit(14), lineHeight: unit(18) }}>
      <span className="font-bold">{label}</span>
      {rest}
    </p>
  );
}

function DLink({ href, children, italic = true }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`underline ${italic ? "italic" : ""}`}>
      {children}
    </a>
  );
}

// Triángulo decorativo rotado — ver comentario junto a su uso en
// DesktopFrame para la explicación del bounding box exterior vs. el
// tamaño intrínseco interior.
function DTriangle({ src, left, top, width, height, innerWidth, innerHeight, rotate }) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{ left: x(left), top: y(top), width: unit(width), height: unit(height) }}
    >
      <div className="relative" style={{ width: unit(innerWidth), height: unit(innerHeight), transform: `rotate(${rotate}deg)` }}>
        <Image src={src} alt="" fill className="object-contain" sizes="15vw" />
      </div>
    </div>
  );
}

function DesktopFrame() {
  return (
    <div
      className="relative hidden aspect-[1440/878] w-full overflow-hidden bg-white lg:block"
      style={{ containerType: "inline-size" }}
    >
      {/* ---- Encabezado ---- */}
      <div className="absolute left-0 top-0 w-full" style={{ height: unit(80), background: HEADER_BG }}>
        <p
          className="absolute font-sans font-bold text-white whitespace-nowrap"
          style={{ left: x(118), top: y(27), fontSize: unit(32) }}
        >
          COMUNIDAD
        </p>
      </div>

      {/* ---- Triángulos decorativos ----
          Los 3 grandes (verde/morado/rosa) van rotados. El bounding box que
          reporta el node de Figma para un shape rotado no coincide con el
          área que realmente ocupa en pantalla al rotar un <img> con
          object-contain dentro de él — usar esos valores tal cual hacía que
          el triángulo se "derramara" sobre las tarjetas vecinas. Aquí el
          div EXTERIOR (left/top/width/height) es el bounding box real,
          calculado con trigonometría a partir del tamaño intrínseco del SVG
          (rotate 85/51/66°), y el div INTERIOR (innerW/innerH) es ese
          tamaño intrínseco sin rotar, centrado dentro del exterior — así el
          triángulo rotado queda contenido en su caja sin invadir las
          tarjetas de al lado. */}
      <DTriangle
        src={TRIANGLE.green}
        left={135}
        top={228}
        width={205}
        height={235}
        innerWidth={219.6}
        innerHeight={186.9}
        rotate={85}
      />
      <DTriangle
        src={TRIANGLE.purple}
        left={760}
        top={238}
        width={231}
        height={235}
        innerWidth={179}
        innerHeight={152.4}
        rotate={51}
      />
      <DTriangle
        src={TRIANGLE.pink}
        left={115}
        top={598}
        width={254}
        height={270}
        innerWidth={214.4}
        innerHeight={182.5}
        rotate={66}
      />
      <div className="absolute" style={{ left: x(751), top: y(765), width: unit(115), height: unit(113) }}>
        <Image src={TRIANGLE.blue} alt="" fill className="object-contain" sizes="8vw" />
      </div>
      <div className="absolute" style={{ left: x(879), top: y(765), width: unit(115), height: unit(113) }}>
        <Image src={TRIANGLE.yellow} alt="" fill className="object-contain" sizes="8vw" />
      </div>

      {/* ---- Salud Mental y Prevención del Suicidio ---- */}
      <DPleca left={104} top={88} gradient={GRADIENTS.green}>
        Salud Mental y Prevención del Suicidio
      </DPleca>
      <DIntro left={120} top={148} width={247}>
        Si algún miembro de nuestra comunidad está pasando por un momento difícil o una crisis emocional.
      </DIntro>
      {/* Estas 3 tarjetas (Línea de la Vida, SAPTEL, SIPINNA) tienen 3
          renglones de cuerpo — con el centrado vertical por defecto
          (align="center") el bloque de texto se desbordaba hacia ARRIBA
          contra la barra del título ("muy pegado"). align="start" ancla el
          contenido justo debajo del padding superior (nunca sube), y el
          padding/gap reducidos le dan más aire real bajo el título. */}
      <DCard
        left={387}
        top={129}
        width={307}
        height={174}
        colors={CARD_COLORS.green}
        title="Línea de la Vida (Nacional)"
        align="start"
        padTop={76}
        padBottom={8}
        gap={6}
      >
        <DPhoneLine label="Teléfono: " value="800 911 2000" />
        <DLabelLine label="Atención" rest=": 24 horas, los 365 días del año." />
        <DLabelLine label="Especialidad" rest=": Depresión, ansiedad y consumo de sustancias." />
      </DCard>
      <DCard
        left={383}
        top={308}
        width={307}
        height={174}
        colors={CARD_COLORS.green}
        align="start"
        padTop={76}
        padBottom={8}
        gap={6}
        title={
          <>
            SAPTEL
            <div className="font-normal" style={{ fontSize: unit(14) }}>
              Sistema Nacional de Apoyo por Teléfono
            </div>
          </>
        }
      >
        <DPhoneLine label="Teléfono: " value="55 5259 8121" />
        <p style={{ width: unit(297), fontSize: unit(18) }}>
          <span className="font-semibold">Web: </span>
          <DLink href="http://www.saptel.org.mx/">saptel.org.mx</DLink>
        </p>
        <DLabelLine label="Especialidad" rest=": Apoyo psicológico y psicoterapia de crisis." />
      </DCard>

      {/* ---- Violencia de Género y Familiar ---- */}
      <DPleca left={739} top={91} gradient={GRADIENTS.purple}>
        Violencia de Género y Familiar
      </DPleca>
      <DIntro left={762} top={161} width={226}>
        Recursos para orientación y denuncia en situaciones de violencia doméstica o de género.
      </DIntro>
      <DCard
        left={1017}
        top={154}
        width={307}
        height={136}
        colors={CARD_COLORS.purple}
        title={
          <>
            Línea Mujeres
            <div>(CDMX/Nacional)</div>
          </>
        }
      >
        <DPhoneLine label="Teléfono: *" value="765  ó 55 5658 1111" />
      </DCard>
      <DCard
        left={1021}
        top={306}
        width={307}
        height={136}
        colors={CARD_COLORS.purple}
        title={
          <>
            CONAVIM
            <div className="font-normal" style={{ fontSize: unit(10) }}>
              (Comisión Nacional para prevenir y Erradicar la Violencia Contra las Mujeres)
            </div>
          </>
        }
      >
        <DPhoneLine label="Teléfono: *" value="765  ó 55 5658 1111" />
        <p style={{ width: unit(297), fontSize: unit(14) }}>
          correo: <DLink href="mailto:vicontramujeres@segob.gob.mx">vicontramujeres@segob.gob.mx</DLink>
        </p>
      </DCard>

      {/* ---- Protección Infantil y Juvenil ---- */}
      <DPleca left={104} top={487} gradient={GRADIENTS.pink}>
        Protección Infantil y Juvenil
      </DPleca>
      <DIntro left={136} top={535} width={232}>
        Para reportar situaciones de riesgo, maltrato o vulneración de derechos de menores.
      </DIntro>
      <DCard
        left={382}
        top={524}
        width={307}
        height={158}
        colors={CARD_COLORS.pink}
        title={
          <>
            DIF NACIONAL
            <div style={{ fontSize: unit(16) }}>(Atención Ciudadana)</div>
          </>
        }
      >
        <DPhoneLine label="Teléfono: " value="55 3003 2200" />
        <p style={{ width: unit(297), fontSize: unit(15) }}>
          <span className="font-bold">Correo</span>: <DLink href="mailto:atencionciudadana@dif.gob.mx" italic={false}>atencionciudadana@dif.gob.mx</DLink>
        </p>
      </DCard>
      <DCard
        left={381}
        top={691}
        width={307}
        height={174}
        colors={CARD_COLORS.pink}
        align="start"
        padTop={76}
        padBottom={8}
        gap={6}
        title={
          <>
            SIPINNA
            <div className="font-normal" style={{ fontSize: unit(10) }}>
              Sistema Nacional de Protección de Niñas, Niños y Adolescentes
            </div>
          </>
        }
      >
        <DPhoneLine label="Teléfono: " value="55 5259 8121" />
        <p style={{ width: unit(297), fontSize: unit(18) }}>
          <span className="font-semibold">Web: </span>
          <DLink href="https://www.gob.mx/sipinna">gob.mx/sipinna</DLink>
        </p>
        <DLabelLine label="Propósito" rest=": Garantizar los derechos de los menores en el entorno escolar y social." />
      </DCard>

      {/* ---- Neurodivergencias ---- */}
      <DPleca left={739} top={486} gradient={GRADIENTS.blue}>
        Neurodivergencias
      </DPleca>
      <div className="absolute" style={{ left: x(739), top: y(538), width: unit(255), fontSize: unit(14), lineHeight: unit(19) }}>
        <p className="font-sans text-black">
          El <span className="font-medium">Colegio Champal</span> está abierto para todas las neurodivergencias, sin
          supeditar el acceso al servicio educativo.
        </p>
        <p className="font-sans text-black" style={{ marginTop: unit(6) }}>
          Contacta a <span className="font-semibold">CONAPRED</span> si consideras ser víctima de una conducta
          discriminatoria.
        </p>
      </div>
      <DCard
        left={1020}
        top={524}
        width={307}
        height={136}
        colors={CARD_COLORS.blue}
        title={
          <>
            CONAPRED
            <div className="font-normal" style={{ fontSize: unit(10) }}>
              (Consejo Nacional para Prevenir la Discriminación)
            </div>
          </>
        }
      >
        <DPhoneLine label="Teléfono: " value="CDMX 55 5262 1490" />
        <p style={{ width: unit(297), fontSize: unit(14) }}>
          correo: <DLink href="mailto:quejas@conapred.gob.mx">quejas@conapred.gob.mx</DLink>
        </p>
      </DCard>

      {/* ---- Ciberseguridad y Convivencia Digital ---- */}
      <DPleca left={733} top={667} gradient={GRADIENTS.yellow} dark>
        Ciberseguridad y Convivencia Digital
      </DPleca>
      <DIntro left={739} top={719} width={242}>
        Para casos de ciberbullying, sexting o riesgos en redes sociales
      </DIntro>
      <DCard
        left={1020}
        top={715}
        width={307}
        height={136}
        colors={CARD_COLORS.yellow}
        title={
          <>
            POLICÍA CIBERNÉTICA
            <div className="font-normal" style={{ fontSize: unit(10) }}>
              (Guardia Nacional)
            </div>
          </>
        }
      >
        <DPhoneLine label="Teléfono: " value="088" />
        <p className="font-semibold" style={{ width: unit(297), fontSize: unit(16) }}>
          Atención las 24 horas
        </p>
      </DCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile/tablet — versión apilada en flujo normal (< lg). Mismas copies y
// colores que la versión de escritorio, sin replicar coordenadas pixel a
// pixel del frame de Figma (que solo existe en 1440px de ancho).
// ---------------------------------------------------------------------------

function MPleca({ gradient, dark, children }) {
  return (
    <div className="flex items-center rounded-md px-4 py-2" style={{ background: gradient }}>
      <span className={`font-sans text-sm font-bold sm:text-base ${dark ? "text-[#0c0909]" : "text-white"}`}>{children}</span>
    </div>
  );
}

function MCard({ colors, title, children }) {
  const isWhite = colors.text === "white";
  return (
    <div className="overflow-hidden rounded-2xl shadow-[0_5px_3px_rgba(0,0,0,0.2)]">
      <div className="px-4 py-3 text-center font-sans font-bold" style={{ background: colors.title, color: colors.title === "#fecf3b" ? "#000" : "#fff" }}>
        {title}
      </div>
      <div
        className={`flex flex-col gap-2 px-4 py-4 font-sans text-sm ${isWhite ? "text-white" : "text-black"}`}
        style={{ background: colors.content }}
      >
        {children}
      </div>
    </div>
  );
}

function MobileFrame() {
  return (
    <div className="flex flex-col gap-8 bg-white px-5 py-8 sm:px-8 lg:hidden">
      {/* Encabezado */}
      <div className="-mx-5 -mt-8 flex items-center px-5 py-5 sm:-mx-8 sm:px-8" style={{ background: HEADER_BG }}>
        <p className="font-sans text-2xl font-bold text-white sm:text-3xl">COMUNIDAD</p>
      </div>

      {/* Salud Mental */}
      <section className="flex flex-col gap-4">
        <MPleca gradient={GRADIENTS.green}>Salud Mental y Prevención del Suicidio</MPleca>
        <p className="font-sans text-sm text-black">
          Si algún miembro de nuestra comunidad está pasando por un momento difícil o una crisis emocional.
        </p>
        <MCard colors={CARD_COLORS.green} title="Línea de la Vida (Nacional)">
          <p>
            Teléfono: <strong className="text-base">800 911 2000</strong>
          </p>
          <p>
            <strong>Atención</strong>: 24 horas, los 365 días del año.
          </p>
          <p>
            <strong>Especialidad</strong>: Depresión, ansiedad y consumo de sustancias.
          </p>
        </MCard>
        <MCard
          colors={CARD_COLORS.green}
          title={
            <>
              SAPTEL
              <div className="text-xs font-normal">Sistema Nacional de Apoyo por Teléfono</div>
            </>
          }
        >
          <p>
            Teléfono: <strong className="text-base">55 5259 8121</strong>
          </p>
          <p className="text-base">
            <strong>Web: </strong>
            <a href="http://www.saptel.org.mx/" target="_blank" rel="noreferrer" className="italic underline">
              saptel.org.mx
            </a>
          </p>
          <p>
            <strong>Especialidad</strong>: Apoyo psicológico y psicoterapia de crisis.
          </p>
        </MCard>
      </section>

      {/* Violencia de Género */}
      <section className="flex flex-col gap-4">
        <MPleca gradient={GRADIENTS.purple}>Violencia de Género y Familiar</MPleca>
        <p className="font-sans text-sm text-black">
          Recursos para orientación y denuncia en situaciones de violencia doméstica o de género.
        </p>
        <MCard
          colors={CARD_COLORS.purple}
          title={
            <>
              Línea Mujeres
              <div>(CDMX/Nacional)</div>
            </>
          }
        >
          <p>
            Teléfono: *<strong className="text-base">765  ó 55 5658 1111</strong>
          </p>
        </MCard>
        <MCard
          colors={CARD_COLORS.purple}
          title={
            <>
              CONAVIM
              <div className="text-[10px] font-normal leading-tight">
                (Comisión Nacional para prevenir y Erradicar la Violencia Contra las Mujeres)
              </div>
            </>
          }
        >
          <p>
            Teléfono: *<strong className="text-base">765  ó 55 5658 1111</strong>
          </p>
          <p className="text-xs">
            correo:{" "}
            <a href="mailto:vicontramujeres@segob.gob.mx" className="italic underline">
              vicontramujeres@segob.gob.mx
            </a>
          </p>
        </MCard>
      </section>

      {/* Protección Infantil */}
      <section className="flex flex-col gap-4">
        <MPleca gradient={GRADIENTS.pink}>Protección Infantil y Juvenil</MPleca>
        <p className="font-sans text-sm text-black">
          Para reportar situaciones de riesgo, maltrato o vulneración de derechos de menores.
        </p>
        <MCard
          colors={CARD_COLORS.pink}
          title={
            <>
              DIF NACIONAL
              <div className="text-sm font-normal">(Atención Ciudadana)</div>
            </>
          }
        >
          <p>
            Teléfono: <strong className="text-base">55 3003 2200</strong>
          </p>
          <p>
            <strong>Correo</strong>:{" "}
            <a href="mailto:atencionciudadana@dif.gob.mx" className="underline">
              atencionciudadana@dif.gob.mx
            </a>
          </p>
        </MCard>
        <MCard
          colors={CARD_COLORS.pink}
          title={
            <>
              SIPINNA
              <div className="text-[10px] font-normal leading-tight">
                Sistema Nacional de Protección de Niñas, Niños y Adolescentes
              </div>
            </>
          }
        >
          <p>
            Teléfono: <strong className="text-base">55 5259 8121</strong>
          </p>
          <p className="text-base">
            <strong>Web: </strong>
            <a href="https://www.gob.mx/sipinna" target="_blank" rel="noreferrer" className="italic underline">
              gob.mx/sipinna
            </a>
          </p>
          <p>
            <strong>Propósito</strong>: Garantizar los derechos de los menores en el entorno escolar y social.
          </p>
        </MCard>
      </section>

      {/* Neurodivergencias */}
      <section className="flex flex-col gap-4">
        <MPleca gradient={GRADIENTS.blue}>Neurodivergencias</MPleca>
        <div className="flex flex-col gap-2 font-sans text-sm text-black">
          <p>
            El <span className="font-medium">Colegio Champal</span> está abierto para todas las neurodivergencias, sin
            supeditar el acceso al servicio educativo.
          </p>
          <p>
            Contacta a <span className="font-semibold">CONAPRED</span> si consideras ser víctima de una conducta
            discriminatoria.
          </p>
        </div>
        <MCard
          colors={CARD_COLORS.blue}
          title={
            <>
              CONAPRED
              <div className="text-[10px] font-normal leading-tight">(Consejo Nacional para Prevenir la Discriminación)</div>
            </>
          }
        >
          <p>
            Teléfono: <strong className="text-base">CDMX 55 5262 1490</strong>
          </p>
          <p className="text-xs">
            correo:{" "}
            <a href="mailto:quejas@conapred.gob.mx" className="italic underline">
              quejas@conapred.gob.mx
            </a>
          </p>
        </MCard>
      </section>

      {/* Ciberseguridad */}
      <section className="flex flex-col gap-4">
        <MPleca gradient={GRADIENTS.yellow} dark>
          Ciberseguridad y Convivencia Digital
        </MPleca>
        <p className="font-sans text-sm text-black">Para casos de ciberbullying, sexting o riesgos en redes sociales</p>
        <MCard
          colors={CARD_COLORS.yellow}
          title={
            <>
              POLICÍA CIBERNÉTICA
              <div className="text-[10px] font-normal leading-tight">(Guardia Nacional)</div>
            </>
          }
        >
          <p>
            Teléfono: <strong className="text-base">088</strong>
          </p>
          <p className="font-semibold">Atención las 24 horas</p>
        </MCard>
      </section>
    </div>
  );
}

export default function ComunidadRecursos() {
  return (
    <section className="relative bg-white">
      <DesktopFrame />
      <MobileFrame />
    </section>
  );
}
