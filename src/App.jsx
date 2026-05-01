import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BackButton from './components/BackButton'
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
const TOKEN_STORAGE_KEY = 'uncle-bondq-token'
const initialCheckout = { phone: '', address: '', notes: '' }

const demoCategories = [
  { id: 'demo-cat-1', name: 'شوكولا', description: 'علب وهدايا شوكولا' },
  { id: 'demo-cat-2', name: 'ضيافة', description: 'اختيارات للمناسبات' },
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
    product_type_id: 'demo-type-1',
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
    product_type_id: 'demo-type-2',
    section_id: 'demo-section-2',
  },
]

const productSelect = `
  *,
  categories:category_id (id, name),
  product_types:type_id (id, name),
  sections:section_id (id, name, type_id)
`

const legacyProductSelect = `
  *,
  categories:category_id (id, name),
  product_types:product_type_id (id, name),
  sections:section_id (id, name, type_id)
`

const normalizeProduct = (product) => ({
  ...product,
  category_name: product.categories?.name || product.category_name || '',
  type_name: product.product_types?.name || product.type_name || '',
  type_id: product.type_id || product.product_type_id || product.product_types?.id || '',
  product_type_id: product.product_type_id || product.type_id || product.product_types?.id || '',
  section_name: product.sections?.name || product.section_name || '',
  section_id: product.section_id || product.sections?.id || '',
})

const normalizeProducts = (records = []) =>
  records.filter((product) => product.is_active !== false).map(normalizeProduct)

const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY) || ''

