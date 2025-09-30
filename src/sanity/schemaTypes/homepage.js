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
                            options: { hotspot: true },
                        },
                        { name: 'caption', title: 'Caption / Credit', type: 'string' },
                        {
                            name: 'durationMs',
                            title: 'Duration (ms)',
                            type: 'number',
                            initialValue: 5000,
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
                                    { title: 'Right', value: 'right' },
                                ],
                            },
                            initialValue: 'center',
                        },
                    ],
                },
            ],
        },
    ],
}