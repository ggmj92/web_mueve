// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S) =>
  S.list()
    .title('Contenido')
    .items([
      // Homepage section
      S.listItem()
        .title('Homepage')
        .icon(() => '🏠')
        .child(
          S.documentTypeList('homepage')
            .title('Homepage')
            .child((homepageId) =>
              S.document()
                .documentId(homepageId)
                .schemaType('homepage')
            )
        ),
      
      // About section
      S.listItem()
        .title('Nosotros')
        .icon(() => '👥')
        .child(
          S.documentTypeList('nosotros')
            .title('Nosotros')
            .child((nosotrosId) =>
              S.document()
                .documentId(nosotrosId)
                .schemaType('nosotros')
            )
        ),
      
      // Artists section (artworks are now inline within each artist)
      S.listItem()
        .title('Artistas')
        .icon(() => '👨‍🎨')
        .child(
          S.documentTypeList('artist')
            .title('Artistas')
            .child((artistId) =>
              S.document()
                .documentId(artistId)
                .schemaType('artist')
            )
        )
    ])
