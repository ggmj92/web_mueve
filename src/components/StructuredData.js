export default function StructuredData({ type = 'Organization' }) {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "ArtGallery",
        "name": "Mueve Galería",
        "description": "Mueve es una galería de arte contemporáneo que presenta exposiciones innovadoras y artistas emergentes.",
        "url": "https://muevegaleria.com",
        "logo": "https://muevegaleria.com/logos/mueve_logo.png",
        "image": "https://muevegaleria.com/logos/mueve_logo.png",
        "sameAs": [
            // Add your social media URLs here
            "https://www.instagram.com/mueve.galeria",
        ],
        "address": {
            "@type": "PostalAddress",
            // Add your gallery address here
            "streetAddress": "General Borgoño 770",
            "addressLocality": "Lima",
            "addressRegion": "Lima",
            "postalCode": "15074",
            "addressCountry": "Perú"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            // Add your contact information here
            "telephone": "+51 987 654 321",
            "contactType": "customer service",
            "email": "info@mueve.com.pe"
        },
        "openingHours": [
            // Add your opening hours here
            "Lun-Sa 11:00-17:00",
        ],
        "priceRange": "$$$", // Adjust based on your pricing
        "currenciesAccepted": "PEN, USD", // Adjust based on your accepted currencies
        "paymentAccepted": "Cash, Credit Card", // Adjust based on your payment methods
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
