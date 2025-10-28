'use client';

import { useState, useEffect } from 'react';
import styles from "./Footer.module.css";
import ConstructionBanner from "./ConstructionBanner";

export default function Footer() {
    const [bannerClosed, setBannerClosed] = useState(false);

    useEffect(() => {
        // Check if banner was previously dismissed
        const wasDismissed = localStorage.getItem('construction-banner-dismissed');
        if (wasDismissed) {
            setBannerClosed(true);
        }

        // Listen for banner close event
        const handleBannerClosed = () => {
            setBannerClosed(true);
        };

        window.addEventListener('constructionBannerClosed', handleBannerClosed);
        
        return () => {
            window.removeEventListener('constructionBannerClosed', handleBannerClosed);
        };
    }, []);

    const handleNewsletterClick = (e) => {
        e.preventDefault();
        // Dispatch a custom event to trigger the newsletter modal
        window.dispatchEvent(new CustomEvent('openNewsletterModal'));
    };

    return (
        <>
            <ConstructionBanner />
            <footer className={`${styles.footer} ${bannerClosed ? styles.footerNoBanner : ''}`}>
                <div className={styles.footerInner}>
                    {/* Desktop layout - 3 columns */}
                    <div className={styles.col}>
                        <a href="https://maps.app.goo.gl/g22oW8UUtikFqpVe7"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.addressLink}>
                            <p>Gral Borgoño 770, Miraflores</p>
                        </a>
                        <p className={styles.limaPeru}>Lima, Perú</p>
                        <a href="https://www.instagram.com/mueve.galeria/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.mobileInstagram}>
                            <p>@mueve.galeria</p>
                        </a>
                    </div>
                    <div className={`${styles.col} ${styles.contactCol}`}>
                        <a
                            href="mailto:info@muevegaleria.com?subject=Consulta desde Mueve Web"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.contactLine}
                        >
                            <p>info@muevegaleria.com</p>
                        </a>
                        <p></p>
                        <a 
                            href="#"
                            onClick={handleNewsletterClick}
                            className={styles.newsletter}
                        >
                            <p>Suscríbete a nuestra newsletter</p>
                        </a>
                    </div>
                    <div className={styles.col}>
                        <a href="https://www.instagram.com/mueve.galeria/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.desktopInstagram}
                        >
                            <p>@mueve.galeria</p>
                        </a>
                    </div>

                    {/* Mobile layout - 2 rows */}
                    <div className={styles.mobileRow1}>
                        <a href="https://maps.app.goo.gl/g22oW8UUtikFqpVe7"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.mobileAddress}>
                            <p>Gral Borgoño 770, Miraflores</p>
                        </a>
                        <a
                            href="mailto:info@muevegaleria.com?subject=Consulta desde Mueve Web"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.mobileEmail}
                        >
                            <p>info@muevegaleria.com</p>
                        </a>
                    </div>
                    <div className={styles.mobileRow2}>
                        <a href="https://www.instagram.com/mueve.galeria/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.mobileInstagram}>
                            <p>@mueve.galeria</p>
                        </a>
                        <a 
                            href="#"
                            onClick={handleNewsletterClick}
                            className={styles.mobileNewsletter}
                        >
                            <p>Suscríbete a nuestra newsletter</p>
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}


{/* <a
                    href="https://wa.me/51987654321"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.contactLine}
                >
                    <p>+51 987 654 321</p>
                </a> */}