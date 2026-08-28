import Image from "next/image";

const CANVAS_W = 1440;
const CANVAS_H = 760;
const pctX = (value) => `${((value / CANVAS_W) * 100).toFixed(4)}%`;
const pctY = (value) => `${((value / CANVAS_H) * 100).toFixed(4)}%`;
const cw = (value) => `${((value / CANVAS_W) * 100).toFixed(4)}cqw`;
const BASE = "/images/conoce-champal/actividades-x";

export const activities = [
  { id: "club-rayados", title: "CLUB RAYADOS", titleWidth: 104, description: "Recibimos a niños y jóvenes que desean aprender el fútbol.", image: `${BASE}/club-rayados-rgba.png`, imageAlt: "Ilustración de jugador de Club Rayados", headerColor: "#1e385b", left: 800, top: 109, imageWidth: 111, imageHeight: 141, imageLeft: 12, imageTop: 33 },
  { id: "taller-poms", title: "TALLER DE POMS", titleWidth: 104, description: "Motivamos la disciplina y arte a través de la música y habilidades de trabajo en equipo", image: `${BASE}/taller-poms-rgba.png`, imageAlt: "Ilustración de estudiante con pompones", headerColor: "#580066", left: 967, top: 106, imageWidth: 111, imageHeight: 157, imageLeft: 23, imageTop: 20 },
  { id: "taller-ajedrez", title: "TALLER DE AJEDREZ", titleWidth: 104, description: "Motivamos la disciplina y el uso de estrategias que cultiven la mente y el pensamiento crítico", image: `${BASE}/taller-ajedrez-rgba.png`, imageAlt: "Ilustración de estudiante jugando ajedrez", headerColor: "#44484d", left: 1175, top: 111, imageWidth: 152, imageHeight: 133, imageLeft: -1, imageTop: 37 },
  { id: "tae-kwon-do", title: "TAE KWON DO", titleWidth: 78, description: "Fortalecemos la disciplina, el respeto, la coordinación y la confianza a través de la práctica del Tae Kwon Do.", image: `${BASE}/tae-kwon-do-rgba.png`, imageAlt: "Ilustración de estudiante practicando Tae Kwon Do", headerColor: "#bc0000", left: 134, top: 328, imageWidth: 114, imageHeight: 121, imageLeft: 50, imageTop: 30, frontVariant: "tae" },
  { id: "taller-arte", title: "TALLER DE ARTE", titleWidth: 104, description: "Promovemos habilidades artísticas como parte del desarrollo integral de la persona", image: `${BASE}/taller-arte-rgba.png`, imageAlt: "Ilustración de estudiante pintando", headerColor: "#34ac00", left: 351, top: 328, imageWidth: 107, imageHeight: 130, imageLeft: 77, imageTop: 40, frontVariant: "arte" },
  { id: "taller-lego", title: "TALLER DE LEGO", titleWidth: 104, description: "Con la ayuda de LEGO, los niños exploran matemáticas, ciencias y lenguaje", image: `${BASE}/taller-lego-rgba.png`, imageAlt: "Ilustración de personaje de LEGO", headerColor: "#ff0004", left: 561, top: 328, imageWidth: 103, imageHeight: 134, imageLeft: 22, imageTop: 52 },
  { id: "taller-musica", title: "TALLER DE MÚSICA", titleWidth: 104, description: "El espacio para seguir desarrollando habilidades artísticas dentro del colegio", image: `${BASE}/taller-musica-rgba.png`, imageAlt: "Ilustración de estudiante tocando guitarra", headerColor: "#fecf3b", left: 755, top: 328, imageWidth: 105, imageHeight: 110, imageLeft: 21, imageTop: 57 },
  { id: "basquetbol", title: "BÁSQUETBOL", titleWidth: 119, description: "Aprenden el trabajo en equipo, el compañerismo, la generosidad y la solidaridad, mientras desarrollan sus habilidades físicas.", image: `${BASE}/basquetbol-rgba.png`, imageAlt: "Ilustración de jugador de básquetbol", headerColor: "#1e385b", left: 953, top: 328, imageWidth: 70, imageHeight: 159, imageLeft: 41, imageTop: 25 },
  { id: "taller-robotica", title: "TALLER DE ROBÓTICA", titleWidth: 104, description: "Participamos en diversos torneos de robótica a nivel local, nacional e internacional", image: `${BASE}/taller-robotica-rgba.png`, imageAlt: "Ilustración de robot", headerColor: "#5b94e1", left: 1142, top: 328, imageWidth: 66, imageHeight: 103, imageLeft: 42, imageTop: 61 },
  { id: "iniciacion-deportiva", title: "INICIACIÓN DEPORTIVA", titleWidth: 104, description: "Desarrollo motriz, cognoscitivo y psicosocial a través de la inclusión", image: `${BASE}/iniciacion-deportiva-rgba.png`, imageAlt: "Ilustración de grupo de iniciación deportiva", headerColor: "#6d8db8", left: 435, top: 534, imageWidth: 126, imageHeight: 126, imageLeft: 10, imageTop: 36 },
  { id: "taller-frances", title: "TALLER DE FRANCÉS", titleWidth: 104, description: "Colaboración con la Alianza Francesa para acompañar en el aprendizaje de un tercer idioma", image: `${BASE}/taller-frances-rgba.png`, imageAlt: "Ilustración de profesor con bandera de Francia", headerColor: "#19457c", left: 645, top: 537, imageWidth: 120, imageHeight: 131, imageLeft: 21, imageTop: 35, frontVariant: "french" },
  { id: "taller-ingles", title: "TALLER DE INGLÉS", titleWidth: 104, description: "Extendemos el tiempo de inmersión en el idioma inglés para apoyarlos en su desempeño", image: `${BASE}/taller-ingles-rgba.png`, imageAlt: "Ilustración de profesor con bandera del Reino Unido", headerColor: "#2163ae", left: 855, top: 537, imageWidth: 119, imageHeight: 141, imageLeft: 14, imageTop: 31, frontVariant: "english" },
];

