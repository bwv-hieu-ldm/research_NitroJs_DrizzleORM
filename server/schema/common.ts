import { sql } from "drizzle-orm";
import { serial, timestamp } from "drizzle-orm/mysql-core";

// Common fields that are shared across all tables
export const commonFields = {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
} as const;

// Helper type for common fields
export type CommonFields = typeof commonFields;
