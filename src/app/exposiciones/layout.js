export const metadata = {
  title: "Exposiciones",
  description: "Explora las exposiciones actuales y pasadas de Mueve Galería. Descubre muestras de arte contemporáneo, instalaciones y eventos culturales.",
  keywords: ["exposiciones", "exposiciones arte", "muestras arte", "galería exposiciones", "arte contemporáneo", "eventos culturales"],
  openGraph: {
    title: "Exposiciones | Mueve Galería",
    description: "Explora las exposiciones actuales y pasadas de Mueve Galería.",
    url: "https://muevegaleria.com/exposiciones",
    siteName: "Mueve Galería",
    images: [
      {
        url: "/logos/mueve_logo.png",
        width: 1200,
        height: 630,
        alt: "Mueve Galería - Exposiciones",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  alternates: {
    canonical: "/exposiciones",
  },
};

export default function ExposicionesLayout({ children }) {
  return children;
}
