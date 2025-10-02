"use client";

import { useState, useEffect } from 'react';
import styles from './ConstructionModal.module.css';

export default function ConstructionModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if modal was previously dismissed
    const wasDismissed = localStorage.getItem('construction-modal-dismissed');
    if (!wasDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('construction-modal-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          X
        </button>
        <div className={styles.content}>
          <p className={styles.message}>
            Web en construcción — gracias por tu paciencia.
          </p>
          <p className={styles.message}>
            Work in progress — thanks for your patience.
          </p>
        </div>
      </div>
    </div>
  );
}
