export const metadata = {
  title: 'Mueve Estar',
  description:
    'Mueve Estar es nuestro punto de base es mueve (estar), un espacio íntimo y habitado que funciona como núcleo del proyecto. Descubre nuestros artistas invitados y exposiciones itinerantes.',
  keywords: [
    'mueve estar',
    'espacio arte',
    'exposiciones itinerantes',
    'artistas invitados',
    'arte contemporáneo',
  ],
  openGraph: {
    title: 'Mueve Estar | Mueve Galería',
    description:
      'Nuestro punto de base es mueve (estar), un espacio íntimo y habitado que funciona como núcleo del proyecto.',
    url: 'https://muevegaleria.com/mueve-estar',
    siteName: 'Mueve Galería',
    images: [
      {
        url: '/logos/mueve_logo.png',
        width: 1200,
        height: 630,
        alt: 'Mueve Galería - Mueve Estar',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  alternates: {
    canonical: '/mueve-estar',
  },
}

export default function MueveEstarLayout({ children }) {
  return children
}
