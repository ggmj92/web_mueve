'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './mueve-estar.module.css'

export default function MueveEstarCarousel({ images }) {
    const scrollContainerRef = useRef(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)
    const timeoutRef = useRef(null)

    const scroll = (direction) => {
        const container = scrollContainerRef.current
        if (!container) return
        
        const slideWidth = container.querySelector(`.${styles.carouselSlide}`)?.offsetWidth || 0
        const gap = 32 // 2rem gap
        const scrollAmount = slideWidth + gap
        
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

        const handleScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = container
            
            // Clear existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            // Show arrows based on scroll position
            setShowLeftArrow(scrollLeft > 10)
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)

            // Hide arrows after 2 seconds
            timeoutRef.current = setTimeout(() => {
                setShowLeftArrow(false)
                setShowRightArrow(false)
            }, 2000)
        }

        // Show right arrow initially if there are multiple images
        if (images.length > 1) {
            setShowRightArrow(true)
            timeoutRef.current = setTimeout(() => {
                setShowRightArrow(false)
            }, 2000)
        }

        container.addEventListener('scroll', handleScroll)
        return () => {
            container.removeEventListener('scroll', handleScroll)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [images.length])

    if (!images || images.length === 0) return null

    return (
        <section className={styles.carouselSection}>
            {showLeftArrow && (
                <button 
                    className={`${styles.scrollArrow} ${styles.left} ${styles.visible}`}
                    onClick={() => scroll('left')}
                    aria-label="Previous image"
                >
                    ◀
                </button>
            )}
            {showRightArrow && (
                <button 
                    className={`${styles.scrollArrow} ${styles.right} ${styles.visible}`}
                    onClick={() => scroll('right')}
                    aria-label="Next image"
                >
                    ▶
                </button>
            )}
            <div className={styles.carouselContainer} ref={scrollContainerRef}>
                {images.map((img, index) => (
                    <div key={index} className={styles.carouselSlide}>
                        <img
                            src={img.asset.url}
                            alt={img.alt || `Mueve Estar imagen ${index + 1}`}
                            className={styles.carouselImage}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}
