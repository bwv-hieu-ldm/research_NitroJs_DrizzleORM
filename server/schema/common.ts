import { sql } from "drizzle-orm";
import { serial, timestamp } from "drizzle-orm/mysql-core";

export const commonFields = {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
} as const;

export type CommonFields = typeof commonFields;
