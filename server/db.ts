import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";

// MySQL connection config
const poolConnection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const db = drizzle(poolConnection);

// User schema definition
export const user = mysqlTable("user", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
});
