function BottomNav({ active, cartCount, onNavigate, t }) {
  const items = [
    { path: '/favorites', label: t('nav.favorites'), icon: '♡' },
    { path: '/products', label: t('nav.products'), icon: '▦' },
    { path: '/', label: t('nav.home'), icon: '⌂', isHome: true },
    { path: '/orders', label: t('nav.orders'), icon: '✓' },
    { path: '/cart', label: t('nav.cart'), icon: '◌', badge: cartCount },
  ]

  return (
    <nav className="bottom-nav" aria-label={t('app.menu')}>
      {items.map((item) => (
        <button
          className={[active === item.path ? 'is-active' : '', item.isHome ? 'home-nav-item' : ''].filter(Boolean).join(' ')}
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
