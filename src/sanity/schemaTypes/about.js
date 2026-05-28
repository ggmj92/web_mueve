export default {
  name: 'nosotros',
  title: 'Nosotros',
  type: 'document',
  fields: [
    {
      name: 'spanish',
      type: 'text',
      title: 'Texto (Español)',
      options: { rows: 14 },
    },
    {
      name: 'english',
      type: 'text',
      title: 'Texto (Inglés)',
      options: { rows: 14 },
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
  ],
  preview: {
    select: { es: 'spanish', en: 'english' },
    prepare({ es, en }) {
      const raw = es || en || ''
      const snippet =
        raw.replace(/\s+/g, ' ').slice(0, 80) + (raw.length > 80 ? '…' : '')
      return {
        title: 'Nosotros',
        subtitle: snippet || 'Sin texto todavía',
      }
    },
  },
}
