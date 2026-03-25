import { useState, useMemo, useCallback } from 'react'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import History from './components/History'
import Toast from './components/Toast'
import { products } from './data/products'
import './App.css'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [orders, setOrders] = useState([])

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleAddToCart = useCallback((productName) => {
    setToastMessage(`${productName} added to cart!`)
  }, [])

  const handlePurchase = useCallback((cartItems, total) => {
    const newOrder = {
      items: cartItems,
      total: total,
      date: new Date().toLocaleString()
    }
    setOrders(prev => [newOrder, ...prev])
    setToastMessage('Order placed successfully!')
  }, [])

  return (
    <CartProvider>
      <div className="app">
        <Header 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCartClick={() => setIsCartOpen(true)}
          onHistoryClick={() => setIsHistoryOpen(true)}
        />

        <main className="main">
          <ProductList products={filteredProducts} onAddToCart={handleAddToCart} />
        </main>

        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          onPurchase={handlePurchase}
        />

        <History 
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          orders={orders}
        />

        {toastMessage && (
          <Toast 
            message={toastMessage} 
            onClose={() => setToastMessage('')} 
          />
        )}
      </div>
    </CartProvider>
  )
}

export default App
