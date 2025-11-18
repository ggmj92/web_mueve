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
      
      // Announcement Banner section
      S.listItem()
        .title('Banner de Anuncios')
        .icon(() => '📢')
        .child(
          S.documentTypeList('announcementBanner')
            .title('Banner de Anuncios')
            .child((bannerId) =>
              S.document()
                .documentId(bannerId)
                .schemaType('announcementBanner')
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
        ),
      
      // Ferias section
      S.listItem()
        .title('Ferias')
        .icon(() => '🎪')
        .child(
          S.documentTypeList('feria')
            .title('Ferias')
            .child((feriaId) =>
              S.document()
                .documentId(feriaId)
                .schemaType('feria')
            )
        )
    ])
