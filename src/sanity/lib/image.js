import createImageUrlBuilder from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source) => {
  return builder.image(source)
}

export function cropToRect(image) {
  const crop = image?.crop
  const dims = image?.asset?.metadata?.dimensions
  if (!crop || !dims) return null
  const { width, height } = dims
  return {
    x: Math.round(crop.left * width),
    y: Math.round(crop.top * height),
    width: Math.round(width - (crop.left + crop.right) * width),
    height: Math.round(height - (crop.top + crop.bottom) * height),
  }
}

export function hotspotToObjectPosition(hotspot) {
  if (
    !hotspot ||
    typeof hotspot.x !== 'number' ||
    typeof hotspot.y !== 'number'
  ) {
    return 'center'
  }
  return `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`
}
