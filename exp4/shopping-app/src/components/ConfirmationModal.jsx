import './ConfirmationModal.css'

const ConfirmationModal = ({ total, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h3>Confirm Purchase</h3>
        <p>Total Amount: ${total}</p>
        <p>Are you sure you want to place this order?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-btn">Yes, Buy Now</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
