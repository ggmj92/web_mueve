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
      // Debug logging
      console.log('Slide crop data:', {
        crop: s?.image?.crop,
        hotspot: s?.image?.hotspot,
        hasCrop: !!(s?.image?.crop && (s.image.crop.left > 0 || s.image.crop.right < 1 || s.image.crop.top > 0 || s.image.crop.bottom < 1))
      })
      
      return {
        // Desktop: full image, no cropping
        desktopUrl: s?.image?.asset?.url
          ? urlFor({
              asset: s.image.asset
            })
              .width(2400)
              .height(1200)
              .fit('crop')
              .quality(85)
              .auto('format')
              .url()
          : null,
        // Mobile: cropped image using hotspot/crop data
        mobileUrl: s?.image?.asset?.url
          ? urlFor(s.image)
              .width(2400)
              .height(1200)
              .fit('crop')
              .quality(85)
              .auto('format')
              .url()
          : null,
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