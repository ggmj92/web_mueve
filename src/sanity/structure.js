// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S) =>
  S.list()
    .title('Contenido')
    .items([
      // 1. Homepage section
      S.listItem()
        .title('Homepage')
        .icon(() => '🏠')
        .child(
          S.documentTypeList('homepage')
            .title('Homepage')
            .child((homepageId) =>
              S.document().documentId(homepageId).schemaType('homepage')
            )
        ),

      // 2. Artists section (artworks are now inline within each artist)
      S.listItem()
        .title('Artistas')
        .icon(() => '👨‍🎨')
        .child(
          S.documentTypeList('artist')
            .title('Artistas')
            .child((artistId) =>
              S.document().documentId(artistId).schemaType('artist')
            )
        ),

      // 3. Exposiciones section
      S.listItem()
        .title('Exposiciones')
        .icon(() => '🖼️')
        .child(
          S.documentTypeList('exposicion')
            .title('Exposiciones')
            .child((exposicionId) =>
              S.document().documentId(exposicionId).schemaType('exposicion')
            )
        ),

      // 4. Ferias section
      S.listItem()
        .title('Ferias')
        .icon(() => '🎪')
        .child(
          S.documentTypeList('feria')
            .title('Ferias')
            .child((feriaId) =>
              S.document().documentId(feriaId).schemaType('feria')
            )
        ),

      // 5. Publicaciones section
      S.listItem()
        .title('Publicaciones')
        .icon(() => '📚')
        .child(
          S.documentTypeList('publicacion')
            .title('Publicaciones')
            .child((publicacionId) =>
              S.document().documentId(publicacionId).schemaType('publicacion')
            )
        ),

      // 6. Mueve Estar section
      S.listItem()
        .title('mueve (estar  )')
        .icon(() => '🎨')
        .child(
          S.documentTypeList('mueveEstar')
            .title('mueve (estar  )')
            .child((mueveEstarId) =>
              S.document().documentId(mueveEstarId).schemaType('mueveEstar')
            )
        ),

      // 7. Guest Artists section
      S.listItem()
        .title('Artistas Invitados')
        .icon(() => '🎭')
        .child(
          S.documentTypeList('guestArtist')
            .title('Artistas Invitados')
            .child((guestArtistId) =>
              S.document().documentId(guestArtistId).schemaType('guestArtist')
            )
        ),

      // 8. About section
      S.listItem()
        .title('Nosotros')
        .icon(() => '👥')
        .child(
          S.documentTypeList('nosotros')
            .title('Nosotros')
            .child((nosotrosId) =>
              S.document().documentId(nosotrosId).schemaType('nosotros')
            )
        ),

      // 8. Announcement Banner section
      S.listItem()
        .title('Banner de Anuncios')
        .icon(() => '📢')
        .child(
          S.documentTypeList('announcementBanner')
            .title('Banner de Anuncios')
            .child((bannerId) =>
              S.document().documentId(bannerId).schemaType('announcementBanner')
            )
        ),
    ])
