import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import NewsletterModal from '@/components/NewsletterModal'
import ScrollIndicator from '@/components/ScrollIndicator'
import PortfolioLink from '@/components/PortfolioLink'
import styles from './exposicion.module.css'
import ExposicionCarousel from './ExposicionCarousel'

export const revalidate = 0

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
                    <PortfolioLink
                        spanish={exposicion.portfolioSpanish}
                        english={exposicion.portfolioEnglish}
                        label="Portafolio"
                        className={styles.portfolio}
                    />
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
                    <h2 className={styles.mobileHeader}>Obras Seleccionadas</h2>
                    <ExposicionCarousel 
                        artworks={artworks} 
                        exposicionSlug={slug}
                        exposicionTitle={exposicion.title}
                    />
                </section>
            )}
        </main>
        </>
    )
}
