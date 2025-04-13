import { client, fql } from './fauna';
import { getUserRole } from './auth';

/**
 * Fetches all grocery list items
 * @returns {Promise<Array>} Array of grocery items
 */
export async function getAllItems() {
  try {
    const query = fql`Items.all()`;
    const result = await client.query(query);
    
    // Debug - log what we're getting back
    console.log('Fauna result:', result);
    
    // In FQL v10, the data might be nested differently
    // Make sure we're always returning an array
    if (Array.isArray(result.data)) {
      return result.data;
    } else if (result.data && typeof result.data === 'object') {
      // If data is an object with data property (nested structure)
      return result.data.data || [];
    } else {
      console.warn('Unexpected data format from Fauna:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

/**
 * Adds a new item to the grocery list
 * @param {string} name - The item name
 * @param {string} notes - Optional notes about the item
 * @param {string} addedBy - Username of who added the item
 * @param {number} importance - Importance rating (1-5)
 * @returns {Promise<{success: boolean, item?: Object, error?: string}>} Result object
 */
export async function addItem(name, notes, addedBy, importance = 1) {
  try {
    // Ensure importance is a valid number between 1-5
    const validImportance = Math.max(1, Math.min(5, parseInt(importance) || 1));
    
    // Any user (parent or kid) can add items
    const query = fql`
      Items.create({
        name: ${name},
        notes: ${notes || ''},
        addedBy: ${addedBy},
        importance: ${validImportance},
        createdAt: Time.now()
      })
    `;
    
    const result = await client.query(query);
    console.log('Add item result:', result);
    
    // Extract the item data, handling potential nesting
    let itemData;
    if (result.data && typeof result.data === 'object') {
      // The item might be directly in data or nested
      itemData = result.data.data || result.data;
    } else {
      itemData = null;
    }
    
    return {
      success: true,
      item: itemData
    };
  } catch (error) {
    console.error('Error adding item:', error);
    return {
      success: false,
      error: 'Failed to add item'
    };
  }
}

/**
 * Deletes an item from the grocery list
 * @param {string} itemId - The id of the item to delete
 * @param {string} username - The username of the user attempting to delete
 * @returns {Promise<{success: boolean, error?: string}>} Result object
 */
export async function deleteItem(itemId, username) {
  try {
    // Check user role - only parents can delete
    const userRole = await getUserRole(username);
    
    console.log('Delete attempt by:', username, 'with role:', userRole);
    
    if (userRole !== 'parent') {
      console.log('Delete denied: user is not a parent');
      return {
        success: false,
        error: 'Only parents can delete items'
      };
    }
    
    // Proceed with deletion
    const query = fql`
      Items.byId(${itemId})?.delete()
    `;
    
    console.log('Attempting to delete item with ID:', itemId);
    const result = await client.query(query);
    console.log('Delete result:', result);
    
    // Check if deletion was successful
    // In FQL v10, a null result or specific error might indicate the item wasn't found
    if (result === null || (result.data === null && result.error)) {
      return {
        success: false,
        error: 'Item not found or already deleted'
      };
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting item:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Check if the error is due to item not found
    if (error.message?.includes('not found') || error.message?.includes('invalid ref')) {
      return {
        success: false,
        error: 'Item not found'
      };
    }
    return {
      success: false,
      error: 'Failed to delete item'
    };
  }
}

/**
 * Updates an existing item
 * @param {string} itemId - The id of the item to update
 * @param {Object} updates - Object containing fields to update
 * @param {string} username - The username of the user attempting to update
 * @returns {Promise<{success: boolean, item?: Object, error?: string}>} Result object
 */
export async function updateItem(itemId, updates, username) {
  try {
    // Check user role - only parents can update
    const userRole = await getUserRole(username);
    
    if (userRole !== 'parent') {
      return {
        success: false,
        error: 'Only parents can update items'
      };
    }
    
    // Proceed with update
    const query = fql`
      let item = Items.byId(${itemId});
      item.update(${updates})
    `;
    
    const result = await client.query(query);
    
    return {
      success: true,
      item: result.data
    };
  } catch (error) {
    console.error('Error updating item:', error);
    return {
      success: false,
      error: 'Failed to update item'
    };
  }
} 