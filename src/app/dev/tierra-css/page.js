import TierraGiratoria from "@/components/dev/TierraGiratoria";

const samples = [180, 280, 380];

export const metadata = {
  title: "Prueba Tierra CSS | Champal",
  robots: { index: false, follow: false },
};

export default function TierraCssPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#030a1e] px-4 py-12 text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        <header className="max-w-2xl text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-[#6c95ce]">
            Prueba aislada
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
            Tierra giratoria con CSS
          </h1>
          <p className="mt-3 font-sans text-sm text-white/70 sm:text-base">
            Tres tamanos, una textura 2:1 y una rotacion continua de 18 segundos.
          </p>
        </header>

        <section
          className="mt-12 flex w-full flex-wrap items-end justify-center gap-x-10 gap-y-14"
          aria-label="Comparacion de tamanos"
        >
          {samples.map((size) => (
            <figure
              key={size}
              className="flex min-w-0 max-w-full flex-col items-center gap-5"
              style={{ width: `${size}px` }}
            >
              <TierraGiratoria
                size={size}
                duration={18}
                label={`Planeta Tierra de ${size} pixeles girando`}
              />
              <figcaption className="font-sans text-sm font-medium tabular-nums text-white/65">
                {size} px · 18 s
              </figcaption>
            </figure>
          ))}
        </section>
      </div>
    </main>
  );
}
