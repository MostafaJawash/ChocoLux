import PageIntro from '../components/PageIntro'
import ProductCard from '../components/ProductCard'

function FavoritesPage({
  products,
  favoriteIds,
  isLoggedIn,
  onLogin,
  onOpenProduct,
  onAddToCart,
  onToggleFavorite,
  t,
}) {
  if (!isLoggedIn) {
    return (
      <>
        <PageIntro eyebrow={t('steps.favorites')} title={t('favorites.title')} copy={t('favorites.profileCopy')} />
        <button className="primary-button narrow" type="button" onClick={onLogin}>
          {t('profile.title')}
        </button>
      </>
    )
  }

  return (
    <>
      <PageIntro eyebrow={t('steps.favorites')} title={t('favorites.title')} copy={t('favorites.copy')} />
      {products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              isFavorite={favoriteIds.includes(product.id)}
              onOpen={onOpenProduct}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              t={t}
            />
          ))}
        </div>
      ) : (
        <p className="notice">{t('favorites.empty')}</p>
      )}
    </>
  )
}

export default FavoritesPage
