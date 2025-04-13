import { useRef, useState, useEffect } from 'react';
import useCartAnimation from '../hooks/useCartAnimation';
import useMouseInteraction from '../hooks/useMouseInteraction';
import CartItem from './CartItem';

function CartAnimation() {
  const containerRef = useRef(null);
  const { carts, CART_EMOJI, getEmojiForCart } = useCartAnimation();
  const [cartsState, setCartsState] = useState(carts);
  const [enableInteraction, setEnableInteraction] = useState(false); // Default to disabled on mobile
  
  // Initialize mouse interaction
  useMouseInteraction(setCartsState);
  
  // Update state when carts change
  useEffect(() => {
    setCartsState(carts);
  }, [carts]);
  
  // Handle interaction without disrupting scrolling
  useEffect(() => {
    // Detect if device is mobile
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // On mobile devices, disable interaction by default to prioritize scrolling
    if (isMobileDevice) {
      setEnableInteraction(false);
    } else {
      setEnableInteraction(true);
    }
    
    const handleTouchStart = () => {
      // On mobile, don't enable interaction on touch to prioritize scrolling
      if (!isMobileDevice) {
        setEnableInteraction(true);
      }
    };
    
    const handleScroll = () => {
      // When user is scrolling, always disable animation interaction
      setEnableInteraction(false);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);
  
  return (
    <div 
      className="cart-animation-container" 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: enableInteraction ? 'auto' : 'none',
        overflow: 'hidden',
        touchAction: 'none' // Prevent this container from handling touch events
      }}
    >
      {carts.map(cart => (
        <CartItem 
          key={cart.id} 
          cart={cart} 
          emoji={getEmojiForCart(cart)}
        />
      ))}
    </div>
  );
}

export default CartAnimation; 