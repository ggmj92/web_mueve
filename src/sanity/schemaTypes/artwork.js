// DEPRECATED: Artworks are now inline objects within the artist schema.
// This file is kept for reference but is no longer used.
// To add artworks, edit them directly within the artist document.

export default {
    name: 'artwork',
    title: 'Obra (DEPRECATED)',
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
            title: 'Destacado (Página del Artista)',
            type: 'boolean',
            description: 'Marcar esta obra como destacada para que aparezca como imagen principal (hero) en la página del artista. Solo una obra por artista puede estar destacada.',
            initialValue: false,
            validation: (Rule) => Rule.custom(async (featured, context) => {
                if (!featured) return true; // If not featured, no validation needed
                
                const { document, getClient } = context;
                const client = getClient({ apiVersion: '2023-01-01' });
                
                if (!document?.artist?._ref) return true; // No artist reference, skip validation
                
                // Get the base ID without the 'drafts.' prefix
                const baseId = document._id.replace(/^drafts\./, '');
                
                // Find other featured artworks for the same artist, excluding both draft and published versions of current doc
                const otherFeaturedArtworks = await client.fetch(
                    `*[_type == "artwork" && artist._ref == $artistRef && featured == true && !(_id in [$currentId, $draftId, $publishedId])]`,
                    { 
                        artistRef: document.artist._ref,
                        currentId: document._id,
                        draftId: `drafts.${baseId}`,
                        publishedId: baseId
                    }
                );
                
                if (otherFeaturedArtworks.length > 0) {
                    return 'Solo una obra por artista puede estar destacada. Desmarca la obra destacada actual primero.';
                }
                
                return true;
            })
        },
        {
            name: 'featuredPreview',
            title: 'Destacado (Vista Previa Hover)',
            type: 'boolean',
            description: 'Marcar esta obra como la que aparece en la vista previa al hacer hover sobre el nombre del artista en la lista de artistas. Solo una obra por artista puede estar marcada.',
            initialValue: false,
            validation: (Rule) => Rule.custom(async (featuredPreview, context) => {
                if (!featuredPreview) return true;
                
                const { document, getClient } = context;
                const client = getClient({ apiVersion: '2023-01-01' });
                
                if (!document?.artist?._ref) return true;
                
                // Get the base ID without the 'drafts.' prefix
                const baseId = document._id.replace(/^drafts\./, '');
                
                // Find other preview-featured artworks for the same artist, excluding both draft and published versions of current doc
                const otherPreviewArtworks = await client.fetch(
                    `*[_type == "artwork" && artist._ref == $artistRef && featuredPreview == true && !(_id in [$currentId, $draftId, $publishedId])]`,
                    { 
                        artistRef: document.artist._ref,
                        currentId: document._id,
                        draftId: `drafts.${baseId}`,
                        publishedId: baseId
                    }
                );
                
                if (otherPreviewArtworks.length > 0) {
                    return 'Solo una obra por artista puede estar marcada para vista previa. Desmarca la obra actual primero.';
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
            featured: 'featured',
            featuredPreview: 'featuredPreview'
        },
        prepare({ title, media, year, artist, featured, featuredPreview }) {
            const subtitle = [artist, year].filter(Boolean).join(' • ');
            const badges = [];
            if (featured) badges.push('⭐ Hero');
            if (featuredPreview) badges.push('👁️ Preview');
            const badgeText = badges.length > 0 ? ' ' + badges.join(' ') : '';
            return {
                title: (title || 'Sin título') + badgeText,
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
