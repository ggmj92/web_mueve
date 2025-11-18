'use client'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { useState, useEffect } from 'react'
import NewsletterModal from '@/components/NewsletterModal'
import styles from '../artistas/artists.module.css'

async function getGuestArtists() {
    try {
        const query = `*[_type == "guestArtist" && defined(slug.current)] | order(name asc){
        _id, name, "slug": slug.current,
        artworks[]{
          title,
          featuredPreview,
          image{
            asset->{
              _id,
              url,
              metadata{ dimensions{ width, height, aspectRatio } }
            },
            hotspot,
            crop
          },
          detailImages[]{
            featuredPreview,
            image{
              asset->{
                _id,
                url,
                metadata{ dimensions{ width, height, aspectRatio } }
              },
              hotspot,
              crop
            }
          }
        }
      }`
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching guest artists:', error)
        return []
    }
}

export default function MueveEstarPage() {
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    const [hoveredArtist, setHoveredArtist] = useState(null)

    useEffect(() => {
        getGuestArtists()
            .then(artists => {
                setArtists(artists)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error al cargar artistas invitados:', error)
                setArtists([])
                setLoading(false)
            })
    }, [])

    const getPreviewArtwork = (artist) => {
        if (!artist?.artworks?.length) return null
        for (const artwork of artist.artworks) {
            if (artwork.featuredPreview && artwork.image) {
                return artwork
            }
            if (artwork.detailImages?.length) {
                const featuredDetail = artwork.detailImages.find(d => d.featuredPreview)
                if (featuredDetail?.image) {
                    return { ...artwork, image: featuredDetail.image }
                }
            }
        }
        return artist.artworks[0]
    }

    return (
        <>
            <NewsletterModal />
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
                                    href={`/mueve-estar/${a.slug}`}
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
                            .width(1000)
                            .height(1600)
                            .fit('crop')
                            .quality(90)
                            .auto('format')
                            .url()}
                        alt={getPreviewArtwork(hoveredArtist).title || 'Artwork preview'}
                        className={styles.previewImage}
                    />
                </div>
            )}
        </div>
        </>
    )
}
