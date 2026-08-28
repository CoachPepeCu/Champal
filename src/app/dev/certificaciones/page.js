import CertificacionesColaboraciones from "@/components/CertificacionesColaboraciones";

export const metadata = {
  title: "Certificaciones y colaboraciones | Vista de desarrollo",
};

export default function CertificacionesDevPage() {
  return (
    <main className="min-h-screen bg-[#bdbdbd]">
      <CertificacionesColaboraciones />
    </main>
  );
}
