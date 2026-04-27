import { memo, useEffect, useState } from 'react'

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#160907"/>
          <stop offset="0.6" stop-color="#3a1d14"/>
          <stop offset="1" stop-color="#b88a35"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#g)"/>
      <rect x="245" y="165" width="310" height="205" rx="26" fill="#120706" opacity=".75"/>
      <path d="M290 235h220M290 302h220M400 190v170" stroke="#e0bc72" stroke-width="15" stroke-linecap="round" opacity=".85"/>
      <text x="400" y="460" text-anchor="middle" fill="#f6e2bd" font-family="Georgia, serif" font-size="38">ChocoLux</text>
    </svg>
  `)

const buildWhatsAppOrderUrl = (productName = '') => {
  const message = `بدي أطلب ${productName || 'هذا المنتج'}`

  return `https://wa.me/963934307797?text=${encodeURIComponent(message)}`
}

const ProductCard = memo(function ProductCard({ product, onSelect }) {
  const safeImage = product?.image?.trim() || FALLBACK_IMAGE
  const [imageSrc, setImageSrc] = useState(safeImage)
  const [isImageLoading, setIsImageLoading] = useState(Boolean(product?.image?.trim()))

  useEffect(() => {
    const nextImage = product?.image?.trim() || FALLBACK_IMAGE
    setImageSrc(nextImage)
    setIsImageLoading(nextImage !== FALLBACK_IMAGE)
  }, [product?.image])

  const openProduct = () => {
    onSelect?.(product)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProduct()
    }
  }

  const handleOrderClick = (event) => {
    event.stopPropagation()
  }

  return (
    <article
      className="product-card"
      role="button"
      tabIndex={0}
      onClick={openProduct}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${product?.name || 'chocolate product'}`}
    >
      <div className="product-image-wrap">
        {isImageLoading && (
          <div className="image-loader" aria-label="Loading product image">
            <span />
          </div>
        )}

        <img
          className="product-image"
          src={imageSrc}
          alt={product?.name || 'Chocolate product'}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            setImageSrc(FALLBACK_IMAGE)
            setIsImageLoading(false)
          }}
        />
      </div>

      <div className="product-content">
        <div className="product-header">
          <h2>{product?.name || 'Unnamed product'}</h2>
          {product?.price && <span className="product-price">{product.price}</span>}
        </div>

        {product?.description && <p className="product-description">{product.description}</p>}

        {product?.weight && <p className="product-weight">{product.weight}</p>}

        <div className="product-card-actions">
          <a
            className="order-button order-button-card"
            href={buildWhatsAppOrderUrl(product?.name)}
            target="_blank"
            rel="noreferrer"
            onClick={handleOrderClick}
            aria-label={`Order ${product?.name || 'product'} on WhatsApp`}
          >
            اطلب الآن
          </a>
          <span className="product-card-action">View details</span>
        </div>
      </div>
    </article>
  )
})

export default ProductCard
