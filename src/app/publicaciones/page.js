'use client'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { useState, useEffect } from 'react'
import NewsletterModal from '@/components/NewsletterModal'
import styles from './publicaciones.module.css'

async function getPublicaciones() {
    try {
        const query = `*[_type == "publicacion" && defined(slug.current)] | order(year desc){
        _id, title, year, isCurrent, "slug": slug.current,
        pdfLink,
        pdfFile{
          asset->{
            _id,
            url
          }
        },
        caratula{
          asset->{
            _id,
            url,
            metadata{ dimensions{ width, height, aspectRatio } }
          },
          hotspot,
          crop
        }
      }`
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching publicaciones:', error)
        return []
    }
}

export default function PublicacionesPage() {
    const [publicaciones, setPublicaciones] = useState([])
    const [loading, setLoading] = useState(true)
    const [hoveredPublicacion, setHoveredPublicacion] = useState(null)

    useEffect(() => {
        getPublicaciones()
            .then(publicaciones => {
                setPublicaciones(publicaciones)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error al cargar publicaciones:', error)
                setPublicaciones([])
                setLoading(false)
            })
    }, [])

    const currentPublicaciones = publicaciones.filter(p => p.isCurrent)
    const pastPublicaciones = publicaciones.filter(p => !p.isCurrent)

    const getPdfUrl = (publicacion) => {
        // Prioritize pdfLink, then pdfFile
        if (publicacion.pdfLink) {
            return publicacion.pdfLink
        }
        if (publicacion.pdfFile?.asset?.url) {
            return publicacion.pdfFile.asset.url
        }
        return null
    }

    const handlePublicacionClick = (e, publicacion) => {
        const pdfUrl = getPdfUrl(publicacion)
        if (pdfUrl) {
            e.preventDefault()
            window.open(pdfUrl, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <>
            <NewsletterModal />
            <div className={`${styles.publicaciones} alignSecondCol`}>
            <div className={styles.listCol}>
                {loading ? (
                    <div>
                        <p>Cargando publicaciones...</p>
                    </div>
                ) : (
                    <>
                        {currentPublicaciones.length > 0 && (
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Actuales</h2>
                                <ul className={styles.list}>
                                    {currentPublicaciones.map((p) => (
                                        <li key={p.slug ?? p._id} className={styles.listItem}>
                                            <a
                                                href={getPdfUrl(p) || '#'}
                                                onClick={(e) => handlePublicacionClick(e, p)}
                                                onMouseEnter={() => setHoveredPublicacion(p)}
                                                onMouseLeave={() => setHoveredPublicacion(null)}
                                                className={styles.itemLink}
                                            >
                                                <span className={`${styles.itemName} notranslate`}>{p.title}</span>
                                                <span className={styles.itemYear}>{p.year}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {pastPublicaciones.length > 0 && (
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Pasadas</h2>
                                <ul className={styles.list}>
                                    {pastPublicaciones.map((p) => (
                                        <li key={p.slug ?? p._id} className={styles.listItem}>
                                            <a
                                                href={getPdfUrl(p) || '#'}
                                                onClick={(e) => handlePublicacionClick(e, p)}
                                                onMouseEnter={() => setHoveredPublicacion(p)}
                                                onMouseLeave={() => setHoveredPublicacion(null)}
                                                className={styles.itemLink}
                                            >
                                                <span className={`${styles.itemName} notranslate`}>{p.title}</span>
                                                <span className={styles.itemYear}>{p.year}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {publicaciones.length === 0 && (
                            <div>
                                <p>No se encontraron publicaciones.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {hoveredPublicacion && hoveredPublicacion.caratula && (
                <div className={styles.preview}>
                    <img
                        src={urlFor(hoveredPublicacion.caratula)
                            .width(800)
                            .height(800)
                            .fit('crop')
                            .crop('focalpoint')
                            .quality(90)
                            .auto('format')
                            .url()}
                        alt={hoveredPublicacion.title || 'Publicación preview'}
                        className={styles.previewImage}
                    />
                </div>
            )}
        </div>
        </>
    )
}
