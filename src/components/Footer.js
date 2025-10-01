import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
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
                    <p>INSTAGRAM</p>
                </a>
            </div>
            <div className={`${styles.col} ${styles.contactCol}`}>
                <a
                    href="mailto:info@mueve.com.pe?subject=Consulta desde Mueve Web&body=Hola..."
                    target="_blank"
                    rel="noreferrer"
                    className={styles.contactLine}
                >
                    <p>info@mueve.com.pe</p>
                </a>
                <a
                    href="https://wa.me/51987654321?text=Hola..."
                    target="_blank"
                    rel="noreferrer"
                    className={styles.contactLine}
                >
                    <p>+51 987 654 321</p>
                </a>
            </div>

            <div className={styles.col}>
                <a href="https://www.instagram.com/mueve.galeria/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.desktopInstagram}
                >
                    <p>INSTAGRAM</p>
                </a>
            </div>
        </footer>
    );
}
