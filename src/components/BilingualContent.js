'use client';

import { useState, useEffect } from 'react';

export default function BilingualContent({ spanish, english, className = '' }) {
    const [currentLang, setCurrentLang] = useState('es');

    useEffect(() => {
        // Check current language from Google Translate cookie
        const checkLanguage = () => {
            const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
            if (match && match[1]) {
                setCurrentLang(match[1] === 'en' ? 'en' : 'es');
            } else {
                setCurrentLang('es');
            }
        };

        checkLanguage();
        
        // Check periodically in case language changes
        const interval = setInterval(checkLanguage, 500);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {currentLang === 'es' && spanish && (
                <div className={className}>
                    {spanish}
                </div>
            )}
            {currentLang === 'en' && english && (
                <div className={className}>
                    {english}
                </div>
            )}
        </>
    );
}
