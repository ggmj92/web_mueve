import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import ExposicionImageViewer from '@/components/ExposicionImageViewer'
import NewsletterModal from '@/components/NewsletterModal'

export const revalidate = 0

async function getExposicionWithImages(slug) {
    const query = `*[_type == "exposicion" && slug.current == $slug][0]{
    _id,
    title,
    year,
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
      image{ 
        asset->{ url, metadata{ dimensions{ width, height, aspectRatio } } },
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
    try {
        return await client.fetch(query, { slug })
    } catch (err) {
        console.error('Sanity fetch error:', err)
        return null
    }
}

export default async function ExposicionImagePage({ params }) {
    const { slug, imageId } = await params
    const exposicion = await getExposicionWithImages(slug)
    
    if (!exposicion) notFound()

    const artistNames = exposicion.artists?.map(a => a.name).filter(Boolean) || []

    // Build slides from artworks with fallback slugs.
    // Use urlFor() so the Sanity CDN applies any crop the user set in Studio.
    const slides = (exposicion.artworks || [])
        .filter((a) => a?.image?.asset?.url)
        .map((a, idx) => {
            // Use real slug or generate fallback
            const slideSlug = a.slug?.current || `${slug}-imagen${idx + 1}`
            return {
                id: slideSlug,
                slug: slideSlug,
                url: urlFor(a.image).quality(90).auto('format').url(),
                ar: a.image.asset.metadata?.dimensions?.aspectRatio || 1,
                artworkInfo: a.artworkInfo || []
            }
        })

    const index = Math.max(
        0,
        slides.findIndex((s) => s.slug === imageId)
    )

    return (
        <>
            <NewsletterModal />
            <main>
            <ExposicionImageViewer
                exposicionTitle={exposicion.title}
                artistNames={artistNames}
                slides={slides}
                initialIndex={index}
                baseHref={`/exposiciones/${slug}/imagenes/`}
            />
            <div style={{ 
                display: 'none',
                padding: 'calc(var(--header-h) + 2rem) var(--edge)',
                textAlign: 'center'
            }} className="mobile-message">
                <p>La vista de imágenes individuales no está disponible en dispositivos móviles.</p>
                <a href={`/exposiciones/${slug}`} style={{ textDecoration: 'underline' }}>
                    Volver a <span className="notranslate">{exposicion.title}</span>
                </a>
            </div>
        </main>
        </>
    )
}
