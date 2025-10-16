'use client';

import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";
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
                <Link href="/" onClick={handleLogoClick}>
                    <Image
                        src="/logos/mueve_logo.png"
                        alt="Mueve Logo"
                        fill
                        className={styles.logo}
                    />
                </Link>
            </div>
            <Navbar />
        </header>
    );
}
