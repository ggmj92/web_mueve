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
      title: 'Portafolio (PDF descargable)',
      type: 'file',
      options: { accept: '.pdf' }
    },
    {
      name: 'bio',
      type: 'text',
      title: 'Biografía',
      options: { rows: 10 }
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
