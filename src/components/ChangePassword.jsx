import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Form from './ui/Form';
import Input from './ui/Input';
import Button from './ui/Button';
import MessageDisplay from './ui/MessageDisplay';

function ChangePassword({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { updatePassword, loading } = useAuth();
  
  const handleSubmit = async () => {
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
    
    try {
      // Submit password change
      console.log('Attempting to update password...');
      const result = await updatePassword(currentPassword, newPassword);
      
      if (result.success) {
        console.log('Password update successful');
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
        console.error('Password update failed:', result.error);
        setMessage(result.error || 'Failed to update password');
        setIsError(true);
      }
    } catch (error) {
      console.error('Exception during password update:', error);
      setMessage(`An unexpected error occurred: ${error.message || 'Unknown error'}`);
      setIsError(true);
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Change Password</h2>
        <Button 
          className="close-button"
          onClick={onClose}
          variant="secondary"
        >
          ×
        </Button>
        
        <MessageDisplay
          message={message}
          type={isError ? 'error' : 'success'} 
          onClear={() => setMessage('')}
          duration={0} // Don't auto-clear
        />
        
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="currentPassword">Current Password</Form.Label>
            <Input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>
          
          <Form.Group>
            <Form.Label htmlFor="newPassword">New Password</Form.Label>
            <Input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
            />
          </Form.Group>
          
          <Form.Group>
            <Form.Label htmlFor="confirmPassword">Confirm New Password</Form.Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>
          
          <div className="button-group">
            <Button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              variant="secondary"
              className="cancel-button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              variant="primary"
              className="submit-button"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ChangePassword; 