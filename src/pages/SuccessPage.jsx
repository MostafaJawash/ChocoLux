import PageIntro from '../components/PageIntro'
import { getPriceAmount, money } from '../utils/store'

function SuccessPage({ order, onHome, t }) {
  return (
    <>
      <PageIntro
        eyebrow={t('steps.success')}
        title={t('success.title')}
        copy={t('success.copy')}
      />

      <section className="success-card">
        <span className="success-mark">✓</span>
        <h2>{t('success.summary')}</h2>
        <p>{t('success.orderId', { id: order.id })}</p>
        <div className="summary-list">
          {order.items.map((item) => (
            <div key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>{money(getPriceAmount(item.price) * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="total-row">
          <span>{t('cart.total')}</span>
          <strong>{money(order.total)}</strong>
        </div>
        <button className="primary-button narrow" type="button" onClick={onHome}>
          {t('success.home')}
        </button>
      </section>
    </>
  )
}

export default SuccessPage
