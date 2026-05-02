import OrderSummaryTable from '../components/OrderSummaryTable'
import PageIntro from '../components/PageIntro'

const formatDate = (value, language) => {
  if (!value) return ''

  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SY' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function OrderDetailsPage({ order, isLoading, language, onRefresh, t }) {
  const finalAmount = Number(order?.final_amount)
  const discountAmount = Number(order?.discount_amount)
  const hasFinalAmount = Number.isFinite(finalAmount)
  const hasDiscount = Number.isFinite(discountAmount) && discountAmount > 0

  return (
    <>
      <PageIntro eyebrow={t('steps.orderDetails')} title={t('orders.details')} copy={t('orders.detailsCopy')} />
      <div className="page-toolbar">
        <span>{order?.id || ''}</span>
        <button className="secondary-button" type="button" onClick={onRefresh}>
          ↻ {t('orders.refresh')}
        </button>
      </div>
      {isLoading ? (
        <div className="order-details skeleton" />
      ) : order ? (
        <article className="order-details">
          <header>
            <div>
              <h2>{t('orders.details')}</h2>
              <p>{t('orders.date')}: {formatDate(order.created_at, language)}</p>
              {hasDiscount && <p>الخصم: {discountAmount.toLocaleString('ar-SY')} ل.س</p>}
              {hasFinalAmount && <p>المبلغ النهائي: {finalAmount.toLocaleString('ar-SY')} ل.س</p>}
            </div>
            <span>{t(`orders.status.${order.status || 'new'}`)}</span>
          </header>
          <OrderSummaryTable items={order.order_items || []} total={order.final_amount ?? order.total_amount} t={t} />
        </article>
      ) : (
        <p className="notice">{t('orders.notFound')}</p>
      )}
    </>
  )
}

export default OrderDetailsPage
