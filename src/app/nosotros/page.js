import { sanityFetch } from '@/sanity/lib/live'
import Image from "next/image";
import styles from "./about.module.css";
import StructuredData from '@/components/StructuredData';

export const metadata = {
  title: "Nosotros - Sobre Mueve Galería",
  description: "Conoce la historia y misión de Mueve Galería. Descubre nuestro compromiso con el arte contemporáneo y los artistas emergentes.",
  keywords: ["sobre nosotros", "historia galería", "misión Mueve", "arte contemporáneo", "galería arte"],
  openGraph: {
    title: "Nosotros - Sobre Mueve Galería",
    description: "Conoce la historia y misión de Mueve Galería. Descubre nuestro compromiso con el arte contemporáneo y los artistas emergentes.",
    url: 'https://muevegaleria.com/nosotros',
    images: [
      {
        url: '/logos/mueve_mini-logo.png',
        width: 600,
        height: 300,
        alt: 'Mueve Galería - Mini Logo',
      },
    ],
  },
  instagram: {
    title: "Nosotros - Sobre Mueve Galería",
    description: "Conoce la historia y misión de Mueve Galería. Descubre nuestro compromiso con el arte contemporáneo y los artistas emergentes.",
    images: ['/logos/mueve_mini-logo.png'],
  },
};

export default async function NosotrosPage() {
  const data = await sanityFetch({
    query: `*[_type == "nosotros"][0]{ spanish, english }`,
    revalidate: 0, // Always revalidate for live updates
  });

  return (
    <>
      <StructuredData type="BreadcrumbList" />
      <div className={styles.about}>

        {/* TEXT COLUMN */}
        <div className={styles.textCol}>
          <p className={styles.copy}>
            {data?.data?.spanish || "Texto próximamente"}
          </p>

          <p className={`${styles.copy} ${styles.en}`}>
            {data?.data?.english || "Content coming soon"}
          </p>
        </div>

        {/* MINI-LOGO COLUMN */}
        <div className={styles.logoCol}>
          <Image
            src="/logos/mueve_mini-logo.png"
            alt="Mueve Galería - Logo de la galería de arte contemporáneo"
            width={300}
            height={120}
            priority
            className={styles.miniLogo}
          />
        </div>
      </div>

    </>
  );
}

