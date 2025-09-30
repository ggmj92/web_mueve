import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.col}>
                    <a href="https://maps.app.goo.gl/g22oW8UUtikFqpVe7"
                        target="_blank"
                        rel="noreferrer">
                        Gral Borgoño 770, Miraflores
                    </a>
                    <p>Lima, Perú</p>
                </div>
                <div className={styles.col}>
                    <a href="mailto:info@mueve.com.pe?subject=Consulta desde Mueve Web&body=Hola,%0D%0A%0D%0AMe gustaría saber más sobre..."
                        target="_blank"
                        rel="noreferrer">info@mueve.com.pe
                    </a>
                    <br />
                    <a
                        href="https://wa.me/51987654321?text=Hola,%20estoy%20interesado%20en..."
                        target="_blank"
                        rel="noreferrer"
                    >
                        +51 987 654 321
                    </a>
                </div>
                <div className={styles.col}>
                    <a href="https://www.instagram.com/mueve.galeria/" target="_blank" rel="noopener noreferrer">
                        INSTAGRAM
                    </a>
                </div>
            </div>
        </footer>
    );
}
