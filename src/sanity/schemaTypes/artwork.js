export default {
    name: 'obra',
    title: 'Obra',
    type: 'document',
    fields: [
        {
            name: 'artist',
            title: 'Artista',
            type: 'reference',
            to: [{ type: 'artista' }],
            validation: (Rule) => Rule.required()
        },
        {
            name: 'title',
            title: 'Título',
            type: 'string',
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
        }
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
            year: 'year',
            artist: 'artist.name'
        },
        prepare({ title, media, year, artist }) {
            const subtitle = [artist, year].filter(Boolean).join(' • ');
            return {
                title: title || 'Sin título',
                subtitle: subtitle || '—',
                media
            };
        }
    }
};
