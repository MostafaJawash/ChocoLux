import { useState } from 'react'
import ProductsGrid from './components/ProductsGrid'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <main className="app-shell">
      <section className="hero-section">
        <h1>شوكولا | ChocoLux</h1>
        <p className="hero-copy">Fresh chocolate collections from our latest product sheet.</p>
      </section>

      <ProductsGrid searchQuery={searchQuery} onSearchChange={setSearchQuery} />
    </main>
  )
}

export default App
