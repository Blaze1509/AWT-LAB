import './History.css'

const History = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null

  return (
    <div className="history-overlay">
      <div className="history">
        <div className="history-header">
          <h2>Purchase History</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        {orders.length === 0 ? (
          <p className="empty-history">No purchase history yet</p>
        ) : (
          <div className="history-items">
            {orders.map((order, index) => (
              <div key={index} className="order">
                <div className="order-header">
                  <h3>Order #{orders.length - index}</h3>
                  <span className="order-date">{order.date}</span>
                </div>
                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="order-item-details">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity} × ${item.price}</p>
                      </div>
                      <span className="item-total">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <strong>Total: ${order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default History
