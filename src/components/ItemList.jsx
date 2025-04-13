import React from 'react';
import ItemCard from './ItemCard';

function ItemList({ items, loading, onDeleteItem }) {
  if (loading) {
    return <p className="loading-text">Loading items...</p>;
  }
  
  if (!items || !items.length) {
    return <p className="empty-list">No items yet. Add something!</p>;
  }
  
  return (
    <ul className="item-list">
      {items.map(item => (
        <ItemCard 
          key={item.id || Math.random()} 
          item={item}
          onDelete={onDeleteItem}
          loading={loading}
        />
      ))}
    </ul>
  );
}

export default ItemList; 