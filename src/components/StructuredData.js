export default function StructuredData({ type = 'Organization' }) {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "ArtGallery",
        "name": "Mueve Galería",
        "alternateName": "Mueve",
        "description": "Galería de arte contemporáneo en Lima, Perú. Representamos artistas emergentes y establecidos, organizamos exposiciones innovadoras y participamos en ferias internacionales de arte.",
        "url": "https://muevegaleria.com",
        "logo": {
            "@type": "ImageObject",
            "url": "https://muevegaleria.com/logos/mueve_logo.png",
            "width": 1200,
            "height": 630
        },
        "image": "https://muevegaleria.com/logos/mueve_logo.png",
        "sameAs": [
            "https://www.instagram.com/mueve.galeria"
        ],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jr. General Borgoño 770",
            "addressLocality": "Miraflores",
            "addressRegion": "Lima",
            "postalCode": "15074",
            "addressCountry": "PE"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-12.120000",
            "longitude": "-77.030000"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "info@muevegaleria.com",
            "availableLanguage": ["Spanish", "English"]
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "11:00",
                "closes": "17:00"
            }
        ],
        "priceRange": "$$$",
        "currenciesAccepted": "PEN, USD",
        "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
        "areaServed": {
            "@type": "City",
            "name": "Lima"
        },
        "knowsAbout": ["Contemporary Art", "Art Exhibitions", "Emerging Artists", "Latin American Art"],
        "slogan": "Arte Contemporáneo"
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Mueve Galería",
        "url": "https://muevegaleria.com",
        "description": "Mueve es una galería de arte contemporáneo que presenta exposiciones innovadoras y artistas emergentes.",
        "publisher": {
            "@type": "Organization",
            "name": "Mueve Galería",
            "logo": {
                "@type": "ImageObject",
                "url": "https://muevegaleria.com/logos/mueve_logo.png"
            }
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://muevegaleria.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://muevegaleria.com"
            }
        ]
    };

    const getSchema = () => {
        switch (type) {
            case 'Organization':
                return organizationSchema;
            case 'WebSite':
                return websiteSchema;
            case 'BreadcrumbList':
                return breadcrumbSchema;
            default:
                return organizationSchema;
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(getSchema()),
            }}
        />
    );
}
