import "./globals.css";
import localFont from "next/font/local";
import HomepageClient from "@/components/HomepageClient";

const mueveFont = localFont({
  src: "/fonts/ABCOracleTripleVariable-Trial.ttf",
  variable: "--font-mueve",
  style: "normal",
});

export const metadata = {
  title: "Mueve",
  description: "Mueve (Galería)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={mueveFont.variable}>
      {/* pass the font class down */}
      <HomepageClient fontClass={mueveFont.className}>
        {children}
      </HomepageClient>
    </html>
  );
}

