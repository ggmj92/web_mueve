import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import NewsletterModal from '@/components/NewsletterModal'
import ScrollIndicator from '@/components/ScrollIndicator'
import styles from '../../artistas/[slug]/artist.module.css'
import ArtworkCarousel from './ArtworkCarousel'

export const revalidate = 0

async function getGuestArtistWithWorks(slug) {
    const query = `*[_type == "guestArtist" && slug.current == $slug][0]{
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

export default async function MueveEstarArtistPage({ params }) {
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

    const portfolioUrl = artist.portfolio?.file?.asset?.url || 
                         artist.portfolio?.externalLink || 
                         artist.portfolio?.asset?.url

    return (
        <>
            <NewsletterModal />
            <ScrollIndicator />
            <main>
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
