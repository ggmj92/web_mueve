export default function robots() {
  const baseUrl = 'https://muevegaleria.com' // Replace with your actual domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
