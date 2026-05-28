'use client'

import { useState, useEffect } from 'react'
import styles from './LanguageToggle.module.css'

export default function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState('es')

  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement('script')
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.head.appendChild(script)

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'es',
          includedLanguages: 'en,es',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      )
    }

    const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/)
    if (match && match[1]) {
      setCurrentLang(match[1])
    }

    return () => {
      window.googleTranslateElementInit = undefined
    }
  }, [])

  const changeLanguage = (lang) => {
    if (lang === 'en') {
      document.cookie = 'googtrans=/es/en; path=/'
    } else {
      const hostname = window.location.hostname
      document.cookie =
        'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = `googtrans=; path=/; domain=${hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      document.cookie = `googtrans=; path=/; domain=.${hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
    window.location.reload()
  }

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
  )
}
