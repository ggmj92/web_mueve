export const metadata = {
  title: "Artistas",
  description: "Descubre los artistas representados por Mueve Galería. Explora portfolios, obras y biografías de artistas contemporáneos emergentes y establecidos.",
  keywords: ["artistas", "artistas contemporáneos", "portfolio artistas", "galería artistas", "arte contemporáneo"],
  openGraph: {
    title: "Artistas | Mueve Galería",
    description: "Descubre los artistas representados por Mueve Galería.",
    url: "https://muevegaleria.com/artistas",
    siteName: "Mueve Galería",
    images: [
      {
        url: "/logos/mueve_logo.png",
        width: 1200,
        height: 630,
        alt: "Mueve Galería - Artistas",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  alternates: {
    canonical: "/artistas",
  },
};

export default function ArtistasLayout({ children }) {
  return children;
}
