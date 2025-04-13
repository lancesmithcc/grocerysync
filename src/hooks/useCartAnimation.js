import { useState, useEffect } from 'react';

const CART_COUNT = 20;
const CART_EMOJIS = ['🛒', '🏪', '🛍️', '🧺', '📦'];

function useCartAnimation() {
  const [carts, setCarts] = useState([]);
  const [cartEmoji, setCartEmoji] = useState(CART_EMOJIS[0]);
  
  // Generate initial cart positions on mount
  useEffect(() => {
    console.log('Initializing cart animations');
    const initialCarts = [];
    
    // Create a varied distribution of cart sizes
    const sizeTiers = [
      { min: 16, max: 20, count: Math.floor(CART_COUNT * 0.3) }, // Small carts
      { min: 22, max: 32, count: Math.floor(CART_COUNT * 0.5) }, // Medium carts
      { min: 38, max: 48, count: Math.floor(CART_COUNT * 0.2) }, // Large carts
    ];
    
    let cartId = 0;
    sizeTiers.forEach(tier => {
      for (let i = 0; i < tier.count; i++) {
        // Assign random emoji to each cart
        const emojiIndex = Math.floor(Math.random() * CART_EMOJIS.length);
        
        initialCarts.push({
          id: cartId++,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * (tier.max - tier.min) + tier.min,
          opacity: Math.random() * 0.4 + 0.3, // 0.3-0.7
          speed: Math.random() * 0.7 + 0.2, // 0.2-0.9px per frame (more variation)
          direction: Math.random() * 360, // degrees
          rotation: Math.random() * 360, // degrees
          wobble: Math.random() * 5, // Random wobble amount
          wobbleSpeed: Math.random() * 0.05 + 0.02, // Random wobble speed
          emojiIndex: emojiIndex // Store emoji index for reference
        });
      }
    });
    
    setCarts(initialCarts);
    console.log('Created initial carts:', initialCarts.length);
    
    // Randomly change the main emoji occasionally
    const emojiChangeInterval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * CART_EMOJIS.length);
      setCartEmoji(CART_EMOJIS[newIndex]);
    }, 30000); // Change every 30 seconds
    
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
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(emojiChangeInterval);
    };
  }, []);
  
  // Animation loop
  useEffect(() => {
    let animationId;
    let lastTime = 0;
    let wobbleAngle = 0;
    
    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Increment wobble angle
      wobbleAngle += 0.01 * deltaTime;
      
      setCarts(prevCarts => 
        prevCarts.map(cart => {
          // Apply wobble effect
          const wobbleOffset = Math.sin(wobbleAngle * cart.wobbleSpeed) * cart.wobble;
          
          // Convert direction to radians
          const radians = (cart.direction + wobbleOffset) * Math.PI / 180;
          
          // Calculate new position with delta time adjustment for frame rate independence
          let newX = cart.x + Math.cos(radians) * cart.speed * deltaTime / 16;
          let newY = cart.y + Math.sin(radians) * cart.speed * deltaTime / 16;
          
          // Bounce off edges with random angle adjustment
          let newDirection = cart.direction;
          
          if (newX < 0 || newX > window.innerWidth) {
            newX = Math.max(0, Math.min(newX, window.innerWidth));
            newDirection = 180 - cart.direction + (Math.random() * 20 - 10); // Add some randomness
          }
          
          if (newY < 0 || newY > window.innerHeight) {
            newY = Math.max(0, Math.min(newY, window.innerHeight));
            newDirection = 360 - cart.direction + (Math.random() * 20 - 10); // Add some randomness
          }
          
          // Occasionally change direction randomly (0.1% chance per frame)
          if (Math.random() < 0.001) {
            newDirection = Math.random() * 360;
          }
          
          return {
            ...cart,
            x: newX,
            y: newY,
            direction: newDirection,
            rotation: (cart.rotation + (0.1 * cart.speed)) % 360 // Faster carts rotate faster
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
  
  // Get emoji for a specific cart
  const getEmojiForCart = (cart) => {
    return CART_EMOJIS[cart.emojiIndex || 0];
  };
  
  return { carts, CART_EMOJI: cartEmoji, getEmojiForCart };
}

export default useCartAnimation; 