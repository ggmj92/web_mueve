"use client";

import { useState, useEffect } from 'react';
import NewsletterForm from './NewsletterForm';
import styles from './NewsletterModal.module.css';

export default function NewsletterModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated and check if modal was previously dismissed
    setIsHydrated(true);
    const wasDismissed = localStorage.getItem('newsletter-modal-dismissed');
    if (!wasDismissed) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Separate useEffect for event listener - always active
  useEffect(() => {
    const handleOpenModal = () => {
      setIsVisible(true);
    };

    window.addEventListener('openNewsletterModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openNewsletterModal', handleOpenModal);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter-modal-dismissed', 'true');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated || !isVisible) return null;

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          ×
        </button>
        
        <div className={styles.content}>
          <h2 className={styles.title}>
            Suscríbete a nuestro boletín
          </h2>
          <h2 className={styles.titleEnglish}>
            Subscribe to our newsletter
          </h2>
          
          <p className={styles.description}>
            Mantente al día con nuestras últimas exposiciones y eventos.
          </p>
          <p className={styles.descriptionEnglish}>
            Stay updated with our latest exhibitions and events.
          </p>
          
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
