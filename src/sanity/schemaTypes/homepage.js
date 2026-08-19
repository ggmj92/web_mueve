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
              description:
                'Imagen del hero. Usa el círculo (hotspot) para centrar la parte importante. Desktop: 2:1 (panorámico), Mobile: 9:16 (vertical).',
              options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                accept: 'image/*',
                crop: {
                  aspectRatios: [
                    {
                      title: 'Desktop (2:1 panorámico)',
                      value: 2 / 1,
                      default: true,
                    },
                    {
                      title: 'Mobile (9:16 vertical)',
                      value: 9 / 16,
                      default: false,
                    },
                  ],
                },
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texto alternativo',
                  description: 'Importante para accesibilidad y SEO',
                },
              ],
            },
            { name: 'caption', title: 'Caption / Credit', type: 'string' },
            {
              name: 'durationMs',
              title: 'Duration (ms)',
              type: 'number',
              initialValue: 5000,
              validation: (Rule) => Rule.min(500),
            },
            {
              name: 'dateAdded',
              title: 'Fecha de Adición',
              type: 'datetime',
              description:
                'Se usa para ordenar los slides (más reciente primero). Se establece automáticamente al crear el slide; los slides existentes se completan mediante un script de migración.',
              initialValue: () => new Date().toISOString(),
            },
          ],
          preview: {
            select: {
              media: 'image',
              title: 'caption',
              durationMs: 'durationMs',
            },
            prepare({ media, title, durationMs }) {
              return {
                media,
                title: title || 'Untitled slide',
                subtitle: `⏱ ${durationMs ?? 5000} ms`,
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: { slides: 'slides' },
    prepare({ slides }) {
      const count = Array.isArray(slides) ? slides.length : 0
      return {
        title: 'Homepage',
        subtitle: count
          ? `slides: ${count} item${count === 1 ? '' : 's'}`
          : 'No slides yet',
      }
    },
  },
}
