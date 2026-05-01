import PageIntro from '../components/PageIntro'
import { money } from '../utils/store'

const formatDate = (value, language) => {
  if (!value) return ''

  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SY' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function OrdersPage({ orders, isLoading, isAdmin = false, language, onRefresh, t }) {
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
                <p>{t('orders.address')}: {order.address || order.delivery_address}</p>
                {order.notes && <p>{t('orders.notes')}: {order.notes}</p>}
              </div>

              <div className="order-items">
                <b>{t('orders.items')}</b>
                {(order.order_items || []).map((item) => (
                  <div key={item.id || item.product_id}>
                    <span>{item.product_name} × {item.quantity}</span>
                    <strong>{money(item.total_price)}</strong>
                  </div>
                ))}
              </div>
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