function FrontCard({ activity, mobile = false }) {
  const bodyAsset = activity.frontVariant === "tae" ? `${BASE}/caja-tae.svg` : `${BASE}/caja-general.svg`;
  const headerStyle = activity.frontVariant === "french" || activity.frontVariant === "english"
    ? { backgroundImage: activity.frontVariant === "french" ? "linear-gradient(90deg, #19457c 3%, #fff 42%, #fff 56%, #f61b0b 100%)" : "linear-gradient(139deg, #2163ae 5%, #2163ae 12%, #fff 19%, #fff 70%, #f23b1f 81%)" }
    : { backgroundColor: activity.headerColor };

  return (
    <div className="frontCard absolute inset-0 z-20 h-[150px] w-[150px] rounded-[8px] border-2 border-[#fdc119]" data-card-layer="frontCard">
      <div className="frontCardSurface absolute inset-0 rounded-[6px]" style={headerStyle}>
        <h3 className={`absolute left-1/2 top-[4px] z-30 m-0 -translate-x-1/2 text-center font-display text-[14px] font-semibold uppercase leading-[14px] tracking-[1.4px] ${activity.headerColor === "#fecf3b" || activity.frontVariant === "french" || activity.frontVariant === "english" ? "text-[#003750]" : "text-white"}`} style={{ width: activity.titleWidth }}>
          {activity.title}
        </h3>
        <Image src={bodyAsset} alt="" aria-hidden width={150} height={135} className="pointer-events-none absolute left-[-2px] top-[14px] z-10 h-[135px] w-[150px]" />
        {activity.frontVariant === "arte" && <Image src={`${BASE}/acento-arte.svg`} alt="" aria-hidden width={56} height={64} className="pointer-events-none absolute left-[26px] top-[44px] z-20 h-[64px] w-[56px]" />}
        <Image src={activity.image} alt={activity.imageAlt} width={activity.imageWidth} height={activity.imageHeight} className="pointer-events-none absolute z-30 object-contain" style={{ left: activity.imageLeft, top: activity.imageTop }} />
      </div>
    </div>
  );
}

