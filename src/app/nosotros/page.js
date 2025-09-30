import { client } from '@/sanity/lib/client'
import Image from "next/image";
import layout from "../layout.module.css";
import styles from "./nosotros.module.css";

export default async function NosotrosPage() {
    const data = await client.fetch(`*[_type == "about"][0]{
    spanish, english
  }`)

    return (
        <main className={layout.main}>
            <div className={layout.container}>
                <p>{data?.spanish || "Texto próximamente"}</p>
                <p>{data?.english || "Content coming soon"}</p>

                <Image
                    src="/logos/mueve_mini-logo.png"
                    alt="Mueve Mini-Logo"
                    width={300}   // use actual natural width of the file
                    height={120}  // use actual natural height of the file
                    className={styles.logo}
                />
            </div>
        </main>
    )
}
