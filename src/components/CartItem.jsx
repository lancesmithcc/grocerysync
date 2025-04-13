import React, { useState } from 'react';

function CartItem({ cart, emoji }) {
  const [hovered, setHovered] = useState(false);
  
  const cartColors = [
    'rgba(255, 255, 255, 0.6)',
    'rgba(220, 220, 255, 0.7)',
    'rgba(255, 220, 220, 0.7)',
    'rgba(220, 255, 220, 0.7)'
  ];
  
  // Get a consistent color based on cart ID
  const cartColor = cartColors[cart.id % cartColors.length];
  
  return (
    <div
      className="cart-icon"
      style={{
        position: 'absolute',
        left: `${cart.x}px`,
        top: `${cart.y}px`,
        fontSize: `${cart.size}px`,
        opacity: hovered ? Math.min(1, cart.opacity + 0.2) : cart.opacity,
        transform: `rotate(${cart.rotation}deg) scale(${hovered ? 1.2 : 1})`,
        transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
        pointerEvents: 'auto',
        color: hovered ? 'rgba(255, 255, 255, 0.9)' : cartColor,
        textShadow: hovered ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
        userSelect: 'none',
        cursor: 'pointer',
        zIndex: hovered ? 10 : 1
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {emoji}
    </div>
  );
}

export default CartItem; 