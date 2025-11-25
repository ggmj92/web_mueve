'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ExposicionImageViewer.module.css'

export default function ExposicionImageViewer({
    exposicionTitle,
    artistNames,
    slides,
    initialIndex = 0,
    baseHref = '',
}) {
    const [i, setI] = useState(
        Math.max(0, Math.min(initialIndex, slides.length - 1))
    )
    const len = slides.length
    const slide = slides[i]
    const artBoxRef = useRef(null)

    const go = (d) => setI((prev) => (prev + d + len) % len)

    // Update URL when index changes
    useEffect(() => {
        if (!baseHref || !slide) return
        const url = `${baseHref}${slide.slug}`
        window.history.replaceState(null, '', url)
    }, [i, baseHref, slide])

    if (!len) return null

    return (
        <section className={styles.wrap}>
            {/* Centered image box (manual carousel) */}
            <div className={styles.stage}>
                <div className={styles.artBox} ref={artBoxRef}>
                    <img
                        src={slide.url}
                        alt={slide.artworkInfo?.[0]?.title || 'Exposición image'}
                        className={styles.art}
                    />
                </div>
            </div>

            {/* Info - fixed on desktop, below artwork on mobile */}
            <aside className={styles.info}>
                {/* Display all artwork info blocks stacked */}
                {slide.artworkInfo && slide.artworkInfo.length > 0 ? (
                    slide.artworkInfo.map((info, infoIndex) => (
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
                    ))
                ) : (
                    <div className={styles.artworkInfoBlock}>
                        <div className={styles.artist}>{artistNames.join(', ')}</div>
                        <div className={styles.workTitle}>{exposicionTitle}</div>
                    </div>
                )}
            </aside>

            {/* Fixed side arrows */}
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
        </section>
    )
}
