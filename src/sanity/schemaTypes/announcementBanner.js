export default {
  name: 'announcementBanner',
  title: 'Announcement Banner',
  type: 'document',
  fields: [
    {
      name: 'message',
      title: 'Announcement Message',
      type: 'string',
      description: 'The message to display in the scrolling banner',
      validation: (Rule) => Rule.required().max(200)
    },
    {
      name: 'link',
      title: 'Link',
      type: 'object',
      description: 'Optional: Where should this announcement link to?',
      fields: [
        {
          name: 'linkType',
          title: 'Link Type',
          type: 'string',
          options: {
            list: [
              { title: 'Internal Page', value: 'internal' },
              { title: 'External URL', value: 'external' },
              { title: 'No Link', value: 'none' }
            ],
            layout: 'radio'
          },
          initialValue: 'none'
        },
        {
          name: 'internalLink',
          title: 'Internal Page',
          type: 'string',
          description: 'Select a page on your website',
          options: {
            list: [
              { title: 'Home', value: '/' },
              { title: 'Artists', value: '/artistas' },
              { title: 'About', value: '/about' }
            ]
          },
          hidden: ({ parent }) => parent?.linkType !== 'internal'
        },
        {
          name: 'artistLink',
          title: 'Link to Artist',
          type: 'reference',
          to: [{ type: 'artist' }],
          description: 'Or link to a specific artist page',
          hidden: ({ parent }) => parent?.linkType !== 'internal'
        },
        {
          name: 'externalUrl',
          title: 'External URL',
          type: 'url',
          description: 'Full URL including https://',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https', 'mailto', 'tel']
            }),
          hidden: ({ parent }) => parent?.linkType !== 'external'
        }
      ]
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Turn the announcement banner on or off',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'message',
      isActive: 'isActive'
    },
    prepare({ title, isActive }) {
      return {
        title: title || 'No message',
        subtitle: isActive ? '✓ Active' : '✗ Inactive'
      }
    }
  }
}
