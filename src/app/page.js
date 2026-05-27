import { sanityFetch } from '@/sanity/lib/live'
import { urlFor } from '@/sanity/lib/image'
import HeroCarousel from '@/components/HeroCarousel'
import StructuredData from '@/components/StructuredData'
import NewsletterModal from '@/components/NewsletterModal'
import styles from './homepage.module.css'

async function getHomepageSlides() {
  const data = await sanityFetch({
    query: `*[_type == "homepage"][0]{
    slides[]{ 
      image{ 
        asset->{ "_ref": _id, _id, url },
        crop,
        hotspot
      }, 
      durationMs
    }
  }`,
    revalidate: 0, // Always revalidate for live updates
  })

  let slides = (data?.data?.slides || [])
    .map((s) => {
      if (!s?.image?.asset?.url) return null
      return {
        desktopUrl: urlFor(s.image)
          .width(2400)
          .quality(85)
          .auto('format')
          .url(),
        mobileUrl: urlFor(s.image)
          .width(1080)
          .height(1920)
          .fit('crop')
          .crop('focalpoint')
          .focalPoint(s.image.hotspot?.x ?? 0.5, s.image.hotspot?.y ?? 0.5)
          .quality(85)
          .auto('format')
          .url(),
        hotspot: s.image.hotspot || null,
        durationMs: s?.durationMs || 5000,
      }
    })
    .filter(Boolean)

  if (slides.length === 0) {
    slides = [
      {
        url: '/logos/mueve_logo.png',
        durationMs: 5000,
        position: 'center',
      },
      {
        url: '/logos/mueve_mini-logo.png',
        durationMs: 5000,
        position: 'center'
      },
    ]
  }

  return slides
}

export default async function Home() {
  const slides = await getHomepageSlides()

  return (
    <>
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <NewsletterModal />
      <main className={`${styles.homeWrap} home`}>
        <HeroCarousel slides={slides} />
      </main>
    </>
  )
}