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
  return (
    <>
      <PageIntro
        eyebrow={t('steps.products')}
        title={t('products.title', { scope: title || t('products.allTitle') })}
        copy={t('products.copy')}
      />

      <div className="page-toolbar">
        <span>{t('products.count', { count: products.length })}</span>
        <button className="secondary-button" type="button" onClick={onViewCart}>
          <span aria-hidden="true">◌</span>
          {t('products.viewCart', { count: cartCount })}
        </button>
      </div>

      {isLoading ? (
        <div className="product-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="product-card skeleton" key={index} />
          ))}
        </div>
      ) : products.length ? (
        <div className="product-grid">
          {products.map((product) => (
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
