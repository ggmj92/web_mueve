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
      
      // Mueve Estar section
      S.listItem()
        .title('Mueve Estar')
        .icon(() => '🎨')
        .child(
          S.documentTypeList('mueveEstar')
            .title('Mueve Estar')
            .child((mueveEstarId) =>
              S.document()
                .documentId(mueveEstarId)
                .schemaType('mueveEstar')
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
      
      // Guest artists (mueve estar) section
      S.listItem()
        .title('Artistas invitados (mueve estar)')
        .icon(() => '🧑‍🎨')
        .child(
          S.documentTypeList('guestArtist')
            .title('Artistas invitados (mueve estar)')
            .child((guestArtistId) =>
              S.document()
                .documentId(guestArtistId)
                .schemaType('guestArtist')
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
        ),
      
      // Exposiciones section
      S.listItem()
        .title('Exposiciones')
        .icon(() => '🖼️')
        .child(
          S.documentTypeList('exposicion')
            .title('Exposiciones')
            .child((exposicionId) =>
              S.document()
                .documentId(exposicionId)
                .schemaType('exposicion')
            )
        ),
      
      // Publicaciones section
      S.listItem()
        .title('Publicaciones')
        .icon(() => '📚')
        .child(
          S.documentTypeList('publicacion')
            .title('Publicaciones')
            .child((publicacionId) =>
              S.document()
                .documentId(publicacionId)
                .schemaType('publicacion')
            )
        )
    ])
