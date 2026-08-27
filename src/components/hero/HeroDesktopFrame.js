// Contenedor desktop (lg+): réplica exacta del canvas de Figma 1440x720.
// aspect-[1440/720] fija la proporción a cualquier ancho y containerType:
// inline-size habilita las unidades cqw que usan HeroTitle/HeroWatermark/
// HeroSubhead/HeroPhotoFloating para su tipografía y tamaño.
export default function HeroDesktopFrame({ children }) {
  return (
    <div className="relative hidden aspect-[1440/720] w-full lg:block" style={{ containerType: "inline-size" }}>
      {children}
    </div>
  );
}
