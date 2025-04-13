import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllItems, addItem, deleteItem } from '../utils/items';

function GroceryList() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load items on component mount and whenever items are added/deleted
  useEffect(() => {
    loadItems();
  }, []);
  
  // Load all items from database
  const loadItems = async () => {
    setLoading(true);
    try {
      const itemList = await getAllItems();
      console.log('ItemList received:', itemList);
      
      // Make sure we're setting an array
      setItems(Array.isArray(itemList) ? itemList : []);
    } catch (error) {
      console.error('Error loading items:', error);
      setItems([]);
    }
    setLoading(false);
  };
  
  // Add a new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    
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
      currentUser.username
    );
    
    if (result.success) {
      // Clear form fields
      setNewItemName('');
      setNewItemNotes('');
      
      // Show success message
      setSuccess('Item added successfully');
      
      // Reload items to show the new one
      await loadItems();
      
      // Clear success message after delay
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to add item');
    }
    
    setLoading(false);
  };
  
  // Delete an item
  const handleDeleteItem = async (itemId) => {
    if (!itemId) {
      setError('Cannot delete item: missing item ID');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Deleting item with ID:', itemId);
      const result = await deleteItem(itemId, currentUser.username);
      
      if (result.success) {
        // Show success message
        setSuccess('Item deleted');
        
        // Remove item from local state
        setItems(items.filter(item => item.id !== itemId));
        
        // Clear success message after delay
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete item');
        
        // If item wasn't found, refresh the list
        if (result.error?.includes('not found')) {
          loadItems();
        }
      }
    } catch (err) {
      console.error('Error in handleDeleteItem:', err);
      setError('An unexpected error occurred while deleting the item');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="grocery-list-container">
      {/* Add new item form */}
      <div className="add-item-form">
        <h3>Add New Item</h3>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleAddItem}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              disabled={loading}
              required
            />
            
            <input
              type="text"
              placeholder="Notes (optional)"
              value={newItemNotes}
              onChange={(e) => setNewItemNotes(e.target.value)}
              disabled={loading}
            />
            
            <button 
              type="submit"
              disabled={loading || !newItemName.trim()}
              className="add-button"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
      
      {/* Item list */}
      <div className="grocery-items">
        <h3>Grocery List</h3>
        
        {loading && <p className="loading-text">Loading items...</p>}
        
        {!loading && (!items || !items.length) && (
          <p className="empty-list">No items yet. Add something!</p>
        )}
        
        {!loading && Array.isArray(items) && items.length > 0 && (
          <ul className="item-list">
            {items.map(item => (
              <li key={item.id || Math.random()} className="item">
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  {item.notes && <span className="item-notes">{item.notes}</span>}
                  <span className="item-added-by">Added by: {item.addedBy}</span>
                </div>
                
                {currentUser.role === 'parent' && (
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="delete-button"
                    disabled={loading}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default GroceryList; 