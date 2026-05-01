function BottomNav({ active, cartCount, onNavigate, t }) {
  const items = [
    { key: 'categories', label: t('nav.home'), icon: '⌂' },
    { key: 'cart', label: t('nav.cart'), icon: '◌', badge: cartCount },
    { key: 'orders', label: t('nav.orders'), icon: '✓' },
    { key: 'allProducts', label: t('nav.all'), icon: '▦' },
  ]

  return (
    <nav className="bottom-nav" aria-label={t('app.menu')}>
      {items.map((item) => (
        <button
          className={active === item.key ? 'is-active' : ''}
          type="button"
          key={item.key}
          onClick={() => onNavigate(item.key)}
        >
          <span aria-hidden="true">{item.icon}</span>
          <small>{item.label}</small>
          {item.badge > 0 && <b>{item.badge}</b>}
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
