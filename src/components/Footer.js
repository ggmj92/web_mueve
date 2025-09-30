import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.col}>
                    <a href="https://maps.app.goo.gl/g22oW8UUtikFqpVe7"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.addressLink}>
                        Gral Borgoño 770, Miraflores
                    </a>
                    <p className={styles.limaPeru}>Lima, Perú</p>
                    <a href="https://www.instagram.com/mueve.galeria/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mobileInstagram}>
                        INSTAGRAM
                    </a>
                </div>
                <div className={styles.col}>
                    <a
                        href="mailto:info@mueve.com.pe?subject=Consulta desde Mueve Web&body=Hola..."
                        target="_blank"
                        rel="noreferrer"
                        className={styles.contactLine}
                    >
                        info@mueve.com.pe
                    </a>
                    <a
                        href="https://wa.me/51987654321?text=Hola..."
                        target="_blank"
                        rel="noreferrer"
                        className={styles.contactLine}
                    >
                        +51 987 654 321
                    </a>
                </div>

                <div className={styles.col}>
                    <a href="https://www.instagram.com/mueve.galeria/"
                        target="_blank"
                        rel="noopener noreferrer">
                        INSTAGRAM
                    </a>
                </div>
            </div>
        </footer>
    );
}
