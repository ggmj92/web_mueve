export default {
  name: 'artista',
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
      of: [{ type: 'reference', to: [{ type: 'obra' }] }]
    }
  ],
  preview: {
    select: { title: 'name', artworks: 'artworks' },
    prepare({ title, artworks }) {
      const count = Array.isArray(artworks) ? artworks.length : 0;
      return {
        title: title || 'Artista sin nombre',
        subtitle: count ? `${count} obra${count === 1 ? '' : 's'}` : 'Sin obras todavía'
      };
    }
  }
};
