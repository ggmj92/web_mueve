'use client'

import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { useState, useEffect } from 'react'
import NewsletterModal from '@/components/NewsletterModal'
import ScrollIndicator from '@/components/ScrollIndicator'
import MueveEstarCarousel from './MueveEstarCarousel'
import styles from './mueve-estar.module.css'
import { urlFor, cropToRect } from '@/sanity/lib/image'

async function getMueveEstarData() {
  try {
    const query = `*[_type == "mueveEstar"][0]{
            images[]{
                asset->{
                    "_ref": _id,
                    _id,
                    url,
                    metadata {
                        dimensions {
                            width,
                            height,
                            aspectRatio
                        }
                    }
                },
                alt,
                hotspot,
                crop
            },
            description,
            artists[]->{
                _id,
                name,
                "slug": slug.current,
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
                                "_ref": _id,
                                _id,
                                url,
                                metadata{ dimensions{ width, height, aspectRatio } }
                            },
                            hotspot,
                            crop
                        }
                    }
                }
            }
        }`

    const data = await client.fetch(query)

    if (!data) {
      console.warn('No mueve estar data found in Sanity')
      return { images: [], description: null, artists: [] }
    }

    if (!data.images || !Array.isArray(data.images)) {
      data.images = []
    } else {
      data.images = data.images.filter(
        (img) =>
          img?.asset?.url &&
          typeof img.asset.url === 'string' &&
          img.asset.url.startsWith('http')
      )
    }

    if (!data.artists || !Array.isArray(data.artists)) {
      data.artists = []
    } else {
      data.artists = data.artists.filter(
        (artist) => artist?.name && typeof artist.name === 'string'
      )
    }

    return data
  } catch (error) {
    console.error('Error fetching mueve estar data:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    return { images: [], description: null, artists: [], error: true }
  }
}

function getPreviewArtwork(artist) {
  if (!artist?.artworks?.length) return null

  for (const artwork of artist.artworks) {
    if (artwork.featuredPreview && artwork.image) {
      return artwork
    }
    if (artwork.detailImages?.length) {
      const featuredDetail = artwork.detailImages.find((d) => d.featuredPreview)
      if (featuredDetail?.image) {
        return { ...artwork, image: featuredDetail.image }
      }
    }
  }

  return artist.artworks[0]
}

export default function MueveEstarPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hoveredArtist, setHoveredArtist] = useState(null)

  useEffect(() => {
    getMueveEstarData()
      .then((data) => {
        setData(data || { images: [], description: null, artists: [] })
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error al cargar mueve estar:', error)
        setData({ images: [], description: null, artists: [] })
        setLoading(false)
      })
  }, [])

  const sortedArtists = data?.artists
    ? [...data.artists].sort((a, b) => a.name.localeCompare(b.name, 'es'))
    : []

  const hasImages = data?.images && data.images.length > 0

  return (
    <>
      <NewsletterModal />
      {hasImages && <ScrollIndicator />}

      <main>
        {hasImages && <MueveEstarCarousel images={data.images} />}

        {!loading && data?.description && (
          <section className={styles.descriptionSection}>
            <div className={styles.textCol}>
              <div className={styles.copy}>
                <PortableText value={data.description} />
              </div>
            </div>
          </section>
        )}

        {!loading && sortedArtists.length > 0 && (
          <section className={styles.artistSection}>
            <div className={styles.listCol}>
              <h2 className={styles.listHeader}>Artistas Invitados</h2>
              <ul className={styles.list}>
                {sortedArtists.map((artist) => (
                  <li key={artist._id} className={styles.listItem}>
                    {artist.artworks?.length > 0 ? (
                      <a
                        href={`/mueve-estar/${artist.slug}`}
                        onMouseEnter={() => setHoveredArtist(artist)}
                        onMouseLeave={() => setHoveredArtist(null)}
                        className={`${styles.artistName} notranslate`}
                      >
                        {artist.name}
                      </a>
                    ) : (
                      <span className={`${styles.artistName} notranslate`}>
                        {artist.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
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
