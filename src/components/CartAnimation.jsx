import { useRef, useState, useEffect } from 'react';
import useCartAnimation from '../hooks/useCartAnimation';
import useMouseInteraction from '../hooks/useMouseInteraction';
import CartItem from './CartItem';

function CartAnimation() {
  const containerRef = useRef(null);
  const { carts, CART_EMOJI, getEmojiForCart } = useCartAnimation();
  const [cartsState, setCartsState] = useState(carts);
  const [enableInteraction, setEnableInteraction] = useState(true);
  
  // Initialize mouse interaction
  useMouseInteraction(setCartsState);
  
  // Update state when carts change
  useEffect(() => {
    setCartsState(carts);
  }, [carts]);
  
  // Handle interaction without disrupting scrolling
  useEffect(() => {
    const handleTouchStart = () => {
      setEnableInteraction(true);
    };
    
    const handleScroll = () => {
      // We no longer disable interaction during scroll
      // This allows normal scrolling behavior
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      clearTimeout(window.scrollTimeout);
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
        overflow: 'hidden'
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