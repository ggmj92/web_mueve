export default {
  name: 'publicacion',
  title: 'Publicación',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'year',
      title: 'Año',
      type: 'number',
      validation: Rule => Rule.required().integer().min(1900).max(new Date().getFullYear() + 10)
    },
    {
      name: 'isCurrent',
      title: 'Actual',
      type: 'boolean',
      description: 'Marcar como "Actual" (si está desmarcado, será "Pasada")',
      initialValue: false
    },
    {
      name: 'caratula',
      title: 'Carátula',
      type: 'image',
      description: 'Imagen de portada/preview',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'pdfFile',
      title: 'Archivo PDF',
      type: 'file',
      description: 'Sube un archivo PDF o proporciona un enlace externo (ej. Google Drive)',
      options: {
        accept: 'application/pdf'
      },
      fields: [
        {
          name: 'description',
          type: 'string',
          title: 'Descripción'
        }
      ]
    },
    {
      name: 'pdfLink',
      title: 'Enlace Externo',
      type: 'url',
      description: 'Usa esto si el PDF está alojado externamente (ej. Google Drive, Dropbox)'
    }
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      media: 'caratula',
      isCurrent: 'isCurrent'
    },
    prepare(selection) {
      const { title, year, media, isCurrent } = selection
      return {
        title: title,
        subtitle: `${year} - ${isCurrent ? 'Actual' : 'Pasada'}`,
        media: media
      }
    }
  }
}
