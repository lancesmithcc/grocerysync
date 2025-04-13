import { useState } from 'react';
import { VERSION_STRING, clearCacheAndReload } from '../utils/version';
import Button from './ui/Button';

/**
 * Component to display app version information and provide cache clearing function
 */
function VersionInfo({ className = '', showControls = false }) {
  const [message, setMessage] = useState('');

  const handleClearCache = () => {
    setMessage('Clearing cache...');
    setTimeout(() => {
      clearCacheAndReload();
    }, 500);
  };

  return (
    <div className={`version-info ${className}`}>
      <div className="version-text">
        Version: {VERSION_STRING}
      </div>
      
      {showControls && (
        <div className="version-controls">
          <Button 
            variant="secondary" 
            size="small"
            onClick={handleClearCache}
            className="clear-cache-btn"
          >
            Clear Cache
          </Button>
          {message && <div className="version-message">{message}</div>}
        </div>
      )}
    </div>
  );
}

export default VersionInfo; 