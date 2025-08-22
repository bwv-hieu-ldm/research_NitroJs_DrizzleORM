import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { DB_CONSTANTS, ERROR_MESSAGES } from "../common/constants";

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: mysql.Pool | null = null;
  private db: ReturnType<typeof drizzle> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
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

export const dbConnection = DatabaseConnection.getInstance();
export const getDb = () => dbConnection.getDb();
