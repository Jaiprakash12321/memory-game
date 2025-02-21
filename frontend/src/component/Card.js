import React from 'react';
import './Card.css';

function Card({ card, handleFlip, isFlipped }) {
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''}`}
      onClick={() => handleFlip(card)}
    >
      <div className="front">?</div>
      <div className="back">{card.icon}</div>
    </div>
  );
}

export default Card;
