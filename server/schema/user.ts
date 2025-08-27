import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { commonFields } from "./common";

export const users = mysqlTable("users", {
  ...commonFields,
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("user").notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type UserRole = "admin" | "user" | "moderator";
