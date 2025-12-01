import Link from 'next/link'
import styles from './error.module.css'

export const metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe.',
}

export default function NotFound() {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>404 - Página no encontrada</h1>
        <p className={styles.errorMessage}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className={styles.errorActions}>
          <Link href="/" className={styles.homeButton}>
            Volver al inicio
          </Link>
          <Link href="/artistas" className={styles.homeButton}>
            Ver artistas
          </Link>
          <Link href="/exposiciones" className={styles.homeButton}>
            Ver exposiciones
          </Link>
        </div>
      </div>
    </div>
  )
}
