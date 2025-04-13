import { useEffect, useState } from 'react';

function MessageDisplay({ message, type, duration = 3000, onClear }) {
  const [visible, setVisible] = useState(!!message);
  
  useEffect(() => {
    setVisible(!!message);
    
    if (message && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClear) onClear();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClear]);
  
  if (!message || !visible) return null;
  
  return (
    <div className={`message message-${type}`}>
      {message}
    </div>
  );
}

export default MessageDisplay; 