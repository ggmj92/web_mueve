"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/app/layout.module.css";
import Header from "./Header";
import Footer from "./Footer";

export default function HomepageClient({ children, fontClass }) {
    const pathname = usePathname();
    const [isHome, setIsHome] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isStudio, setIsStudio] = useState(false);
    const [bannerVisible, setBannerVisible] = useState(true);

    useEffect(() => {
        setMounted(true);
        setIsHome(pathname === "/");
        setIsStudio(pathname?.startsWith("/studio"));
        
        // Check if banner was dismissed
        const wasDismissed = localStorage.getItem('construction-banner-dismissed');
        setBannerVisible(!wasDismissed);
        
        // Listen for banner close event
        const handleBannerClosed = () => {
            setBannerVisible(false);
        };
        
        window.addEventListener('constructionBannerClosed', handleBannerClosed);
        
        return () => {
            window.removeEventListener('constructionBannerClosed', handleBannerClosed);
        };
    }, [pathname]);

    // Ensure we have valid class names to prevent hydration mismatch
    const bodyClass = styles.body ? styles.body : 'body';
    const mainClass = styles.main ? styles.main : 'main';

    // Default to home class until we know the actual pathname
    const bodyClassName = mounted ? (isStudio ? "studio" : (isHome ? "home" : "inner")) : "home";
    
    // Add banner state class
    const bannerClass = mounted && !bannerVisible ? "banner-hidden" : "";

    if (isStudio) {
        return (
            <body className={`${bodyClass} ${fontClass} ${bodyClassName} ${bannerClass}`}>
                <main className={mainClass}>{children}</main>
            </body>
        );
    }

    return (
        <body className={`${bodyClass} ${fontClass} ${bodyClassName} ${bannerClass}`}>
            <Header />
            <main className={mainClass}>{children}</main>
            <Footer />
        </body>
    );
}

