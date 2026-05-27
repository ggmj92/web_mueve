'use client'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { useState, useEffect } from 'react'
import NewsletterModal from '@/components/NewsletterModal'
import styles from './artists.module.css'

async function getArtists() {
    try {
        const query = `*[_type == "artist" && defined(slug.current)] | order(name asc){
        _id, name, "slug": slug.current,
        artworks[]{
          title,
          featuredPreview,
          image{
            asset->{
              "_ref": _id,
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

        // Check all artworks for featuredPreview (main image or detail images)
        for (const artwork of artist.artworks) {
            // Check if main image is marked as featuredPreview
            if (artwork.featuredPreview && artwork.image) {
                return artwork
            }
            // Check if any detail image is marked as featuredPreview
            if (artwork.detailImages?.length) {
                const featuredDetail = artwork.detailImages.find(d => d.featuredPreview)
                if (featuredDetail?.image) {
                    return { ...artwork, image: featuredDetail.image }
                }
            }
        }

        // Fallback to first artwork if no preview is marked
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
                                    href={`/artistas/${a.slug}`}
                                    onMouseEnter={() => setHoveredArtist(a)}
                                    onMouseLeave={() => setHoveredArtist(null)}
                                    className="notranslate"
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

            {(() => {
                const preview = hoveredArtist ? getPreviewArtwork(hoveredArtist) : null
                if (!preview) return null
                const hs = preview.image?.hotspot
                return (
                <div className={styles.preview}>
                    <img
                        src={urlFor(preview.image)
                            .width(800)
                            .height(800)
                            .fit('crop')
                            .crop('focalpoint')
                            .focalPoint(hs?.x ?? 0.5, hs?.y ?? 0.5)
                            .quality(90)
                            .auto('format')
                            .url()}
                        alt={preview.title || 'Artwork preview'}
                        className={styles.previewImage}
                    />
                </div>)
            })()}
        </div>
        </>
    )
}