import { useEffect } from 'react';

function useMouseInteraction(setCarts) {
  useEffect(() => {
    const REPEL_DISTANCE = 150;
    const REPEL_STRENGTH = 2.5;
    const ATTRACT_DISTANCE = 250;
    const ATTRACT_STRENGTH = 0.08;
    
    let lastMouseX = window.innerWidth / 2;
    let lastMouseY = window.innerHeight / 2;
    let isPointerDown = false;
  
    const handlePointerMove = (e) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      
      updateCarts(e.clientX, e.clientY, isPointerDown);
    };

    const handlePointerDown = (e) => {
      isPointerDown = true;
      updateCarts(e.clientX, e.clientY, true);
    };

    const handlePointerUp = () => {
      isPointerDown = false;
    };
    
    const updateCarts = (mouseX, mouseY, isDown) => {
      setCarts(prevCarts => 
        prevCarts.map(cart => {
          const dx = cart.x - mouseX;
          const dy = cart.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (isDown && distance < REPEL_DISTANCE) {
            const repelAngle = Math.atan2(dy, dx);
            const repelForce = (REPEL_DISTANCE - distance) * REPEL_STRENGTH * 1.5;
            
            return {
              ...cart,
              x: cart.x + Math.cos(repelAngle) * repelForce,
              y: cart.y + Math.sin(repelAngle) * repelForce,
              opacity: Math.min(0.9, cart.opacity + 0.1),
            };
          }
          else if (distance < REPEL_DISTANCE) {
            const repelAngle = Math.atan2(dy, dx);
            const repelForce = (REPEL_DISTANCE - distance) * REPEL_STRENGTH;
            
            return {
              ...cart,
              x: cart.x + Math.cos(repelAngle) * repelForce,
              y: cart.y + Math.sin(repelAngle) * repelForce,
            };
          }
          else if (distance < ATTRACT_DISTANCE) {
            const attractAngle = Math.atan2(dy, dx);
            const attractForce = (ATTRACT_DISTANCE - distance) * -ATTRACT_STRENGTH;
            
            return {
              ...cart,
              x: cart.x + Math.cos(attractAngle) * attractForce,
              y: cart.y + Math.sin(attractAngle) * attractForce,
            };
          }
          
          return cart;
        })
      );
    };
    
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) {
        e.preventDefault();
        handlePointerMove({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        });
      }
    }, { passive: false });
    
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', (e) => {
      if (e.touches[0]) {
        handlePointerDown({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        });
      }
    });
    
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', (e) => {
        if (e.touches[0]) handlePointerMove({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        });
      });
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', (e) => {
        if (e.touches[0]) handlePointerDown({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        });
      });
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [setCarts]);
}

export default useMouseInteraction; 