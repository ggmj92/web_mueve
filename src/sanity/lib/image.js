import createImageUrlBuilder from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source) => {
  return builder.image(source)
}

/**
 * Convert a Sanity hotspot {x, y} (0–1 range) to a CSS object-position string.
 * Useful when an image is displayed with object-fit:cover and you want the
 * visible area centered on the hotspot the user chose in Sanity Studio.
 */
export const hotspotToObjectPosition = (hotspot) => {
  if (!hotspot) return 'center center'
  const x = Math.round((hotspot.x ?? 0.5) * 100)
  const y = Math.round((hotspot.y ?? 0.5) * 100)
  return `${x}% ${y}%`
}
