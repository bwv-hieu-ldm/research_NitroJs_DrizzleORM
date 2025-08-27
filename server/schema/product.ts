import { bigint, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";
import { users } from "./user";
import { commonFields } from "./common";

export const products = mysqlTable("products", {
  ...commonFields,
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: varchar("price", { length: 20 }).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
});

export type InsertProduct = typeof products.$inferInsert;
export type SelectProduct = typeof products.$inferSelect;
