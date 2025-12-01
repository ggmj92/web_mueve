'use client'

import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { useState, useEffect } from 'react'
import NewsletterModal from '@/components/NewsletterModal'
import ScrollIndicator from '@/components/ScrollIndicator'
import MueveEstarCarousel from './MueveEstarCarousel'
import styles from './mueve-estar.module.css'

async function getMueveEstarData() {
    try {
        const query = `*[_type == "mueveEstar"][0]{
            images[]{
                asset->{
                    url
                },
                alt,
                hotspot,
                crop
            },
            description,
            artists[]{
                name
            }
        }`
        const data = await client.fetch(query)
        // Ensure images is always an array, even if field doesn't exist yet
        if (data && !data.images) {
            data.images = []
        }
        return data
    } catch (error) {
        console.error('Error fetching mueve estar data:', error)
        return { images: [], description: null, artists: [] }
    }
}

export default function MueveEstarPage() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMueveEstarData()
            .then(data => {
                setData(data || { images: [], description: null, artists: [] })
                setLoading(false)
            })
            .catch(error => {
                console.error('Error al cargar mueve estar:', error)
                setData({ images: [], description: null, artists: [] })
                setLoading(false)
            })
    }, [])

    // Sort artists alphabetically
    const sortedArtists = data?.artists
        ? [...data.artists].sort((a, b) => a.name.localeCompare(b.name, 'es'))
        : []

    const hasImages = data?.images && data.images.length > 0

    return (
        <>
            <NewsletterModal />
            {hasImages && <ScrollIndicator />}
            
            <main>
                {/* Image carousel at the top */}
                {hasImages && <MueveEstarCarousel images={data.images} />}
                
                {/* Description right below carousel */}
                {!loading && data?.description && (
                    <section className={styles.descriptionSection}>
                        <div className={styles.textCol}>
                            <div className={styles.copy}>
                                <PortableText value={data.description} />
                            </div>
                        </div>
                    </section>
                )}

                {/* Artist list - further down, requires scrolling */}
                {!loading && sortedArtists.length > 0 && (
                    <section className={styles.artistSection}>
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
                    </section>
                )}

                {loading && (
                    <div className={styles.mueveEstar}>
                        <div className={styles.textCol}>
                            <p>Cargando...</p>
                        </div>
                    </div>
                )}
            </main>
        </>
    )
}
