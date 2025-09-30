"use client";

import { usePathname } from "next/navigation";
import styles from "@/app/layout.module.css";
import Header from "./Header";
import Footer from "./Footer";

export default function HomepageClient({ children, fontClass }) {
    const pathname = usePathname();
    const isHome = pathname === "/";

    // Ensure we have valid class names to prevent hydration mismatch
    const bodyClass = styles.body ? styles.body : 'body';
    const mainClass = styles.main ? styles.main : 'main';

    return (
        <body className={`${bodyClass} ${fontClass} ${isHome ? "home" : "inner"}`}>
            <Header />
            <main className={mainClass}>{children}</main>
            <Footer />
        </body>
    );
}

