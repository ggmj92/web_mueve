'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };


    return (
        <>
            <header className={`${styles.header} ${isMenuOpen ? styles.headerElevated : ''}`}>
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
                <button 
                    className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerElevated : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                    <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                    <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                </button>
            </header>
            
            {/* Mobile Navigation Overlay */}
            <div className={`${styles.mobileNavOverlay} ${isMenuOpen ? styles.mobileNavOverlayOpen : ''}`} onClick={closeMenu}>
                <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`} onClick={(e) => e.stopPropagation()}>
                    {/* X Button inside mobile nav */}
                    <button 
                        className={styles.mobileNavClose}
                        onClick={closeMenu}
                        aria-label="Close navigation menu"
                    >
                        <span className={styles.closeLine}></span>
                        <span className={styles.closeLine}></span>
                        <span className={styles.closeLine}></span>
                    </button>
                    
                    <div className={styles.mobileNavContent}>
                        <Link href="/artistas" className={styles.mobileNavLink} onClick={closeMenu}>
                            Artistas
                        </Link>
                        <Link href="/nosotros" className={styles.mobileNavLink} onClick={closeMenu}>
                            Nosotros
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    );
}
