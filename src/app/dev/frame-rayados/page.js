// Ruta temporal de revisión — NO enlazada desde el Header/Footer ni desde
// ninguna sección real, NO es una ruta pública definitiva. Sirve solo para
// ver src/components/rayados/Rayados.js en aislamiento.
//
// Ver en dev: http://localhost:3000/dev/frame-rayados

import Rayados from "@/components/rayados/Rayados";

export default function FrameRayadosDevPage() {
  return <Rayados />;
}
