import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import styles from './artist.module.css'

export const revalidate = 0 // dev-friendly

async function getArtistWithWorks(slug) {
    const query = `*[_type == "artist" && slug.current == $slug][0]{
    _id,
    name,
    bio,
    portfolio{
      file{
        asset->{
          url
        }
      },
      externalLink,
      asset->{
        url
      }
    },
    artworks[]{
      title,
      slug,
      year,
      technique,
      dimensions,
      description,
      featured,
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
        featured,
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
    return client.fetch(query, { slug })
}

export default async function ArtistPage({ params }) {
    const { slug } = await params
    const artist = await getArtistWithWorks(slug)

    if (!artist) {
        return (
            <main className={styles.container}>
                <p>Artist not found</p>
            </main>
        )
    }

    // Get the featured artwork for the static hero image, fallback to first artwork
    const artworks = (artist.artworks || []).filter((a) => a?.image?.asset?.url)
    
    // Check for featured main image or featured detail image
    let heroArtwork = null
    for (const artwork of artworks) {
        // Check if main image is featured
        if (artwork.featured && artwork.image) {
            heroArtwork = artwork
            break
        }
        // Check if any detail image is featured
        if (artwork.detailImages?.length) {
            const featuredDetail = artwork.detailImages.find(d => d.featured)
            if (featuredDetail?.image) {
                heroArtwork = { ...artwork, image: featuredDetail.image }
                break
            }
        }
    }
    
    // Fallback to first artwork if no featured image
    if (!heroArtwork) {
        heroArtwork = artworks[0]
    }

    // Get portfolio URL (supports both old and new structure)
    const portfolioUrl = artist.portfolio?.file?.asset?.url || 
                         artist.portfolio?.externalLink || 
                         artist.portfolio?.asset?.url // Legacy support for old structure

    return (
        <main>
            {/* Top: static hero image */}
            {heroArtwork && (
                <section className={styles.hero}>
                    <div className={styles.heroImage}>
                        <img
                            src={heroArtwork.image.asset.url}
                            alt={heroArtwork.title || 'Artwork'}
                            className={styles.heroImg}
                        />
                    </div>
                </section>
            )}

            {/* Below the fold: artist info section (left aligned to page edge) */}
            <section className={styles.info}>
                <div className={styles.infoRow}>
                    <h1 className={styles.name}>{artist.name}</h1>
                    {portfolioUrl ? (
                        <a
                            className={styles.portfolio}
                            href={portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Ver portafolio"
                        >
                            Portafolio
                        </a>
                    ) : null}
                </div>
                {artist.bio ? (
                    <div className={styles.bio}>
                        <PortableText value={artist.bio} />
                    </div>
                ) : null}
            </section>

            {/* 5-up portrait cards; horizontally scrollable if more */}
            {artist.artworks?.length > 0 && (
                <section className={styles.cardsSection}>
                    <h2 className={styles.mobileHeader}>Obras Seleccionadas</h2>
                    <div className={styles.cards}>
                        {artist.artworks.map((aw, index) => {
                            const url = aw?.image?.asset?.url
                            if (!url || !aw.slug?.current) return null
                            
                            // Desktop: cropped vertical image respecting hotspot
                            const desktopImageUrl = urlFor(aw.image)
                                .width(600)
                                .height(800)
                                .fit('crop')
                                .quality(90)
                                .auto('format')
                                .url()
                            
                            // Mobile: use raw asset URL to bypass hotspot/crop entirely
                            const mobileImageUrl = urlFor(aw.image.asset)
                                .width(1200)
                                .quality(90)
                                .auto('format')
                                .url()
                            
                            return (
                                <div key={aw.slug?.current || `artwork-${index}`} className={styles.cardWrapper}>
                                    <a
                                        href={`/artistas/${slug}/obras/${aw.slug.current}`}
                                        className={styles.card}
                                    >
                                        <picture>
                                            <source media="(max-width: 768px)" srcSet={mobileImageUrl} />
                                            <img
                                                src={desktopImageUrl}
                                                alt={aw.title || 'Artwork'}
                                                className={styles.cardImage}
                                            />
                                        </picture>
                                    </a>
                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardTitle}>
                                            {aw.title}
                                            {aw.year && (
                                                <span className={styles.cardYear}>
                                                    , {aw.year}
                                                </span>
                                            )}
                                        </div>
                                        {aw.technique && (
                                            <div className={styles.cardDetail}>
                                                {aw.technique}
                                            </div>
                                        )}
                                        {aw.dimensions && (
                                            <div className={styles.cardDetail}>
                                                {aw.dimensions}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}
        </main>
    )
}