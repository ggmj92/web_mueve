import { client } from '@/sanity/lib/client'

export default async function sitemap() {
  const baseUrl = 'https://muevegaleria.com'

  // Fetch all artists
  const artists =
    await client.fetch(`*[_type == "artist" && defined(slug.current)]{
    slug,
    _updatedAt
  }`)

  // Fetch all exposiciones
  const exposiciones =
    await client.fetch(`*[_type == "exposicion" && defined(slug.current)]{
    slug,
    _updatedAt
  }`)

  // Fetch all guest artists
  const guestArtists =
    await client.fetch(`*[_type == "guestArtist" && defined(slug.current)]{
    slug,
    _updatedAt
  }`)

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/artistas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/exposiciones`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ferias`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/publicaciones`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Dynamic artist pages
  const artistPages = artists.map((artist) => ({
    url: `${baseUrl}/artistas/${artist.slug.current}`,
    lastModified: new Date(artist._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Dynamic exposicion pages
  const exposicionPages = exposiciones.map((expo) => ({
    url: `${baseUrl}/exposiciones/${expo.slug.current}`,
    lastModified: new Date(expo._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Dynamic guest artist pages
  const guestArtistPages = guestArtists.map((ga) => ({
    url: `${baseUrl}/artistas/invitados/${ga.slug.current}`,
    lastModified: new Date(ga._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    ...staticPages,
    ...artistPages,
    ...exposicionPages,
    ...guestArtistPages,
  ]
}
