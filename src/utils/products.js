export const API_URL = 'https://sheetdb.io/api/v1/rh6lkg8c6h3o9'

export const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#20100c"/>
          <stop offset="0.55" stop-color="#4a2619"/>
          <stop offset="1" stop-color="#c89b3c"/>
        </linearGradient>
      </defs>
      <rect width="900" height="700" fill="url(#bg)"/>
      <rect x="250" y="190" width="400" height="270" rx="34" fill="#150b08" opacity=".7"/>
      <path d="M292 265h316M292 350h316M450 215v220" stroke="#d6ae61" stroke-width="18" stroke-linecap="round" opacity=".85"/>
      <text x="450" y="545" text-anchor="middle" fill="#f5deb2" font-family="Georgia, serif" font-size="46">Choco Lux</text>
    </svg>
  `)

const DRIVE_FILE_ID_PATTERN =
  /(?:drive\.google\.com\/open\?id=|drive\.google\.com\/file\/d\/|drive\.google\.com\/uc\?(?:export=[^&]+&)?id=|[?&]id=)([^/?&#\s]+)/

const normalizeKey = (key) => String(key).trim().replace(/\s+/g, ' ')

const trimProductKeys = (product) =>
  Object.fromEntries(
    Object.entries(product).map(([key, value]) => [normalizeKey(key), value]),
  )

const readArabicField = (product, key) => {
  const normalizedProduct = trimProductKeys(product)
  return normalizedProduct[normalizeKey(key)] ?? ''
}

export const extractDriveFileId = (url = '') => {
  const rawUrl = String(url).trim()

  if (!rawUrl) return ''

  const match = rawUrl.match(DRIVE_FILE_ID_PATTERN) || rawUrl.match(/\/d\/([^/?&#\s]+)/)
  const fileId = decodeURIComponent(match?.[1] ?? '').trim()

  return /^[\w-]+$/.test(fileId) ? fileId : ''
}

export const getDriveImageUrl = (url = '') => {
  const fileId = extractDriveFileId(url)

  return fileId
    ? `https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}`
    : FALLBACK_IMAGE
}

export const toDirectDriveImage = getDriveImageUrl

export const normalizeProduct = (product, index) => {
  const normalizedProduct = trimProductKeys(product)
  const name = String(readArabicField(normalizedProduct, '1️⃣ اسم المنتج') ?? '').trim()
  const imageUrl = readArabicField(normalizedProduct, '5️⃣ صورة المنتج')
  const convertedImageUrl = getDriveImageUrl(imageUrl)

  console.debug('ChocoLux converted image URL:', convertedImageUrl)

  return {
    id: `${name || 'product'}-${index}`,
    name,
    price: String(readArabicField(normalizedProduct, '2️⃣ السعر') ?? '').trim(),
    description: String(readArabicField(normalizedProduct, '3️⃣ الوصف') ?? '').trim(),
    weight: String(readArabicField(normalizedProduct, '4️⃣ الوزن للقطعة') ?? '').trim(),
    image: convertedImageUrl,
    isBestSeller: index === 0,
  }
}
