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
      
      // Artists section
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
      
      // Artworks section
      S.listItem()
        .title('Obras')
        .icon(() => '🖼️')
        .child(
          S.documentTypeList('artwork')
            .title('Todas las Obras')
            .child((artworkId) =>
              S.document()
                .documentId(artworkId)
                .schemaType('artwork')
            )
        ),
        
      // Artworks by Artist (grouped view)
      S.listItem()
        .title('Obras por Artista')
        .icon(() => '👨‍🎨🖼️')
        .child(
          S.documentTypeList('artist')
            .title('Obras por Artista')
            .child((artistId) =>
              S.document()
                .documentId(artistId)
                .schemaType('artist')
                .child(
                  S.documentList()
                    .title('Obras')
                    .filter('_type == "artwork" && artist._ref == $artistId')
                    .params({ artistId })
                    .child((artworkId) =>
                      S.document()
                        .documentId(artworkId)
                        .schemaType('artwork')
                    )
                )
            )
        )
    ])
