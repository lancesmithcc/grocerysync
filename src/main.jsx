import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Disable default touch behaviors on mobile
document.addEventListener('touchstart', function() {}, { passive: true });

// Prevent bounce effect on iOS
document.body.addEventListener('touchmove', function(e) {
  if (e.target.closest('.scroll-container') === null) {
    e.preventDefault();
  }
}, { passive: false });

// Add iOS standalone web app handling
if (window.navigator.standalone) {
  document.documentElement.classList.add('ios-standalone');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
