import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import ArtworkViewer from '@/components/ArtworkViewer'
import NewsletterModal from '@/components/NewsletterModal'

export const revalidate = 0

async function getFeriaWithImages(slug) {
  const query = `*[_type == "feria" && slug.current == $slug][0]{
    _id,
    title,
    images[]{
      title,
      slug,
      description,
      image{
        asset->{ url, metadata{ dimensions{ width, height, aspectRatio } } },
        hotspot,
        crop
      },
      detailImages[]{
        image{
          asset->{ url, metadata{ dimensions{ width, height, aspectRatio } } },
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

export default async function FeriaImagePage({ params }) {
  const { slug, artId } = await params
  const feria = await getFeriaWithImages(slug)
  if (!feria) notFound()

  // Expand images with their detail images into separate slides
  // Use urlFor() so the Sanity CDN applies any crop the user set in Studio.
  const slides = (feria.images || [])
    .filter((a) => a?.image?.asset?.url)
    .flatMap((a) => {
      const baseSlug = a.slug?.current || ''
      const mainSlide = {
        id: baseSlug,
        slug: baseSlug,
        url: urlFor(a.image).quality(90).auto('format').url(),
        ar: a.image.asset.metadata?.dimensions?.aspectRatio || 1,
        title: a.title || '',
        description: a.description || '',
      }

      // Add detail images as separate slides
      const detailSlides = (a.detailImages || [])
        .filter((d) => d?.image?.asset?.url)
        .map((d, idx) => ({
          id: `${baseSlug}-detalle-${idx + 1}`,
          slug: `${baseSlug}-detalle-${idx + 1}`,
          url: urlFor(d.image).quality(90).auto('format').url(),
          ar: d.image.asset.metadata?.dimensions?.aspectRatio || 1,
          title: `${a.title || ''} (Detalle ${idx + 1})`,
          description: a.description || '',
        }))

      return [mainSlide, ...detailSlides]
    })

  const index = Math.max(
    0,
    slides.findIndex((s) => s.slug === artId)
  )

  return (
    <>
      <NewsletterModal />
      <main>
        <ArtworkViewer
          artistName={feria.title}
          slides={slides}
          initialIndex={index}
          baseHref={`/ferias/${slug}/obras/`}
        />
        <div
          style={{
            display: 'none',
            padding: 'calc(var(--header-h) + 2rem) var(--edge)',
            textAlign: 'center',
          }}
          className="mobile-message"
        >
          <p>
            La vista de imágenes individuales no está disponible en
            dispositivos móviles.
          </p>
          <a href={`/ferias/${slug}`} style={{ textDecoration: 'underline' }}>
            Volver a <span className="notranslate">{feria.title}</span>
          </a>
        </div>
      </main>
    </>
  )
}
