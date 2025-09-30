'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from '@/app/homepage.module.css'

export default function HeroCarousel({ slides }) {
    const [index, setIndex] = useState(0)
    const [front, setFront] = useState(0)
    const timerRef = useRef(null)

    // Debug logging
    console.log('HeroCarousel slides:', slides)

    const durations = useMemo(
        () => (slides?.length ? slides.map((s) => s.durationMs || 5000) : [5000]),
        [slides]
    )

    const [layers, setLayers] = useState([
        slides?.[0]
            ? {
                url: slides[0].url,
                position: slides[0].position || 'center',
                caption: slides[0].caption || '',
            }
            : { url: '', position: 'center', caption: '' },
        slides?.[1]
            ? {
                url: slides[1].url,
                position: slides[1].position || 'center',
                caption: slides[1].caption || '',
            }
            : slides?.[0]
                ? {
                    url: slides[0].url,
                    position: slides[0].position || 'center',
                    caption: slides[0].caption || '',
                }
                : { url: '', position: 'center', caption: '' },
    ])

    useEffect(() => {
        if (!slides?.length) return
        setIndex(0)
        setFront(0)
        setLayers([
            {
                url: slides[0].url,
                position: slides[0].position || 'center',
                caption: slides[0].caption || '',
            },
            slides[1]
                ? {
                    url: slides[1].url,
                    position: slides[1].position || 'center',
                    caption: slides[1].caption || '',
                }
                : {
                    url: slides[0].url,
                    position: slides[0].position || 'center',
                    caption: slides[0].caption || '',
                },
        ])
    }, [slides])

    useEffect(() => {
        if (!slides?.length) return
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            const nextIndex = (index + 1) % slides.length
            const back = 1 - front // hidden layer

            setLayers((prev) => {
                const copy = [...prev]
                copy[back] = {
                    url: slides[nextIndex].url,
                    position: slides[nextIndex].position || 'center',
                    caption: slides[nextIndex].caption || '',
                }
                return copy
            })

            setFront(back)
            setIndex(nextIndex)
        }, durations[index])

        return () => clearTimeout(timerRef.current)
    }, [index, front, slides, durations])

    if (!slides?.length) {
        console.log('HeroCarousel: No slides, returning null')
        return null
    }

    const visibleLayer = layers[front]
    console.log('HeroCarousel: Rendering with', slides.length, 'slides')

    return (
        <section
            className={styles.heroStage}
            aria-label="Homepage background carousel"
        >
            <div
                className={`${styles.heroLayer} ${front === 0 ? styles.visible : ''}`}
                style={{
                    backgroundImage: `url(${layers[0].url})`,
                    backgroundPosition: layers[0].position,
                }}
                aria-hidden={front !== 0}
            />
            <div
                className={`${styles.heroLayer} ${front === 1 ? styles.visible : ''}`}
                style={{
                    backgroundImage: `url(${layers[1].url})`,
                    backgroundPosition: layers[1].position,
                }}
                aria-hidden={front !== 1}
            />

            {visibleLayer?.caption ? (
                <div className={styles.caption}>{visibleLayer.caption}</div>
            ) : null}
        </section>
    )
}