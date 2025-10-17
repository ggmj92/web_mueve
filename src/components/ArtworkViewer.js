'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './ArtworkViewer.module.css'

export default function ArtworkViewer({
    artistName,
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

    // Update URL when index changes (optional, shallow)
    useEffect(() => {
        if (!baseHref || !slide) return
        const url = `${baseHref}${slide.slug}`
        window.history.replaceState(null, '', url)
    }, [i, baseHref, slide])


    const meta = useMemo(
        () => ({
            title: slide?.title || '',
            year: slide?.year || '',
            technique: slide?.technique || '',
            dims: slide?.dims || '',
            description: slide?.description || '',
        }),
        [slide]
    )

    if (!len) return null

    return (
        <section className={styles.wrap}>
            {/* Left fixed info */}
            <aside className={styles.info}>
                <div className={styles.artist}>{artistName}</div>
                <div className={styles.workTitle}>
                    {meta.title}
                    {meta.year ? (
                        <span className={styles.year}>, {meta.year}</span>
                    ) : ''}
                </div>
                {meta.technique && <div className={styles.row}>{meta.technique}</div>}
                {meta.dims && <div className={styles.row}>{meta.dims}</div>}
            </aside>

            {/* Centered image box (manual carousel) */}
            <div className={styles.stage}>
                <div className={styles.artBox} ref={artBoxRef}>
                    <img
                        src={slide.url}
                        alt={meta.title || 'Artwork'}
                        className={styles.art}
                    />
                </div>
            </div>

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

            {/* Long text (revealed on scroll) */}
            {meta.description && (
                <div className={styles.description}>{meta.description}</div>
            )}
        </section>
    )
}