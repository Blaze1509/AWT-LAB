import { useMemo, useContext } from 'react'
import { CartContext } from '../context/CartContext'
import './Header.css'

const Header = ({ searchTerm, onSearchChange, onCartClick, onHistoryClick }) => {
  const { cart } = useContext(CartContext)

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }, [cart])

  return (
    <header className="header">
      <h1>TechStore</h1>
      <div className="header-controls">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <button 
          onClick={onHistoryClick} 
          className="cart-btn"
        >
          History
        </button>
        <button 
          onClick={onCartClick} 
          className="cart-btn"
        >
          Cart ({cartItemCount})
        </button>
      </div>
    </header>
  )
}

export default Header
