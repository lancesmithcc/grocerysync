import pkg from 'fauna';
const { Client, fql } = pkg;
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file at the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = new Client({
  secret: process.env.VITE_FAUNADB_API_KEY,
});

const initialUsers = [
  { username: 'Lance', password: 'tempPW123', role: 'parent' },
  { username: 'Casey', password: 'tempPW123', role: 'parent' },
  { username: 'Seth', password: 'tempPW123', role: 'kid' },
  { username: 'Jude', password: 'tempPW123', role: 'kid' },
];

async function setupFauna() {
  console.log('Setting up FaunaDB collections and indexes using FQL v10 (attempting creation)...');

  try {
    // --- Collections Setup --- 
    try {
      console.log('Attempting to create Users collection...');
      await client.query(fql`Collection.create({ name: 'Users' })`);
      console.log('Users collection created.');
    } catch (error) {
      // Check summary for "already exists" indication
      if (error.queryInfo?.summary?.includes('already exists with the name')) { 
        console.log('Users collection already exists.');
      } else {
        // Log details for unexpected errors during collection creation
        console.error('Error creating/checking Users collection:', error.message || error);
        if(error.queryInfo) { console.error('Users Collection Create Fauna Query Info:', JSON.stringify(error.queryInfo, null, 2)); }
        throw error; // Rethrow unexpected errors
      }
    }

    try {
      console.log('Attempting to create Items collection...');
      await client.query(fql`Collection.create({ name: 'Items' })`);
      console.log('Items collection created.');
    } catch (error) {
       // Check summary for "already exists" indication
       if (error.queryInfo?.summary?.includes('already exists with the name')) { 
        console.log('Items collection already exists.');
      } else {
        // Log details for unexpected errors during collection creation
        console.error('Error creating/checking Items collection:', error.message || error);
        if(error.queryInfo) { console.error('Items Collection Create Fauna Query Info:', JSON.stringify(error.queryInfo, null, 2)); }
        throw error; // Rethrow unexpected errors
      }
    }

    // --- Index Setup --- 
    console.log('Skipping index creation for now - will implement this later with correct FQL v10 syntax');
    /*
    try {
        console.log('Attempting to create user_by_username index...');
        // Index creation temporarily skipped
        console.log('user_by_username index created.');
    } catch (error) {
        // ...
    }
    */

    // --- Seed Initial Users --- 
    console.log('Seeding initial users...');
    const saltRounds = 10;

    for (const user of initialUsers) {
        try {
            // Check if user already exists directly without using index
            let userExists = false;
            try {
                // Check user existence using a filter on all users
                const userExistsQuery = fql`
                  Users.where(.username == ${user.username}).count() > 0
                `;
                const userExistsResult = await client.query(userExistsQuery);
                userExists = userExistsResult.data;
            } catch(err) {
                // Handle query errors
                console.error(`Error checking existence for user ${user.username}:`, err.message || err);
                if(err.queryInfo) { console.error(`User Check Fauna Query Info (${user.username}):`, JSON.stringify(err.queryInfo, null, 2)); }
                // Assume user doesn't exist if we can't check
                userExists = false;
            }

            if (!userExists) { 
                console.log(`Creating user: ${user.username}`);
                const hashedPassword = await bcrypt.hash(user.password, saltRounds);
                // Create user without relying on an index
                const createUserQuery = fql`
                  Users.create({
                    username: ${user.username},
                    passwordHash: ${hashedPassword},
                    role: ${user.role},
                  })
                `;
                await client.query(createUserQuery);
                console.log(`User ${user.username} created.`);
            } else {
                console.log(`User ${user.username} already exists. Skipping creation.`);
            }
        } catch (error) {
            // Handle creation errors
            if (error.queryInfo?.summary?.includes('unique constraint violated') || 
                error.message?.includes('unique constraint violated')) {
                console.warn(`User ${user.username} already exists (unique constraint). Skipping.`);
            } else {
                console.error(`Error seeding user ${user.username}:`, error.message || error);
                if(error.queryInfo) { console.error(`User Seed (${user.username}) Fauna Query Info:`, JSON.stringify(error.queryInfo, null, 2)); }
            }
        }
    }

    console.log('Initial user seeding complete.');
    // --- End Seed Initial Users --- 

    console.log('FaunaDB setup attempt complete.');

  } catch (error) {
     // Catch any unhandled errors from the setup process
     console.error('Unhandled error during FaunaDB setup:', error.message || error);
     if(error.queryInfo) { console.error('Fauna Query Info:', JSON.stringify(error.queryInfo, null, 2)); }
     if(error.cause) { console.error('Cause:', error.cause); }
  }
}

setupFauna(); 