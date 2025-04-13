import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ChangePassword({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { updatePassword, loading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setMessage('');
    setIsError(false);
    
    // Validate form
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('All fields are required');
      setIsError(true);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setIsError(true);
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long');
      setIsError(true);
      return;
    }
    
    // Submit password change
    const result = await updatePassword(currentPassword, newPassword);
    
    if (result.success) {
      setMessage('Password successfully updated');
      setIsError(false);
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setMessage(result.error || 'Failed to update password');
      setIsError(true);
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Change Password</h2>
        <button className="close-button" onClick={onClose}>×</button>
        
        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="button-group">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              className="submit-button"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword; 