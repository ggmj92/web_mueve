import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import NewsletterModal from '@/components/NewsletterModal'
import ScrollIndicator from '@/components/ScrollIndicator'
import PortfolioLink from '@/components/PortfolioLink'
import styles from './exposicion.module.css'
import ExposicionCarousel from './ExposicionCarousel'

export const revalidate = 0

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const { slug } = await params
    const exposicion = await getExposicionWithWorks(slug)
    
    if (!exposicion) {
        return {
            title: 'Exposición no encontrada',
        }
    }

    // Get featured image for OG
    const artworks = (exposicion.artworks || []).filter((a) => a?.image?.asset?.url)
    let ogImage = '/logos/mueve_logo.png' // fallback
    
    const featuredArtwork = artworks.find(a => a.featured)
    if (featuredArtwork?.image?.asset?.url) {
        ogImage = featuredArtwork.image.asset.url
    } else if (artworks[0]?.image?.asset?.url) {
        ogImage = artworks[0].image.asset.url
    }

    // Extract plain text from description
    const descText = exposicion.description?.map(block => 
        block.children?.map(child => child.text).join(' ')
    ).join(' ').slice(0, 160) || `${exposicion.title} - Exposición en Mueve Galería`

    // Get artist names
    const artistNames = exposicion.artists?.map(a => a.name).filter(Boolean).join(', ') || ''
    const titleWithArtists = artistNames ? `${exposicion.title} - ${artistNames}` : exposicion.title

    return {
        title: titleWithArtists,
        description: descText,
        keywords: [exposicion.title, ...exposicion.artists?.map(a => a.name).filter(Boolean) || [], 'exposición', 'arte contemporáneo', 'Mueve', 'Mueve Galería'],
        openGraph: {
            title: `${titleWithArtists} | Mueve Galería`,
            description: descText,
            url: `https://muevegaleria.com/exposiciones/${slug}`,
            siteName: 'Mueve Galería',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${exposicion.title} - Mueve Galería`,
                },
            ],
            locale: 'es_ES',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${titleWithArtists} | Mueve Galería`,
            description: descText,
            images: [ogImage],
        },
        alternates: {
            canonical: `/exposiciones/${slug}`,
        },
    }
}

async function getExposicionWithWorks(slug) {
    const query = `*[_type == "exposicion" && slug.current == $slug][0]{
    _id,
    title,
    year,
    description,
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
    prensaSpanish{
      file{
        asset->{
          url
        }
      },
      externalLink
    },
    prensaEnglish{
      file{
        asset->{
          url
        }
      },
      externalLink
    },
    artists[]{
      _type == 'reference' => @->{
        name
      },
      _type != 'reference' => {
        name
      }
    },
    artworks[]{
      slug,
      featured,
      image{
        asset->{
          _id,
          url,
          metadata{ dimensions{ width, height, aspectRatio } }
        },
        hotspot,
        crop
      },
      artworkInfo[]{
        artistName,
        title,
        year,
        technique,
        dimensions
      }
    }
  }`
    return client.fetch(query, { slug })
}

export default async function ExposicionPage({ params }) {
    const { slug } = await params
    const exposicion = await getExposicionWithWorks(slug)

    if (!exposicion) {
        return (
            <main className={styles.container}>
                <p>Exposición not found</p>
            </main>
        )
    }

    const artistNames = exposicion.artists?.map(a => a.name).filter(Boolean) || []

    // Get the featured image for the hero, fallback to first image
    const artworks = (exposicion.artworks || []).filter((a) => a?.image?.asset?.url)
    let heroImage = artworks.find(a => a.featured) || artworks[0]

    return (
        <>
            <NewsletterModal />
            <ScrollIndicator />
            <main>
            {/* Top: static hero image */}
            {heroImage && (
                <section className={styles.hero}>
                    <div className={styles.heroImage}>
                        <img
                            src={heroImage.image.asset.url}
                            alt={exposicion.title || 'Exposición'}
                            className={styles.heroImg}
                        />
                    </div>
                </section>
            )}

            {/* Below the fold: exposicion info section */}
            <section className={styles.info}>
                <div className={styles.infoRow}>
                    <h1 className={styles.artists}>
                        {artistNames.length > 0 ? artistNames.join(', ') : exposicion.title}
                    </h1>
                    <div className={styles.linksColumn}>
                        <PortfolioLink
                            spanish={exposicion.portfolioSpanish}
                            english={exposicion.portfolioEnglish}
                            label="Portafolio"
                            className={styles.portfolio}
                        />
                        <PortfolioLink
                            spanish={exposicion.prensaSpanish}
                            english={exposicion.prensaEnglish}
                            label="Prensa"
                            className={styles.portfolio}
                        />
                    </div>
                </div>
                {exposicion.description ? (
                    <div className={styles.description}>
                        <PortableText value={exposicion.description} />
                    </div>
                ) : null}
            </section>

            {/* 5-up portrait cards; infinite carousel on desktop if more than 5 */}
            {artworks.length > 0 && (
                <section className={styles.cardsSection}>
                    <ExposicionCarousel 
                        artworks={artworks} 
                        exposicionSlug={slug}
                    />
                </section>
            )}
        </main>
        </>
    )
}
