'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import styles from "./Header.module.css";

export default function Header() {
    const [navOpen, setNavOpen] = useState(false);
    const toggleNav = () => setNavOpen(!navOpen);

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
            
            <button
                onClick={toggleNav}
                className={`${styles.menuButton} ${navOpen ? styles.open : ''}`}
                aria-label="Toggle navigation menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

                   <nav className={`${styles.nav} ${navOpen ? styles.open : ''}`}>
                       <ul>
                           <li>
                               <Link href="/nosotros" className={styles.link} onClick={toggleNav}>
                                   Nosotros
                               </Link>
                           </li>
                           <li>
                               <Link href="/artistas" className={styles.link} onClick={toggleNav}>
                                   Artistas
                               </Link>
                           </li>
                           {/* Add more navigation items here as needed */}
                       </ul>
                   </nav>
        </header>
    );
}