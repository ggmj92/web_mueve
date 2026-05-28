import './globals.css'
import localFont from 'next/font/local'
import HomepageClient from '@/components/HomepageClient'
import { SanityLive } from '@/sanity/lib/live'
import StructuredData from '@/components/StructuredData'

const mueveFont = localFont({
  src: '/fonts/ABCOracleTripleVariable-Trial.ttf',
  variable: '--font-mueve',
  style: 'normal',
  preload: false,
})

export const metadata = {
  title: {
    default: 'Mueve Galería - Arte Contemporáneo en Lima, Perú',
    template: '%s | Mueve Galería',
  },
  description:
    'Mueve es una galería de arte contemporáneo en Lima, Perú. Representamos artistas emergentes y establecidos, organizamos exposiciones innovadoras y participamos en ferias internacionales de arte.',
  keywords: [
    'galería de arte Lima',
    'arte contemporáneo Perú',
    'galería arte contemporáneo',
    'exposiciones arte Lima',
    'artistas peruanos',
    'artistas emergentes',
    'galería Miraflores',
    'arte contemporáneo latinoamericano',
    'Mueve Galería',
    'contemporary art gallery Peru',
    'art exhibitions Lima',
    'ferias de arte',
    'coleccionismo arte',
  ],
  authors: [{ name: 'Mueve Galería', url: 'https://muevegaleria.com' }],
  creator: 'Mueve Galería',
  publisher: 'Mueve Galería',
  category: 'Art Gallery',
  classification: 'Art',

  metadataBase: new URL('https://muevegaleria.com'),

  alternates: {
    canonical: '/',
    languages: {
      'es-PE': '/',
      'es-ES': '/',
      'en-US': '/en',
    },
  },

  icons: {
    icon: [
      { url: '/logos/favicon.ico' },
      { url: '/logos/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logos/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/logos/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/logos/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },

  manifest: '/manifest.json',

  openGraph: {
    title: 'Mueve Galería - Arte Contemporáneo en Lima, Perú',
    description:
      'Galería de arte contemporáneo en Lima. Representamos artistas emergentes y establecidos, organizamos exposiciones y participamos en ferias internacionales.',
    url: 'https://muevegaleria.com',
    siteName: 'Mueve Galería',
    images: [
      {
        url: 'https://muevegaleria.com/logos/mueve_logo.png',
        width: 1200,
        height: 630,
        alt: 'Mueve Galería - Arte Contemporáneo',
        type: 'image/png',
      },
    ],
    locale: 'es_PE',
    type: 'website',
    countryName: 'Peru',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Mueve Galería - Arte Contemporáneo',
    description:
      'Galería de arte contemporáneo en Lima, Perú. Exposiciones, artistas y ferias de arte.',
    images: ['https://muevegaleria.com/logos/mueve_logo.png'],
    creator: '@mueve.galeria',
    site: '@mueve.galeria',
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  other: {
    'geo.region': 'PE-LIM',
    'geo.placename': 'Lima',
    'geo.position': '-12.120000;-77.030000',
    ICBM: '-12.120000, -77.030000',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={mueveFont.variable}>
      <head>
        <StructuredData type="Organization" />
        <StructuredData type="WebSite" />
      </head>
      <HomepageClient fontClass={mueveFont.className}>
        {children}
        <SanityLive />
      </HomepageClient>
    </html>
  )
}
