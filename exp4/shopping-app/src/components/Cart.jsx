import { useState, useContext, useMemo } from 'react'
import { CartContext } from '../context/CartContext'
import CartItem from './CartItem'
import ConfirmationModal from './ConfirmationModal'
import './Cart.css'

const Cart = ({ isOpen, onClose, onPurchase }) => {
  const { cart, dispatch } = useContext(CartContext)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, [cart])

  const handleBuy = () => {
    setShowConfirmation(true)
  }

  const confirmPurchase = () => {
    onPurchase(cart, total)
    dispatch({ type: 'CLEAR_CART' })
    setShowConfirmation(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="cart-overlay">
      <div className="cart">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <div className="cart-footer">
              <div className="total">
                <strong>Total: ${total}</strong>
              </div>
              <button onClick={handleBuy} className="buy-btn">
                Buy Now
              </button>
            </div>
          </>
        )}
        
        {showConfirmation && (
          <ConfirmationModal 
            total={total}
            onConfirm={confirmPurchase}
            onCancel={() => setShowConfirmation(false)}
          />
        )}
      </div>
    </div>
  )
}

export default Cart
