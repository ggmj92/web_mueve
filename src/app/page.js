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
      // Extract hotspot for focal point positioning
      const hotspot = s?.image?.hotspot || { x: 0.5, y: 0.5 }
      
      return {
        desktopUrl: s?.image?.asset?.url
          ? urlFor(s.image)
              .width(2400)
              .quality(85)
              .auto('format')
              .url()
          : null,
        // Mobile: Use portrait aspect ratio with hotspot-aware cropping
        // rect() uses the crop rectangle, then we crop to viewport size centered on hotspot
        mobileUrl: s?.image?.asset?.url
          ? urlFor(s.image)
              .width(1080)
              .height(1920)
              .fit('crop')
              .crop('focalpoint')
              .focalPoint(hotspot.x, hotspot.y)
              .quality(85)
              .auto('format')
              .url()
          : null,
        // Pass hotspot coordinates (0-1 range) for CSS background-position
        hotspot: {
          x: hotspot.x,
          y: hotspot.y
        },
        durationMs: s?.durationMs || 5000,
      }
    })
    .filter((s) => !!s.desktopUrl)

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