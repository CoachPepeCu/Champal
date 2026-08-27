import Image from "next/image";

// "09_International_High_School" (node 447:830, canvas 1440x650) — va
// pegada directo debajo de PreparatoriaAccesosEspecializados.js (el
// "Bloque_Preparatoria" de las 4 franjas Caja01), sin padding vertical
// propio arriba. Fondo: degradado azul de esquina a esquina
// (`rgb(26,68,157)` -> `rgb(0,33,102)`, 162.589deg — literal de Figma).
//
// Layout: foto a la izquierda (marco blanco 4px + esquinas redondeadas +
// sombra) con la ilustración del dragón "asomándose" por encima del marco
// (se dibuja DESPUÉS de la foto en el árbol de Figma, o sea que pinta por
// encima de su esquina superior — mismo orden acá) y un pie de foto/crédito
// alineado a la derecha del marco debajo; a la derecha, antetítulo (barra
// roja + label) + título + párrafo + una lista de 3 puntos con ícono de
// palomita (el MISMO ícono para las 3, reusado tal cual trae Figma).
//
// El pie de foto en Figma queda CORTADO a medio texto ("...Reino Unid",
// node 553:822) — se completa acá ("Reino Unido)") en vez de replicar el
// corte literal.
const CANVAS_W = 1440;
const CANVAS_H = 650;
function pctX(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}%`;
}
function pctY(px) {
  return `${((px / CANVAS_H) * 100).toFixed(3)}%`;
}
function cqw(px) {
  return `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;
}

const GRADIENT = "linear-gradient(162.589deg, rgb(26,68,157) 26.398%, rgb(0,33,102) 81.075%)";
const RED = "#d62838";

const FOTO_HARRY = "/images/preparatoria/international-high-school/foto-harry.png";
const DRAGON = "/images/preparatoria/international-high-school/dragon-completo.png";
const CHECK_ICON = "/images/preparatoria/international-high-school/icono-palomita.png";

const TITLE = "Doble certificado, misma formación humana.";
const TEXT =
  "Los alumnos tienen la oportunidad de obtener al terminar la preparatoria un certificado nacional y uno estadounidense. Una experiencia internacional que amplía su panorama y opciones académicas, sin salir de casa.";

const CHECKLIST = [
  "Interacción con estudiantes internacionales",
  "Fortalecimiento del idioma inglés",
  "Mucho más económica que estudiar en una preparatoria privada en Estados Unidos",
];

// Fila de la lista de checks — mismo ícono (imagen real, nunca redibujado)
// para las 3, solo cambia el texto/alto de fila.
function ChecklistRow({ text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative size-[50px] shrink-0">
        <Image src={CHECK_ICON} alt="" fill sizes="50px" className="object-cover" />
      </div>
      <p className="text-[17px] leading-[30px] text-white">{text}</p>
    </div>
  );
}

