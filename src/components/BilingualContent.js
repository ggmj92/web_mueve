'use client'

import { useState, useEffect } from 'react'

export default function BilingualContent({ spanish, english, className = '' }) {
  const [currentLang, setCurrentLang] = useState('es')

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/)
    setCurrentLang(match?.[1] === 'en' ? 'en' : 'es')
  }, [])

  return (
    <>
      {currentLang === 'es' && spanish && (
        <div className={className}>{spanish}</div>
      )}
      {currentLang === 'en' && english && (
        <div className={className}>{english}</div>
      )}
    </>
  )
}
