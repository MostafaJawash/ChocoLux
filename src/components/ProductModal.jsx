import { memo, useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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

const ProductModal = memo(function ProductModal({ product, onClose }) {
  const [imageSrc, setImageSrc] = useState(product?.image || FALLBACK_IMAGE)

  useEffect(() => {
    setImageSrc(product?.image || FALLBACK_IMAGE)
  }, [product?.image])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [onClose])

  const handleImageError = useCallback(() => {
    setImageSrc(FALLBACK_IMAGE)
  }, [])

  return (
    <motion.div
      className="product-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product?.name || 'Chocolate product details'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className="product-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close product preview"
          onClick={onClose}
          className="product-modal-close"
        >
          ×
        </button>

        <div className="product-modal-media">
          <img
            src={imageSrc}
            alt={product?.name || 'Chocolate product'}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 60vw, 100vw"
            onError={handleImageError}
            className="product-modal-image"
          />
        </div>

        <div className="product-modal-content">
          <p className="product-modal-label">Chocolate details</p>
          <h2>{product?.name || 'شوكولا'}</h2>
          {product?.price && <p className="product-modal-price">{product.price}</p>}
          {product?.description && <p className="product-modal-description">{product.description}</p>}

          {product?.weight && (
            <div className="product-modal-detail">
              <span>Weight</span>
              <strong>{product.weight}</strong>
            </div>
          )}

          <a
            className="order-button order-button-modal"
            href={buildWhatsAppOrderUrl(product?.name)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Order ${product?.name || 'product'} on WhatsApp`}
          >
            اطلب الآن
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
})

export default ProductModal
