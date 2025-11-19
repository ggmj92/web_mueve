/**
 * PortfolioLink Component
 * Displays portfolio/dosier links with ESP/ENG language options
 * Shows single language if only one is available, or both with hover effects
 */

export default function PortfolioLink({ 
    spanish, 
    english, 
    label = 'Portafolio', // 'Portafolio' or 'Dosier'
    className = ''
}) {
    // Helper to get URL from portfolio/dosier object
    const getUrl = (item) => {
        if (!item) return null
        return item.externalLink || item.file?.asset?.url || null
    }

    const spanishUrl = getUrl(spanish)
    const englishUrl = getUrl(english)

    // If neither language has a URL, render empty div to maintain grid structure
    if (!spanishUrl && !englishUrl) {
        return <div className={className}></div>
    }

    // If only one language is available
    if (spanishUrl && !englishUrl) {
        return (
            <a
                href={spanishUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                aria-label={label}
            >
                {label}
            </a>
        )
    }

    if (!spanishUrl && englishUrl) {
        return (
            <a
                href={englishUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                aria-label={label}
            >
                {label}
            </a>
        )
    }

    // Both languages available - show ESP / ENG
    return (
        <div className={`${className} portfolio-dual-lang`}>
            {label}{' '}
            <a
                href={spanishUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-lang-link"
                aria-label={`${label} Español`}
            >
                ESP
            </a>
            {' / '}
            <a
                href={englishUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-lang-link"
                aria-label={`${label} English`}
            >
                ENG
            </a>
        </div>
    )
}
