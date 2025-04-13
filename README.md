# GrocerySync

A family grocery list application that allows parents and kids to collaborate on a shared shopping list.

## Features

- **User Authentication**: Login with parent or kid roles
- **Role-Based Permissions**: 
  - Everyone can add items to the grocery list
  - Only parents can delete items
- **Dark Mode UI**: Charcoal background with aurora effect borders
- **Interactive Background**: Animated shopping carts that react to cursor movement

## Technology Stack

- **Frontend**: React with Vite
- **Database**: FaunaDB with FQL v10
- **Authentication**: Custom auth system with bcrypt password hashing
- **Styling**: CSS with custom animations

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/lancesmithcc/grocerysync.git
   cd grocerysync
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your FaunaDB API key:
   ```
   VITE_FAUNADB_API_KEY=your_fauna_db_key
   ```

4. Set up the database:
   ```
   node --experimental-modules --es-module-specifier-resolution=node scripts/setupFauna.js
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## License

MIT
