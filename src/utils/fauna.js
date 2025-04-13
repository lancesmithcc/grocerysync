import { Client, fql } from 'fauna';

// Import the API key from environment variables
const faunaKey = import.meta.env.VITE_FAUNADB_API_KEY;

if (!faunaKey) {
  console.error("Error: VITE_FAUNADB_API_KEY is not set in your environment variables.");
  throw new Error("FaunaDB API key is missing. Please check your .env file.");
}

// Initialize the FaunaDB client using the new driver
const client = new Client({
  secret: faunaKey,
  // No query builder 'q' is exported or needed separately with the new driver.
  // Queries are built directly using template literals or the query builder functions
  // imported from 'fauna'.
});

export { client, fql }; 