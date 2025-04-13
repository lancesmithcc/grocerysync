import { useState, useEffect } from 'react';

const CART_COUNT = 15;
const CART_EMOJI = '🛒';

function useCartAnimation() {
  const [carts, setCarts] = useState([]);
  
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
  
  // Animation loop
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
  
  return { carts, CART_EMOJI };
}

export default useCartAnimation; 