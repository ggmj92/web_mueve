'use client'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { useState, useEffect } from 'react'
import styles from './artists.module.css'

async function getArtists() {
    try {
        const query = `*[_type == "artist" && defined(slug.current)] | order(name asc){
        _id, name, "slug": slug.current,
        artworks[]->{
          _id,
          title,
          featuredPreview,
          image{
            asset->{
              url,
              metadata{ dimensions{ width, height, aspectRatio } }
            }
          }
        }
      }`
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching artists:', error)
        return []
    }
}

export default function ArtistsPage() {
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    const [hoveredArtist, setHoveredArtist] = useState(null)

    useEffect(() => {
        getArtists()
            .then(artists => {
                setArtists(artists)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error al cargar artistas:', error)
                setArtists([])
                setLoading(false)
            })
    }, [])

    const getPreviewArtwork = (artist) => {
        if (!artist?.artworks?.length) return null
        // First try to find the artwork marked as featuredPreview
        const previewArtwork = artist.artworks.find(a => a.featuredPreview)
        // Fallback to first artwork if no preview is marked
        return previewArtwork || artist.artworks[0]
    }

    return (
        <div className={`${styles.artists} alignSecondCol`}>
            <div className={styles.listCol}>
                {loading ? (
                    <div>
                        <p>Cargando artistas...</p>
                    </div>
                ) : artists.length > 0 ? (
                    <ul className={styles.list}>
                        {artists.map((a) => (
                            <li key={a.slug ?? a._id}>
                                <a
                                    href={`/artistas/${a.slug}`}
                                    onMouseEnter={() => setHoveredArtist(a)}
                                    onMouseLeave={() => setHoveredArtist(null)}
                                >
                                    {a.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>
                        <p>No se encontraron artistas.</p>
                    </div>
                )}
            </div>

            {hoveredArtist && getPreviewArtwork(hoveredArtist) && (
                <div className={styles.preview}>
                    <img
                        src={urlFor(getPreviewArtwork(hoveredArtist).image)
                            .width(2000)
                            .quality(100)
                            .auto('format')
                            .url()}
                        alt={getPreviewArtwork(hoveredArtist).title || 'Artwork preview'}
                        className={styles.previewImage}
                    />
                </div>
            )}
        </div>
    )
}




