export default {
  name: 'exposicion',
  title: 'Exposición',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Título',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'year',
      type: 'string',
      title: 'Año',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'isCurrent',
      type: 'boolean',
      title: 'Exposición Actual',
      description: 'Marcar como "Actual" (true) o "Pasada" (false)',
      initialValue: false,
      validation: (Rule) => Rule.required()
    },
    {
      name: 'artists',
      type: 'array',
      title: 'Artistas',
      description: 'Seleccionar uno o varios artistas asociados a esta exposición',
      of: [
        {
          type: 'reference',
          to: [{ type: 'artist' }, { type: 'guestArtist' }]
        }
      ]
    },
    {
      name: 'portfolio',
      title: 'Portafolio / Enlace Externo',
      type: 'object',
      description: 'Sube un archivo PDF o proporciona un enlace externo',
      fields: [
        {
          name: 'file',
          title: 'Archivo PDF',
          type: 'file',
          options: {
            accept: '.pdf'
          }
        },
        {
          name: 'externalLink',
          title: 'Enlace Externo',
          type: 'url',
          validation: (Rule) => Rule.uri({
            scheme: ['http', 'https']
          })
        }
      ]
    },
    {
      name: 'description',
      type: 'array',
      title: 'Descripción / Acerca de',
      description: 'Texto que aparece al hacer scroll hacia abajo en la página de la exposición',
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
      name: 'previewImage',
      title: 'Imagen de Vista Previa',
      type: 'image',
      description: 'Imagen que aparece al hacer hover sobre el título de la exposición en la lista',
      options: { hotspot: true },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'artworks',
      type: 'array',
      title: 'Imágenes de la Exposición',
      description: 'Agregar imágenes de la exposición con información de obra(s)',
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
              validation: (Rule) => Rule.required()
            },
            {
              name: 'artworkInfo',
              title: 'Información de Obra(s)',
              type: 'array',
              description: 'Agregar información de una o varias obras visibles en esta imagen',
              of: [
                {
                  type: 'object',
                  name: 'artworkDetails',
                  title: 'Detalles de Obra',
                  fields: [
                    {
                      name: 'artistName',
                      title: 'Nombre del Artista',
                      type: 'string'
                    },
                    {
                      name: 'title',
                      title: 'Título',
                      type: 'string'
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
                    }
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      artistName: 'artistName',
                      year: 'year'
                    },
                    prepare({ title, artistName, year }) {
                      return {
                        title: title || 'Sin título',
                        subtitle: `${artistName || '—'} ${year ? `(${year})` : ''}`
                      }
                    }
                  }
                }
              ]
            }
          ],
          preview: {
            select: {
              media: 'image',
              artworkInfo: 'artworkInfo'
            },
            prepare({ media, artworkInfo }) {
              const count = Array.isArray(artworkInfo) ? artworkInfo.length : 0;
              return {
                title: count > 0 ? `${count} obra${count > 1 ? 's' : ''}` : 'Imagen',
                media
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      isCurrent: 'isCurrent',
      media: 'previewImage'
    },
    prepare({ title, year, isCurrent, media }) {
      const status = isCurrent ? '🟢 Actual' : '⚫ Pasada';
      return {
        title: title || 'Sin título',
        subtitle: `${year || '—'} • ${status}`,
        media
      };
    }
  }
};
