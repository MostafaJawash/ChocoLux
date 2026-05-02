import PageIntro from '../components/PageIntro'
import { money } from '../utils/store'

const formatDate = (value, language) => {
  if (!value) return ''

  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SY' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function OrdersPage({
  orders,
  isLoading,
  language,
  isLoggedIn,
  onProfile,
  onRefresh,
  onOpenOrder,
  t,
}) {
  const toAmount = (value) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  const renderPriceLine = (label, value) => {
    if (value === null) return null

    return (
      <p>
        {label}: {money(value)}
      </p>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        <PageIntro eyebrow={t('steps.orders')} title={t('orders.title')} copy={t('orders.profileCopy')} />
        <button className="primary-button narrow" type="button" onClick={onProfile}>
          {t('profile.title')}
        </button>
      </>
    )
  }

  return (
    <>
      <PageIntro
        eyebrow={t('steps.orders')}
        title={t('orders.title')}
        copy={t('orders.copy')}
      />

      <div className="page-toolbar">
        <span>{orders.length}</span>
        <button className="secondary-button" type="button" onClick={onRefresh}>
          ↻ {t('orders.refresh')}
        </button>
      </div>

      {isLoading ? (
        <div className="orders-list">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="order-card skeleton" key={index} />
          ))}
        </div>
      ) : orders.length ? (
        <div className="orders-list">
          {orders.map((order) => {
            const totalAmount = toAmount(order.total_amount)
            const finalAmount = toAmount(order.final_amount)
            const discountAmount = toAmount(order.discount_amount)

            return (
              <article className="order-card" key={order.id}>
              <header>
                <div>
                  <strong>{money(finalAmount ?? order.total_amount)}</strong>
                  <small>{t('orders.date')}: {formatDate(order.created_at, language)}</small>
                </div>
                <span>{t(`orders.status.${order.status || 'new'}`)}</span>
              </header>

              <div className="order-meta">
                <p>{t('orders.phone')}: {order.phone}</p>
                <p>{t('orders.address')}: {order.address}</p>
                <div className="order-price-breakdown">
                  {renderPriceLine('السعر الكلي', totalAmount)}
                  {discountAmount !== null && discountAmount > 0 && renderPriceLine('الخصم', discountAmount)}
                  {renderPriceLine('السعر بعد الخصم', finalAmount)}
                </div>
                {order.notes && <p>{t('orders.notes')}: {order.notes}</p>}
              </div>

              <button className="secondary-button details-button" type="button" onClick={() => onOpenOrder(order.id)}>
                {t('orders.details')}
              </button>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="notice">{t('orders.empty')}</p>
      )}
    </>
  )
}

export default OrdersPage
