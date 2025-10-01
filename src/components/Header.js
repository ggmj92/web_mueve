import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logoWrap}>
                <Link href="/">
                    <Image
                        src="/logos/mueve_logo.png"
                        alt="Mueve Logo"
                        fill
                        className={styles.logo}
                    />
                </Link>
            </div>
            <nav className={styles.nav}>
                <a href="/nosotros" className={styles.link}>Nosotros</a>
            </nav>
        </header>
    );
}