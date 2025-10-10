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
                    name: 'slide',
                    title: 'Slide',
                    type: 'object',
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
                        {
                            name: 'position',
                            title: 'Focal Position (CSS)',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Center', value: 'center' },
                                    { title: 'Top', value: 'top' },
                                    { title: 'Bottom', value: 'bottom' },
                                    { title: 'Left', value: 'left' },
                                    { title: 'Right', value: 'right' }
                                ],
                                layout: 'radio'
                            },
                            initialValue: 'center'
                        }
                    ],
                    preview: {
                        select: {
                            media: 'image',
                            title: 'caption',
                            durationMs: 'durationMs',
                            position: 'position'
                        },
                        prepare({ media, title, durationMs, position }) {
                            return {
                                media,
                                title: title || 'Untitled slide',
                                subtitle: `⏱ ${durationMs ?? 5000} ms • ${position || 'center'}`
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
