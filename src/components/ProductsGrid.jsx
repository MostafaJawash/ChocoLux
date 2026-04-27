import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'

const API_URL = 'https://sheetdb.io/api/v1/rh6lkg8c6h3o9'

const normalizeKey = (key) => String(key).trim().replace(/\s+/g, ' ')

const normalizeRow = (row) => {
  const normalized = Object.fromEntries(
    Object.entries(row || {}).map(([key, value]) => [normalizeKey(key), value]),
  )

  const read = (key) => String(normalized[normalizeKey(key)] ?? '').trim()

  return {
    name: read('1️⃣ اسم المنتج'),
    price: read('2️⃣ السعر'),
    description: read('3️⃣ الوصف'),
    weight: read('4️⃣ الوزن للقطعة'),
    image: read('5️⃣ صورة المنتج'),
  }
}

function ProductsGrid({ searchQuery, onSearchChange }) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        setError('')
        const response = await fetch(API_URL, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Products request failed with ${response.status}`)
        }

        const data = await response.json()
        setProducts(Array.isArray(data) ? data.map(normalizeRow) : [])
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Unable to load products. Please try again shortly.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => controller.abort()
  }, [])

  const visibleProducts = useMemo(
    () => products.filter((product) => product.name || product.image),
    [products],
  )
  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase()

    if (!normalizedQuery) return visibleProducts

    return visibleProducts.filter((product) =>
      product.name.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [searchQuery, visibleProducts])

  const searchControl = (
    <div className="products-toolbar">
      <div>
        <p className="section-label">Collection</p>
        <h2>Explore our chocolates</h2>
      </div>

      <label className="search-field">
        <span className="search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
          </svg>
        </span>
        <span className="sr-only">Search products by name</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search chocolates"
          autoComplete="off"
        />
      </label>
    </div>
  )

  if (isLoading) {
    return (
      <section className="products-section" aria-busy="true">
        {searchControl}
        <div className="products-grid">
          {Array.from({ length: 8 }, (_, index) => (
            <div className="product-card product-card-skeleton" key={index}>
              <div className="skeleton-image" />
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-short" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="products-section">
        {searchControl}
        <p className="products-message">{error}</p>
      </section>
    )
  }

  if (visibleProducts.length === 0) {
    return (
      <section className="products-section">
        {searchControl}
        <p className="products-message">No products available.</p>
      </section>
    )
  }

  return (
    <section className="products-section">
      {searchControl}

      {filteredProducts.length === 0 ? (
        <p className="products-message">No chocolates match your search.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard
              product={product}
              onSelect={setSelectedProduct}
              key={`${product.name}-${product.image}-${index}`}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProductsGrid
