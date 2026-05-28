import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import ArtworkViewer from '@/components/ArtworkViewer'
import NewsletterModal from '@/components/NewsletterModal'

export const revalidate = 0

async function getGuestArtistWithWorks(slug) {
    const query = `*[_type == "guestArtist" && slug.current == $slug][0]{
    _id,
    name,
    artworks[]{
      title,
      slug,
      year,
      technique,
      dimensions,
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

export default async function GuestArtworkPage({ params }) {
    const { slug, artId } = await params
    const artist = await getGuestArtistWithWorks(slug)
    if (!artist) notFound()

    const slides = (artist.artworks || [])
        .filter((a) => a?.image?.asset?.url)
        .flatMap((a) => {
            const baseSlug = a.slug?.current || ''
            const mainSlide = {
                id: baseSlug,
                slug: baseSlug,
                url: a.image.asset.url,
                ar: a.image.asset.metadata?.dimensions?.aspectRatio || 1,
                title: a.title || '',
                year: a.year || '',
                technique: a.technique || '',
                dims: a.dimensions || '',
                description: a.description || '',
            }

            const detailSlides = (a.detailImages || [])
                .filter(d => d?.image?.asset?.url)
                .map((d, idx) => ({
                    id: `${baseSlug}-detalle-${idx + 1}`,
                    slug: `${baseSlug}-detalle-${idx + 1}`,
                    url: d.image.asset.url,
                    ar: d.image.asset.metadata?.dimensions?.aspectRatio || 1,
                    title: `${a.title || ''} (Detalle ${idx + 1})`,
                    year: a.year || '',
                    technique: a.technique || '',
                    dims: a.dimensions || '',
                    description: a.description || '',
                }))

            return [mainSlide, ...detailSlides]
        })

    const index = Math.max(0, slides.findIndex((s) => s.slug === artId))

    return (
        <>
            <NewsletterModal />
            <main>
            <ArtworkViewer
                artistName={artist.name}
                slides={slides}
                initialIndex={index}
                baseHref={`/mueve-estar/${slug}/obras/`}
            />
            <div style={{
                display: 'none',
                padding: 'calc(var(--header-h) + 2rem) var(--edge)',
                textAlign: 'center'
            }} className="mobile-message">
                <p>La vista de obras individuales no está disponible en dispositivos móviles.</p>
                <a href={`/mueve-estar/${slug}`} style={{ textDecoration: 'underline' }}>
                    Volver a <span className="notranslate">{artist.name}</span>
                </a>
            </div>
        </main>
        </>
    )
}
