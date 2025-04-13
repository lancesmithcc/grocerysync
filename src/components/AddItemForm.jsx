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
    
    try {
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
    } catch (err) {
      console.error('Error adding item:', err);
      setError('An unexpected error occurred while adding the item');
    } finally {
      setLoading(false);
    }
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
      
      <Form onSubmit={handleAddItem}>
        <Form.Row>
          <Input
            type="text"
            placeholder="Item name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            disabled={loading}
            required
            aria-label="Item name"
          />
          
          <Input
            type="text"
            placeholder="Notes (optional)"
            value={newItemNotes}
            onChange={(e) => setNewItemNotes(e.target.value)}
            disabled={loading}
            aria-label="Item notes"
          />
        </Form.Row>
        
        <Form.Row className="importance-row">
          <div className="importance-selector">
            <label htmlFor="importance-rating">Importance:</label>
            <StarRating 
              rating={importance} 
              setRating={setImportance} 
              maxStars={5}
              editable={!loading}
              id="importance-rating"
            />
          </div>
          
          <Button 
            type="submit"
            disabled={loading || !newItemName.trim()}
            className="add-button"
            aria-label="Add item to grocery list"
          >
            Add Item
          </Button>
        </Form.Row>
      </Form>
    </div>
  );
}

export default AddItemForm; 