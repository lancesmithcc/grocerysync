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
    let isScrolling = false;
    let initialTouchY = 0;
  
    const handlePointerMove = (e) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      
      // Only update carts if we're not actively scrolling
      if (!isScrolling) {
        updateCarts(e.clientX, e.clientY, isPointerDown);
      }
    };

    const handlePointerDown = (e) => {
      isPointerDown = true;
      
      // Only update carts if we're not actively scrolling
      if (!isScrolling) {
        updateCarts(e.clientX, e.clientY, true);
      }
    };

    const handlePointerUp = () => {
      isPointerDown = false;
      isScrolling = false;
    };
    
    // Detect vertical scrolling from touch start
    const handleTouchStart = (e) => {
      if (e.touches[0]) {
        initialTouchY = e.touches[0].clientY;
        
        handlePointerDown({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        });
      }
    };
    
    // Detect if user is trying to scroll vertically
    const handleTouchMove = (e) => {
      if (e.touches[0]) {
        const currentTouchY = e.touches[0].clientY;
        const touchYDiff = Math.abs(currentTouchY - initialTouchY);
        
        // If vertical movement is more than 10px, assume user is trying to scroll
        if (touchYDiff > 10) {
          isScrolling = true;
        }
        
        // Only if not scrolling, update cart positions
        if (!isScrolling) {
          handlePointerMove({
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY
          });
        }
      }
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
    
    // Add mouse event listeners
    window.addEventListener('mousemove', handlePointerMove);
    
    // Add touch event listeners with passive: true to allow native scrolling
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp, { passive: true });

    return () => {
      // Clean up all event listeners
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [setCarts]);
}

export default useMouseInteraction; 