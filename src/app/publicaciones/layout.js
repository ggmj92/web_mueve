export const metadata = {
  title: "Publicaciones",
  description: "Consulta las publicaciones, catálogos y material editorial de Mueve Galería. Descarga PDFs y explora contenido sobre arte contemporáneo.",
  keywords: ["publicaciones", "catálogos arte", "editorial arte", "PDFs arte", "material galería"],
  openGraph: {
    title: "Publicaciones | Mueve Galería",
    description: "Consulta las publicaciones, catálogos y material editorial de Mueve Galería.",
    url: "https://muevegaleria.com/publicaciones",
    siteName: "Mueve Galería",
    images: [
      {
        url: "/logos/mueve_logo.png",
        width: 1200,
        height: 630,
        alt: "Mueve Galería - Publicaciones",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  alternates: {
    canonical: "/publicaciones",
  },
};

export default function PublicacionesLayout({ children }) {
  return children;
}
