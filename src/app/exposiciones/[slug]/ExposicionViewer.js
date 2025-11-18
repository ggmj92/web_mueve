'use client'

import { useState, useRef, useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import styles from './exposicion.module.css'

export default function ExposicionViewer({
    exposicionTitle,
    year,
    artists,
    portfolioUrl,
    slides,
    description
}) {
    const [i, setI] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)
    const len = slides.length
    const slide = slides[i]

    const go = (d) => setI((prev) => (prev + d + len) % len)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return
        
        const distance = touchStartX.current - touchEndX.current
        const threshold = 50 // minimum swipe distance
        
        if (Math.abs(distance) > threshold) {
            if (distance > 0) {
                // Swiped left - go to next
                go(1)
            } else {
                // Swiped right - go to previous
                go(-1)
            }
        }
        
        touchStartX.current = 0
        touchEndX.current = 0
    }

    if (!len) return null

    return (
        <section className={styles.wrap}>
            {/* Top info bar - full width */}
            <div className={styles.topBar}>
                <div className={styles.topBarInner}>
                    <div className={styles.titleYear}>
                        {exposicionTitle}, {year}
                    </div>
                    {artists.length > 0 && (
                        <div className={styles.artists}>
                            {artists.join(', ')}
                        </div>
                    )}
                    {portfolioUrl && (
                        <a
                            className={styles.portfolio}
                            href={portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Ver portafolio"
                        >
                            Portafolio
                        </a>
                    )}
                </div>
            </div>

            {/* Centered image box (manual carousel) */}
            <div className={styles.stage}>
                <div 
                    className={styles.artBox}
                    onTouchStart={isMobile ? handleTouchStart : undefined}
                    onTouchMove={isMobile ? handleTouchMove : undefined}
                    onTouchEnd={isMobile ? handleTouchEnd : undefined}
                >
                    <img
                        src={slide.url}
                        alt={slide.artworkInfo?.[0]?.title || 'Exposición image'}
                        className={styles.art}
                    />
                </div>
            </div>

            {/* Info - fixed on desktop, below artwork on mobile */}
            <aside className={styles.info}>
                {slide.artworkInfo && slide.artworkInfo.length > 0 && (
                    <>
                        {slide.artworkInfo.map((info, infoIndex) => (
                            <div key={infoIndex} className={styles.artworkInfoBlock}>
                                {info.artistName && (
                                    <div className={styles.artist}>{info.artistName}</div>
                                )}
                                <div className={styles.workTitle}>
                                    {info.title}
                                    {info.year && (
                                        <span className={styles.year}>, {info.year}</span>
                                    )}
                                </div>
                                {info.technique && <div className={styles.row}>{info.technique}</div>}
                                {info.dimensions && <div className={styles.row}>{info.dimensions}</div>}
                            </div>
                        ))}
                    </>
                )}
            </aside>

            {/* Pagination dots for mobile */}
            {isMobile && len > 1 && (
                <div className={styles.pagination}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === i ? styles.dotActive : ''}`}
                            onClick={() => setI(index)}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Fixed side arrows */}
            {len > 1 && (
                <>
                    <button
                        className={`${styles.arrow} ${styles.left}`}
                        onClick={() => go(-1)}
                        aria-label="Prev"
                    >
                        ◀
                    </button>
                    <button
                        className={`${styles.arrow} ${styles.right}`}
                        onClick={() => go(1)}
                        aria-label="Next"
                    >
                        ▶
                    </button>
                </>
            )}

            {/* Description (revealed on scroll) */}
            {description && (
                <div className={styles.description}>
                    <div className={styles.descriptionInner}>
                        <PortableText value={description} />
                    </div>
                </div>
            )}
        </section>
    )
}
