import React from 'react';

function DeleteConfirmation(props) {
  const { showConfirmation, handleDelete, handleClose, handleConfirm } = props;

  return (
    <div className="delete-confirmation">
      <div className="delete-btn">
        <button type="button" onClick={handleDelete}>Delete</button>
      </div>
      {showConfirmation && (
        <div className="confirmation-content">
          <div className="close-confirmation">
            <span className="material-symbols-outlined" onClick={handleClose}>close</span>
          </div>
          <p>Are you sure you want to delete this task? It's irreversible.</p>
          <div className="confirmation-buttons">
            <div>
              <button type="button" onClick={handleConfirm}>Confirm</button>
            </div>
            <div className="cancel-btn">
              <button type="button" onClick={handleClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteConfirmation;
