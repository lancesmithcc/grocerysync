import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import StarRating from './ui/StarRating';

function ItemCard({ item, onDelete, loading }) {
  const { currentUser } = useAuth();
  
  return (
    <li className="item">
      <div className="item-details">
        <div className="item-header">
          <span className="item-name">{item.name}</span>
          <StarRating 
            rating={item.importance || 1} 
            setRating={() => {}} // Read-only
            editable={false}
            size="1em"
          />
        </div>
        {item.notes && <span className="item-notes">{item.notes}</span>}
        <span className="item-added-by">Added by: {item.addedBy}</span>
      </div>
      
      {currentUser && currentUser.role === 'parent' && (
        <Button 
          onClick={() => onDelete(item.id)}
          variant="danger"
          className="delete-button"
          disabled={loading}
          title="Delete item (parent only)"
        >
          Delete
        </Button>
      )}
    </li>
  );
}

export default ItemCard; 