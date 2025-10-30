'use client'

import { useEffect, useRef, useState } from 'react'
import { urlFor } from '@/sanity/lib/image'
import styles from './artist.module.css'

export default function ArtworkCarousel({ artworks, artistSlug }) {
    const carouselRef = useRef(null)
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth > 768)
        }

        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    useEffect(() => {
        if (!isDesktop || !carouselRef.current || artworks.length <= 5) return

        const carousel = carouselRef.current
        let animationId = null
        let isUserScrolling = false
        let userScrollTimeout = null
        const scrollSpeed = 0.5

        // Get total width of one complete set of artworks
        const getSetWidth = () => {
            const cards = carousel.querySelectorAll(`.${styles.cardWrapper}`)
            if (cards.length === 0) return 0
            const firstCard = cards[0]
            const lastCard = cards[artworks.length - 1]
            const firstRect = firstCard.getBoundingClientRect()
            const lastRect = lastCard.getBoundingClientRect()
            return lastRect.right - firstRect.left
        }

        // Initialize scroll position to start of middle set
        const init = () => {
            const setWidth = getSetWidth()
            if (setWidth > 0) {
                carousel.scrollLeft = setWidth
            }
        }
        setTimeout(init, 50)

        // Check if we need to wrap and do it seamlessly
        const checkWrap = () => {
            const setWidth = getSetWidth()
            if (setWidth === 0) return

            const scrollLeft = carousel.scrollLeft
            const middleSetStart = setWidth
            const middleSetEnd = setWidth * 2

            // If we've scrolled past the middle set into the third set
            if (scrollLeft >= middleSetEnd) {
                const offset = scrollLeft - middleSetEnd
                carousel.scrollLeft = middleSetStart + offset
            }
            // If we've scrolled before the middle set into the first set
            else if (scrollLeft < middleSetStart) {
                const offset = middleSetStart - scrollLeft
                carousel.scrollLeft = middleSetEnd - offset
            }
        }

        const scroll = () => {
            if (!isUserScrolling) {
                carousel.scrollLeft += scrollSpeed
                checkWrap()
            }
            animationId = requestAnimationFrame(scroll)
        }

        const handleScroll = () => {
            isUserScrolling = true
            checkWrap()
            clearTimeout(userScrollTimeout)
            userScrollTimeout = setTimeout(() => { isUserScrolling = false }, 2000)
        }

        carousel.addEventListener('scroll', handleScroll, { passive: true })
        setTimeout(() => { animationId = requestAnimationFrame(scroll) }, 100)

        return () => {
            if (animationId) cancelAnimationFrame(animationId)
            if (userScrollTimeout) clearTimeout(userScrollTimeout)
            carousel.removeEventListener('scroll', handleScroll)
        }
    }, [artworks.length, isDesktop])

    // Triple the artworks for seamless infinite scrolling
    const displayArtworks = isDesktop && artworks.length > 5
        ? [...artworks, ...artworks, ...artworks]
        : artworks

    return (
        <div
            ref={carouselRef}
            className={`${styles.cards} ${isDesktop && artworks.length > 5 ? styles.cardsCarousel : ''}`}
        >
            {displayArtworks.map((aw, index) => {
                const url = aw?.image?.asset?.url
                if (!url || !aw.slug?.current) return null

                // Desktop: cropped vertical image respecting hotspot
                const desktopImageUrl = urlFor(aw.image)
                    .width(600)
                    .height(800)
                    .fit('crop')
                    .quality(90)
                    .auto('format')
                    .url()

                // Mobile: use raw asset URL to bypass hotspot/crop entirely
                const mobileImageUrl = urlFor(aw.image.asset)
                    .width(1200)
                    .quality(90)
                    .auto('format')
                    .url()

                return (
                    <div key={`${aw.slug?.current}-${index}`} className={styles.cardWrapper}>
                        <a
                            href={`/artistas/${artistSlug}/obras/${aw.slug.current}`}
                            className={styles.card}
                        >
                            <picture>
                                <source media="(max-width: 768px)" srcSet={mobileImageUrl} />
                                <img
                                    src={desktopImageUrl}
                                    alt={aw.title || 'Artwork'}
                                    className={styles.cardImage}
                                />
                            </picture>
                        </a>
                        <div className={styles.cardInfo}>
                            <div className={styles.cardTitle}>
                                {aw.title}
                                {aw.year && (
                                    <span className={styles.cardYear}>
                                        , {aw.year}
                                    </span>
                                )}
                            </div>
                            {aw.technique && (
                                <div className={styles.cardDetail}>
                                    {aw.technique}
                                </div>
                            )}
                            {aw.dimensions && (
                                <div className={styles.cardDetail}>
                                    {aw.dimensions}
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
