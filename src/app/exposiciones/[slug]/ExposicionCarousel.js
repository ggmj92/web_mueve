'use client'

import { useEffect, useRef, useState } from 'react'
import { urlFor } from '@/sanity/lib/image'
import styles from './exposicion.module.css'

export default function ExposicionCarousel({ artworks, exposicionSlug }) {
    const carouselRef = useRef(null)
    const [isDesktop, setIsDesktop] = useState(false)
    const [leftHover, setLeftHover] = useState(false)
    const [rightHover, setRightHover] = useState(false)
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(false)

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth > 768)
        }

        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    // Check scroll position to show/hide end indicators
    useEffect(() => {
        if (!isDesktop || !carouselRef.current || artworks.length <= 5) return

        const carousel = carouselRef.current

        const checkScrollPosition = () => {
            const scrollLeft = carousel.scrollLeft
            const scrollWidth = carousel.scrollWidth
            const clientWidth = carousel.clientWidth

            // At start if scrolled less than 10px from left
            setAtStart(scrollLeft < 10)
            // At end if scrolled within 10px of the end
            setAtEnd(scrollLeft + clientWidth >= scrollWidth - 10)
        }

        // Check on mount
        checkScrollPosition()

        // Check on scroll
        carousel.addEventListener('scroll', checkScrollPosition, { passive: true })

        return () => {
            carousel.removeEventListener('scroll', checkScrollPosition)
        }
    }, [artworks.length, isDesktop])

    const handleScrollLeft = () => {
        if (!carouselRef.current) return
        const scrollAmount = carouselRef.current.offsetWidth * 0.8
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }

    const handleScrollRight = () => {
        if (!carouselRef.current) return
        const scrollAmount = carouselRef.current.offsetWidth * 0.8
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }

    // No tripling - just show artworks once
    const displayArtworks = artworks

    const showNavigation = isDesktop && artworks.length > 5

    return (
        <div className={styles.carouselContainer}>
            <div
                ref={carouselRef}
                className={`${styles.cards} ${isDesktop && artworks.length > 5 ? styles.cardsCarousel : ''}`}
            >
            {displayArtworks.map((aw, index) => {
                const url = aw?.image?.asset?.url
                if (!url) return null

                // Use slug if available, otherwise generate fallback: {exposicionSlug}-imagen{number}
                const imageSlug = aw.slug?.current || `${exposicionSlug}-imagen${index + 1}`

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

                // Get first artwork info for display
                const firstInfo = aw.artworkInfo?.[0]

                return (
                    <div key={`${imageSlug}-${index}`} className={styles.cardWrapper}>
                        <a
                            href={`/exposiciones/${exposicionSlug}/imagenes/${imageSlug}`}
                            className={styles.card}
                        >
                            <picture>
                                <source media="(max-width: 768px)" srcSet={mobileImageUrl} />
                                <img
                                    src={desktopImageUrl}
                                    alt={firstInfo?.title || 'Exposición image'}
                                    className={styles.cardImage}
                                />
                            </picture>
                        </a>
                        <div className={styles.cardInfo}>
                            {aw.artworkInfo?.map((info, infoIdx) => (
                                <div key={infoIdx} className={styles.cardInfoBlock}>
                                    {info.artistName && (
                                        <div className={styles.cardArtist}>
                                            {info.artistName}
                                        </div>
                                    )}
                                    <div className={styles.cardTitle}>
                                        {info.title}
                                        {info.year && (
                                            <span className={styles.cardYear}>
                                                , {info.year}
                                            </span>
                                        )}
                                    </div>
                                    {info.technique && (
                                        <div className={styles.cardDetail}>
                                            {info.technique}
                                        </div>
                                    )}
                                    {info.dimensions && (
                                        <div className={styles.cardDetail}>
                                            {info.dimensions}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>

            {showNavigation && (
                <>
                    <button
                        className={`${styles.artworkNavColumn} ${styles.artworkNavLeft} ${leftHover ? styles.artworkNavHover : ''} ${atStart ? styles.artworkNavDisabled : ''}`}
                        onClick={handleScrollLeft}
                        onMouseEnter={() => setLeftHover(true)}
                        onMouseLeave={() => setLeftHover(false)}
                        disabled={atStart}
                        aria-label="Scroll left"
                    >
                        <svg 
                            className={styles.artworkNavArrow}
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        className={`${styles.artworkNavColumn} ${styles.artworkNavRight} ${rightHover ? styles.artworkNavHover : ''} ${atEnd ? styles.artworkNavDisabled : ''}`}
                        onClick={handleScrollRight}
                        onMouseEnter={() => setRightHover(true)}
                        onMouseLeave={() => setRightHover(false)}
                        disabled={atEnd}
                        aria-label="Scroll right"
                    >
                        <svg 
                            className={styles.artworkNavArrow}
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    )
}
