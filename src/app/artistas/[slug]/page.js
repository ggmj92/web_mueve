import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import NewsletterModal from '@/components/NewsletterModal'
import ScrollIndicator from '@/components/ScrollIndicator'
import PortfolioLink from '@/components/PortfolioLink'
import styles from './artist.module.css'
import ArtworkCarousel from './ArtworkCarousel'
import { urlFor, hotspotToObjectPosition } from '@/sanity/lib/image'

export const revalidate = 0 // dev-friendly

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const { slug } = await params
    const artist = await getArtistWithWorks(slug)
    
    if (!artist) {
        return {
            title: 'Artista no encontrado',
        }
    }

    // Get featured artwork image for OG image
    const artworks = (artist.artworks || []).filter((a) => a?.image?.asset?.url)
    let ogImage = '/logos/mueve_logo.png' // fallback
    
    for (const artwork of artworks) {
        if (artwork.featured && artwork.image?.asset?.url) {
            ogImage = artwork.image.asset.url
            break
        } else if (artwork.featuredPreview && artwork.image?.asset?.url) {
            ogImage = artwork.image.asset.url
            break
        }
    }
    
    if (!ogImage && artworks[0]?.image?.asset?.url) {
        ogImage = artworks[0].image.asset.url
    }

    // Extract plain text from bio for description
    const bioText = artist.bio?.map(block => 
        block.children?.map(child => child.text).join(' ')
    ).join(' ').slice(0, 160) || `Obras y portfolio de ${artist.name} en Mueve Galería`

    return {
        title: artist.name,
        description: bioText,
        keywords: [artist.name, 'artista', 'arte contemporáneo', 'Mueve', 'Mueve Galería', 'obras', 'portfolio'],
        openGraph: {
            title: `${artist.name} | Mueve Galería`,
            description: bioText,
            url: `https://muevegaleria.com/artistas/${slug}`,
            siteName: 'Mueve Galería',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${artist.name} - Mueve Galería`,
                },
            ],
            locale: 'es_ES',
            type: 'profile',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${artist.name} | Mueve Galería`,
            description: bioText,
            images: [ogImage],
        },
        alternates: {
            canonical: `/artistas/${slug}`,
        },
    }
}

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
          "_ref": _id,
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
    try {
        return await client.fetch(query, { slug })
    } catch (err) {
        console.error('Sanity fetch error:', err)
        return null
    }
}

export default async function ArtistPage({ params }) {
    const { slug } = await params
    const artist = await getArtistWithWorks(slug)

    if (!artist) notFound()

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
                            src={urlFor(heroArtwork.image).width(2400).quality(90).auto('format').url()}
                            alt={heroArtwork.title || 'Artwork'}
                            className={styles.heroImg}
                            style={{ objectPosition: hotspotToObjectPosition(heroArtwork.image.hotspot) }}
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                            loading="eager"
                        />
                    </div>
                </section>
            )}

            {/* Below the fold: artist info section (left aligned to page edge) */}
            <section className={styles.info}>
                <div className={styles.infoRow}>
                    <h1 className={`${styles.name} notranslate`}>{artist.name}</h1>
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