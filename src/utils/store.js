export const money = (value) => {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'string' && Number.isNaN(Number(value))) return value

  return `${Number(value).toLocaleString('ar-SY')} ل.س`
}

export const getPriceAmount = (value) => {
  if (typeof value === 'number') return value

  const parsed = Number(String(value || '').replace(/[^\d.]/g, ''))

  return Number.isFinite(parsed) ? parsed : 0
}

export const normalizeKey = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\//g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 640%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%22 x2=%221%22 y1=%220%22 y2=%221%22%3E%3Cstop stop-color=%22%23211814%22/%3E%3Cstop offset=%22.58%22 stop-color=%22%23513127%22/%3E%3Cstop offset=%221%22 stop-color=%22%23b48a52%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22800%22 height=%22640%22 fill=%22url(%23g)%22/%3E%3Ccircle cx=%22400%22 cy=%22276%22 r=%2296%22 fill=%22%23f0d08a%22 opacity=%22.28%22/%3E%3Cpath d=%22M282 384h236v36H282zM326 332h148v32H326z%22 fill=%22%23fff8ea%22 opacity=%22.76%22/%3E%3Ctext x=%22400%22 y=%22484%22 fill=%22%23fff8ea%22 font-family=%22Georgia,serif%22 font-size=%2246%22 text-anchor=%22middle%22%3EUncle Bondq%3C/text%3E%3C/svg%3E'

const parseImageList = (images) => {
  try {
    const parsedImages = Array.isArray(images) ? images : JSON.parse(images || '[]')

    return Array.isArray(parsedImages) ? parsedImages : []
  } catch {
    return []
  }
}

export const getProductImages = (product = {}) => {
  const imageList = parseImageList(product.images)
  const allImages = imageList
    .filter((image) => typeof image === 'string')
    .map((image) => image.trim())
    .filter(Boolean)

  const uniqueImages = [...new Set(allImages)]

  return uniqueImages.length ? uniqueImages : [PLACEHOLDER_IMAGE]
}

export const fallbackOccasionText = (name = 'Occasion') => {
  const key = normalizeKey(name)
  const copy = {
    wedding: 'Elegant favors and refined celebration sets',
    birthday: 'Sweet gifts for joyful moments',
    anniversary: 'Timeless chocolate gestures for special milestones',
    'new-baby': 'Soft, memorable pieces for welcoming days',
  }

  return copy[key] || 'Premium selections for meaningful occasions'
}
