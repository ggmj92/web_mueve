export default {
  name: 'exposicion',
  title: 'Exposición',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Título',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'year',
      type: 'string',
      title: 'Año',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isCurrent',
      type: 'boolean',
      title: 'Exposición Actual',
      description: 'Marcar como "Actual" (true) o "Pasada" (false)',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'artists',
      type: 'array',
      title: 'Artistas',
      description:
        'Seleccionar artistas representados o escribir nombres de artistas invitados',
      of: [
        {
          type: 'reference',
          title: 'Artista Representado',
          to: [{ type: 'artist' }],
          options: {
            filter: '_type == "artist"',
          },
        },
        {
          type: 'object',
          title: 'Artista Invitado (Texto)',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Nombre del Artista',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'name',
            },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle: 'Artista invitado',
              }
            },
          },
        },
      ],
    },
    {
      name: 'portfolioSpanish',
      title: 'Portafolio (Español)',
      type: 'object',
      description:
        'Portafolio en español - Sube un archivo PDF o proporciona un enlace externo',
      fields: [
        {
          name: 'file',
          title: 'Archivo PDF',
          type: 'file',
          options: {
            accept: '.pdf',
          },
        },
        {
          name: 'externalLink',
          title: 'Enlace Externo',
          type: 'url',
          description: 'Usa esto si el PDF está alojado externamente',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
      ],
      validation: (Rule) =>
        Rule.custom((portfolio) => {
          if (!portfolio) return true
          const hasFile = portfolio?.file?.asset
          const hasLink = portfolio?.externalLink

          if (hasFile && hasLink) {
            return 'Por favor usa solo un archivo PDF O un enlace externo, no ambos.'
          }

          return true
        }),
    },
    {
      name: 'portfolioEnglish',
      title: 'Portfolio (English)',
      type: 'object',
      description:
        'Portfolio in English - Upload a PDF file or provide an external link',
      fields: [
        {
          name: 'file',
          title: 'PDF File',
          type: 'file',
          options: {
            accept: '.pdf',
          },
        },
        {
          name: 'externalLink',
          title: 'External Link',
          type: 'url',
          description: 'Use this if the PDF is hosted externally',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
      ],
      validation: (Rule) =>
        Rule.custom((portfolio) => {
          if (!portfolio) return true
          const hasFile = portfolio?.file?.asset
          const hasLink = portfolio?.externalLink

          if (hasFile && hasLink) {
            return 'Please use either a PDF file OR an external link, not both.'
          }

          return true
        }),
    },
    {
      name: 'prensaSpanish',
      title: 'Prensa (Español)',
      type: 'object',
      description:
        'Prensa en español - Sube un archivo PDF o proporciona un enlace externo',
      initialValue: {},
      fields: [
        {
          name: 'file',
          title: 'Archivo PDF',
          type: 'file',
          options: {
            accept: '.pdf',
          },
        },
        {
          name: 'externalLink',
          title: 'Enlace Externo',
          type: 'url',
          description: 'Usa esto si el PDF está alojado externamente',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
      ],
      validation: (Rule) =>
        Rule.custom((prensa) => {
          if (!prensa) return true
          const hasFile = prensa?.file?.asset
          const hasLink = prensa?.externalLink

          if (hasFile && hasLink) {
            return 'Por favor usa solo un archivo PDF O un enlace externo, no ambos.'
          }

          return true
        }),
    },
    {
      name: 'prensaEnglish',
      title: 'Press (English)',
      type: 'object',
      description:
        'Press in English - Upload a PDF file or provide an external link',
      initialValue: {},
      fields: [
        {
          name: 'file',
          title: 'PDF File',
          type: 'file',
          options: {
            accept: '.pdf',
          },
        },
        {
          name: 'externalLink',
          title: 'External Link',
          type: 'url',
          description: 'Use this if the PDF is hosted externally',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
      ],
      validation: (Rule) =>
        Rule.custom((prensa) => {
          if (!prensa) return true
          const hasFile = prensa?.file?.asset
          const hasLink = prensa?.externalLink

          if (hasFile && hasLink) {
            return 'Please use either a PDF file OR an external link, not both.'
          }

          return true
        }),
    },
    {
      name: 'description',
      type: 'array',
      title: 'Descripción / Acerca de',
      description:
        'Texto que aparece al hacer scroll hacia abajo en la página de la exposición',
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
      name: 'previewImage',
      title: 'Imagen de Vista Previa',
      type: 'image',
      description:
        'Imagen que aparece al hacer hover sobre el título de la exposición en la lista. Usa el círculo (hotspot) para centrar la parte importante. Se mostrará como cuadrado (1:1).',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
        accept: 'image/*',
        crop: {
          aspectRatios: [
            {
              title: 'Hover Preview (como se ve en el sitio)',
              value: 1 / 1,
              default: true,
            }, // 800x800 square
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
      name: 'artworks',
      type: 'array',
      title: 'Imágenes de la Exposición',
      description:
        'Agregar imágenes de la exposición con información de obra(s)',
      of: [
        {
          type: 'object',
          name: 'exposicionArtwork',
          title: 'Imagen',
          fields: [
            {
              name: 'image',
              title: 'Imagen',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              description:
                'Identificador único para esta imagen (se genera automáticamente)',
              options: {
                source: (doc, options) => {
                  // Generate slug from parent title and index
                  const parentTitle = options.parent?.title || 'imagen'
                  const timestamp = Date.now()
                  return `${parentTitle}-${timestamp}`
                },
                maxLength: 96,
              },
            },
            {
              name: 'featured',
              title: 'Destacado (Página de Exposición) - Imagen Principal',
              type: 'boolean',
              description:
                'Marcar esta imagen como la imagen principal que aparece en la parte superior de la página de la exposición',
              initialValue: false,
            },
            {
              name: 'artworkInfo',
              title: 'Información de Obra(s)',
              type: 'array',
              description:
                'Agregar información de una o varias obras visibles en esta imagen',
              of: [
                {
                  type: 'object',
                  name: 'artworkDetails',
                  title: 'Detalles de Obra',
                  fields: [
                    {
                      name: 'artistName',
                      title: 'Nombre del Artista',
                      type: 'string',
                    },
                    {
                      name: 'title',
                      title: 'Título',
                      type: 'string',
                    },
                    {
                      name: 'year',
                      title: 'Año',
                      type: 'string',
                    },
                    {
                      name: 'technique',
                      title: 'Técnica',
                      type: 'string',
                    },
                    {
                      name: 'dimensions',
                      title: 'Medidas',
                      type: 'string',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      artistName: 'artistName',
                      year: 'year',
                    },
                    prepare({ title, artistName, year }) {
                      return {
                        title: title || 'Sin título',
                        subtitle: `${artistName || '—'} ${year ? `(${year})` : ''}`,
                      }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              media: 'image',
              artworkInfo: 'artworkInfo',
              featured: 'featured',
            },
            prepare({ media, artworkInfo, featured }) {
              const count = Array.isArray(artworkInfo) ? artworkInfo.length : 0
              const featuredIcon = featured ? '⭐ ' : ''
              return {
                title: `${featuredIcon}${count > 0 ? `${count} obra${count > 1 ? 's' : ''}` : 'Imagen'}`,
                media,
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      isCurrent: 'isCurrent',
      media: 'previewImage',
    },
    prepare({ title, year, isCurrent, media }) {
      const status = isCurrent ? '🟢 Actual' : '⚫ Pasada'
      return {
        title: title || 'Sin título',
        subtitle: `${year || '—'} • ${status}`,
        media,
      }
    },
  },
}
