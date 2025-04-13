import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllItems, deleteItem } from '../utils/items';
import AddItemForm from './AddItemForm';
import ItemList from './ItemList';
import MessageDisplay from './ui/MessageDisplay';

function GroceryList() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load items on component mount
  useEffect(() => {
    loadItems();
  }, []);
  
  // Sort items by importance (high to low)
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      // Default to importance 1 if not specified
      const importanceA = a.importance || 1;
      const importanceB = b.importance || 1;
      
      // Sort by importance (high to low)
      if (importanceB !== importanceA) {
        return importanceB - importanceA;
      }
      
      // If importance is the same, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [items]);
  
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
  
  // Delete an item
  const handleDeleteItem = async (itemId) => {
    if (!itemId) {
      setError('Cannot delete item: missing item ID');
      return;
    }
    
    // Check if the user is a parent before attempting to delete
    if (currentUser.role !== 'parent') {
      setError('Only parents can delete items');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Deleting item with ID:', itemId, 'by user:', currentUser.username, 'with role:', currentUser.role);
      const result = await deleteItem(itemId, currentUser.username);
      
      if (result.success) {
        // Show success message
        setSuccess('Item deleted');
        
        // Remove item from local state
        setItems(items.filter(item => item.id !== itemId));
        
        // Clear success message handled by MessageDisplay
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
      {/* Error/success messages for item deletion */}
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
      
      {/* Add item form - positioned as the first element for better accessibility */}
      <AddItemForm onItemAdded={loadItems} />
      
      {/* Item list */}
      <div className="grocery-items">
        <h3>Grocery List</h3>
        <ItemList 
          items={sortedItems} 
          loading={loading} 
          onDeleteItem={handleDeleteItem} 
        />
      </div>
    </div>
  );
}

export default GroceryList; 