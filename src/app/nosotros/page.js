import { client } from '@/sanity/lib/client'
import Image from "next/image";
import layout from "../layout.module.css";
import styles from "./nosotros.module.css";
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

const FALLBACK_SPANISH = `mueve (galería ) concibe el arte como un espacio vivo y en movimiento, capaz de tender puentes entre territorios, generaciones y lenguajes diversos.

Representamos a artistas emergentes y de mediana carrera cuyas prácticas expanden y cuestionan los imaginarios locales e internacionales.

En un contexto de transformación permanente, mueve (galería ) propone un modelo flexible que reimagina el rol de la galería y de la curaduría. Nuestro trabajo se materializa en exposiciones itinerantes, colaboraciones internacionales y formatos experimentales que dialogan con los desafíos del circuito artístico contemporáneo.

Apostamos por espacios de reflexión, investigación y diálogo, así como por prácticas colaborativas que se construyen desde una sensibilidad crítica, abierta y atenta a su tiempo.`;

const FALLBACK_ENGLISH = `mueve (galería ) conceives art as a living, dynamic space, capable of building bridges between territories, generations, and diverse languages.

We represent emerging and mid-career artists whose practices expand and question both local and international imaginaries.

In a context of constant transformation, mueve (galería ) proposes a flexible model that reimagines the role of the gallery and curatorship. Our work unfolds through traveling exhibitions, international collaborations, and experimental formats that engage with the challenges of the contemporary art circuit.

We are committed to fostering spaces for reflection, research, and dialogue, as well as collaborative practices grounded in a critical, open, and context-aware sensitivity.`;

export default async function NosotrosPage() {
    let data = null;

    try {
        data = await client.fetch(`*[_type == "about"][0]{ spanish, english }`);
    } catch (error) {
        console.error('Failed to load about content', error);
    }

    return (
        <>
            <StructuredData type="BreadcrumbList" />
            <main className={layout.main}>
                <div className={styles.grid}>
                    {/* TEXT COLUMN */}
                    <div className={styles.textCol}>
                        <p className={styles.copy}>
                            {data?.spanish || FALLBACK_SPANISH}
                        </p>

                        <p className={`${styles.copy} ${styles.en}`}>
                            {data?.english || FALLBACK_ENGLISH}
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
                            className={styles.logo}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}

