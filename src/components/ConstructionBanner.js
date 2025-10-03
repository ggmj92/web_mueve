"use client";

import { useState, useEffect } from 'react';
import styles from './ConstructionBanner.module.css';

export default function ConstructionBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated and check localStorage
    setIsHydrated(true);
    const wasDismissed = localStorage.getItem('construction-banner-dismissed');
    if (!wasDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('construction-banner-dismissed', 'true');
    // Dispatch event to notify footer that banner is closed
    window.dispatchEvent(new CustomEvent('constructionBannerClosed'));
  };

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated || !isVisible) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.scrollingText}>
        <span className={styles.text}>
          Web en construcción — gracias por tu paciencia.
        </span>
        <span className={styles.text}>
          Work in progress — thanks for your patience.
        </span>
        <span className={styles.text}>
          Web en construcción — gracias por tu paciencia.
        </span>
        <span className={styles.text}>
          Work in progress — thanks for your patience.
        </span>
        <span className={styles.text}>
          Web en construcción — gracias por tu paciencia.
        </span>
        <span className={styles.text}>
          Work in progress — thanks for your patience.
        </span>
      </div>
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close banner"
      >
        ×
      </button>
    </div>
  );
}
