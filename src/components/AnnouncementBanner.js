"use client";

import { useState, useEffect } from 'react';
import styles from './AnnouncementBanner.module.css';

async function getAnnouncements() {
  try {
    // Dynamically import the client only in the browser
    const { client } = await import('@/sanity/lib/client');
    const query = `*[_type == "announcementBanner" && isActive == true] | order(_createdAt desc){
      message,
      link,
      "artistSlug": link.artistLink->slug.current
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mark as hydrated and check localStorage
    setIsHydrated(true);
    const wasDismissed = localStorage.getItem('announcement-banner-dismissed');
    
    // Fetch announcements from Sanity
    getAnnouncements().then((data) => {
      setAnnouncements(data);
      setLoading(false);
      
      // Only show if not dismissed and announcements exist
      if (!wasDismissed && data && data.length > 0) {
        setIsVisible(true);
      }
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('announcement-banner-dismissed', 'true');
    // Dispatch event to notify footer that banner is closed
    window.dispatchEvent(new CustomEvent('announcementBannerClosed'));
  };

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated || loading || !isVisible || announcements.length === 0) return null;

  // Build the link URL based on the announcement data
  const getLinkUrl = (announcement) => {
    if (!announcement?.link) return null;
    
    const { linkType, internalLink, artistSlug, externalUrl } = announcement.link;
    
    if (linkType === 'external' && externalUrl) {
      return externalUrl;
    }
    
    if (linkType === 'internal') {
      if (artistSlug) {
        return `/artistas/${artistSlug}`;
      }
      if (internalLink) {
        return internalLink;
      }
    }
    
    return null;
  };

  return (
    <div className={styles.banner}>
      <div className={styles.scrollingText}>
        {/* Repeat all announcements 3 times for seamless scrolling */}
        {[...Array(3)].map((_, repeatIndex) => (
          announcements.map((announcement, announcementIndex) => {
            const linkUrl = getLinkUrl(announcement);
            const hasLink = linkUrl && announcement?.link?.linkType !== 'none';
            const key = `${repeatIndex}-${announcementIndex}`;
            
            if (hasLink) {
              return (
                <a
                  key={key}
                  href={linkUrl}
                  className={styles.textLink}
                  target={announcement.link.linkType === 'external' ? '_blank' : '_self'}
                  rel={announcement.link.linkType === 'external' ? 'noopener noreferrer' : undefined}
                >
                  {announcement.message}
                </a>
              );
            }
            
            return (
              <span key={key} className={styles.text}>
                {announcement.message}
              </span>
            );
          })
        ))}
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
