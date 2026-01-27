'use client';

import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";
import LanguageToggle from "./LanguageToggle";
import styles from "./Header.module.css";

export default function Header() {
    const handleLogoClick = () => {
        console.log('Logo clicked - closing navbar');
        // Remove nav-open class from body to close navbar
        document.body.classList.remove('nav-open');
        
        // Dispatch a custom event to notify navbar to close
        window.dispatchEvent(new CustomEvent('closeNavbar'));
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoWrap}>
                <Link href="/" onClick={handleLogoClick} className={styles.logoLink}>
                    <Image
                        src="/logos/mueve_navbar_logo.png"
                        alt="Mueve Logo"
                        fill
                        sizes="(max-width: 600px) 40vw, 220px"
                        priority
                        className={styles.logo}
                    />
                </Link>
            </div>
            <div className={styles.rightSection}>
                <LanguageToggle />
                <Navbar />
            </div>
        </header>
    );
}
