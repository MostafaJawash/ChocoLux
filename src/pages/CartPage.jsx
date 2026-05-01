import CartItem from '../components/CartItem'
import PageIntro from '../components/PageIntro'
import { money } from '../utils/store'

function CartPage({ cart, cartTotal, onDecrease, onIncrease, onRemove, onCheckout, onContinue, t }) {
  return (
    <>
      <PageIntro
        eyebrow={t('steps.cart')}
        title={t('cart.title')}
        copy={t('cart.copy')}
      />

      {cart.length ? (
        <section className="cart-page-grid">
          <div className="cart-list">
            {cart.map((item) => (
              <CartItem
                item={item}
                key={item.id}
                onDecrease={onDecrease}
                onIncrease={onIncrease}
                onRemove={onRemove}
                t={t}
              />
            ))}
          </div>

          <aside className="summary-card">
            <span>{t('cart.total')}</span>
            <strong>{money(cartTotal)}</strong>
            <button className="primary-button" type="button" onClick={onCheckout}>
              {t('cart.checkout')}
            </button>
          </aside>
        </section>
      ) : (
        <section className="empty-state">
          <h2>{t('cart.emptyTitle')}</h2>
          <p>{t('cart.emptyCopy')}</p>
          <button className="primary-button narrow" type="button" onClick={onContinue}>
            {t('cart.continue')}
          </button>
        </section>
      )}
    </>
  )
}

export default CartPage
