import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { VERSION_STRING } from './utils/version'

// Log the app version
console.log(`GrocerySync version: ${VERSION_STRING}`);

// Add version to localStorage to detect version changes on reload
const lastVersion = localStorage.getItem('appVersion');
localStorage.setItem('appVersion', VERSION_STRING);

// Detect version changes (will be useful in the future for migration/updates)
if (lastVersion && lastVersion !== VERSION_STRING) {
  console.log(`App updated from ${lastVersion} to ${VERSION_STRING}`);
  // Consider forcing a reload or showing an update notification
}

// Disable default touch behaviors on mobile
document.addEventListener('touchstart', function() {}, { passive: true });

// Allow normal scrolling behavior on all elements
// Remove the iOS bounce prevention that was preventing scrolling
// document.body.addEventListener('touchmove', function(e) {
//   if (e.target.closest('.scroll-container') === null) {
//     e.preventDefault();
//   }
// }, { passive: false });

// Add iOS standalone web app handling
if (window.navigator.standalone) {
  document.documentElement.classList.add('ios-standalone');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
