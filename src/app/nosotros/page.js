import { client } from '@/sanity/lib/client'
import Image from "next/image";
import layout from "../layout.module.css";
import styles from "./nosotros.module.css";

export default async function NosotrosPage() {
    const data = await client.fetch(`*[_type == "about"][0]{ spanish, english }`);

    return (
        <main className={layout.main}>
            <div className={`${layout.container} ${styles.grid}`}>
                {/* TEXT COLUMN */}
                <div className={styles.textCol}>
                    <p className={styles.copy}>
                        {data?.spanish || "Texto próximamente"}
                    </p>

                    <p className={`${styles.copy} ${styles.en}`}>
                        {data?.english || "Content coming soon"}
                    </p>
                </div>

                {/* MINI-LOGO COLUMN */}
                <div className={styles.logoCol}>
                    <Image
                        src="/logos/mueve_mini-logo.png"
                        alt="Mueve Mini-Logo"
                        width={300}          // natural file width if you know it
                        height={120}         // natural file height if you know it
                        priority
                        className={styles.logo}
                    />
                </div>
            </div>
        </main>
    );
}

