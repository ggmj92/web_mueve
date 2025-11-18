'use client'

import { client } from '@/sanity/lib/client'
import { useState, useEffect } from 'react'
import NewsletterModal from '@/components/NewsletterModal'
import styles from './ferias.module.css'

async function getFerias() {
    try {
        const query = `*[_type == "feria" && defined(slug.current)] | order(year desc){
        _id,
        title,
        "slug": slug.current,
        year,
        dateRange,
        isCurrent
      }`
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching ferias:', error)
        return []
    }
}

export default function FeriasPage() {
    const [ferias, setFerias] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getFerias()
            .then(ferias => {
                setFerias(ferias)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error al cargar ferias:', error)
                setFerias([])
                setLoading(false)
            })
    }, [])

    const actuales = ferias.filter(f => f.isCurrent)
    const pasadas = ferias.filter(f => !f.isCurrent)

    return (
        <>
            <NewsletterModal />
            <div className={`${styles.ferias} alignSecondCol`}>
            <div className={styles.listCol}>
                {loading ? (
                    <div>
                        <p>Cargando ferias...</p>
                    </div>
                ) : (
                    <>
                        {actuales.length > 0 && (
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Actuales</h2>
                                <ul className={styles.list}>
                                    {actuales.map((f) => (
                                        <li key={f.slug ?? f._id} className={styles.listItem}>
                                            <div className={styles.itemLink}>
                                                <span className={styles.itemName}>{f.title}</span>
                                                <span className={styles.itemYear}>{f.year}</span>
                                                <span className={styles.itemDate}>{f.dateRange}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {pasadas.length > 0 && (
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Pasadas</h2>
                                <ul className={styles.list}>
                                    {pasadas.map((f) => (
                                        <li key={f.slug ?? f._id} className={styles.listItem}>
                                            <div className={styles.itemLink}>
                                                <span className={styles.itemName}>{f.title}</span>
                                                <span className={styles.itemYear}>{f.year}</span>
                                                <span className={styles.itemDate}>{f.dateRange}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {ferias.length === 0 && (
                            <div>
                                <p>No se encontraron ferias.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
        </>
    )
}
