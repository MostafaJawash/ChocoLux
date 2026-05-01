import { useMemo, useState } from 'react'
import PageIntro from '../components/PageIntro'
import ProductCard from '../components/ProductCard'

function ProductsPage({
  title,
  products,
  isLoading,
  cartCount,
  onOpenProduct,
  onAddToCart,
  onViewCart,
  t,
}) {
  const [search, setSearch] = useState('')
  const visibleProducts = useMemo(
    () =>
      products.filter((product) =>
        [product.name, product.description, product.weight]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      ),
    [products, search],
  )

  return (
    <>
      <PageIntro
        eyebrow={t('steps.products')}
        title={t('products.title', { scope: title || t('products.allTitle') })}
        copy={t('products.copy')}
      />

      <div className="page-toolbar">
        <span>{t('products.count', { count: visibleProducts.length })}</span>
        <button className="secondary-button" type="button" onClick={onViewCart}>
          <span aria-hidden="true">◌</span>
          {t('products.viewCart', { count: cartCount })}
        </button>
      </div>

      <label className="search-field">
        {t('search.label')}
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('search.products')} />
      </label>

      {isLoading ? (
        <div className="product-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="product-card skeleton" key={index} />
          ))}
        </div>
      ) : visibleProducts.length ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              onOpen={onOpenProduct}
              onAddToCart={onAddToCart}
              t={t}
            />
          ))}
        </div>
      ) : (
        <p className="notice">{t('products.empty')}</p>
      )}
    </>
  )
}

export default ProductsPage
