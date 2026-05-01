import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BottomNav from './components/BottomNav'
import ProductModal from './components/ProductModal'
import CartPage from './pages/CartPage'
import CategoriesPage from './pages/CategoriesPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import ProductTypesPage from './pages/ProductTypesPage'
import ProductsPage from './pages/ProductsPage'
import SectionsPage from './pages/SectionsPage'
import SuccessPage from './pages/SuccessPage'
import { getInitialLanguage, LANGUAGE_STORAGE_KEY, translate } from './i18n'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { getPriceAmount, getProductImages } from './utils/store'

const CART_STORAGE_KEY = 'uncle-bondq-cart'
const USER_ID_STORAGE_KEY = 'uncle-bondq-user-id'
const PHONE_STORAGE_KEY = 'uncle-bondq-phone'
const initialCheckout = { phone: '', address: '', notes: '' }

const demoCategories = [
  { id: 'demo-cat-1', name: 'شوكولا' },
  { id: 'demo-cat-2', name: 'ضيافة' },
]

const demoTypes = [
  { id: 'demo-type-1', name: 'علب شوكولا' },
  { id: 'demo-type-2', name: 'هدايا وضيافة' },
]

const demoSections = [
  { id: 'demo-section-1', name: 'فاخر', type_id: 'demo-type-1' },
  { id: 'demo-section-2', name: 'كلاسيك', type_id: 'demo-type-2' },
]

const demoProducts = [
  {
    id: 'demo-product-1',
    name: 'علبة بندق فاخرة',
    price: 150000,
    description: 'تشكيلة شوكولا بالحشوات الغنية.',
    weight: '500 غ',
    category_id: 'demo-cat-1',
    type_id: 'demo-type-1',
    section_id: 'demo-section-1',
  },
  {
    id: 'demo-product-2',
    name: 'ضيافة Uncle Bondq',
    price: 225000,
    description: 'قطع مرتبة للمناسبات والزيارات.',
    weight: '750 غ',
    category_id: 'demo-cat-2',
    type_id: 'demo-type-2',
    section_id: 'demo-section-2',
  },
]

const productColumns = 'id, name, price, description, weight, images, category_id, type_id, section_id'
const orderColumns =
  'id, customer_name, phone, address, notes, status, total_amount, created_at, order_items(id, order_id, product_id, product_name, quantity, unit_price, total_price)'

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

const getRoute = () => {
  const pathname = window.location.pathname.replace(basePath, '') || '/'
  return {
    pathname: pathname === '' ? '/' : pathname,
    search: new URLSearchParams(window.location.search),
  }
}

const getInitialRoute = () => {
  const redirect = new URLSearchParams(window.location.search).get('redirect')
  if (redirect) window.history.replaceState({}, '', makeUrl(redirect))

  return getRoute()
}

const makeUrl = (path, params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })

  return `${basePath}${path}${query.toString() ? `?${query}` : ''}`
}

