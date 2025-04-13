import { createContext, useState, useContext, useEffect } from 'react';
import { login, changePassword } from '../utils/auth';

// Create context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('grocerySyncUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('grocerySyncUser');
      }
    }
    setLoading(false);
  }, []);
  
  // Login function
  const signIn = async (username, password) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        setCurrentUser(result.user);
        // Save to localStorage for persistence
        localStorage.setItem('grocerySyncUser', JSON.stringify(result.user));
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError('An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('grocerySyncUser');
  };
  
  // Update password function
  const updatePassword = async (currentPassword, newPassword) => {
    if (!currentUser) return { success: false, error: 'Not logged in' };
    
    setLoading(true);
    setError('');
    
    try {
      console.log('AuthContext: Updating password for user:', currentUser.username);
      
      const result = await changePassword(
        currentUser.username,
        currentPassword,
        newPassword
      );
      
      console.log('AuthContext: Password update result:', result);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      console.error('AuthContext: Exception during password update:', err);
      const errorMessage = err.message || 'Unknown error';
      setError(`An error occurred while changing password: ${errorMessage}`);
      return { 
        success: false, 
        error: `An error occurred while changing password: ${errorMessage}` 
      };
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    currentUser,
    loading,
    error,
    signIn,
    signOut,
    updatePassword
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 