export default function PreparatoriaInternationalHighSchool() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundImage: GRADIENT }}>
      {/* Mobile/tablet (< lg): apilado simple — foto arriba (con el dragón
          asomando en la esquina, a escala relativa a la foto), crédito,
          luego el bloque de texto y la lista de checks. */}
      <div className="flex flex-col gap-8 px-6 py-14 lg:hidden">
        <div>
          <div className="relative mt-[76px] aspect-[659/438] w-full overflow-visible rounded-[20px] border-4 border-white shadow-[2px_2px_20px_5px_rgba(0,0,0,0.3)]">
            <Image src={FOTO_HARRY} alt="Alumnos de Preparatoria en el Warner Bros. Studio Tour London" fill sizes="100vw" className="rounded-[16px] object-cover" />
            <div className="absolute" style={{ left: "-5.6%", top: "-34.6%", width: "75.1%", aspectRatio: "495/335" }}>
              <Image src={DRAGON} alt="" fill sizes="60vw" className="object-cover" />
            </div>
          </div>
          <p className="mt-2 text-right text-xs leading-[20px] text-white">
            Vestíbulo principal de entrada de la exhibición{" "}
            <a
              className="underline decoration-from-font [text-underline-position:from-font]"
              href="https://www.wbstudiotour.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Warner Bros. Studio Tour London – The Making of Harry Potter
            </a>
            , Leavesden, Watford (a las afueras de Londres, Reino Unido)
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-[18px]">
            <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: RED }} />
            <p className="text-sm font-medium text-white">INTERNATIONAL HIGH SCHOOL</p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-3xl font-semibold text-white">{TITLE}</h2>
            <p className="text-base leading-relaxed text-white/90">{TEXT}</p>
          </div>
          <div className="flex flex-col gap-4">
            {CHECKLIST.map((text) => (
              <ChecklistRow key={text} text={text} />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop (lg+): réplica 1:1 de Figma, canvas 1440x650 */}
      <div className="relative hidden aspect-[1440/650] w-full lg:block" style={{ containerType: "inline-size" }}>
        {/* Foto + dragón que se asoma por encima (pinta después, encima de
            la esquina superior de la foto — mismo orden que en Figma) */}
        <div
          className="absolute overflow-hidden rounded-[20px] border-4 border-white"
          style={{ left: pctX(63), top: pctY(149), width: cqw(659), height: cqw(438), boxShadow: "2px 2px 20px 5px rgba(0,0,0,0.3)" }}
        >
          <Image src={FOTO_HARRY} alt="Alumnos de Preparatoria en el Warner Bros. Studio Tour London" fill sizes="659px" className="object-cover" />
        </div>
        <div className="absolute" style={{ left: pctX(26), top: pctY(-1), width: cqw(495), height: cqw(335) }}>
          <Image src={DRAGON} alt="" fill sizes="495px" className="object-cover" />
        </div>
        <p
          className="absolute text-right text-white"
          style={{ left: pctX(140), top: pctY(592), width: pctX(580), fontSize: cqw(12), lineHeight: cqw(20) }}
        >
          Vestíbulo principal de entrada de la exhibición{" "}
          <a
            className="underline decoration-from-font [text-underline-position:from-font]"
            href="https://www.wbstudiotour.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Warner Bros. Studio Tour London – The Making of Harry Potter
          </a>
          , Leavesden, Watford (a las afueras de Londres, Reino Unido)
        </p>

        {/* Antetítulo + título/texto + lista de checks — en Figma
            ("Texto_High", node 553:820) los 3 van en un flex-col con
            gap-19px real, NO en 3 bloques anclados cada uno a su propio
            `top` fijo: con `top` fijo, si el párrafo envuelve UNA línea
            más de lo que Figma calculó (letra/kerning distintos en el
            navegador), se mete encima de la lista de checks — mismo bug
            que ya se corrigió en PreparatoriaAccesosEspecializados.js.
            Con flex-col real, cada bloque siempre empuja al siguiente
            hacia abajo sin importar cuántas líneas envuelva. */}
        <div className="absolute flex flex-col" style={{ left: pctX(820), top: pctY(76), width: cqw(570), gap: cqw(19) }}>
          <div className="flex items-center" style={{ gap: cqw(18) }}>
            <span className="h-[6px] w-14 shrink-0 rounded-full" style={{ backgroundColor: RED }} />
            <p className="whitespace-nowrap font-medium uppercase text-white" style={{ fontSize: cqw(14) }}>
              International High School
            </p>
          </div>

          {/* Título + texto (66px de separación real entre ambos, igual que Figma) */}
          <div className="flex flex-col" style={{ gap: cqw(66) }}>
            <h2 className="font-serif font-semibold text-white" style={{ fontSize: cqw(46), lineHeight: "normal" }}>
              {TITLE}
            </h2>
            <p className="text-white" style={{ width: cqw(555), fontSize: cqw(18), lineHeight: cqw(30) }}>
              {TEXT}
            </p>
          </div>

          <div className="flex flex-col" style={{ width: cqw(405), gap: cqw(17) }}>
            {CHECKLIST.map((text) => (
              <div key={text} className="flex items-center" style={{ gap: cqw(16) }}>
                <div className="relative shrink-0" style={{ width: cqw(50), height: cqw(51) }}>
                  <Image src={CHECK_ICON} alt="" fill sizes="50px" className="object-cover" />
                </div>
                <p className="text-white" style={{ fontSize: cqw(17), lineHeight: cqw(30) }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
