'use client'

import { client } from '@/sanity/lib/client'
import { urlFor, cropToRect } from '@/sanity/lib/image'
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

async function getGuestArtists() {
  try {
    const query = `*[_type == "guestArtist" && defined(slug.current)] | order(name asc){
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
    console.error('Error fetching guest artists:', error)
    return []
  }
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState([])
  const [guestArtists, setGuestArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredArtist, setHoveredArtist] = useState(null)

  useEffect(() => {
    Promise.all([getArtists(), getGuestArtists()])
      .then(([artists, guestArtists]) => {
        setArtists(artists)
        setGuestArtists(guestArtists)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error al cargar artistas:', error)
        setArtists([])
        setGuestArtists([])
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
        const featuredDetail = artwork.detailImages.find(
          (d) => d.featuredPreview
        )
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
          ) : (
            <>
              <h2 className={styles.listHeader}>Artistas Representados</h2>
              {artists.length > 0 ? (
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
                <p>No se encontraron artistas.</p>
              )}

              {guestArtists.length > 0 && (
                <>
                  <h2 className={styles.listHeader}>Artistas Invitados</h2>
                  <ul className={styles.list}>
                    {guestArtists.map((a) => (
                      <li key={a.slug ?? a._id}>
                        <a
                          href={`/artistas/invitados/${a.slug}`}
                          onMouseEnter={() => setHoveredArtist(a)}
                          onMouseLeave={() => setHoveredArtist(null)}
                          className="notranslate"
                        >
                          {a.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>

        {(() => {
          const preview = hoveredArtist
            ? getPreviewArtwork(hoveredArtist)
            : null
          if (!preview) return null
          const hs = preview.image?.hotspot
          const rect = cropToRect(preview.image)
          const previewUrl = (
            rect
              ? urlFor(preview.image).rect(
                  rect.x,
                  rect.y,
                  rect.width,
                  rect.height
                )
              : urlFor(preview.image)
          )
            .width(800)
            .height(800)
            .fit('crop')
            .focalPoint(hs?.x ?? 0.5, hs?.y ?? 0.5)
            .quality(90)
            .auto('format')
            .url()
          return (
            <div className={styles.preview}>
              <img
                src={previewUrl}
                alt={preview.title || 'Artwork preview'}
                className={styles.previewImage}
              />
            </div>
          )
        })()}
      </div>
    </>
  )
}
