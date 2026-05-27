import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import NewsletterModal from '@/components/NewsletterModal'
import ScrollIndicator from '@/components/ScrollIndicator'
import PortfolioLink from '@/components/PortfolioLink'
import styles from '../../artistas/[slug]/artist.module.css'
import ArtworkCarousel from '../../artistas/[slug]/ArtworkCarousel'
import { urlFor, hotspotToObjectPosition } from '@/sanity/lib/image'

export const revalidate = 0

export async function generateMetadata({ params }) {
    const { slug } = await params
    const artist = await getGuestArtistWithWorks(slug)

    if (!artist) {
        return { title: 'Artista no encontrado' }
    }

    const artworks = (artist.artworks || []).filter((a) => a?.image?.asset?.url)
    let ogImage = '/logos/mueve_logo.png'

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

    const bioText = artist.bio?.map(block =>
        block.children?.map(child => child.text).join(' ')
    ).join(' ').slice(0, 160) || `Obras y portfolio de ${artist.name} en Mueve Estar`

    return {
        title: artist.name,
        description: bioText,
        keywords: [artist.name, 'artista invitado', 'mueve estar', 'arte contemporáneo', 'Mueve Galería'],
        openGraph: {
            title: `${artist.name} | Mueve Estar`,
            description: bioText,
            url: `https://muevegaleria.com/mueve-estar/${slug}`,
            siteName: 'Mueve Galería',
            images: [{ url: ogImage, width: 1200, height: 630, alt: `${artist.name} - Mueve Estar` }],
            locale: 'es_ES',
            type: 'profile',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${artist.name} | Mueve Estar`,
            description: bioText,
            images: [ogImage],
        },
        alternates: {
            canonical: `/mueve-estar/${slug}`,
        },
    }
}

async function getGuestArtistWithWorks(slug) {
    const query = `*[_type == "guestArtist" && slug.current == $slug][0]{
    _id,
    name,
    bio,
    portfolioSpanish{
      file{
        asset->{ url }
      },
      externalLink
    },
    portfolioEnglish{
      file{
        asset->{ url }
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
  }`
    return client.fetch(query, { slug })
}

export default async function GuestArtistPage({ params }) {
    const { slug } = await params
    const artist = await getGuestArtistWithWorks(slug)

    if (!artist) {
        return (
            <main className={styles.container}>
                <p>Artist not found</p>
            </main>
        )
    }

    const artworks = (artist.artworks || []).filter((a) => a?.image?.asset?.url)

    let heroArtwork = null
    for (const artwork of artworks) {
        if (artwork.featured && artwork.image) {
            heroArtwork = artwork
            break
        }
        if (artwork.detailImages?.length) {
            const featuredDetail = artwork.detailImages.find(d => d.featured)
            if (featuredDetail?.image) {
                heroArtwork = { ...artwork, image: featuredDetail.image }
                break
            }
        }
    }

    if (!heroArtwork) {
        heroArtwork = artworks[0]
    }

    return (
        <>
            <NewsletterModal />
            <ScrollIndicator />
            <main>
            {heroArtwork && (
                <section className={styles.hero}>
                    <div className={styles.heroImage}>
                        <img
                            src={urlFor(heroArtwork.image).width(2400).quality(90).auto('format').url()}
                            alt={heroArtwork.title || 'Artwork'}
                            className={styles.heroImg}
                            style={{ objectPosition: hotspotToObjectPosition(heroArtwork.image.hotspot) }}
                        />
                    </div>
                </section>
            )}

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

            {artist.artworks?.length > 0 && (
                <section className={styles.cardsSection}>
                    <h2 className={styles.mobileHeader}>Obras Seleccionadas</h2>
                    <ArtworkCarousel artworks={artist.artworks} artistSlug={slug} basePath="/mueve-estar" />
                </section>
            )}
        </main>
        </>
    )
}
