import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import NewsletterModal from '@/components/NewsletterModal'
import ScrollIndicator from '@/components/ScrollIndicator'
import PortfolioLink from '@/components/PortfolioLink'
import styles from '../../artistas/[slug]/artist.module.css'
import ArtworkCarousel from '../../artistas/[slug]/ArtworkCarousel'
import { urlFor, hotspotToObjectPosition } from '@/sanity/lib/image'

export const revalidate = 0 // dev-friendly

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params
  const feria = await getFeriaWithImages(slug)

  if (!feria) {
    return {
      title: 'Feria no encontrada',
    }
  }

  // Get featured image for OG image
  const images = (feria.images || []).filter((a) => a?.image?.asset?.url)
  let ogImage = '/logos/mueve_logo.png' // fallback

  for (const image of images) {
    if (image.featured && image.image?.asset?.url) {
      ogImage = image.image.asset.url
      break
    } else if (image.featuredPreview && image.image?.asset?.url) {
      ogImage = image.image.asset.url
      break
    }
  }

  if (!ogImage && images[0]?.image?.asset?.url) {
    ogImage = images[0].image.asset.url
  }

  // Extract plain text from description for meta description
  const descriptionText =
    feria.description
      ?.map((block) => block.children?.map((child) => child.text).join(' '))
      .join(' ')
      .slice(0, 160) || `${feria.title} - Mueve Galería`

  return {
    title: feria.title,
    description: descriptionText,
    keywords: [
      feria.title,
      'feria',
      'feria de arte',
      'Mueve',
      'Mueve Galería',
      'arte contemporáneo',
    ],
    openGraph: {
      title: `${feria.title} | Mueve Galería`,
      description: descriptionText,
      url: `https://muevegaleria.com/ferias/${slug}`,
      siteName: 'Mueve Galería',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${feria.title} - Mueve Galería`,
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${feria.title} | Mueve Galería`,
      description: descriptionText,
      images: [ogImage],
    },
    alternates: {
      canonical: `/ferias/${slug}`,
    },
  }
}

async function getFeriaWithImages(slug) {
  const query = `*[_type == "feria" && slug.current == $slug][0]{
    _id,
    title,
    description,
    pressSpanish{
      file{
        asset->{
          url
        }
      },
      externalLink
    },
    pressEnglish{
      file{
        asset->{
          url
        }
      },
      externalLink
    },
    images[]{
      title,
      slug,
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

export default async function FeriaPage({ params }) {
  const { slug } = await params
  const feria = await getFeriaWithImages(slug)

  if (!feria) notFound()

  // Get the featured image for the static hero image, fallback to first image
  const images = (feria.images || []).filter((a) => a?.image?.asset?.url)

  // Check for featured main image or featured detail image
  let heroImage = null
  for (const image of images) {
    // Check if main image is featured
    if (image.featured && image.image) {
      heroImage = image
      break
    }
    // Check if any detail image is featured
    if (image.detailImages?.length) {
      const featuredDetail = image.detailImages.find((d) => d.featured)
      if (featuredDetail?.image) {
        heroImage = { ...image, image: featuredDetail.image }
        break
      }
    }
  }

  // Fallback to first image if no featured image
  if (!heroImage) {
    heroImage = images[0]
  }

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
                src={urlFor(heroImage.image)
                  .width(2400)
                  .quality(90)
                  .auto('format')
                  .url()}
                alt={heroImage.title || feria.title}
                className={styles.heroImg}
                style={{
                  objectPosition: hotspotToObjectPosition(
                    heroImage.image.hotspot
                  ),
                }}
                loading="eager"
              />
            </div>
          </section>
        )}

        {/* Below the fold: feria info section (left aligned to page edge) */}
        <section className={styles.info}>
          <div className={styles.infoRow}>
            <h1 className={`${styles.name} notranslate`}>{feria.title}</h1>
            <PortfolioLink
              spanish={feria.pressSpanish}
              english={feria.pressEnglish}
              label="Info"
              className={styles.portfolio}
            />
          </div>
          {feria.description ? (
            <div className={styles.bio}>
              <PortableText value={feria.description} />
            </div>
          ) : null}
        </section>

        {/* 5-up portrait cards; infinite carousel on desktop if more than 5 */}
        {feria.images?.length > 0 && (
          <section className={styles.cardsSection}>
            <h2 className={styles.mobileHeader}>Imágenes</h2>
            <ArtworkCarousel
              artworks={feria.images}
              artistSlug={slug}
              basePath="/ferias"
            />
          </section>
        )}
      </main>
    </>
  )
}
