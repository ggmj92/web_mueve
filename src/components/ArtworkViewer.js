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
    const [infoTop, setInfoTop] = useState(null)

    const go = (d) => setI((prev) => (prev + d + len) % len)

    // Update URL when index changes (optional, shallow)
    useEffect(() => {
        if (!baseHref || !slide) return
        const url = `${baseHref}${slide.slug}`
        window.history.replaceState(null, '', url)
    }, [i, baseHref, slide])

    // Measure the top of the artwork box relative to the viewport so the info can be fixed at that exact height
    useEffect(() => {
        function measure() {
            if (!artBoxRef.current) return
            const rect = artBoxRef.current.getBoundingClientRect()
            setInfoTop(Math.max(0, Math.round(rect.top)))
        }
        // Measure after image load/paint
        const img = artBoxRef.current?.querySelector('img')
        if (img && !img.complete) {
            img.addEventListener('load', measure, { once: true })
        } else {
            measure()
        }
        window.addEventListener('resize', measure)
        window.addEventListener('orientationchange', measure)
        return () => {
            window.removeEventListener('resize', measure)
            window.removeEventListener('orientationchange', measure)
        }
    }, [i, slide?.url])

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
        <section
            className={styles.wrap}
            style={infoTop != null ? { '--info-top': `${infoTop}px` } : undefined}
        >
            {/* Left fixed info */}
            <aside className={styles.info}>
                <div className={styles.artist}>{artistName}</div>
                <div className={styles.workTitle}>
                    {meta.title}
                    {meta.year ? `, ${meta.year}` : ''}
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