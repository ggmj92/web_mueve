import createImageUrlBuilder from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source) => {
  return builder.image(source)
}

export function hotspotToObjectPosition(hotspot) {
  if (!hotspot || typeof hotspot.x !== 'number' || typeof hotspot.y !== 'number') {
    return 'center'
  }
  return `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`
}
