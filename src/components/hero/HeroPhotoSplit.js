import Image from "next/image";

// Foto de medio canvas, a todo lo alto (patrón de Pre-Kinder): ocupa una
// mitad del hero y se sobrepone a la banda azul y a la blanca. `leftPct`
// admite el ligero "sangrado" negativo que trae Pre-Kinder (-5%) para que
// la foto llegue hasta el borde real de la ventana en anchos muy grandes.
export default function HeroPhotoSplit({
  src,
  alt,
  leftPct = "-5%",
  widthPct = "50%",
  sizes = "50vw",
  objectClassName = "object-cover object-top",
  preload = true,
}) {
  return (
    <div className="absolute top-0 h-full" style={{ left: leftPct, width: widthPct }}>
      <Image src={src} alt={alt} fill preload={preload} sizes={sizes} className={objectClassName} />
    </div>
  );
}
