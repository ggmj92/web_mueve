'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from '@/app/homepage.module.css'

export default function HeroCarousel({ slides }) {
    const [index, setIndex] = useState(0)
    const [front, setFront] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const timerRef = useRef(null)

    const durations = useMemo(
        () => (slides?.length ? slides.map((s) => s.durationMs || 5000) : [5000]),
        [slides]
    )

    const [layers, setLayers] = useState([
        slides?.[0]
            ? {
                url: slides[0].desktopUrl || slides[0].url,
                mobileUrl: slides[0].mobileUrl || slides[0].url,
                caption: slides[0].caption || '',
                hotspot: slides[0].hotspot || { x: 0.5, y: 0.5 },
            }
            : { url: '', mobileUrl: '', caption: '', hotspot: { x: 0.5, y: 0.5 } },
        slides?.[1]
            ? {
                url: slides[1].desktopUrl || slides[1].url,
                mobileUrl: slides[1].mobileUrl || slides[1].url,
                caption: slides[1].caption || '',
                hotspot: slides[1].hotspot || { x: 0.5, y: 0.5 },
            }
            : slides?.[0]
                ? {
                    url: slides[0].desktopUrl || slides[0].url,
                    mobileUrl: slides[0].mobileUrl || slides[0].url,
                    caption: slides[0].caption || '',
                    hotspot: slides[0].hotspot || { x: 0.5, y: 0.5 },
                }
                : { url: '', mobileUrl: '', caption: '', hotspot: { x: 0.5, y: 0.5 } },
    ])

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        if (!slides?.length) return
        setIndex(0)
        setFront(0)
        setLayers([
            {
                url: slides[0].desktopUrl || slides[0].url,
                mobileUrl: slides[0].mobileUrl || slides[0].url,
                caption: slides[0].caption || '',
                hotspot: slides[0].hotspot || { x: 0.5, y: 0.5 },
            },
            slides[1]
                ? {
                    url: slides[1].desktopUrl || slides[1].url,
                    mobileUrl: slides[1].mobileUrl || slides[1].url,
                    caption: slides[1].caption || '',
                    hotspot: slides[1].hotspot || { x: 0.5, y: 0.5 },
                }
                : {
                    url: slides[0].desktopUrl || slides[0].url,
                    mobileUrl: slides[0].mobileUrl || slides[0].url,
                    caption: slides[0].caption || '',
                    hotspot: slides[0].hotspot || { x: 0.5, y: 0.5 },
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
                    url: slides[nextIndex].desktopUrl || slides[nextIndex].url,
                    mobileUrl: slides[nextIndex].mobileUrl || slides[nextIndex].url,
                    caption: slides[nextIndex].caption || '',
                    hotspot: slides[nextIndex].hotspot || { x: 0.5, y: 0.5 },
                }
                return copy
            })

            setFront(back)
            setIndex(nextIndex)
        }, durations[index])

        return () => clearTimeout(timerRef.current)
    }, [index, front, slides, durations])

    if (!slides?.length) {
        return null
    }

    const visibleLayer = layers[front]

    return (
        <section
            className={styles.heroStage}
            aria-label="Homepage background carousel"
        >
            <div
                className={`${styles.heroLayer} ${front === 0 ? styles.visible : ''}`}
                aria-hidden={front !== 0}
            >
                <img 
                    src={isMobile ? layers[0].mobileUrl : layers[0].url}
                    alt=""
                    className={styles.heroImage}
                />
            </div>
            <div
                className={`${styles.heroLayer} ${front === 1 ? styles.visible : ''}`}
                aria-hidden={front !== 1}
            >
                <img 
                    src={isMobile ? layers[1].mobileUrl : layers[1].url}
                    alt=""
                    className={styles.heroImage}
                />
            </div>

            {visibleLayer?.caption ? (
                <div className={styles.caption}>{visibleLayer.caption}</div>
            ) : null}
        </section>
    )
}