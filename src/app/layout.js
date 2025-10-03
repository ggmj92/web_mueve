import "./globals.css";
import localFont from "next/font/local";
import HomepageClient from "@/components/HomepageClient";
import { SanityLive } from "@/sanity/lib/live";

const mueveFont = localFont({
  src: "/fonts/ABCOracleTripleVariable-Trial.ttf",
  variable: "--font-mueve",
  style: "normal",
});

export const metadata = {
  title: {
    default: "Mueve Galería",
    template: "%s | Mueve"
  },
  icons: {
    icon: [
      { url: "/logos/favicon.ico" }, // legacy support
      { url: "/logos/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logos/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/logos/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/logos/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  description: "Mueve es una galería de arte contemporáneo que presenta exposiciones innovadoras y artistas emergentes. Descubre obras únicas y experiencias artísticas excepcionales.",
  keywords: ["galería de arte", "arte contemporáneo", "exposiciones", "artistas emergentes", "arte", "galería", "Mueve"],
  authors: [{ name: "Mueve Galería" }],
  creator: "Mueve Galería",
  publisher: "Mueve Galería",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://muevegaleria.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: "Mueve - Galería de Arte Contemporáneo",
    description: "Mueve es una galería de arte contemporáneo que presenta exposiciones innovadoras y artistas emergentes.",
    url: 'https://muevegaleria.com', // Replace with your actual domain
    siteName: 'Mueve Galería',
    images: [
      {
        url: '/logos/mueve_logo.png',
        width: 1200,
        height: 630,
        alt: 'Mueve Galería - Logo',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  instagram: {
    card: 'summary_large_image',
    title: "Mueve - Galería de Arte Contemporáneo",
    description: "Mueve es una galería de arte contemporáneo que presenta exposiciones innovadoras y artistas emergentes.",
    images: ['/logos/mueve_logo.png'],
    creator: '@mueve.galeria', // Replace with your actual Instagram handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // verification: {
  //   google: 'your-google-verification-code', // Not needed - domain already verified
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={mueveFont.variable}>
      {/* pass the font class down */}
      <HomepageClient fontClass={mueveFont.className}>
        {children}
        <SanityLive />
      </HomepageClient>
    </html>
  );
}

