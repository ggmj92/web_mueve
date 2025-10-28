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

    useEffect(() => {
        setMounted(true);
        setIsHome(pathname === "/");
        setIsStudio(pathname?.startsWith("/studio"));
    }, [pathname]);

    // Ensure we have valid class names to prevent hydration mismatch
    const bodyClass = styles.body ? styles.body : 'body';
    const mainClass = styles.main ? styles.main : 'main';

    // Default to home class until we know the actual pathname
    const bodyClassName = mounted ? (isStudio ? "studio" : (isHome ? "home" : "inner")) : "home";

    if (isStudio) {
        return (
            <body className={`${bodyClass} ${fontClass} ${bodyClassName}`}>
                <main className={mainClass}>{children}</main>
            </body>
        );
    }

    return (
        <body className={`${bodyClass} ${fontClass} ${bodyClassName}`}>
            <Header />
            <main className={mainClass}>{children}</main>
            <Footer />
        </body>
    );
}

