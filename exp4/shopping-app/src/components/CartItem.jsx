import { useContext, useCallback } from 'react'
import { CartContext } from '../context/CartContext'
import './CartItem.css'

const CartItem = ({ item }) => {
  const { dispatch } = useContext(CartContext)

  const handleQuantityChange = useCallback((quantity) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: item.id })
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity } })
    }
  }, [dispatch, item.id])

  const handleRemove = useCallback(() => {
    dispatch({ type: 'REMOVE_ITEM', payload: item.id })
  }, [dispatch, item.id])

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <div className="item-details">
        <h4>{item.name}</h4>
        <p>${item.price}</p>
      </div>
      <div className="quantity-controls">
        <button onClick={() => handleQuantityChange(item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => handleQuantityChange(item.quantity + 1)}>+</button>
      </div>
      <button onClick={handleRemove} className="remove-btn">
        Remove
      </button>
    </div>
  )
}

export default CartItem
