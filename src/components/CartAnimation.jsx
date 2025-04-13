import { useEffect, useState, useRef } from 'react';

const CART_COUNT = 15;
const CART_EMOJI = '🛒';

function CartAnimation() {
  const [carts, setCarts] = useState([]);
  const containerRef = useRef(null);
  
  // Generate initial cart positions on mount
  useEffect(() => {
    console.log('Initializing cart animations');
    const initialCarts = [];
    
    for (let i = 0; i < CART_COUNT; i++) {
      initialCarts.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 24 + 24, // 24-48px (larger size)
        opacity: Math.random() * 0.4 + 0.3, // 0.3-0.7 (much more visible)
        speed: Math.random() * 0.5 + 0.2, // 0.2-0.7px per frame
        direction: Math.random() * 360, // degrees
        rotation: Math.random() * 360 // degrees
      });
    }
    
    setCarts(initialCarts);
    console.log('Created initial carts:', initialCarts.length);
    
    // Handle window resize
    const handleResize = () => {
      setCarts(carts => 
        carts.map(cart => ({
          ...cart,
          x: Math.min(cart.x, window.innerWidth),
          y: Math.min(cart.y, window.innerHeight)
        }))
      );
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Animation loop - important to keep this running
  useEffect(() => {
    let animationId;
    let lastTime = 0;
    
    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      setCarts(prevCarts => 
        prevCarts.map(cart => {
          // Convert direction to radians
          const radians = cart.direction * Math.PI / 180;
          
          // Calculate new position
          let newX = cart.x + Math.cos(radians) * cart.speed * deltaTime / 16;
          let newY = cart.y + Math.sin(radians) * cart.speed * deltaTime / 16;
          
          // Bounce off edges
          if (newX < 0 || newX > window.innerWidth) {
            newX = Math.max(0, Math.min(newX, window.innerWidth));
            cart.direction = 180 - cart.direction;
          }
          
          if (newY < 0 || newY > window.innerHeight) {
            newY = Math.max(0, Math.min(newY, window.innerHeight));
            cart.direction = 360 - cart.direction;
          }
          
          return {
            ...cart,
            x: newX,
            y: newY,
            rotation: (cart.rotation + 0.1) % 360 // slowly rotate
          };
        })
      );
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    console.log('Animation loop started');
    return () => {
      console.log('Animation loop cleaning up');
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  // Handle mouse interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const REPEL_DISTANCE = 100;
      const REPEL_STRENGTH = 1;
      
      setCarts(prevCarts => 
        prevCarts.map(cart => {
          const dx = cart.x - mouseX;
          const dy = cart.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < REPEL_DISTANCE) {
            const repelAngle = Math.atan2(dy, dx);
            const repelForce = (REPEL_DISTANCE - distance) * REPEL_STRENGTH;
            
            return {
              ...cart,
              x: cart.x + Math.cos(repelAngle) * repelForce,
              y: cart.y + Math.sin(repelAngle) * repelForce,
            };
          }
          
          return cart;
        })
      );
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  console.log('Cart Animation Rendering, cart count:', carts.length);
  
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
        <div
          key={cart.id}
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
            color: 'rgba(255, 255, 255, 0.6)', // More visible carts
          }}
        >
          {CART_EMOJI}
        </div>
      ))}
    </div>
  );
}

export default CartAnimation; 