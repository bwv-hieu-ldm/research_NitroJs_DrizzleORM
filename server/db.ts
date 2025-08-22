import { dbConnection } from "./db/connection";

// Export the database instance getter
export const getDb = () => dbConnection.getDb();

// Export the connection manager for advanced usage
export { dbConnection };

// Initialize function that can be called when the server starts
export const initializeDatabase = async () => {
  await dbConnection.initialize();
};

// For backward compatibility, export a db instance that will be available after initialization
export let db: ReturnType<typeof getDb>;

// Set up the db instance after initialization
export const setupDatabase = async () => {
  await initializeDatabase();
  db = getDb();
};
