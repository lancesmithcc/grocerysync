import { useEffect } from 'react';

function useMouseInteraction(setCarts) {
  useEffect(() => {
    const REPEL_DISTANCE = 100;
    const REPEL_STRENGTH = 1;
  
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
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
  }, [setCarts]);
}

export default useMouseInteraction; 