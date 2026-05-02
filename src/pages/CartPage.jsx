import CartItem from '../components/CartItem'
import PageIntro from '../components/PageIntro'
import { money } from '../utils/store'

function CartPage({
  cart,
  cartTotal,
  couponCode,
  couponDiscount,
  discountedTotal,
  onCouponChange,
  onDecrease,
  onIncrease,
  onRemove,
  onCheckout,
  onContinue,
  t,
}) {
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
            <label className="coupon-field">
              {t('coupon.label')}
              <input
                value={couponCode}
                onChange={(event) => onCouponChange(event.target.value)}
                placeholder={t('coupon.placeholder')}
              />
            </label>
            {couponDiscount > 0 && (
              <div className="total-row">
                <span>{t('coupon.discount')}</span>
                <strong>-{money(couponDiscount)}</strong>
              </div>
            )}
            <div className="total-row final-total">
              <span>{t('coupon.after')}</span>
              <strong>{money(discountedTotal)}</strong>
            </div>
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