const ensureUserToken = () => {
  const existingToken = getStoredToken()
  if (existingToken) return existingToken

  const token = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  localStorage.setItem(TOKEN_STORAGE_KEY, token)

  return token
}

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [step, setStep] = useState('categories')
  const [categories, setCategories] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [sections, setSections] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [modalQuantity, setModalQuantity] = useState(1)
  const [checkout, setCheckout] = useState(initialCheckout)
  const [successOrder, setSuccessOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [error, setError] = useState('')
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  const isArabic = language === 'ar'
  const t = useCallback((key, values) => translate(language, key, values), [language])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
  }, [isArabic, language])

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

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
        let productsResult = await supabase.from('products').select(productSelect).order('created_at', { ascending: false })
        if (productsResult.error && /type_id|relationship|schema cache/i.test(productsResult.error.message || '')) {
          productsResult = await supabase.from('products').select(legacyProductSelect).order('created_at', { ascending: false })
        }

        const [categoriesResult, typesResult, sectionsResult] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('product_types').select('*').order('name'),
          supabase.from('sections').select('*').order('name'),
        ])

        if (categoriesResult.error) throw categoriesResult.error
        if (typesResult.error) throw typesResult.error
        if (sectionsResult.error) throw sectionsResult.error
        if (productsResult.error) throw productsResult.error

        setCategories(categoriesResult.data || [])
        setProductTypes(typesResult.data || [])
        setSections(sectionsResult.data || [])
        setProducts(normalizeProducts(productsResult.data || []))
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

  const relatedTypes = useMemo(() => {
    if (!selectedCategory) return productTypes
    const ids = new Set(products.filter((product) => product.category_id === selectedCategory.id).map((product) => product.type_id))
    const filtered = productTypes.filter((type) => ids.has(type.id))

    return filtered.length ? filtered : productTypes
  }, [productTypes, products, selectedCategory])

  const relatedSections = useMemo(() => {
    if (!selectedType) return []
    return sections.filter((section) => section.type_id === selectedType.id || section.product_type_id === selectedType.id)
  }, [sections, selectedType])

  const filteredProducts = useMemo(() => {
    if (step === 'allProducts') return products

    return products.filter((product) => {
      const categoryMatches = !selectedCategory || product.category_id === selectedCategory.id
      const typeMatches = !selectedType || product.type_id === selectedType.id
      const sectionMatches = !selectedSection || product.section_id === selectedSection.id

      return categoryMatches && typeMatches && sectionMatches
    })
  }, [products, selectedCategory, selectedSection, selectedType, step])

  const productTitle = step === 'allProducts' ? t('products.allTitle') : selectedSection?.name || selectedType?.name || t('products.allTitle')

  const goHome = () => {
    setSelectedCategory(null)
    setSelectedType(null)
    setSelectedSection(null)
    setSelectedProduct(null)
    setSuccessOrder(null)
    setIsMenuOpen(false)
    setStep('categories')
  }

  const navigateBack = () => {
    if (step === 'types') setStep('categories')
    if (step === 'sections') setStep('types')
    if (step === 'products') setStep('sections')
    if (step === 'allProducts') setStep('categories')
    if (step === 'cart') setStep('categories')
    if (step === 'checkout') setStep('cart')
    if (step === 'success') setStep('orders')
    if (step === 'orders' || step === 'admin') setStep('categories')
  }

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
          description: product.preview_description || product.description || '',
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

  const removeFromCart = (productId) => {
    setCart((items) => items.filter((item) => item.id !== productId))
  }

  const openProduct = (product) => {
    setModalQuantity(1)
    setSelectedProduct(product)
  }

  const fetchOrders = useCallback(async (admin = false) => {
    if (!isSupabaseConfigured) return

    setIsOrdersLoading(true)
    setError('')

    try {
      let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })

      if (!admin) {
        const token = getStoredToken()
        query = token ? query.eq('token', token) : query.eq('token', '__no_orders__')
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
  }, [t])

  const submitOrder = async (event) => {
    event.preventDefault()
    if (!cart.length || !isSupabaseConfigured) return

    setIsSubmitting(true)
    setError('')

    try {
      const token = ensureUserToken()
      const basePayload = {
        customer_name: '',
        phone: checkout.phone,
        address: checkout.address,
        notes: checkout.notes,
        total_amount: cartTotal,
        status: 'pending',
        token,
      }

      let orderResult = await supabase.from('orders').insert(basePayload).select('id, created_at').single()
      if (orderResult.error && /address|customer_name|schema cache/i.test(orderResult.error.message || '')) {
        const legacyPayload = {
          phone: basePayload.phone,
          notes: basePayload.notes,
          total_amount: basePayload.total_amount,
          status: basePayload.status,
          token: basePayload.token,
        }
        orderResult = await supabase
          .from('orders')
          .insert({ ...legacyPayload, delivery_address: checkout.address })
          .select('id, created_at')
          .single()
      }

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
        customer: checkout,
      })
      setCart([])
      setCheckout(initialCheckout)
      await fetchOrders(false)
      setStep('success')
    } catch (submitError) {
      setError(submitError.message || t('app.submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBottomNavigate = (target) => {
    setIsMenuOpen(false)
    if (target === 'categories') goHome()
    if (target === 'cart') setStep('cart')
    if (target === 'orders') {
      fetchOrders(false)
      setStep('orders')
    }
    if (target === 'allProducts') {
      setSelectedCategory(null)
      setSelectedType(null)
      setSelectedSection(null)
      setStep('allProducts')
    }
  }

  const activeNav = ['types', 'sections', 'products', 'categories'].includes(step) ? 'categories' : step

  return (
    <main className="store-shell" data-language={language}>
      <header className="topbar">
        <button className="brand-mark" type="button" onClick={goHome}>
          <span className="brand-icon" aria-hidden="true">◆</span>
          {t('app.brand')}
        </button>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-label={t('app.menu')}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={isMenuOpen ? 'topnav is-open' : 'topnav'} aria-label={t('app.menu')}>
          {step !== 'categories' && <BackButton onClick={navigateBack} t={t} />}
          <button
            className="nav-button"
            type="button"
            onClick={() => {
              fetchOrders(true)
              setStep('admin')
            }}
          >
            {t('app.admin')}
          </button>
          <button
            className="language-toggle"
            type="button"
            onClick={() => setLanguage((current) => (current === 'ar' ? 'en' : 'ar'))}
          >
            {isArabic ? t('app.languageEnglish') : t('app.languageArabic')}
          </button>
        </nav>
      </header>

      {error && <p className="notice notice-error">{error}</p>}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {step === 'categories' && (
            <CategoriesPage
              categories={categories}
              isLoading={isLoading}
              t={t}
              onSelect={(category) => {
                setSelectedCategory(category)
                setSelectedType(null)
                setSelectedSection(null)
                setStep('types')
              }}
            />
          )}

          {step === 'types' && (
            <ProductTypesPage
              productTypes={relatedTypes}
              isLoading={isLoading}
              t={t}
              onSelect={(type) => {
                setSelectedType(type)
                setSelectedSection(null)
                setStep('sections')
              }}
            />
          )}

          {step === 'sections' && (
            <SectionsPage
              sections={relatedSections}
              isLoading={isLoading}
              t={t}
              onSelect={(section) => {
                setSelectedSection(section)
                setStep('products')
              }}
            />
          )}

          {(step === 'products' || step === 'allProducts') && (
            <ProductsPage
              title={productTitle}
              products={filteredProducts}
              isLoading={isLoading}
              cartCount={cartCount}
              onOpenProduct={openProduct}
              onAddToCart={addToCart}
              onViewCart={() => setStep('cart')}
              t={t}
            />
          )}

          {step === 'cart' && (
            <CartPage
              cart={cart}
              t={t}
              cartTotal={cartTotal}
              onDecrease={(id) => updateQuantity(id, -1)}
              onIncrease={(id) => updateQuantity(id, 1)}
              onRemove={removeFromCart}
              onCheckout={() => setStep('checkout')}
              onContinue={goHome}
            />
          )}

          {step === 'checkout' && (
            <CheckoutPage
              checkout={checkout}
              t={t}
              setCheckout={setCheckout}
              cart={cart}
              cartTotal={cartTotal}
              isSubmitting={isSubmitting}
              onSubmit={submitOrder}
            />
          )}

          {step === 'success' && successOrder && <SuccessPage order={successOrder} t={t} onHome={goHome} />}

          {step === 'orders' && (
            <OrdersPage
              orders={orders}
              isLoading={isOrdersLoading}
              language={language}
              onRefresh={() => fetchOrders(false)}
              t={t}
            />
          )}

          {step === 'admin' && (
            <OrdersPage
              orders={allOrders}
              isLoading={isOrdersLoading}
              isAdmin
              language={language}
              onRefresh={() => fetchOrders(true)}
              t={t}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav active={activeNav} cartCount={cartCount} onNavigate={handleBottomNavigate} t={t} />

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
