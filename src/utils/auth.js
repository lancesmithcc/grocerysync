import { client, fql } from './fauna';
import bcrypt from 'bcryptjs';

/**
 * Authenticates a user with username and password
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>} Result object 
 */
export async function login(username, password) {
  try {
    // Get user by username
    const userQuery = fql`
      Users.where(.username == ${username}).first()
    `;
    
    const result = await client.query(userQuery);
    const user = result.data;
    
    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }
    
    // Check what field is used for password
    console.log('User object structure:', Object.keys(user));
    
    // Try to get the password field - it might be named differently
    const passwordField = user.passwordHash || user.password || user.hashedPassword;
    
    if (!passwordField) {
      console.error('Could not find password field in user object');
      return { success: false, error: 'Invalid account configuration' };
    }
    
    // Compare password with stored hash
    const passwordMatch = await bcrypt.compare(password, passwordField);
    
    if (!passwordMatch) {
      return { success: false, error: 'Invalid username or password' };
    }
    
    // Verify user has a role property
    if (!user.role) {
      console.error('User is missing role property:', username);
      return { success: false, error: 'User account is missing role information' };
    }
    
    console.log('User logged in successfully:', username, 'with role:', user.role);
    
    // Return user info without sensitive data
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.passwordHash;
    delete userWithoutPassword.password;
    delete userWithoutPassword.hashedPassword;
    
    return { 
      success: true, 
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'An error occurred during authentication'
    };
  }
}

/**
 * Changes a user's password - simplified implementation
 * @param {string} username - The user's username
 * @param {string} currentPassword - The user's current password
 * @param {string} newPassword - The user's new password
 * @returns {Promise<{success: boolean, error?: string}>} Result object
 */
export async function changePassword(username, currentPassword, newPassword) {
  try {
    // First verify current password is correct using login function
    const loginResult = await login(username, currentPassword);
    
    if (!loginResult.success) {
      return { success: false, error: 'Current password is incorrect' };
    }
    
    // Hash the new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    try {
      console.log('Updating password for user:', username);
      
      // Get the document ID from the login result
      const documentId = loginResult.user.id;
      
      if (!documentId) {
        console.error('User ID not found in login result');
        return { success: false, error: 'User ID not found' };
      }
      
      console.log('Using document ID for update:', documentId);
      
      // Update the user's password using the document reference
      const updateResult = await client.query(fql`
        Users.byId(${documentId}).update({
          passwordHash: ${newPasswordHash}
        })
      `);
      
      console.log('Password update successful:', updateResult);
      return { success: true };
    } catch (updateError) {
      console.error('Password update error:', updateError);
      
      // Try an alternative approach with direct where query
      try {
        console.log('Trying alternative update approach with where clause...');
        
        const alternativeUpdateResult = await client.query(fql`
          let user = Users.where(.username == ${username}).first()
          user!.update({
            passwordHash: ${newPasswordHash}
          })
        `);
        
        console.log('Alternative password update successful:', alternativeUpdateResult);
        return { success: true };
      } catch (alternativeError) {
        console.error('Alternative update approach failed:', alternativeError);
        
        if (alternativeError.message?.includes('null')) {
          return { 
            success: false, 
            error: 'User not found in database' 
          };
        }
        
        return { 
          success: false, 
          error: 'Could not update password in database: ' + (alternativeError.message || 'Unknown error')
        };
      }
    }
  } catch (error) {
    console.error('Password change error:', error);
    return { 
      success: false, 
      error: 'An error occurred while changing password: ' + (error.message || 'Unknown error')
    };
  }
}

/**
 * Gets the current user's role
 * @param {string} username - The user's username
 * @returns {Promise<string|null>} The user's role or null if user not found
 */
export async function getUserRole(username) {
  try {
    console.log('Getting role for user:', username);
    
    if (!username) {
      console.error('getUserRole called with empty username');
      return null;
    }
    
    const userQuery = fql`
      Users.where(.username == ${username}).first()
    `;
    
    const result = await client.query(userQuery);
    console.log('User role query result:', result);
    
    if (!result.data) {
      console.error('User not found:', username);
      return null;
    }
    
    return result.data.role || null;
  } catch (error) {
    console.error('Get user role error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return null;
  }
} 