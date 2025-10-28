export default {
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
        {
            name: 'slides',
            title: 'Hero Slides',
            type: 'array',
            of: [
                {
                    type: 'object',
                    title: 'Slide',
                    fields: [
                        {
                            name: 'image',
                            title: 'Image',
                            type: 'image',
                            options: { hotspot: true }
                        },
                        { name: 'caption', title: 'Caption / Credit', type: 'string' },
                        {
                            name: 'durationMs',
                            title: 'Duration (ms)',
                            type: 'number',
                            initialValue: 5000,
                            validation: (Rule) => Rule.min(500)
                        },
                    ],
                    preview: {
                        select: {
                            media: 'image',
                            title: 'caption',
                            durationMs: 'durationMs'
                        },
                        prepare({ media, title, durationMs }) {
                            return {
                                media,
                                title: title || 'Untitled slide',
                                subtitle: `⏱ ${durationMs ?? 5000} ms`
                            };
                        }
                    }
                }
            ]
        }
    ],
    preview: {
        select: { slides: 'slides' },
        prepare({ slides }) {
            const count = Array.isArray(slides) ? slides.length : 0;
            return {
                title: 'Homepage',
                subtitle: count ? `slides: ${count} item${count === 1 ? '' : 's'}` : 'No slides yet'
            };
        }
    }
};
