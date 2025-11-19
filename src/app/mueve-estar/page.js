'use client'

import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { useState, useEffect } from 'react'
import NewsletterModal from '@/components/NewsletterModal'
import styles from './mueve-estar.module.css'

async function getMueveEstarData() {
    try {
        const query = `*[_type == "mueveEstar"][0]{
            description,
            artists[]{
                name
            }
        }`
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching mueve estar data:', error)
        return null
    }
}

export default function MueveEstarPage() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMueveEstarData()
            .then(data => {
                setData(data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error al cargar mueve estar:', error)
                setData(null)
                setLoading(false)
            })
    }, [])

    // Sort artists alphabetically
    const sortedArtists = data?.artists
        ? [...data.artists].sort((a, b) => a.name.localeCompare(b.name, 'es'))
        : []

    return (
        <>
            <NewsletterModal />
            <div className={styles.mueveEstar}>
                {loading ? (
                    <div className={styles.textCol}>
                        <p>Cargando...</p>
                    </div>
                ) : (
                    <>
                        {/* Description paragraph */}
                        {data?.description && (
                            <div className={styles.textCol}>
                                <div className={styles.copy}>
                                    <PortableText value={data.description} />
                                </div>
                            </div>
                        )}

                        {/* Artist list */}
                        {sortedArtists.length > 0 && (
                            <div className={styles.listCol}>
                                <h2 className={styles.listHeader}>Artistas Invitados</h2>
                                <ul className={styles.list}>
                                    {sortedArtists.map((artist, index) => (
                                        <li key={index} className={styles.listItem}>
                                            <span className={styles.artistName}>{artist.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}
