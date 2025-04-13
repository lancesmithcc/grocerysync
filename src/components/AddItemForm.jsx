import { useState } from 'react';
import { addItem } from '../utils/items';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import Input from './ui/Input';
import Form from './ui/Form';
import StarRating from './ui/StarRating';
import MessageDisplay from './ui/MessageDisplay';

function AddItemForm({ onItemAdded }) {
  const { currentUser } = useAuth();
  const [newItemName, setNewItemName] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [importance, setImportance] = useState(1); // Default importance 1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Add a new item
  const handleAddItem = async (e) => {
    if (!newItemName.trim()) {
      setError('Item name is required');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    const result = await addItem(
      newItemName.trim(), 
      newItemNotes.trim(),
      currentUser.username,
      importance // Add importance rating to the item
    );
    
    if (result.success) {
      // Clear form fields
      setNewItemName('');
      setNewItemNotes('');
      setImportance(1); // Reset to default
      
      // Show success message
      setSuccess('Item added successfully');
      
      // Notify parent component
      if (onItemAdded) {
        onItemAdded();
      }
      
      // Clear success message handled by MessageDisplay
    } else {
      setError(result.error || 'Failed to add item');
    }
    
    setLoading(false);
  };
  
  return (
    <div className="add-item-form">
      <h3>Add New Item</h3>
      
      <MessageDisplay 
        message={error} 
        type="error" 
        onClear={() => setError('')}
      />
      
      <MessageDisplay 
        message={success} 
        type="success" 
        onClear={() => setSuccess('')}
      />
      
      <Form onSubmit={handleAddItem} className="add-item-form">
        <Form.Row>
          <Input
            type="text"
            placeholder="Item name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            disabled={loading}
            required
          />
          
          <Input
            type="text"
            placeholder="Notes (optional)"
            value={newItemNotes}
            onChange={(e) => setNewItemNotes(e.target.value)}
            disabled={loading}
          />
        </Form.Row>
        
        <Form.Row className="importance-row">
          <div className="importance-selector">
            <label>Importance:</label>
            <StarRating 
              rating={importance} 
              setRating={setImportance} 
              maxStars={5}
              editable={!loading}
            />
          </div>
          
          <Button 
            type="submit"
            disabled={loading || !newItemName.trim()}
            className="add-button"
          >
            Add Item
          </Button>
        </Form.Row>
      </Form>
    </div>
  );
}

export default AddItemForm; 