function ActivityCard({ activity, mobile = false }) {
  return (
    <article className={`activityCard ${mobile ? "relative mx-auto" : "absolute"} h-[184px] w-[150px]`} style={!mobile ? { left: pctX(activity.left), top: pctY(activity.top) } : undefined} data-activity-id={activity.id}>
      <div className="descriptionCard absolute left-0 top-0 z-10 min-h-[150px] w-[150px] rounded-[10px] border-2 border-[#fdc119] bg-white px-3 py-4 text-center text-[11px] leading-[1.2] tracking-[0.04em] text-black" data-card-layer="descriptionCard">
        <p className="m-0">{activity.description}</p>
      </div>
      <FrontCard activity={activity} mobile={mobile} />
    </article>
  );
}

export default function ActividadesExtracurriculares() {
  return (
    <section className="actividades-x relative overflow-x-clip bg-[#07030f] text-white" aria-labelledby="actividades-x-title">
      <div className="relative mx-auto hidden aspect-[1440/760] w-full max-w-[1440px] lg:block" style={{ containerType: "inline-size" }}>
        <Image src={`${BASE}/fondo-nebula.png`} alt="" fill priority sizes="100vw" className="pointer-events-none object-fill" />
        <Image src={`${BASE}/olas-inferiores.svg`} alt="" width={1440} height={295} className="pointer-events-none absolute left-0 top-[62.1%] z-10 h-[38.8%] w-full object-fill" />
        <header className="absolute left-[10.49%] top-[13.95%] z-30 w-[36.25%]">
          <div className="flex items-center gap-[14px]"><span className="h-[6px] w-[56px] shrink-0 bg-[#aa181f]" /><p className="m-0 whitespace-nowrap font-sans text-[15px] leading-[18px] tracking-[0.012em]">Actividades extracurriculares</p></div>
          <h1 id="actividades-x-title" className="m-0 mt-[10px] font-display text-[clamp(30px,3.2cqw,46px)] font-medium leading-[1.09] tracking-[0.01em] [text-shadow:0_4px_4px_rgba(0,0,0,.25)]">Más allá del aula, cada interés encuentra un espacio para crecer.</h1>
        </header>
        <div className="absolute inset-0 z-20">
          {activities.map((activity) => <ActivityCard key={activity.id} activity={activity} />)}
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-3xl px-4 py-10 sm:px-8 lg:hidden">
        <Image src={`${BASE}/fondo-nebula.png`} alt="" fill sizes="100vw" className="pointer-events-none object-cover" />
        <Image src={`${BASE}/olas-inferiores.svg`} alt="" width={1440} height={295} className="pointer-events-none absolute inset-x-[-35%] bottom-0 z-10 h-[24%] w-[170%] object-fill" />
        <header className="relative z-30 mb-9 max-w-xl">
          <div className="flex items-center gap-3"><span className="h-1.5 w-10 shrink-0 bg-[#aa181f]" /><p className="m-0 text-xs tracking-[0.012em] sm:text-sm">Actividades extracurriculares</p></div>
          <h1 className="m-0 mt-3 font-display text-4xl font-medium leading-[1.05] [text-shadow:0_3px_4px_rgba(0,0,0,.25)] sm:text-5xl">Más allá del aula, cada interés encuentra un espacio para crecer.</h1>
        </header>
        <div className="relative z-20 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10">
          {activities.map((activity) => <ActivityCard key={activity.id} activity={activity} mobile />)}
        </div>
      </div>
    </section>
  );
}
