import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logoWrap}>
                <Image
                    src="/logos/mueve_logo.png"
                    alt="Mueve Logo"
                    width={160}
                    height={40}
                    className={styles.logo}
                />
            </div>
            <nav className={styles.nav}>
                <a href="/nosotros" className={styles.link}>Nosotros</a>
            </nav>
        </header>
    );
}
