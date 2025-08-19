// server/db/index.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema"; // Import your Drizzle schema

// Ensure DATABASE_URL is defined
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

const pool = mysql.createPool(databaseUrl);

export const db = drizzle(pool, { schema, mode: "default" });
