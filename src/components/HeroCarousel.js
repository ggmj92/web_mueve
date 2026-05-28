'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { hotspotToObjectPosition } from '@/sanity/lib/image'
import styles from '@/app/homepage.module.css'

export default function HeroCarousel({ slides }) {
    const [index, setIndex] = useState(0)
    const [front, setFront] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const timerRef = useRef(null)
    const [leftHover, setLeftHover] = useState(false)
    const [rightHover, setRightHover] = useState(false)

    const durations = useMemo(
        () => (slides?.length ? slides.map((s) => s.durationMs || 2500) : [2500]),
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

    // Only initialize once on mount, don't reset on slides change
    useEffect(() => {
        if (!slides?.length) return
        
        // Only set initial state if not already set
        setLayers((prevLayers) => {
            // If layers are already populated, don't reset
            if (prevLayers[0]?.url) return prevLayers
            
            return [
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
            ]
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const goToSlide = (targetIndex) => {
        if (!slides?.length || targetIndex === index) return
        
        clearTimeout(timerRef.current)
        const back = 1 - front // hidden layer

        setLayers((prev) => {
            const copy = [...prev]
            copy[back] = {
                url: slides[targetIndex].desktopUrl || slides[targetIndex].url,
                mobileUrl: slides[targetIndex].mobileUrl || slides[targetIndex].url,
                caption: slides[targetIndex].caption || '',
                hotspot: slides[targetIndex].hotspot || { x: 0.5, y: 0.5 },
            }
            return copy
        })

        setFront(back)
        setIndex(targetIndex)
    }

    const goNext = () => {
        const nextIndex = (index + 1) % slides.length
        goToSlide(nextIndex)
    }

    const goPrev = () => {
        const prevIndex = (index - 1 + slides.length) % slides.length
        goToSlide(prevIndex)
    }

    // Auto-advance carousel with page visibility handling
    useEffect(() => {
        if (!slides?.length) return
        
        const nextIndex = (index + 1) % slides.length
        
        const startTimer = () => {
            clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => {
                goToSlide(nextIndex)
            }, durations[index])
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Page is hidden, clear timer
                clearTimeout(timerRef.current)
            } else {
                // Page is visible again, restart timer
                startTimer()
            }
        }

        // Start timer initially
        startTimer()

        // Listen for visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            clearTimeout(timerRef.current)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [index, front, slides, durations, goToSlide])

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
                    style={{ objectPosition: hotspotToObjectPosition(layers[0].hotspot) }}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
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
                    style={{ objectPosition: hotspotToObjectPosition(layers[1].hotspot) }}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
            </div>

            {visibleLayer?.caption ? (
                <div className={styles.caption}>{visibleLayer.caption}</div>
            ) : null}

            {/* Navigation arrows - only show on desktop with multiple slides */}
            {!isMobile && slides.length > 1 && (
                <>
                    <button
                        className={`${styles.navColumn} ${styles.navLeft} ${leftHover ? styles.navHover : ''}`}
                        onClick={goPrev}
                        onMouseEnter={() => setLeftHover(true)}
                        onMouseLeave={() => setLeftHover(false)}
                        aria-label="Previous slide"
                    >
                        <svg 
                            className={styles.navArrow}
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        className={`${styles.navColumn} ${styles.navRight} ${rightHover ? styles.navHover : ''}`}
                        onClick={goNext}
                        onMouseEnter={() => setRightHover(true)}
                        onMouseLeave={() => setRightHover(false)}
                        aria-label="Next slide"
                    >
                        <svg 
                            className={styles.navArrow}
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
        </section>
    )
}