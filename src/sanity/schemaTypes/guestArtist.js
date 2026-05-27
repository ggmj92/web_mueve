export default {
  name: 'guestArtist',
  title: 'Artista Invitado',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nombre',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'portfolioSpanish',
      title: 'Portafolio (Español)',
      type: 'object',
      description: 'Portafolio en español - Sube un archivo PDF o proporciona un enlace externo',
      fields: [
        {
          name: 'file',
          title: 'Archivo PDF',
          type: 'file',
          options: { accept: '.pdf' }
        },
        {
          name: 'externalLink',
          title: 'Enlace Externo',
          type: 'url',
          description: 'Usa esto si el PDF está alojado externamente (ej. Google Drive, Dropbox)',
          validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] })
        }
      ],
      validation: (Rule) => Rule.custom((portfolio) => {
        if (!portfolio) return true
        if (portfolio?.file?.asset && portfolio?.externalLink) {
          return 'Por favor usa solo un archivo PDF O un enlace externo, no ambos.'
        }
        return true
      })
    },
    {
      name: 'portfolioEnglish',
      title: 'Portafolio (English)',
      type: 'object',
      description: 'Portfolio in English - Upload a PDF file or provide an external link',
      fields: [
        {
          name: 'file',
          title: 'PDF File',
          type: 'file',
          options: { accept: '.pdf' }
        },
        {
          name: 'externalLink',
          title: 'External Link',
          type: 'url',
          description: 'Use this if the PDF is hosted externally (e.g. Google Drive, Dropbox)',
          validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] })
        }
      ],
      validation: (Rule) => Rule.custom((portfolio) => {
        if (!portfolio) return true
        if (portfolio?.file?.asset && portfolio?.externalLink) {
          return 'Please use either a PDF file OR an external link, not both.'
        }
        return true
      })
    },
    {
      name: 'bio',
      type: 'array',
      title: 'Biografía',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ],
            annotations: []
          }
        }
      ]
    },
    {
      name: 'artworks',
      type: 'array',
      title: 'Obras',
      description: 'Agregar obras para este artista invitado.',
      of: [
        {
          type: 'object',
          name: 'artwork',
          title: 'Obra',
          fields: [
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
                source: (doc, options) => options.parent?.title,
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
              title: 'Imagen Principal',
              type: 'image',
              description: 'Usa el círculo (hotspot) para centrar la parte importante.',
              options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                accept: 'image/*',
                crop: {
                  aspectRatios: [
                    { title: 'Hover Preview', value: 1 / 1, default: false },
                    { title: 'Carousel Desktop', value: 3 / 4, default: true },
                  ]
                }
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texto alternativo',
                  description: 'Importante para accesibilidad y SEO'
                }
              ],
              validation: (Rule) => Rule.required()
            },
            {
              name: 'detailImages',
              title: 'Imágenes de Detalle',
              type: 'array',
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
                      validation: (Rule) => Rule.required()
                    },
                    {
                      name: 'featured',
                      title: 'Destacado (Página del Artista)',
                      type: 'boolean',
                      description: 'Marcar como imagen principal (hero) en la página del artista.',
                      initialValue: false
                    },
                    {
                      name: 'featuredPreview',
                      title: 'Destacado (Vista Previa Hover)',
                      type: 'boolean',
                      description: 'Marcar como imagen de hover preview.',
                      initialValue: false
                    }
                  ],
                  preview: {
                    select: { media: 'image', featured: 'featured', featuredPreview: 'featuredPreview' },
                    prepare({ media, featured, featuredPreview }) {
                      const badges = []
                      if (featured) badges.push('⭐')
                      if (featuredPreview) badges.push('👁️')
                      return { title: badges.join(' ') || 'Detalle', media }
                    }
                  }
                }
              ]
            },
            {
              name: 'featured',
              title: 'Destacado (Página del Artista) - Imagen Principal',
              type: 'boolean',
              description: 'Usar como imagen hero en la página del artista invitado.',
              initialValue: false
            },
            {
              name: 'featuredPreview',
              title: 'Destacado (Vista Previa Hover) - Imagen Principal',
              type: 'boolean',
              description: 'Usar como hover preview en la lista de Mueve Estar.',
              initialValue: false
            }
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
              year: 'year',
              featured: 'featured',
              featuredPreview: 'featuredPreview',
              detailImages: 'detailImages'
            },
            prepare({ title, media, year, featured, featuredPreview, detailImages }) {
              const badges = []
              if (featured) badges.push('⭐ Hero')
              if (featuredPreview) badges.push('👁️ Preview')
              const badgeText = badges.length > 0 ? ' ' + badges.join(' ') : ''
              const detailCount = Array.isArray(detailImages) ? detailImages.length : 0
              const detailText = detailCount > 0 ? ` (+${detailCount} detalle${detailCount > 1 ? 's' : ''})` : ''
              return {
                title: (title || 'Sin título') + badgeText,
                subtitle: year ? `${year}${detailText}` : (detailText || '—'),
                media
              }
            }
          }
        }
      ],
      options: { sortable: true, layout: 'grid' }
    }
  ],
  preview: {
    select: { title: 'name', artworks: 'artworks' },
    prepare({ title, artworks }) {
      const count = Array.isArray(artworks) ? artworks.length : 0
      return {
        title: title || 'Artista sin nombre',
        subtitle: count ? `${count} obra${count === 1 ? '' : 's'}` : 'Sin obras'
      }
    }
  }
}
