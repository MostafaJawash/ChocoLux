function BottomNav({ active, cartCount, onNavigate, t }) {
  const items = [
    { path: '/', label: t('nav.home'), icon: '⌂' },
    { path: '/cart', label: t('nav.cart'), icon: '◌', badge: cartCount },
    { path: '/orders', label: t('nav.orders'), icon: '✓' },
    { path: '/favorites', label: t('nav.favorites'), icon: '♥' },
  ]

  return (
    <nav className="bottom-nav" aria-label={t('app.menu')}>
      {items.map((item) => (
        <button
          className={active === item.path ? 'is-active' : ''}
          type="button"
          key={item.path}
          onClick={() => onNavigate(item.path)}
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
