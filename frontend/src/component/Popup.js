import React from 'react';
import './Popup.css';

function Popup({ children, onClose }) {
  return (
    <div className="popup">
      <div className="popup-content">
        {children}
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Popup;