const ensureUserId = () => {
  const existingUserId = localStorage.getItem(USER_ID_STORAGE_KEY)
  if (existingUserId) return existingUserId

  const userId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  localStorage.setItem(USER_ID_STORAGE_KEY, userId)

  return userId
}

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [route, setRoute] = useState(getInitialRoute)
  const [categories, setCategories] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [sections, setSections] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [modalQuantity, setModalQuantity] = useState(1)
  const [checkout, setCheckout] = useState(initialCheckout)
  const [successOrder, setSuccessOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [error, setError] = useState('')
  const [ordersPhone, setOrdersPhone] = useState(() => localStorage.getItem(PHONE_STORAGE_KEY) || '')
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  const isArabic = language === 'ar'
  const t = useCallback((key, values) => translate(language, key, values), [language])

  const navigate = useCallback((path, params = {}) => {
    const url = makeUrl(path, params)
    window.history.pushState({}, '', url)
    setRoute(getRoute())
    setIsDrawerOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
  }, [isArabic, language])

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    ensureUserId()
  }, [])

  useEffect(() => {
    localStorage.setItem(PHONE_STORAGE_KEY, ordersPhone.trim())
  }, [ordersPhone])

  useEffect(() => {
    async function loadStorefront() {
      if (!isSupabaseConfigured) {
        setCategories(demoCategories)
        setProductTypes(demoTypes)
        setSections(demoSections)
        setProducts(demoProducts)
        setError(t('app.configuredError'))
        setIsLoading(false)
        return
      }

      try {
        const [categoriesResult, typesResult, sectionsResult, productsResult] = await Promise.all([
          supabase.from('categories').select('id, name').order('name'),
          supabase.from('product_types').select('id, name').order('name'),
          supabase.from('sections').select('id, name, type_id').order('name'),
          supabase.from('products').select(productColumns),
        ])

        if (categoriesResult.error) throw categoriesResult.error
        if (typesResult.error) throw typesResult.error
        if (sectionsResult.error) throw sectionsResult.error
        if (productsResult.error) throw productsResult.error

        setCategories(categoriesResult.data || [])
        setProductTypes(typesResult.data || [])
        setSections(sectionsResult.data || [])
        setProducts(productsResult.data || [])
      } catch (requestError) {
        setError(requestError.message || t('app.loadError'))
      } finally {
        setIsLoading(false)
      }
    }

    loadStorefront()
  }, [t])

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart])
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + getPriceAmount(item.price) * item.quantity, 0),
    [cart],
  )

  const categoryId = route.search.get('category_id') || ''
  const typeId = route.search.get('type_id') || ''
  const sectionId = route.search.get('section_id') || ''
  const orderId = route.search.get('order_id') || ''

  const relatedTypes = useMemo(() => {
    if (!categoryId) return productTypes
    const ids = new Set(products.filter((product) => product.category_id === categoryId).map((product) => product.type_id))
    const filtered = productTypes.filter((type) => ids.has(type.id))
    return filtered.length ? filtered : productTypes
  }, [categoryId, productTypes, products])

  const relatedSections = useMemo(
    () => sections.filter((section) => !typeId || section.type_id === typeId),
    [sections, typeId],
  )

  const filteredProducts = useMemo(() => {
    if (route.pathname === '/all-products') return products

    return products.filter((product) => {
      const categoryMatches = !categoryId || product.category_id === categoryId
      const typeMatches = !typeId || product.type_id === typeId
      const sectionMatches = !sectionId || product.section_id === sectionId

      return categoryMatches && typeMatches && sectionMatches
    })
  }, [categoryId, products, route.pathname, sectionId, typeId])

  const productTitle = route.pathname === '/all-products' ? t('products.allTitle') : t('products.filteredTitle')

  const addToCart = useCallback((product, quantity = 1) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id)
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }

      return [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price || 0,
          description: product.description || '',
          weight: product.weight || '',
          image: getProductImages(product)[0] || '',
          quantity,
        },
      ]
    })
  }, [])

  const updateQuantity = (productId, delta) => {
    setCart((items) =>
      items
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const fetchOrders = useCallback(async (admin = false, phoneOverride = '') => {
    if (!isSupabaseConfigured) return

    setIsOrdersLoading(true)
    setError('')

    try {
      let query = supabase.from('orders').select(orderColumns).order('created_at', { ascending: false })

      if (!admin) {
        const phone = (phoneOverride || ordersPhone).trim()
        if (!phone) {
          setOrders([])
          setIsOrdersLoading(false)
          return
        }
        query = query.eq('phone', phone)
      }

      const { data, error: ordersError } = await query
      if (ordersError) throw ordersError

      if (admin) setAllOrders(data || [])
      else setOrders(data || [])
    } catch (requestError) {
      setError(requestError.message || t('app.loadError'))
    } finally {
      setIsOrdersLoading(false)
    }
  }, [ordersPhone, t])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (route.pathname === '/orders') fetchOrders(false)
      if (route.pathname === '/admin-orders') fetchOrders(true)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchOrders, route.pathname])

  const submitOrder = async (event) => {
    event.preventDefault()
    if (!cart.length || !isSupabaseConfigured) return

    setIsSubmitting(true)
    setError('')

    try {
      ensureUserId()
      const orderPayload = {
        customer_name: '',
        phone: checkout.phone,
        address: checkout.address,
        notes: checkout.notes,
        total_amount: cartTotal,
        status: 'pending',
      }

      const orderResult = await supabase.from('orders').insert(orderPayload).select('id, created_at').single()
      if (orderResult.error) throw orderResult.error

      const orderItems = cart.map((item) => ({
        order_id: orderResult.data.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: getPriceAmount(item.price),
        total_price: getPriceAmount(item.price) * item.quantity,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      setSuccessOrder({
        id: orderResult.data.id,
        items: cart,
        total: cartTotal,
        status: 'pending',
        created_at: orderResult.data.created_at,
      })
      setCart([])
      setCheckout(initialCheckout)
      setOrdersPhone(checkout.phone)
      await fetchOrders(false, checkout.phone)
      navigate('/orders', { order_id: orderResult.data.id })
    } catch (submitError) {
      setError(submitError.message || t('app.submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const navItems = [
    { path: '/', label: t('nav.home'), active: route.pathname === '/' },
    { path: '/cart', label: `${t('nav.cart')} (${cartCount})`, active: route.pathname === '/cart' },
    { path: '/orders', label: t('nav.orders'), active: route.pathname === '/orders' },
    { path: '/all-products', label: t('nav.all'), active: route.pathname === '/all-products' },
    { path: '/admin-orders', label: t('app.admin'), active: route.pathname === '/admin-orders' },
  ]

  const renderPage = () => {
    if (route.pathname === '/') {
      return (
        <CategoriesPage
          categories={categories}
          isLoading={isLoading}
          t={t}
          onSelect={(category) => navigate('/types', { category_id: category.id })}
        />
      )
    }

    if (route.pathname === '/types') {
      return (
        <ProductTypesPage
          productTypes={relatedTypes}
          isLoading={isLoading}
          t={t}
          onSelect={(type) => {
            sessionStorage.setItem('uncle-bondq-category-id', categoryId)
            navigate('/sections', { type_id: type.id })
          }}
        />
      )
    }

    if (route.pathname === '/sections') {
      return (
        <SectionsPage
          sections={relatedSections}
          isLoading={isLoading}
          t={t}
          onSelect={(section) =>
            navigate('/products', {
              category_id: categoryId || sessionStorage.getItem('uncle-bondq-category-id') || '',
              type_id: typeId,
              section_id: section.id,
            })
          }
        />
      )
    }

    if (route.pathname === '/products' || route.pathname === '/all-products') {
      return (
        <ProductsPage
          title={productTitle}
          products={filteredProducts}
          isLoading={isLoading}
          cartCount={cartCount}
          onOpenProduct={(product) => {
            setModalQuantity(1)
            setSelectedProduct(product)
          }}
          onAddToCart={addToCart}
          onViewCart={() => navigate('/cart')}
          t={t}
        />
      )
    }

    if (route.pathname === '/cart') {
      return (
        <CartPage
          cart={cart}
          t={t}
          cartTotal={cartTotal}
          onDecrease={(id) => updateQuantity(id, -1)}
          onIncrease={(id) => updateQuantity(id, 1)}
          onRemove={(id) => setCart((items) => items.filter((item) => item.id !== id))}
          onCheckout={() => navigate('/checkout')}
          onContinue={() => navigate('/')}
        />
      )
    }

    if (route.pathname === '/checkout') {
      return (
        <CheckoutPage
          checkout={checkout}
          t={t}
          setCheckout={setCheckout}
          cart={cart}
          cartTotal={cartTotal}
          isSubmitting={isSubmitting}
          onSubmit={submitOrder}
        />
      )
    }

    if (route.pathname === '/orders') {
      return (
        <OrdersPage
          orders={orders}
          selectedOrderId={orderId}
          isLoading={isOrdersLoading}
          language={language}
          phone={ordersPhone}
          onPhoneChange={setOrdersPhone}
          onRefresh={() => fetchOrders(false)}
          onOpenOrder={(id) => navigate('/orders', { order_id: id })}
          t={t}
        />
      )
    }

    if (route.pathname === '/admin-orders') {
      return (
        <OrdersPage
          orders={allOrders}
          selectedOrderId={orderId}
          isLoading={isOrdersLoading}
          isAdmin
          language={language}
          onRefresh={() => fetchOrders(true)}
          onOpenOrder={(id) => navigate('/admin-orders', { order_id: id })}
          t={t}
        />
      )
    }

    return (
      <SuccessPage
        order={successOrder || { id: '', items: [], total: 0 }}
        t={t}
        onHome={() => navigate('/')}
      />
    )
  }

  return (
    <main className="app-layout" data-language={language}>
      <aside className="sidebar">
        <button className="brand-link" type="button" onClick={() => navigate('/')}>
          <img src={`${basePath}/favicon.png`} alt="" />
          <span>{t('app.brand')}</span>
        </button>
        <nav>
          {navItems.map((item) => (
            <button
              className={item.active ? 'is-active' : ''}
              type="button"
              key={item.path}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="language-link" type="button" onClick={() => setLanguage((current) => (current === 'ar' ? 'en' : 'ar'))}>
          {isArabic ? t('app.languageEnglish') : t('app.languageArabic')}
        </button>
      </aside>

      <header className="mobile-header">
        <button className="drawer-toggle" type="button" onClick={() => setIsDrawerOpen(true)} aria-label={t('app.menu')}>
          ☰
        </button>
        <button className="brand-link" type="button" onClick={() => navigate('/')}>
          <img src={`${basePath}/favicon.png`} alt="" />
          <span>{t('app.brand')}</span>
        </button>
      </header>

      {isDrawerOpen && (
        <div className="drawer-layer" onClick={() => setIsDrawerOpen(false)}>
          <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <button className="brand-link" type="button" onClick={() => navigate('/')}>
              <img src={`${basePath}/favicon.png`} alt="" />
              <span>{t('app.brand')}</span>
            </button>
            {navItems.map((item) => (
              <button
                className={item.active ? 'is-active' : ''}
                type="button"
                key={item.path}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </aside>
        </div>
      )}

      <section className="content-shell">
        {error && <p className="notice notice-error">{error}</p>}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${route.pathname}${route.search.toString()}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </section>

      <BottomNav active={route.pathname} cartCount={cartCount} onNavigate={navigate} t={t} />

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            key={selectedProduct.id}
            product={selectedProduct}
            t={t}
            quantity={modalQuantity}
            setQuantity={setModalQuantity}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={(product, quantity) => {
              addToCart(product, quantity)
              setSelectedProduct(null)
            }}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
