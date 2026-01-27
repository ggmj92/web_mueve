'use client';

import { useState, useEffect } from 'react';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
    const [currentLang, setCurrentLang] = useState('es');

    useEffect(() => {
        // Load Google Translate script
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);

        // Initialize Google Translate
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'es',
                    includedLanguages: 'en,es',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                },
                'google_translate_element'
            );
        };

        // Check initial language from cookie
        const checkLanguage = () => {
            const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
            if (match && match[1]) {
                setCurrentLang(match[1]);
            }
        };

        checkLanguage();
        const interval = setInterval(checkLanguage, 500);

        return () => {
            clearInterval(interval);
            document.head.removeChild(script);
        };
    }, []);

    const changeLanguage = (lang) => {
        const langCode = lang === 'en' ? 'en' : 'es';
        
        // Set the cookie
        document.cookie = `googtrans=/es/${langCode}; path=/`;
        
        // Reload to apply translation
        window.location.reload();
    };

    return (
        <>
            <div id="google_translate_element" style={{ display: 'none' }}></div>
            <div className={`${styles.languageToggle} notranslate`}>
                <button
                    onClick={() => changeLanguage('es')}
                    className={`${styles.langButton} ${currentLang === 'es' ? styles.active : ''}`}
                    aria-label="Cambiar a español"
                    suppressHydrationWarning
                >
                    ES
                </button>
                <span className={`${styles.separator} notranslate`}>/</span>
                <button
                    onClick={() => changeLanguage('en')}
                    className={`${styles.langButton} ${currentLang === 'en' ? styles.active : ''}`}
                    aria-label="Switch to English"
                    suppressHydrationWarning
                >
                    EN
                </button>
            </div>
        </>
    );
}
