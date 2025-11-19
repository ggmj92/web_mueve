import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import NewsletterModal from '@/components/NewsletterModal'
import ScrollIndicator from '@/components/ScrollIndicator'
import PortfolioLink from '@/components/PortfolioLink'
import styles from './artist.module.css'
import ArtworkCarousel from './ArtworkCarousel'

export const revalidate = 0 // dev-friendly

async function getArtistWithWorks(slug) {
    const query = `*[_type == "artist" && slug.current == $slug][0]{
    _id,
    name,
    bio,
    portfolioSpanish{
      file{
        asset->{
          url
        }
      },
      externalLink
    },
    portfolioEnglish{
      file{
        asset->{
          url
        }
      },
      externalLink
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

    return (
        <>
            <NewsletterModal />
            <ScrollIndicator />
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
                    <PortfolioLink
                        spanish={artist.portfolioSpanish}
                        english={artist.portfolioEnglish}
                        label="Portafolio"
                        className={styles.portfolio}
                    />
                </div>
                {artist.bio ? (
                    <div className={styles.bio}>
                        <PortableText value={artist.bio} />
                    </div>
                ) : null}
            </section>

            {/* 5-up portrait cards; infinite carousel on desktop if more than 5 */}
            {artist.artworks?.length > 0 && (
                <section className={styles.cardsSection}>
                    <h2 className={styles.mobileHeader}>Obras Seleccionadas</h2>
                    <ArtworkCarousel artworks={artist.artworks} artistSlug={slug} />
                </section>
            )}
        </main>
        </>
    )
}