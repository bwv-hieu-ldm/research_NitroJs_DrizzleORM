import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";
import { DB_CONSTANTS, ERROR_MESSAGES } from "../common/constants";

class DatabaseContext {
  private static instance: DatabaseContext;
  private pool: mysql.Pool | null = null;
  private db: ReturnType<typeof drizzle> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseContext {
    if (!DatabaseContext.instance) {
      DatabaseContext.instance = new DatabaseContext();
    }
    return DatabaseContext.instance;
  }

  public async initialize(): Promise<void> {
    if (this.pool) return;

    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: DB_CONSTANTS.CONNECTION_LIMIT,
      queueLimit: 0,
    });

    this.db = drizzle(this.pool) as unknown as ReturnType<typeof drizzle>;
  }

  public getDb() {
    if (!this.db) {
      throw new Error(ERROR_MESSAGES.DB_NOT_INITIALIZED);
    }
    return this.db;
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.db = null;
    }
  }
}

// Export singleton instance
export const dbContext = DatabaseContext.getInstance();

// Export a function to get the database instance
export const getDb = () => dbContext.getDb();

// Export the context for direct access if needed
export { DatabaseContext };
