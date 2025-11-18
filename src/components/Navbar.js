'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Add class to body when menu is open for styling
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('nav-open');
        } else {
            document.body.classList.remove('nav-open');
        }
        
        return () => {
            document.body.classList.remove('nav-open');
        };
    }, [isMenuOpen]);

    // Close navbar when body class is removed or custom event is fired
    useEffect(() => {
        const handleBodyClassChange = () => {
            if (!document.body.classList.contains('nav-open') && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        const handleCloseNavbar = () => {
            console.log('Close navbar event received');
            setIsMenuOpen(false);
        };

        // Listen for class changes on body
        const observer = new MutationObserver(handleBodyClassChange);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // Listen for custom close event
        window.addEventListener('closeNavbar', handleCloseNavbar);

        return () => {
            observer.disconnect();
            window.removeEventListener('closeNavbar', handleCloseNavbar);
        };
    }, [isMenuOpen]);

    return (
        <>
            {/* Hamburger Button */}
            <button 
                className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerElevated : ''}`}
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
                <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
            </button>
            
            {/* Navigation Overlay */}
            <div className={`${styles.navOverlay} ${isMenuOpen ? styles.navOverlayOpen : ''}`} onClick={closeMenu} data-navbar>
                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`} onClick={(e) => e.stopPropagation()} data-navbar>
                    <div className={styles.navContent}>
                        <Link href="/artistas" className={styles.navLink} onClick={closeMenu}>
                            Artistas
                        </Link>
                        <Link href="/ferias" className={styles.navLink} onClick={closeMenu}>
                            Ferias
                        </Link>
                        <Link href="/nosotros" className={styles.navLink} onClick={closeMenu}>
                            Nosotros
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    );
}
