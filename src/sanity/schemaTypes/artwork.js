export default {
    name: 'artwork',
    title: 'Obra',
    type: 'document',
    fields: [
        {
            name: 'artist',
            title: 'Artista',
            type: 'reference',
            to: [{ type: 'artist' }],
            validation: (Rule) => Rule.required()
        },
        {
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: (Rule) => Rule.required()
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required()
        },
        {
            name: 'year',
            title: 'Año',
            type: 'string'
        },
        {
            name: 'technique',
            title: 'Técnica',
            type: 'string'
        },
        {
            name: 'dimensions',
            title: 'Medidas',
            type: 'string'
        },
        {
            name: 'description',
            title: 'Descripción',
            type: 'text',
            options: { rows: 6 }
        },
        {
            name: 'image',
            title: 'Imagen',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required()
        },
        {
            name: 'featured',
            title: 'Destacado',
            type: 'boolean',
            description: 'Marcar esta obra como destacada para que aparezca como imagen principal en la página del artista. Solo una obra por artista puede estar destacada.',
            initialValue: false,
            validation: (Rule) => Rule.custom(async (featured, context) => {
                if (!featured) return true; // If not featured, no validation needed
                
                const { document, getClient } = context;
                const client = getClient({ apiVersion: '2023-01-01' });
                
                if (!document?.artist?._ref) return true; // No artist reference, skip validation
                
                // Find other featured artworks for the same artist
                const otherFeaturedArtworks = await client.fetch(
                    `*[_type == "artwork" && artist._ref == $artistRef && featured == true && _id != $currentId]`,
                    { 
                        artistRef: document.artist._ref,
                        currentId: document._id 
                    }
                );
                
                if (otherFeaturedArtworks.length > 0) {
                    return 'Solo una obra por artista puede estar destacada. Desmarca la obra destacada actual primero.';
                }
                
                return true;
            })
        }
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
            year: 'year',
            artist: 'artist.name',
            featured: 'featured'
        },
        prepare({ title, media, year, artist, featured }) {
            const subtitle = [artist, year].filter(Boolean).join(' • ');
            const featuredText = featured ? ' ⭐ Destacado' : '';
            return {
                title: (title || 'Sin título') + featuredText,
                subtitle: subtitle || '—',
                media
            };
        }
    },
    // Add helpful actions
    actions: (S) => [
        S.action
            .title('Create Another Artwork for Same Artist')
            .icon(() => '➕')
            .onExecute(async ({ draft, published }) => {
                const artistRef = draft?.artist?._ref || published?.artist?._ref;
                if (artistRef) {
                    // This would open a new artwork with the artist pre-selected
                    window.open(`/desk/artwork;new;artist=${artistRef}`, '_blank');
                }
            })
    ]
};
