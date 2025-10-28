export default {
  name: 'artist',
  title: 'Artista',
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
      name: 'portfolio',
      title: 'Portafolio',
      type: 'object',
      description: 'Sube un archivo PDF o proporciona un enlace externo (ej. Google Drive)',
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
          validation: (Rule) => Rule.uri({
            scheme: ['http', 'https']
          })
        }
      ],
      validation: (Rule) => Rule.custom((portfolio) => {
        if (!portfolio) return true; // Portfolio is optional
        const hasFile = portfolio?.file?.asset;
        const hasLink = portfolio?.externalLink;
        
        if (hasFile && hasLink) {
          return 'Por favor usa solo un archivo PDF O un enlace externo, no ambos.';
        }
        
        if (!hasFile && !hasLink) {
          return 'Por favor proporciona un archivo PDF o un enlace externo.';
        }
        
        return true;
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
      description: 'Agregar obras para este artista. Haz clic en "Agregar elemento" para crear una nueva obra directamente aquí.',
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
              options: { hotspot: true },
              validation: (Rule) => Rule.required()
            },
            {
              name: 'detailImages',
              title: 'Imágenes de Detalle',
              type: 'array',
              description: 'Agrega imágenes de detalle de esta obra. Heredarán automáticamente toda la información (año, técnica, medidas, descripción) de la obra principal.',
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
                      description: 'Marcar esta imagen de detalle como destacada para que aparezca como imagen principal (hero) en la página del artista.',
                      initialValue: false
                    },
                    {
                      name: 'featuredPreview',
                      title: 'Destacado (Vista Previa Hover)',
                      type: 'boolean',
                      description: 'Marcar esta imagen de detalle como la que aparece en la vista previa al hacer hover sobre el nombre del artista.',
                      initialValue: false
                    }
                  ],
                  preview: {
                    select: {
                      media: 'image',
                      featured: 'featured',
                      featuredPreview: 'featuredPreview'
                    },
                    prepare({ media, featured, featuredPreview }) {
                      const badges = [];
                      if (featured) badges.push('⭐');
                      if (featuredPreview) badges.push('👁️');
                      const badgeText = badges.length > 0 ? badges.join(' ') : '';
                      return {
                        title: badgeText || 'Detalle',
                        media
                      };
                    }
                  }
                }
              ]
            },
            {
              name: 'featured',
              title: 'Destacado (Página del Artista) - Imagen Principal',
              type: 'boolean',
              description: 'Marcar la imagen principal de esta obra como destacada para que aparezca como imagen hero en la página del artista.',
              initialValue: false
            },
            {
              name: 'featuredPreview',
              title: 'Destacado (Vista Previa Hover) - Imagen Principal',
              type: 'boolean',
              description: 'Marcar la imagen principal como la que aparece en la vista previa al hacer hover sobre el nombre del artista.',
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
              const badges = [];
              if (featured) badges.push('⭐ Hero');
              if (featuredPreview) badges.push('👁️ Preview');
              const badgeText = badges.length > 0 ? ' ' + badges.join(' ') : '';
              
              const detailCount = Array.isArray(detailImages) ? detailImages.length : 0;
              const detailText = detailCount > 0 ? ` (+${detailCount} detalle${detailCount > 1 ? 's' : ''})` : '';
              
              const subtitle = year ? `${year}${detailText}` : (detailText || '—');
              return {
                title: (title || 'Sin título') + badgeText,
                subtitle,
                media
              };
            }
          }
        }
      ],
      options: {
        sortable: true,
        layout: 'grid'
      }
    }
  ],
  preview: {
    select: { title: 'name', artworks: 'artworks' },
    prepare({ title, artworks }) {
      const count = Array.isArray(artworks) ? artworks.length : 0;
      return {
        title: title || 'Artista sin nombre',
        subtitle: count ? `${count} obra${count === 1 ? '' : 's'}` : 'Sin obras'
      };
    }
  }
};
