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
      description: 'Agregar obras para este artista. La obra marcada como "Destacado" aparecerá como imagen principal en la página del artista. También puedes crear nuevas obras desde la sección "Obras por Artista" en el menú principal.',
      of: [{ 
        type: 'reference', 
        to: [{ type: 'artwork' }],
        options: {
          filter: 'artist._ref == $artistId',
          filterParams: { artistId: 'drafts.' }
        }
      }],
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
