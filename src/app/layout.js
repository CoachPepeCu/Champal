import { Outfit, Fredoka } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Vive Champal | Colegio Champal",
  description:
    "Educación que impulsa su futuro. Conoce la comunidad educativa de Colegio Champal.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
