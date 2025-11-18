export default {
    name: 'feria',
    title: 'Feria',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Nombre de la Feria',
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
            validation: Rule => Rule.required().integer().min(2000).max(2100)
        },
        {
            name: 'dateRange',
            title: 'Rango de Fechas',
            type: 'string',
            description: 'Ejemplo: "Dec 2 to 6" o "5 al 10 de Diciembre"',
            validation: Rule => Rule.required()
        },
        {
            name: 'isCurrent',
            title: 'Es Actual',
            type: 'boolean',
            description: 'Marcar si esta feria está en la sección "Actuales"',
            initialValue: false
        }
    ],
    preview: {
        select: {
            title: 'title',
            year: 'year',
            dateRange: 'dateRange'
        },
        prepare(selection) {
            const { title, year, dateRange } = selection
            return {
                title: title,
                subtitle: `${year} - ${dateRange}`
            }
        }
    }
}
