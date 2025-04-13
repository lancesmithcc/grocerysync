import React, { useState, useEffect } from 'react';

function CartItem({ cart, emoji }) {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  const cartColors = [
    'rgba(255, 255, 255, 0.6)',
    'rgba(220, 220, 255, 0.7)',
    'rgba(255, 220, 220, 0.7)',
    'rgba(220, 255, 220, 0.7)'
  ];
  
  // Get a consistent color based on cart ID
  const cartColor = cartColors[cart.id % cartColors.length];
  
  // Handle interaction without interfering with scrolling
  const handleTouchStart = (e) => {
    // On mobile, don't handle touch events to prioritize scrolling
    if (!isMobile) {
      setHovered(true);
    }
    // Don't prevent default behavior to allow scrolling
  };
  
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
        pointerEvents: isMobile ? 'none' : 'auto', // Disable pointer events on mobile
        color: hovered ? 'rgba(255, 255, 255, 0.9)' : cartColor,
        textShadow: hovered ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
        userSelect: 'none',
        cursor: isMobile ? 'default' : 'pointer',
        zIndex: hovered ? 10 : 1,
        touchAction: 'none' // Prevent this element from handling touch events
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={() => setHovered(false)}
    >
      {emoji}
    </div>
  );
}

export default CartItem; 