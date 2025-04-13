import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import GroceryList from './components/GroceryList';
import ChangePassword from './components/ChangePassword';
import CartAnimation from './components/CartAnimation';
import CartIcon from './components/CartIcon';
import VersionInfo from './components/VersionInfo';
import { useAuth } from './contexts/AuthContext';
import './App.css'

// Main layout component that checks authentication state
function AppContent({ isPWA }) {
  const { currentUser, signOut } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // If not logged in, show login form
  if (!currentUser) {
    return (
      <>
        <CartAnimation />
        <Login />
        <div className="app-footer">
          <VersionInfo className="login-version" />
        </div>
      </>
    );
  }
  
  // Otherwise show content based on auth state
  return (
    <>
      <CartAnimation />
      <div className="app-container">
        <header>
          <h1>
            <CartIcon size="1.5em" /> <span className="app-title"><strong>Grocery</strong>Sync</span>
          </h1>
          <div className="user-info">
            <span>Welcome, {currentUser.username} ({currentUser.role})</span>
            <button onClick={() => setShowChangePassword(true)}>Change Password</button>
            <button onClick={signOut}>Logout</button>
          </div>
        </header>
        
        {showChangePassword ? (
          <ChangePassword onClose={() => setShowChangePassword(false)} />
        ) : (
          <GroceryList />
        )}
        
        <footer className="app-footer">
          <VersionInfo showControls={true} />
        </footer>
      </div>
    </>
  );
}

function App() {
  const [isPWA, setIsPWA] = useState(false);
  const [isIOSStandalone, setIsIOSStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is running as PWA
    const isInStandaloneMode = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator.standalone) || 
             document.referrer.includes('android-app://');
    };
    
    // Detect iOS standalone mode
    const detectIOSStandalone = () => {
      return window.navigator.standalone === true;
    };

    setIsPWA(isInStandaloneMode());
    setIsIOSStandalone(detectIOSStandalone());

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            
            // Check for service worker updates
            registration.addEventListener('updatefound', () => {
              console.log('New service worker being installed');
              const newWorker = registration.installing;
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New content is available; please refresh.');
                  // You could show a notification here that an update is available
                }
              });
            });
          })
          .catch(error => {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
      
      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Controller changed, refreshing page to use new service worker');
        window.location.reload();
      });
    }

    // Add event listener for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e) => setIsPWA(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={isIOSStandalone ? 'ios-standalone' : ''}>
      <AuthProvider>
        <AppContent isPWA={isPWA} />
      </AuthProvider>
    </div>
  )
}

export default App 