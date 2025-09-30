import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import HeroCarousel from '@/components/HeroCarousel'
import styles from './page.module.css'

async function getHomepageSlides() {
  const data = await client
    .fetch(
      `*[_type == "homepage"][0]{
    slides[]{ image, durationMs, position }
  }`
    )
    .catch(() => null)

  let slides = (data?.slides || [])
    .map((s) => ({
      url: s?.image
        ? urlFor(s.image).width(2400).quality(85).auto('format').url()
        : null,
      durationMs: s?.durationMs || 5000,
      position: s?.position || 'center',
    }))
    .filter((s) => !!s.url)

  if (slides.length === 0) {
    slides = [
      {
        url: '/background.jpg',
        durationMs: 5000,
        position: 'center',
      },
      { url: '/vercel.svg', durationMs: 5000, position: 'center' },
    ]
  }

  return slides
}

export default async function Home() {
  const slides = await getHomepageSlides()

  return (
    <main className={styles.homeWrap}>
      <HeroCarousel slides={slides} />
    </main>
  )
}