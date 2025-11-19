import { client } from '@/sanity/lib/client'
import NewsletterModal from '@/components/NewsletterModal'
import ScrollIndicator from '@/components/ScrollIndicator'
import styles from './exposicion.module.css'
import ExposicionViewer from './ExposicionViewer'

export const revalidate = 0

async function getExposicionWithWorks(slug) {
    const query = `*[_type == "exposicion" && slug.current == $slug][0]{
    _id,
    title,
    year,
    description,
    dosierSpanish{
      file{
        asset->{
          url
        }
      },
      externalLink
    },
    dosierEnglish{
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

    // Build slides from artworks
    const slides = (exposicion.artworks || [])
        .filter(aw => aw?.image?.asset?.url)
        .map((aw, idx) => ({
            id: `${exposicion._id}-${idx}`,
            url: aw.image.asset.url,
            ar: aw.image.asset.metadata?.dimensions?.aspectRatio || 1,
            artworkInfo: aw.artworkInfo || []
        }))

    return (
        <>
            <NewsletterModal />
            <ScrollIndicator />
            <main>
            <ExposicionViewer
                exposicionTitle={exposicion.title}
                year={exposicion.year}
                artists={artistNames}
                dosierSpanish={exposicion.dosierSpanish}
                dosierEnglish={exposicion.dosierEnglish}
                slides={slides}
                description={exposicion.description}
            />
        </main>
        </>
    )
}
