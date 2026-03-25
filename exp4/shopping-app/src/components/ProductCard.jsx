import { useContext, useCallback } from 'react'
import { CartContext } from '../context/CartContext'
import './ProductCard.css'

const ProductCard = ({ product, onAddToCart }) => {
  const { dispatch } = useContext(CartContext)
  
  const handleAddToCart = useCallback(() => {
    dispatch({ type: 'ADD_ITEM', payload: product })
    onAddToCart(product.name)
  }, [dispatch, product, onAddToCart])

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <button onClick={handleAddToCart} className="add-btn">
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard
