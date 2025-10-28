import { client } from '@/sanity/lib/client'
import ArtworkViewer from '@/components/ArtworkViewer'

export const revalidate = 0

async function getArtistWithWorks(slug) {
    const query = `*[_type == "artist" && slug.current == $slug][0]{
    _id,
    name,
    artworks[]{
      title,
      slug,
      year,
      technique,
      dimensions,
      description,
      about,
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
    return client.fetch(query, { slug })
}

export default async function ArtworkPage({ params }) {
    const { slug, artId } = await params
    const artist = await getArtistWithWorks(slug)
    if (!artist)
        return (
            <main style={{ padding: 'calc(var(--header-h) + 2rem) var(--edge)' }}>
                Not found
            </main>
        )

    // Expand artworks with their detail images into separate slides
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
            
            // Add detail images as separate slides
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

    const index = Math.max(
        0,
        slides.findIndex((s) => s.slug === artId)
    )

    return (
        <main>
            <ArtworkViewer
                artistName={artist.name}
                slides={slides}
                initialIndex={index}
                baseHref={`/artistas/${slug}/obras/`}
            />
            <div style={{ 
                display: 'none',
                padding: 'calc(var(--header-h) + 2rem) var(--edge)',
                textAlign: 'center'
            }} className="mobile-message">
                <p>La vista de obras individuales no está disponible en dispositivos móviles.</p>
                <a href={`/artistas/${slug}`} style={{ textDecoration: 'underline' }}>
                    Volver a {artist.name}
                </a>
            </div>
        </main>
    )
}