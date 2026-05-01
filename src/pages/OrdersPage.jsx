import OrderSummaryTable from '../components/OrderSummaryTable'
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
  selectedOrderId,
  isLoading,
  isAdmin = false,
  language,
  phone = '',
  onPhoneChange = () => {},
  onRefresh,
  onOpenOrder,
  t,
}) {
  const selectedOrder = orders.find((order) => order.id === selectedOrderId)

  return (
    <>
      <PageIntro
        eyebrow={isAdmin ? t('steps.admin') : t('steps.orders')}
        title={isAdmin ? t('orders.adminTitle') : t('orders.title')}
        copy={isAdmin ? t('orders.adminCopy') : t('orders.copy')}
      />

      <div className="page-toolbar">
        <span>{orders.length}</span>
        <button className="secondary-button" type="button" onClick={onRefresh}>
          ↻ {t('orders.refresh')}
        </button>
      </div>

      {!isAdmin && (
        <label className="phone-filter">
          {t('orders.phoneFilter')}
          <input
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder={t('checkout.phonePlaceholder')}
          />
        </label>
      )}

      {selectedOrder && (
        <article className="order-details">
          <header>
            <div>
              <h2>{t('orders.details')}</h2>
              <p>{t('orders.date')}: {formatDate(selectedOrder.created_at, language)}</p>
            </div>
            <span>{t(`orders.status.${selectedOrder.status || 'new'}`)}</span>
          </header>
          <OrderSummaryTable
            items={selectedOrder.order_items || []}
            total={selectedOrder.total_amount}
            t={t}
          />
        </article>
      )}

      {isLoading ? (
        <div className="orders-list">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="order-card skeleton" key={index} />
          ))}
        </div>
      ) : orders.length ? (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <header>
                <div>
                  <strong>{money(order.total_amount)}</strong>
                  <small>{t('orders.date')}: {formatDate(order.created_at, language)}</small>
                </div>
                <span>{t(`orders.status.${order.status || 'new'}`)}</span>
              </header>

              <div className="order-meta">
                <p>{t('orders.phone')}: {order.phone}</p>
                <p>{t('orders.address')}: {order.address}</p>
                {order.notes && <p>{t('orders.notes')}: {order.notes}</p>}
              </div>

              <button className="secondary-button details-button" type="button" onClick={() => onOpenOrder(order.id)}>
                {t('orders.details')}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="notice">{t('orders.empty')}</p>
      )}
    </>
  )
}

export default OrdersPage
