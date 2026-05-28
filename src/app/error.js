'use client'

import { useEffect } from 'react'
import styles from './error.module.css'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)

    // You can integrate with error tracking services here
    // Example: Sentry.captureException(error)
  }, [error])

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>Algo salió mal</h1>
        <p className={styles.errorMessage}>
          Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta
          nuevamente.
        </p>
        <div className={styles.errorActions}>
          <button onClick={() => reset()} className={styles.retryButton}>
            Intentar nuevamente
          </button>
          <a href="/" className={styles.homeButton}>
            Volver al inicio
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className={styles.errorDetails}>
            <summary>Detalles del error (solo en desarrollo)</summary>
            <pre className={styles.errorStack}>
              {error?.message || 'Error desconocido'}
              {'\n\n'}
              {error?.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
