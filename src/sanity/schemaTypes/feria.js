export default {
  name: 'feria',
  title: 'Feria',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nombre de la Feria',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Año',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(2000).max(2100),
    },
    {
      name: 'dateRange',
      title: 'Rango de Fechas',
      type: 'string',
      description: 'Ejemplo: "Dec 2 to 6" o "5 al 10 de Diciembre"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isCurrent',
      title: 'Es Actual',
      type: 'boolean',
      description: 'Marcar si esta feria está en la sección "Actuales"',
      initialValue: false,
    },
    {
      name: 'status',
      title: 'Estado',
      type: 'string',
      description:
        'Estado de la feria para agrupar la lista en /ferias. Este campo es manual: no se calcula automáticamente a partir de "Es Actual" ni del rango de fechas — debe actualizarse a mano.',
      options: {
        list: [
          { title: 'Futura', value: 'Futura' },
          { title: 'Presente', value: 'Presente' },
          { title: 'Pasada', value: 'Pasada' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'order',
      title: 'Orden de Visualización',
      type: 'number',
      description:
        'Número para ordenar las ferias (menor número = aparece primero). Ejemplo: 1, 2, 3...',
      validation: (Rule) => Rule.integer().min(0),
    },
    {
      name: 'description',
      type: 'array',
      title: 'Descripción',
      description:
        'Descripción de la feria. Una feria solo es clickeable en /ferias cuando este campo tiene contenido.',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [],
          },
        },
      ],
    },
    {
      name: 'pressSpanish',
      title: 'Prensa/Info (Español)',
      type: 'object',
      description:
        'Prensa o información en español - Sube un archivo PDF o proporciona un enlace externo',
      fields: [
        {
          name: 'file',
          title: 'Archivo PDF',
          type: 'file',
          options: { accept: '.pdf' },
        },
        {
          name: 'externalLink',
          title: 'Enlace Externo',
          type: 'url',
          description:
            'Usa esto si el PDF está alojado externamente (ej. Google Drive, Dropbox)',
          validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
        },
      ],
      validation: (Rule) =>
        Rule.custom((press) => {
          if (!press) return true
          if (press?.file?.asset && press?.externalLink) {
            return 'Por favor usa solo un archivo PDF O un enlace externo, no ambos.'
          }
          return true
        }),
    },
    {
      name: 'pressEnglish',
      title: 'Prensa/Info (English)',
      type: 'object',
      description:
        'Press or info in English - Upload a PDF file or provide an external link',
      fields: [
        {
          name: 'file',
          title: 'PDF File',
          type: 'file',
          options: { accept: '.pdf' },
        },
        {
          name: 'externalLink',
          title: 'External Link',
          type: 'url',
          description:
            'Use this if the PDF is hosted externally (e.g. Google Drive, Dropbox)',
          validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
        },
      ],
      validation: (Rule) =>
        Rule.custom((press) => {
          if (!press) return true
          if (press?.file?.asset && press?.externalLink) {
            return 'Please use either a PDF file OR an external link, not both.'
          }
          return true
        }),
    },
    {
      name: 'images',
      type: 'array',
      title: 'Imágenes de la Feria',
      description:
        'Agregar fotos del stand/participación en esta feria. Haz clic en "Agregar elemento" para crear una nueva imagen directamente aquí.',
      of: [
        {
          type: 'object',
          name: 'feriaImage',
          title: 'Imagen',
          fields: [
            {
              name: 'title',
              title: 'Título',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {
                source: (doc, options) => options.parent?.title,
                maxLength: 96,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text',
              options: { rows: 6 },
            },
            {
              name: 'image',
              title: 'Imagen Principal',
              type: 'image',
              description:
                'Usa el círculo (hotspot) para centrar la parte importante. Los aspectos abajo muestran cómo se verá en el sitio: 1:1 (hover preview), 3:4 (carousel desktop).',
              options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                accept: 'image/*',
                sources: [],
                crop: {
                  aspectRatios: [
                    { title: 'Hover Preview', value: 1 / 1, default: false },
                    { title: 'Carousel Desktop', value: 3 / 4, default: true },
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
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'detailImages',
              title: 'Imágenes de Detalle',
              type: 'array',
              description:
                'Agrega imágenes de detalle. Heredarán automáticamente toda la información (descripción) de la imagen principal.',
              of: [
                {
                  type: 'object',
                  name: 'detailImage',
                  title: 'Imagen de Detalle',
                  fields: [
                    {
                      name: 'image',
                      title: 'Imagen',
                      type: 'image',
                      options: { hotspot: true },
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'featured',
                      title: 'Destacado (Página de la Feria)',
                      type: 'boolean',
                      description:
                        'Marcar esta imagen de detalle como destacada para que aparezca como imagen principal (hero) en la página de la feria.',
                      initialValue: false,
                    },
                    {
                      name: 'featuredPreview',
                      title: 'Destacado (Vista Previa Hover)',
                      type: 'boolean',
                      description:
                        'Marcar esta imagen de detalle como la que aparece en la vista previa al hacer hover sobre el nombre de la feria.',
                      initialValue: false,
                    },
                  ],
                  preview: {
                    select: {
                      media: 'image',
                      featured: 'featured',
                      featuredPreview: 'featuredPreview',
                    },
                    prepare({ media, featured, featuredPreview }) {
                      const badges = []
                      if (featured) badges.push('⭐')
                      if (featuredPreview) badges.push('👁️')
                      return { title: badges.join(' ') || 'Detalle', media }
                    },
                  },
                },
              ],
            },
            {
              name: 'featured',
              title: 'Destacado (Página de la Feria) - Imagen Principal',
              type: 'boolean',
              description:
                'Marcar la imagen principal de esta imagen como destacada para que aparezca como imagen hero en la página de la feria.',
              initialValue: false,
            },
            {
              name: 'featuredPreview',
              title: 'Destacado (Vista Previa Hover) - Imagen Principal',
              type: 'boolean',
              description:
                'Marcar la imagen principal como la que aparece en la vista previa al hacer hover sobre el nombre de la feria.',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
              featured: 'featured',
              featuredPreview: 'featuredPreview',
              detailImages: 'detailImages',
            },
            prepare({ title, media, featured, featuredPreview, detailImages }) {
              const badges = []
              if (featured) badges.push('⭐ Hero')
              if (featuredPreview) badges.push('👁️ Preview')
              const badgeText = badges.length > 0 ? ' ' + badges.join(' ') : ''
              const detailCount = Array.isArray(detailImages)
                ? detailImages.length
                : 0
              const detailText =
                detailCount > 0
                  ? ` (+${detailCount} detalle${detailCount > 1 ? 's' : ''})`
                  : ''
              return {
                title: (title || 'Sin título') + badgeText,
                subtitle: detailText || '—',
                media,
              }
            },
          },
        },
      ],
      options: {
        sortable: true,
        layout: 'grid',
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      dateRange: 'dateRange',
      status: 'status',
    },
    prepare(selection) {
      const { title, year, dateRange, status } = selection
      return {
        title: title,
        subtitle: `${year} - ${dateRange}${status ? ` · ${status}` : ' · sin estado'}`,
      }
    },
  },
}
