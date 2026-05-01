import { getPriceAmount, money } from '../utils/store'

function OrderSummaryTable({ items = [], total = 0, t }) {
  return (
    <div className="table-wrap">
      <table className="summary-table">
        <thead>
          <tr>
            <th>{t('summary.product')}</th>
            <th>{t('summary.qty')}</th>
            <th>{t('summary.price')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const price = item.total_price ?? getPriceAmount(item.price) * item.quantity

            return (
              <tr key={item.id || item.product_id}>
                <td>{item.product_name || item.name}</td>
                <td>{item.quantity}</td>
                <td>{money(price)}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">{t('cart.total')}</td>
            <td>{money(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default OrderSummaryTable
