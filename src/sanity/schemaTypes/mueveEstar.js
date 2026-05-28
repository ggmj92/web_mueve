export default {
  name: 'mueveEstar',
  title: 'Mueve Estar',
  type: 'document',
  fields: [
    {
      name: 'images',
      title: 'Carrusel de Imágenes',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Texto Alternativo',
              type: 'string',
              description: 'Descripción de la imagen para accesibilidad',
            },
          ],
        },
      ],
      description:
        'Imágenes para el carrusel en la parte superior de la página (opcional)',
    },
    {
      name: 'description',
      title: 'Descripción',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Texto que aparece en la parte superior de la página',
    },
    {
      name: 'artists',
      title: 'Artistas Invitados',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'guestArtist' }] }],
      description: 'Referencias a los artistas invitados de Mueve Estar',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Mueve Estar Page',
      }
    },
  },
}
