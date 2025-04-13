import React from 'react';

function CartItem({ cart, emoji }) {
  return (
    <div
      className="cart-icon"
      style={{
        position: 'absolute',
        left: `${cart.x}px`,
        top: `${cart.y}px`,
        fontSize: `${cart.size}px`,
        opacity: cart.opacity,
        transform: `rotate(${cart.rotation}deg)`,
        transition: 'transform 0.1s ease-out',
        pointerEvents: 'none',
        color: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      {emoji}
    </div>
  );
}

export default CartItem; 