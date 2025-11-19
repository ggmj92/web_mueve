export default {
    name: 'mueveEstar',
    title: 'Mueve Estar',
    type: 'document',
    fields: [
        {
            name: 'description',
            title: 'Descripción',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Texto que aparece en la parte superior de la página'
        },
        {
            name: 'artists',
            title: 'Lista de Artistas',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'name',
                            title: 'Nombre del Artista',
                            type: 'string',
                            validation: Rule => Rule.required()
                        }
                    ],
                    preview: {
                        select: {
                            title: 'name'
                        }
                    }
                }
            ],
            description: 'Lista de nombres de artistas (se mostrarán en orden alfabético)'
        }
    ],
    preview: {
        prepare() {
            return {
                title: 'Mueve Estar Page'
            }
        }
    }
}
