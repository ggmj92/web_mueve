'use client'

import { useState, useEffect } from 'react'
import styles from './ScrollIndicator.module.css'

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Permanently hide indicator after user scrolls down
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Toggle visibility every 5 seconds (show for 3s, hide for 2s)
    const interval = setInterval(() => {
      if (!hasScrolled) {
        setIsVisible((prev) => !prev)
      }
    }, 5000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [hasScrolled])

  if (!isVisible || hasScrolled) return null

  return (
    <div className={styles.scrollIndicator}>
      <div className={styles.arrow}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  )
}
