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
        asset->{ url },
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

      // Pass the full image object so @sanity/image-url can read
      // the embedded crop rectangle + hotspot automatically.
      return {
        // Desktop: landscape crop — library applies crop rect & hotspot
        desktopUrl: urlFor(s.image)
              .width(2400)
              .height(1200)
              .fit('crop')
              .quality(85)
              .auto('format')
              .url(),
        // Mobile: portrait crop — same library auto-applies crop & hotspot
        mobileUrl: urlFor(s.image)
              .width(1080)
              .height(1920)
              .fit('crop')
              .quality(85)
              .auto('format')
              .url(),
        // Pass hotspot for CSS object-position (secondary crop by browser)
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