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
