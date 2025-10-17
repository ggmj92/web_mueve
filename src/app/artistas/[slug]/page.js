import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import styles from './artist.module.css'

export const revalidate = 0 // dev-friendly

async function getArtistWithWorks(slug) {
    const query = `*[_type == "artist" && slug.current == $slug][0]{
    _id,
    name,
    bio,
    portfolio{
      asset->{
        url
      }
    },
    artworks[]->{
      _id,
      title,
      slug,
      year,
      technique,
      dimensions,
      featured,
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
    const featuredArtwork = artworks.find((a) => a.featured)
    const heroArtwork = featuredArtwork || artworks[0]

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
                    {artist.portfolio?.asset?.url ? (
                        <a
                            className={styles.portfolio}
                            href={artist.portfolio.asset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Ver portafolio"
                        >
                            Portafolio
                        </a>
                    ) : null}
                </div>
                {artist.bio ? <p className={styles.bio}>{artist.bio}</p> : null}
            </section>

            {/* 5-up portrait cards; horizontally scrollable if more */}
            {artist.artworks?.length > 0 && (
                <section className={styles.cardsSection}>
                    <h2 className={styles.mobileHeader}>Obras Seleccionadas</h2>
                    <div className={styles.cards}>
                        {artist.artworks.map((aw) => {
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
                            
                            // Mobile: original full image
                            const mobileImageUrl = urlFor(aw.image)
                                .width(1200)
                                .quality(90)
                                .auto('format')
                                .url()
                            
                            return (
                                <div key={aw._id} className={styles.cardWrapper}>
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