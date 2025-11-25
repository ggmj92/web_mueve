'use client'

import { useEffect, useRef, useState } from 'react'
import { urlFor } from '@/sanity/lib/image'
import styles from './exposicion.module.css'

export default function ExposicionCarousel({ artworks, exposicionSlug }) {
    const carouselRef = useRef(null)
    const [isDesktop, setIsDesktop] = useState(false)
    const [leftHover, setLeftHover] = useState(false)
    const [rightHover, setRightHover] = useState(false)

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

        const getSetWidth = () => {
            const cards = carousel.querySelectorAll(`.${styles.cardWrapper}`)
            if (cards.length === 0) return 0
            
            const cardsPerSet = Math.floor(cards.length / 3)
            if (cardsPerSet === 0) return 0
            
            const firstCard = cards[0]
            const lastCardOfFirstSet = cards[cardsPerSet - 1]
            if (!firstCard || !lastCardOfFirstSet) return 0
            
            const firstRect = firstCard.getBoundingClientRect()
            const lastRect = lastCardOfFirstSet.getBoundingClientRect()
            return lastRect.right - firstRect.left
        }

        const init = () => {
            const setWidth = getSetWidth()
            if (setWidth > 0) {
                carousel.scrollLeft = setWidth
            }
        }
        setTimeout(init, 50)

        const checkWrap = () => {
            const setWidth = getSetWidth()
            if (setWidth === 0) return

            const scrollLeft = carousel.scrollLeft
            const middleSetStart = setWidth
            const middleSetEnd = setWidth * 2

            if (scrollLeft >= middleSetEnd) {
                const offset = scrollLeft - middleSetEnd
                carousel.scrollLeft = middleSetStart + offset
            }
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

    const displayArtworks = isDesktop && artworks.length > 5
        ? [...artworks, ...artworks, ...artworks]
        : artworks

    const showNavigation = isDesktop && artworks.length > 1

    return (
        <div className={styles.carouselContainer}>
            <div
                ref={carouselRef}
                className={`${styles.cards} ${isDesktop && artworks.length > 5 ? styles.cardsCarousel : ''}`}
            >
            {displayArtworks.map((aw, index) => {
                const url = aw?.image?.asset?.url
                if (!url) return null

                // Calculate the original index (accounting for tripled artworks in carousel mode)
                const originalIndex = isDesktop && artworks.length > 5 
                    ? index % artworks.length 
                    : index

                // Use slug if available, otherwise generate fallback: {exposicionSlug}-imagen{number}
                const imageSlug = aw.slug?.current || `${exposicionSlug}-imagen${originalIndex + 1}`

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
                        className={`${styles.artworkNavColumn} ${styles.artworkNavLeft} ${leftHover ? styles.artworkNavHover : ''}`}
                        onClick={handleScrollLeft}
                        onMouseEnter={() => setLeftHover(true)}
                        onMouseLeave={() => setLeftHover(false)}
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
                        className={`${styles.artworkNavColumn} ${styles.artworkNavRight} ${rightHover ? styles.artworkNavHover : ''}`}
                        onClick={handleScrollRight}
                        onMouseEnter={() => setRightHover(true)}
                        onMouseLeave={() => setRightHover(false)}
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
