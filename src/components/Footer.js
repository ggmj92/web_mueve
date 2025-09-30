import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.col}>
                    <p>Gral Borgoño 770, Miraflores</p>
                    <p>Lima, Perú</p>
                </div>
                <div className={styles.col}>
                    <p>info@mueve.com.pe</p>
                    <p>+51 987 654 321</p>
                </div>
                <div className={styles.col}>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        INSTAGRAM
                    </a>
                </div>
            </div>
        </footer>
    );
}
