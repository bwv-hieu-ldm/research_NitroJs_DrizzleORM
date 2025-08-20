import { db } from "../db";
import { products, InsertProduct, users } from "./schema";
import { eq } from "drizzle-orm";

export class ProductRepository {
  async create(product: InsertProduct) {
    const [result] = await db.insert(products).values(product);
    return result;
  }

  async findById(id: number) {
    return db.select().from(products).where(eq(products.id, id)).limit(1);
  }

  async findAll() {
    return db
      .select()
      .from(products)
      .leftJoin(users, eq(products.userId, users.id));
  }

  async findByUserId(userId: number) {
    return db
      .select()
      .from(products)
      .leftJoin(users, eq(products.userId, users.id))
      .where(eq(products.userId, userId));
  }

  async update(id: number, product: Partial<InsertProduct>) {
    return db.update(products).set(product).where(eq(products.id, id));
  }

  async delete(id: number) {
    return db.delete(products).where(eq(products.id, id));
  }
}
