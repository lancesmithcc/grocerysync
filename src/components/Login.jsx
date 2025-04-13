import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CartIcon from './CartIcon';
import Form from './ui/Form';
import Input from './ui/Input';
import Button from './ui/Button';
import MessageDisplay from './ui/MessageDisplay';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error } = useAuth();
  
  const handleSubmit = async () => {
    if (!username || !password) {
      return; // Don't submit if fields are empty
    }
    
    await signIn(username, password);
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h2><CartIcon size="1.5em" /> <span className="app-title"><strong>Grocery</strong>Sync</span></h2>
        <h3>Login</h3>
        
        <MessageDisplay 
          message={error} 
          type="error" 
          duration={0} 
        />
        
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
              autoComplete="username"
            />
          </Form.Group>
          
          <Form.Group>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="current-password"
            />
          </Form.Group>
          
          <Button 
            type="submit"
            disabled={loading || !username || !password}
            className="login-button"
            variant="primary"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login; 