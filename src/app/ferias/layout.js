export const metadata = {
  title: 'Ferias',
  description:
    'Descubre la participación de Mueve Galería en ferias de arte nacionales e internacionales. Conoce nuestras próximas presentaciones y eventos.',
  keywords: [
    'ferias arte',
    'ferias internacionales',
    'eventos arte',
    'participación ferias',
    'arte contemporáneo',
  ],
  openGraph: {
    title: 'Ferias | Mueve Galería',
    description:
      'Descubre la participación de Mueve Galería en ferias de arte.',
    url: 'https://muevegaleria.com/ferias',
    siteName: 'Mueve Galería',
    images: [
      {
        url: '/logos/mueve_logo.png',
        width: 1200,
        height: 630,
        alt: 'Mueve Galería - Ferias',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  alternates: {
    canonical: '/ferias',
  },
}

export default function FeriasLayout({ children }) {
  return children
}
