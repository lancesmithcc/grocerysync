import { useRef, useState } from 'react';
import useCartAnimation from '../hooks/useCartAnimation';
import useMouseInteraction from '../hooks/useMouseInteraction';
import CartItem from './CartItem';

function CartAnimation() {
  const containerRef = useRef(null);
  const { carts, CART_EMOJI } = useCartAnimation();
  const [cartsState, setCartsState] = useState(carts);
  
  // Initialize mouse interaction
  useMouseInteraction(setCartsState);
  
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
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {carts.map(cart => (
        <CartItem 
          key={cart.id} 
          cart={cart} 
          emoji={CART_EMOJI} 
        />
      ))}
    </div>
  );
}

export default CartAnimation; 