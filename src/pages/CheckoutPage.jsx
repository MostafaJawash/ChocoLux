import OrderSummaryTable from '../components/OrderSummaryTable'
import PageIntro from '../components/PageIntro'

function CheckoutPage({ checkout, setCheckout, cart, cartTotal, isSubmitting, onSubmit, t }) {
  return (
    <>
      <PageIntro
        eyebrow={t('steps.checkout')}
        title={t('checkout.title')}
        copy={t('checkout.copy')}
      />

      <section className="checkout-grid">
        <form className="checkout-form panel" onSubmit={onSubmit}>
          <label>
            {t('checkout.phone')}
            <input
              required
              value={checkout.phone}
              onChange={(event) => setCheckout((value) => ({ ...value, phone: event.target.value }))}
              placeholder={t('checkout.phonePlaceholder')}
            />
          </label>
          <label>
            {t('checkout.address')}
            <textarea
              required
              value={checkout.address}
              onChange={(event) => setCheckout((value) => ({ ...value, address: event.target.value }))}
              placeholder={t('checkout.addressPlaceholder')}
            />
          </label>
          <label>
            {t('checkout.notes')}
            <textarea
              value={checkout.notes}
              onChange={(event) => setCheckout((value) => ({ ...value, notes: event.target.value }))}
              placeholder={t('checkout.notesPlaceholder')}
            />
          </label>
          <button className="primary-button" type="submit" disabled={!cart.length || isSubmitting}>
            {isSubmitting ? t('checkout.submitting') : t('checkout.submit')}
          </button>
        </form>

        <aside className="summary-card">
          <h2>{t('checkout.summary')}</h2>
          <OrderSummaryTable items={cart} total={cartTotal} t={t} />
        </aside>
      </section>
    </>
  )
}

export default CheckoutPage
